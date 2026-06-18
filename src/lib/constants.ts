export const SITE_NAME = "All Seasons Spotless Cleaning";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://www.allseasonsspotlesscleaning.com.au";

const rawWhatsAppNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+61426000002";

export const WHATSAPP_NUMBER = rawWhatsAppNumber.replace(/\D/g, "");
export const WHATSAPP_DISPLAY = "+61 426 000002";
export const WHATSAPP_MESSAGE =
  "Hello! I would like to inquire about your cleaning services.";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const CONTACT_SUCCESS_MESSAGE =
  "Thank you for contacting All Seasons Spotless Cleaning. We will get back to you shortly.";

export const BOOKING_SUCCESS_MESSAGE =
  "Thank you for your booking request. Our team will contact you within 2 hours to confirm your appointment.";

export const CONTACT = {
  phone: WHATSAPP_DISPLAY,
  email: "talhakatal175@gmail.com",
  address: "Australia",
};
