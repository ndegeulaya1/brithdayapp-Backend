import { signinSchema } from "../validator/auth";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { signJWT } from "../utility/JWT";
import { comparePassword } from "../utility/password";

export const Signin = async (c: any) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();

  const parsed = signinSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { email, password } = parsed.data;

  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) return c.json({ error: "User not found" }, 404);

  const match = await comparePassword(password, user.password);
  if (!match) return c.json({ error: "Invalid password" }, 401);

  const token = await signJWT({ userId: user.id, email: user.email, role: user.role }, c.env, "1h");

  return c.json(
    { message: "Login successful", userId: user.id, token },
    {
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`,
      },
    }
  );
};
