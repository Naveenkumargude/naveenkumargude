import { describe, expect, it } from "vitest";

import { contactFormSchema } from "@/lib/contact-validation";

const validContact = {
  name: "Naveen",
  email: "visitor@example.com",
  subject: "Project collaboration",
  message: "I would like to discuss an engineering project.",
};

describe("contact form validation", () => {
  it("accepts a valid contact message", () => {
    expect(contactFormSchema.safeParse(validContact).success).toBe(true);
  });

  it("rejects names longer than 100 characters", () => {
    expect(contactFormSchema.safeParse({ ...validContact, name: "N".repeat(101) }).success).toBe(false);
  });

  it("rejects email addresses longer than 255 characters", () => {
    expect(contactFormSchema.safeParse({ ...validContact, email: `${"a".repeat(244)}@x.com` }).success).toBe(false);
  });

  it("rejects subjects longer than 200 characters", () => {
    expect(contactFormSchema.safeParse({ ...validContact, subject: "S".repeat(201) }).success).toBe(false);
  });

  it("rejects messages longer than 5,000 characters", () => {
    expect(contactFormSchema.safeParse({ ...validContact, message: "M".repeat(5001) }).success).toBe(false);
  });
});