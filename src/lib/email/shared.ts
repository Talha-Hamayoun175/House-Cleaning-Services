import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { Resend } from "resend";

let cachedTransporter: Transporter | null = null;

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Australia/Sydney",
  }).format(date);
}

export function getRecipientEmail() {
  return (
    process.env.CONTACT_RECIPIENT_EMAIL ?? "info@allseasonsspotlesscleaning.com.au"
  );
}

export function getFromName() {
  return process.env.SMTP_FROM_NAME ?? "All Seasons Spotless Cleaning";
}

export type TransactionalEmail = {
  subject: string;
  html: string;
  text: string;
  replyTo: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("Email service is not configured.");
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass: pass.replace(/\s/g, "") },
    ...(port === 587 && process.env.SMTP_SECURE !== "true"
      ? { requireTLS: true }
      : {}),
  };
}

function getTransporter(): Transporter {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      ...getSmtpConfig(),
      pool: true,
      maxConnections: 1,
      maxMessages: 100,
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 8_000,
    });
  }

  return cachedTransporter;
}

async function sendViaResend(
  email: TransactionalEmail,
  recipient: string,
  fromName: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return false;
  }

  const resend = new Resend(apiKey);
  const from =
    process.env.RESEND_FROM_EMAIL ??
    `${fromName} <onboarding@resend.dev>`;

  const { error } = await resend.emails.send({
    from,
    to: [recipient],
    replyTo: email.replyTo,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

async function sendViaSmtp(
  email: TransactionalEmail,
  recipient: string,
  fromName: string,
  fromEmail: string,
) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: recipient,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}

export async function sendTransactionalEmail(email: TransactionalEmail) {
  const recipient = getRecipientEmail();
  const fromName = getFromName();
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER;

  if (process.env.RESEND_API_KEY) {
    await sendViaResend(email, recipient, fromName);
    return;
  }

  if (!fromEmail) {
    throw new Error("Email service is not configured.");
  }

  await sendViaSmtp(email, recipient, fromName, fromEmail);
}

export function buildEmailRow(label: string, value: string, isLast = false) {
  const border = isLast ? "" : "border-bottom:1px solid #e2e8f0;";
  return `
    <tr>
      <td style="padding:12px 0;${border}font-size:13px;font-weight:700;color:#0f172a;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:12px 0;${border}font-size:14px;line-height:1.6;color:#334155;white-space:pre-wrap;">${value}</td>
    </tr>
  `;
}

export function wrapEmailTemplate(title: string, subtitle: string, rows: string) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f7f8;font-family:Arial,Helvetica,sans-serif;color:#1e293b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:#0f766e;padding:28px 32px;">
                <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;">${escapeHtml(title)}</h1>
                <p style="margin:8px 0 0;color:#ccfbf1;font-size:14px;">${escapeHtml(subtitle)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  ${rows}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}
