import { drizzle } from "drizzle-orm/d1";
import { friendships } from "../../db/schema";
import { eq } from "drizzle-orm";

export const acceptFriendRequest = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");
  const requestId = Number(c.req.param("id"));

  const request = await db.select().from(friendships).where(eq(friendships.id, requestId)).get();

  if (!request || request.receiverId !== currentUser.userId) {
    return c.json({ error: "Invalid request" }, 404);
  }

  await db.update(friendships).set({ status: "accepted" }).where(eq(friendships.id, requestId));

  return c.json({ message: "Friend request accepted" });
};
