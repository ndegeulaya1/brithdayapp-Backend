import { drizzle } from "drizzle-orm/d1";
import { posts, postTags, users } from "../../db/schema";

import { z } from "zod";
import { createNotification } from "../notification/notification";

// Zod validation
export const createPostSchema = z.object({
  content: z.string(),
  taggedUserIds: z.array(z.number()).optional(),
});

export const createPost = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");
  const body = await c.req.json();

  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { content, taggedUserIds } = parsed.data;

  try {
    const insertedPost = await db.insert(posts)
      .values({
        userId: currentUser.userId,
        content,
      })
      .returning({ id: posts.id });

    const postId = insertedPost[0].id;

    // Handle tagged users
    if (taggedUserIds && taggedUserIds.length > 0) {
      const tagValues = taggedUserIds.map(uid => ({ postId: postId, userId: uid }));
      await db.insert(postTags).values(tagValues);

      // Send notifications to tagged users
      for (const uid of taggedUserIds) {
        const notificationResult = await createNotification(c, {
          userId: uid,
          type: "tag",
          refId: postId,
          content: `You were tagged in a post by ${currentUser.username || currentUser.userId}`,
        });

        if (!notificationResult.success) {
          console.error(`Failed to create notification for user ${uid}:`, notificationResult.error);
        }
      }
    }

    return c.json({ message: "Post created", postId });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to create post" }, 500);
  }
};
