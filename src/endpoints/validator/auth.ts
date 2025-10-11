import { z } from "zod";



//all about zod sign in

export const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  birthday: z.string().min(1, "date required"),
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

// Response schemas
export const signupResponseSchema = z.object({
  message: z.string(),
});

export const signinResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
});

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export const resetRequestResponseSchema = z.object({
  message: z.string(),
});

export const resetConfirmResponseSchema = z.object({
  message: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
});
