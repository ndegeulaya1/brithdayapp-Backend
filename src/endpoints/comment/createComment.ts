import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { comments, posts } from "../../db/schema";
import { z } from "zod";
import { createNotification } from "../notification/notification";

export const createCommentSchema = z.object({
  postId: z.number(),
  content: z.string(),
});

export const createComment = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");
  const body = await c.req.json();

  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { postId, content } = parsed.data;

  try {
    const insertedComment = await db.insert(comments)
      .values({
        postId: postId,
        userId: currentUser.userId,
        content,
      })
      .returning({ id: comments.id });

    // Notify post author
    const postAuthor = await db.select({ userId: posts.userId })
      .from(posts)
      .where(eq(posts.id, postId))
      .get();

    if (postAuthor && postAuthor.userId !== currentUser.userId) {
      const notificationResult = await createNotification(c, {
        userId: postAuthor.userId,
        type: "comment",
        refId: postId,
        content: `New comment on your post from ${currentUser.username || currentUser.userId}`,
      });

      if (!notificationResult.success) {
        console.error(`Failed to create notification for user ${postAuthor.userId}:`, notificationResult.error);
      }
    }

    return c.json({ message: "Comment added", commentId: insertedComment[0].id });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to add comment" }, 500);
  }
};
