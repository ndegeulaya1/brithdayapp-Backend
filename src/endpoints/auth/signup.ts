import { signupSchema } from "../validator/auth";
import { drizzle } from "drizzle-orm/d1";
import { users, birthdays } from "../../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../utility/password";

export const Signup = async (c: any) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { username, email, password, birthday } = parsed.data;

  const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
  if (existingUser) return c.json({ error: "Email already registered" }, 400);

  const hashedPassword = await hashPassword(password);

  try {
    const insertedUser = await db.insert(users)
      .values({ username:username, email, password: hashedPassword })
      .returning({ id: users.id });

    await db.insert(birthdays)
      .values({ userId: insertedUser[0].id, date: birthday });

    return c.json({ message: "User created successfully" }, 201);
  } catch (err) {
    return c.json({ error: "Failed to create user", details: err }, 500);
  }




};
