import { drizzle } from "drizzle-orm/d1";
import { users, birthdays } from "../../db/schema";
import { eq } from "drizzle-orm";

export const deleteUser = async (c: any) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();



    const idParam = c.req.param("id");
    const userId = Number(idParam);
  try {
    // Delete birthday 
    await db.delete(birthdays).where(eq(birthdays.userId, userId));

    // Delete user
    await db.delete(users).where(eq(users.id, userId));

    return c.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return c.json({ error: "Failed to delete user" }, 500);
  }
};
