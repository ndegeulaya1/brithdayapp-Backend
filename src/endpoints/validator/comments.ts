import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.number(),
  content: z.string().min(1),
});

// Response schemas
export const createCommentResponseSchema = z.object({
  message: z.string(),
});

export const commentSchema = z.object({
  id: z.number(),
  postId: z.number(),
  userId: z.number(),
  content: z.string(),
  createdAt: z.string(),
});

export const commentsResponseSchema = z.array(commentSchema);
