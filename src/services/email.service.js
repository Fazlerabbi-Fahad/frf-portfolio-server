import { Resend } from "resend";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export async function sendContactEmail({ name, email, message }) {
  if (!resend) {
    logger.warn("Resend not configured — skipping email send");
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>", 
    to: env.contactToEmail,
    replyTo: email,
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    logger.error({ error }, "Failed to send contact email");
    throw new Error("Email send failed");
  }
  return data;
}