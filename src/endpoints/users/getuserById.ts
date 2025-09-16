import { drizzle } from "drizzle-orm/d1";
import { users, birthdays } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getUserById = async (c: any) => {
  const db = drizzle(c.env.DB);

  
   const idParam = c.req.param("id");
    const userId = Number(idParam);

  


  try {
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        birthday: birthdays.date, 
      })
      .from(users)
      .leftJoin(birthdays, eq(birthdays.userId, users.id))
      .where(eq(users.id, Number(userId)))
      .get(); 

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
};
