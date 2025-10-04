import { drizzle } from "drizzle-orm/d1";
import { friendships, users } from "../../db/schema";
import { eq, or, and } from "drizzle-orm";

export const getFriendsList = async (c: any) => {
  const db = drizzle(c.env.DB);
  const currentUser = c.get("user");

  const results = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
    })
    .from(friendships)
    .innerJoin(
      users,
      or(
        eq(users.id, friendships.requesterId),
        eq(users.id, friendships.receiverId)
      )
    )
    .where(
      and(
        eq(friendships.status, "accepted"),
        or(
          eq(friendships.requesterId, currentUser.userId),
          eq(friendships.receiverId, currentUser.userId)
        )
      )
    );

  return c.json({ friends: results });
};
