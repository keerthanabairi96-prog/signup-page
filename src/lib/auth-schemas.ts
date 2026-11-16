import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Please enter your name")
      .max(100, "Name must be under 100 characters"),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .max(255, "Email must be under 255 characters"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(72, "Password must be under 72 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(1, "Enter your password"),
});
