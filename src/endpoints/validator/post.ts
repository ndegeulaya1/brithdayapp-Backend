import { z } from "zod";



export const createPostSchema = z.object({
  content: z.string(),
  taggedUserIds: z.array(z.number()).optional(),
});

// Response schemas
export const createPostResponseSchema = z.object({
  message: z.string(),
});

export const postSchema = z.object({
  id: z.number(),
  userId: z.number(),
  content: z.string(),
  taggedUserIds: z.array(z.number()).optional(),
  createdAt: z.string(),
});

export const postsResponseSchema = z.array(postSchema);
