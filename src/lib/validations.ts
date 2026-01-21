import { z } from "zod";

// UK phone number regex - allows various formats
const ukPhoneRegex = /^(\+44\s?|0)(\d{4}\s?\d{6}|\d{3}\s?\d{3}\s?\d{4}|\d{2}\s?\d{4}\s?\d{4}|\d{10,11})$/;

export const contactFormSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, "Business name is required")
    .max(100, "Business name must be less than 100 characters"),
  name: z
    .string()
    .trim()
    .min(1, "Your name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || ukPhoneRegex.test(val.replace(/\s/g, "")),
      "Please enter a valid UK phone number"
    )
    .optional()
    .or(z.literal("")),
  details: z
    .string()
    .trim()
    .max(2000, "Details must be less than 2000 characters")
    .optional()
    .or(z.literal("")),
});

export const websiteUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return true;
      try {
        const url = new URL(val.startsWith("http") ? val : `https://${val}`);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    "Please enter a valid website URL"
  );

export type ContactFormData = z.infer<typeof contactFormSchema>;
