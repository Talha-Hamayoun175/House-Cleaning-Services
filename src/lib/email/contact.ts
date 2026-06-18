import type { ContactFormData } from "@/lib/validations/contact";
import {
  buildEmailRow,
  escapeHtml,
  formatSubmittedAt,
  sendTransactionalEmail,
  wrapEmailTemplate,
} from "@/lib/email/shared";

export type ContactEmailPayload = ContactFormData & {
  submittedAt: Date;
};

export function buildContactEmailHtml(payload: ContactEmailPayload): string {
  const submittedAt = formatSubmittedAt(payload.submittedAt);

  const rows = [
    buildEmailRow("Name", escapeHtml(payload.name)),
    buildEmailRow(
      "Email",
      `<a href="mailto:${escapeHtml(payload.email)}" style="color:#0f766e;text-decoration:none;">${escapeHtml(payload.email)}</a>`,
    ),
    buildEmailRow("Phone Number", escapeHtml(payload.phone)),
    buildEmailRow("Subject", escapeHtml(payload.subject)),
    buildEmailRow("Message", escapeHtml(payload.message)),
    buildEmailRow("Submission Date & Time", escapeHtml(submittedAt), true),
  ].join("");

  return wrapEmailTemplate(
    "New Contact Form Submission",
    "All Seasons Spotless Cleaning website",
    rows,
  );
}

export function buildContactEmailText(payload: ContactEmailPayload): string {
  const submittedAt = formatSubmittedAt(payload.submittedAt);

  return [
    "New Contact Form Submission",
    "All Seasons Spotless Cleaning website",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone Number: ${payload.phone}`,
    `Subject: ${payload.subject}`,
    `Message: ${payload.message}`,
    `Submission Date & Time: ${submittedAt}`,
  ].join("\n");
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  await sendTransactionalEmail({
    subject: `New Contact: ${payload.subject}`,
    html: buildContactEmailHtml(payload),
    text: buildContactEmailText(payload),
    replyTo: payload.email,
  });
}
