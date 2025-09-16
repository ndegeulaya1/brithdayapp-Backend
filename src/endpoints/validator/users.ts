import { z } from "zod";

// -------------------
// Create a new user

export const createUserSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  birthday: z
    .string().min(1,"birthday date is required"),
  role: z.enum(["user", "admin"]).optional(),
});


export const updateUserSchema = z.object({

  username: z.string().min(2).optional(),


  birthday: z
    .string().min(1),
  role: z.enum(["user", "admin"]).optional(),
});


export const userIdSchema = z.object({
  userId: z.number({ required_error: "User ID is required" }),
});



export const queryUsersSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  birthday: z.string().min(1,"birthday date is required")
});
