"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

type HeatStamp = Point & {
  hot: boolean;
};

type Brush = {
  canvas: HTMLCanvasElement;
  radius: number;
};

const COOLING_HALF_LIFE_MS = 720;
const TRAIL_LIFETIME_MS = 4000;
const MAX_QUEUED_STAMPS = 900;

function createBrush(
  radius: number,
  dpr: number,
  theme: "light" | "dark",
  pressed: boolean,
): Brush {
  const canvas = document.createElement("canvas");
  const diameter = radius * 2;
  canvas.width = Math.ceil(diameter * dpr);
  canvas.height = Math.ceil(diameter * dpr);

  const context = canvas.getContext("2d");
  if (!context) return { canvas, radius };

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);

  if (theme === "dark") {
    gradient.addColorStop(0, `rgba(96, 165, 250, ${pressed ? 0.038 : 0.022})`);
    gradient.addColorStop(0.28, `rgba(99, 102, 241, ${pressed ? 0.032 : 0.018})`);
    gradient.addColorStop(0.62, `rgba(67, 56, 202, ${pressed ? 0.016 : 0.009})`);
  } else {
    gradient.addColorStop(0, `rgba(129, 140, 248, ${pressed ? 0.026 : 0.014})`);
    gradient.addColorStop(0.3, `rgba(165, 180, 252, ${pressed ? 0.022 : 0.011})`);
    gradient.addColorStop(0.64, `rgba(196, 181, 253, ${pressed ? 0.011 : 0.005})`);
  }

  gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, diameter, diameter);

  return { canvas, radius };
}

export function ThermalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;
    const renderContext: CanvasRenderingContext2D = context;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const stamps: HeatStamp[] = [];

    let frameId: number | null = null;
    let lastFrameTime = 0;
    let heatAliveUntil = 0;
    let lastPoint: Point | null = null;
    let pointerPressed = false;
    let dpr = 1;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let normalBrush: Brush;
    let pressedBrush: Brush;

    const canAnimate = () =>
      !document.hidden && !reducedMotion.matches && !coarsePointer.matches;

    const currentTheme = (): "light" | "dark" =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";

    const rebuildBrushes = () => {
      const theme = currentTheme();
      const normalRadius = theme === "dark" ? 92 : 82;
      const activeRadius = theme === "dark" ? 142 : 128;
      normalBrush = createBrush(normalRadius, dpr, theme, false);
      pressedBrush = createBrush(activeRadius, dpr, theme, true);
    };

    const clearCanvas = () => {
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();
      stamps.length = 0;
      heatAliveUntil = 0;
    };

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      canvas.width = Math.round(viewportWidth * dpr);
      canvas.height = Math.round(viewportHeight * dpr);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildBrushes();
      stamps.length = 0;
      heatAliveUntil = 0;
    };

    const scheduleFrame = () => {
      if (frameId === null && canAnimate()) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const enqueueStamp = (x: number, y: number, hot: boolean) => {
      stamps.push({ x, y, hot });
      if (stamps.length > MAX_QUEUED_STAMPS) {
        stamps.splice(0, stamps.length - MAX_QUEUED_STAMPS);
      }
      heatAliveUntil = performance.now() + TRAIL_LIFETIME_MS;
      scheduleFrame();
    };

    const depositPath = (x: number, y: number, hot: boolean) => {
      const nextPoint = { x, y };
      if (!lastPoint) {
        lastPoint = nextPoint;
        enqueueStamp(x, y, hot);
        return;
      }

      const deltaX = x - lastPoint.x;
      const deltaY = y - lastPoint.y;
      const distance = Math.hypot(deltaX, deltaY);
      const brush = hot ? pressedBrush : normalBrush;
      const spacing = Math.max(12, brush.radius * 0.28);
      const steps = Math.max(1, Math.ceil(distance / spacing));

      for (let step = 1; step <= steps; step += 1) {
        const progress = step / steps;
        enqueueStamp(
          lastPoint.x + deltaX * progress,
          lastPoint.y + deltaY * progress,
          hot,
        );
      }

      lastPoint = nextPoint;
    };

    function renderFrame(time: number) {
      frameId = null;
      if (!canAnimate()) return;

      const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 50) : 16.67;
      lastFrameTime = time;

      // Cool the existing buffer by a stable percentage each frame. This lets
      // old impressions fade without maintaining a React stateful particle list.
      const fadeAlpha = 1 - Math.pow(0.5, elapsed / COOLING_HALF_LIFE_MS);
      renderContext.save();
      renderContext.globalCompositeOperation = "destination-out";
      renderContext.globalAlpha = fadeAlpha;
      renderContext.fillStyle = "#000";
      renderContext.fillRect(0, 0, viewportWidth, viewportHeight);
      renderContext.restore();

      if (stamps.length) {
        renderContext.save();
        renderContext.globalCompositeOperation = "lighter";

        for (const stamp of stamps) {
          const brush = stamp.hot ? pressedBrush : normalBrush;
          renderContext.drawImage(
            brush.canvas,
            stamp.x - brush.radius,
            stamp.y - brush.radius,
            brush.radius * 2,
            brush.radius * 2,
          );
        }

        renderContext.restore();
        stamps.length = 0;
      }

      if (time < heatAliveUntil || stamps.length) {
        scheduleFrame();
      } else {
        clearCanvas();
        lastFrameTime = 0;
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!canAnimate() || event.pointerType === "touch") return;

      const samples = event.getCoalescedEvents?.() || [event];
      for (const sample of samples) {
        depositPath(
          sample.clientX,
          sample.clientY,
          pointerPressed || sample.buttons > 0,
        );
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !canAnimate()) return;
      pointerPressed = true;
      lastPoint = { x: event.clientX, y: event.clientY };
      enqueueStamp(event.clientX, event.clientY, true);
    };

    const handlePointerUp = () => {
      pointerPressed = false;
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (!event.relatedTarget) lastPoint = null;
    };

    const handleVisibility = () => {
      if (document.hidden && frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      lastFrameTime = 0;
      if (!document.hidden && performance.now() < heatAliveUntil) scheduleFrame();
    };

    const handleMotionPreference = () => {
      lastPoint = null;
      if (!canAnimate()) {
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        frameId = null;
        clearCanvas();
      }
    };

    const themeObserver = new MutationObserver(() => {
      rebuildBrushes();
      clearCanvas();
    });

    resizeCanvas();
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("pointerout", handlePointerLeave, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", handleMotionPreference);
    coarsePointer.addEventListener("change", handleMotionPreference);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      themeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("pointerout", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      coarsePointer.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <div className="thermal-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="thermal-canvas" />
      <div className="thermal-static-fallback" />
      <div className="texture" />
    </div>
  );
}
