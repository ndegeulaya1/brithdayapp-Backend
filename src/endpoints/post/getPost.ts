import { drizzle } from "drizzle-orm/d1";
import { posts, users, postTags } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getPosts = async (c: any) => {
  const db = drizzle(c.env.DB);

  try {
    const allPosts = await db
      .select({
        id: posts.id,
        content: posts.content,
        user_id: posts.userId,
        created_at: posts.createdAt,
      })
      .from(posts);

    // Optionally fetch tags
    const postsWithTags = [];
    for (const post of allPosts) {
      const tags = await db
        .select({ user_id: postTags.userId })
        .from(postTags)
        .where(eq(postTags.postId, post.id));

      postsWithTags.push({ ...post, taggedUserIds: tags.map(t => t.user_id) });
    }

    return c.json({ posts: postsWithTags });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
};
