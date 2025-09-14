import { z } from "zod";



//all about zod sign in

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "email required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  birthday: z.string().min(1, "date required").regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be YYYY-MM-DD"),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const resetRequestSchema = z.object({
  email: z.string().email(),
});

export const resetConfirmSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});
