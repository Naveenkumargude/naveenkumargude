import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Name must be 100 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(255, "Email must be 255 characters or fewer."),
  subject: z.string().trim().min(1, "Enter a subject.").max(200, "Subject must be 200 characters or fewer."),
  message: z.string().trim().min(1, "Enter a message.").max(5000, "Message must be 5,000 characters or fewer."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;