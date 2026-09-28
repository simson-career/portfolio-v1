import { contactSchema } from "@/lib/contact-schema";
import { sendContactEmail } from "@/lib/server/contact-email";
import {
  checkRateLimit,
  getRequestIdentity,
  rateLimitPolicy,
} from "@/lib/server/rate-limit";

export const runtime = "nodejs";

function rateHeaders(remaining: number, resetAt: number) {
  return {
    "X-RateLimit-Limit": String(rateLimitPolicy.limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return Response.json(
      { ok: false, message: "That message is too large to process." },
      { status: 413 },
    );
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return Response.json(
          { ok: false, message: "This request could not be verified." },
          { status: 403 },
        );
      }
    } catch {
      return Response.json(
        { ok: false, message: "This request could not be verified." },
        { status: 403 },
      );
    }
  }

  const limit = checkRateLimit(getRequestIdentity(request));
  const headers = rateHeaders(limit.remaining, limit.resetAt);

  if (!limit.allowed) {
    const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return Response.json(
      {
        ok: false,
        message: "Too many messages were sent recently. Please try again in a few minutes.",
      },
      { status: 429, headers: { ...headers, "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "The request body must be valid JSON." },
      { status: 400, headers },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(([field, messages]) => [
        field,
        messages?.[0],
      ]),
    );

    return Response.json(
      {
        ok: false,
        message: "Please review the highlighted fields.",
        fieldErrors,
      },
      { status: 400, headers },
    );
  }

  // Bots commonly populate fields that are visually hidden from people. Responding
  // successfully avoids teaching automated senders how the trap works.
  if (parsed.data.website) {
    return Response.json(
      { ok: true, message: "Thanks — your message has been received." },
      { headers },
    );
  }

  try {
    await sendContactEmail(parsed.data);
    return Response.json(
      {
        ok: true,
        message: "Message sent. I’ll get back to you as soon as I can.",
      },
      { headers },
    );
  } catch (error) {
    console.error("Contact delivery failed", error);
    return Response.json(
      {
        ok: false,
        message:
          "I couldn’t deliver that message right now. Please email me directly instead.",
      },
      { status: 502, headers },
    );
  }
}
