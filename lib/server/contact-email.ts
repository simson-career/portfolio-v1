import "server-only";
import type { ContactMessage } from "@/lib/contact-schema";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function createEmailContent(message: ContactMessage) {
  const safe = {
    name: escapeHtml(message.name),
    email: escapeHtml(message.email),
    subject: escapeHtml(message.subject),
    message: escapeHtml(message.message).replace(/\n/g, "<br />"),
  };

  return {
    text: [
      `New portfolio message: ${message.subject}`,
      `From: ${message.name} <${message.email}>`,
      "",
      message.message,
    ].join("\n"),
    html: `
      <div style="background:#f8fafc;padding:32px;font-family:Arial,sans-serif;color:#0f172a">
        <div style="max-width:620px;margin:auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px">
          <p style="margin:0 0 8px;color:#4f46e5;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Portfolio enquiry</p>
          <h1 style="margin:0 0 24px;font-size:24px">${safe.subject}</h1>
          <p style="margin:0 0 20px;color:#475569">From ${safe.name} &lt;${safe.email}&gt;</p>
          <div style="border-top:1px solid #e2e8f0;padding-top:20px;line-height:1.7">${safe.message}</div>
        </div>
      </div>
    `,
  };
}

async function sendWithResend(message: ContactMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "simsonmoses.m@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("The Resend provider is not configured.");
  }

  const content = createEmailContent(message);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: message.email,
      subject: `[Portfolio] ${message.subject} — ${message.name}`,
      ...content,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email provider rejected the request (${response.status}).`);
  }
}

export async function sendContactEmail(message: ContactMessage) {
  const provider = (
    process.env.EMAIL_PROVIDER ||
    (process.env.RESEND_API_KEY ? "resend" : "console")
  ).toLowerCase();

  if (provider === "resend") {
    await sendWithResend(message);
    return;
  }

  if (provider === "console" && process.env.NODE_ENV !== "production") {
    console.info("[contact:development]", {
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
    });
    return;
  }

  throw new Error("No supported email provider is configured.");
}
