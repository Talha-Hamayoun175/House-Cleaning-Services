import type { BookingFormData } from "@/lib/validations/booking";
import {
  buildEmailRow,
  escapeHtml,
  formatSubmittedAt,
  sendTransactionalEmail,
  wrapEmailTemplate,
} from "@/lib/email/shared";

export type BookingEmailPayload = Omit<BookingFormData, "website"> & {
  submittedAt: Date;
};

function formatOptional(value?: string) {
  return value?.trim() ? escapeHtml(value) : "—";
}

export function buildBookingEmailHtml(payload: BookingEmailPayload): string {
  const submittedAt = formatSubmittedAt(payload.submittedAt);

  const rows = [
    buildEmailRow("Full Name", escapeHtml(payload.fullName)),
    buildEmailRow(
      "Email",
      `<a href="mailto:${escapeHtml(payload.email)}" style="color:#0f766e;text-decoration:none;">${escapeHtml(payload.email)}</a>`,
    ),
    buildEmailRow("Phone Number", escapeHtml(payload.phone)),
    buildEmailRow("WhatsApp", formatOptional(payload.whatsapp)),
    buildEmailRow("Service Type", escapeHtml(payload.serviceType)),
    buildEmailRow("Property Type", escapeHtml(payload.propertyType)),
    buildEmailRow("Address", escapeHtml(payload.address)),
    buildEmailRow("Preferred Date", escapeHtml(payload.preferredDate)),
    buildEmailRow("Preferred Time", escapeHtml(payload.preferredTime)),
    buildEmailRow("Additional Notes", formatOptional(payload.notes)),
    buildEmailRow("Submission Date & Time", escapeHtml(submittedAt), true),
  ].join("");

  return wrapEmailTemplate(
    "New Booking Request",
    "All Seasons Spotless Cleaning website",
    rows,
  );
}

export function buildBookingEmailText(payload: BookingEmailPayload): string {
  const submittedAt = formatSubmittedAt(payload.submittedAt);

  return [
    "New Booking Request",
    "All Seasons Spotless Cleaning website",
    "",
    `Full Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone Number: ${payload.phone}`,
    `WhatsApp: ${payload.whatsapp?.trim() || "—"}`,
    `Service Type: ${payload.serviceType}`,
    `Property Type: ${payload.propertyType}`,
    `Address: ${payload.address}`,
    `Preferred Date: ${payload.preferredDate}`,
    `Preferred Time: ${payload.preferredTime}`,
    `Additional Notes: ${payload.notes?.trim() || "—"}`,
    `Submission Date & Time: ${submittedAt}`,
  ].join("\n");
}

export async function sendBookingEmail(payload: BookingEmailPayload) {
  await sendTransactionalEmail({
    subject: `New Booking: ${payload.serviceType} — ${payload.fullName}`,
    html: buildBookingEmailHtml(payload),
    text: buildBookingEmailText(payload),
    replyTo: payload.email,
  });
}
