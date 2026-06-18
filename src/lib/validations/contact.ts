import { z } from "zod";

const phoneRegex = /^[\d\s+().-]{8,20}$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number")
    .refine((value) => value.replace(/\D/g, "").length >= 8, {
      message: "Please enter a valid phone number",
    }),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be 200 characters or less"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be 5000 characters or less"),
  website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
