import { z } from "zod";
import { addons, packageIds } from "../data/packages.js";

/**
 * One validation contract for the project brief. The browser uses it for inline errors and
 * api/submit-form.ts uses the same schema again on the server, so the server never trusts the client.
 */
const text = (label: string, min: number, max: number) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(min, min <= 2 ? `${label} is required` : `${label} needs a few more words`)
    .max(max, `${label} is too long (max ${max} characters)`);

const optionalText = (max: number) => z.string().trim().max(max, `Too long (max ${max} characters)`).optional().or(z.literal(""));

export const briefFieldsSchema = z.object({
  businessName: text("Business name", 2, 100),
  name: text("Your name", 2, 100),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .email("Enter an email address like name@example.com"),
  phone: z
    .string()
    .trim()
    .max(25, "Phone number is too long")
    .refine((v) => v === "" || /^[0-9+()\-\s]{7,25}$/.test(v), "Use digits only, for example 07700 900123")
    .optional(),
  businessDescription: text("What your business does", 5, 300),
  websiteUrl: z
    .string()
    .trim()
    .max(200, "Too long (max 200 characters)")
    .refine((v) => v === "" || (/^[^\s]+\.[^\s]{2,}$/.test(v)), "Enter a web address like www.example.co.uk")
    .optional(),
  details: optionalText(2000),
});

export const PACKAGE_CHOICES = [...packageIds, "unsure"] as unknown as [string, ...string[]];
export const ADDON_IDS = addons.map((a) => a.id) as [string, ...string[]];

export const briefSchema = briefFieldsSchema.extend({
  selectedPackage: z.enum(PACKAGE_CHOICES, { errorMap: () => ({ message: "Choose a package, or 'Not sure yet'" }) }),
  selectedAddons: z.array(z.enum(ADDON_IDS)).max(ADDON_IDS.length).default([]),
  /** Honeypot. Real visitors never see or fill this; bots often do. */
  company_site: z.string().max(0).optional(),
});

export type BriefFields = z.infer<typeof briefFieldsSchema>;
export type BriefPayload = z.infer<typeof briefSchema>;
