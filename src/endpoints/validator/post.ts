import { z } from "zod";



export const createPostSchema = z.object({
  content: z.string(),
  taggedUserIds: z.array(z.number()).optional(),
});