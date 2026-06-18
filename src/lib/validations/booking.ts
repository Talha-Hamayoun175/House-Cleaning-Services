import { z } from "zod";

const phoneRegex = /^[\d\s+().-]{8,20}$/;

function isValidPhone(value: string) {
  return phoneRegex.test(value) && value.replace(/\D/g, "").length >= 8;
}

export const bookingFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),
  phone: z
    .string()
    .trim()
    .refine(isValidPhone, "Please enter a valid phone number"),
  whatsapp: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isValidPhone(value), {
      message: "Please enter a valid WhatsApp number",
    }),
  email: z.string().trim().email("Please enter a valid email"),
  serviceType: z.string().trim().min(1, "Please select a service"),
  propertyType: z.string().trim().min(1, "Please select property type"),
  address: z
    .string()
    .trim()
    .min(5, "Please enter your address")
    .max(500, "Address must be 500 characters or less"),
  preferredDate: z
    .string()
    .trim()
    .min(1, "Please select a date")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Please select a valid date",
    }),
  preferredTime: z.string().trim().min(1, "Please select a time"),
  notes: z.string().trim().max(2000, "Notes must be 2000 characters or less").optional(),
  website: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
