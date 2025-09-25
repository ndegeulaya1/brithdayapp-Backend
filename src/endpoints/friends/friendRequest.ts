import { drizzle } from "drizzle-orm/d1";
import { friendships } from "../../db/schema";
import { eq } from "drizzle-orm";

export const sendFriendRequest = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");
  const receiverId = Number(c.req.param("userId"));

  if (currentUser.userId === receiverId) {
    return c.json({ error: "You cannot add yourself" }, 400);
  }

  // Check if already exists
  const existing = await db.select().from(friendships).where(
    eq(friendships.requesterId, currentUser.userId)
  ).where(eq(friendships.receiverId, receiverId)).get();

  if (existing) {
    return c.json({ error: "Request already sent" }, 400);
  }

  await db.insert(friendships).values({
    requesterId: currentUser.userId,
    receiverId,
    status: "pending",
  });

  return c.json({ message: "Friend request sent" });
};
