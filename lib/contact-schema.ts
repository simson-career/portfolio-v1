import { z } from "zod";

export const contactSubjects = [
  "Job Opportunity",
  "Project Collaboration",
  "Technical Discussion",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(80, "Please keep your name under 80 characters."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(160, "Please keep your email under 160 characters."),
  subject: z.enum(contactSubjects, {
    error: "Choose a subject from the list.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Please share a little more detail (at least 20 characters).")
    .max(3000, "Please keep your message under 3,000 characters."),
  website: z.string().max(200).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;
