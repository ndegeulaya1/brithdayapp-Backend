import { drizzle } from "drizzle-orm/d1";
import { comments, users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getCommentsByPost = async (c: any) => {
  const db = drizzle(c.env.DB);
  const postId = Number(c.req.param("postId"));

  try {
    const allComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        user_id: comments.userId,
        created_at: comments.createdAt,
      })
      .from(comments)
      .where(eq(comments.postId, postId));

    return c.json({ comments: allComments });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }
};
