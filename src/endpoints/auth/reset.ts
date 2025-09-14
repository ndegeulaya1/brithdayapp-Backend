import { resetRequestSchema } from "../validator/auth";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { signJWT } from "../utility/JWT";

export const ResetPasswordRequest = async (c: any) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();

  const parsed = resetRequestSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { email } = parsed.data;

  const user = await db.select().from(users).where(eq(users.email, email)).get();
  if (!user) return c.json({ error: "Email not found" }, 404);

  const resetToken = await signJWT({ userId: user.id, email: user.email }, c.env, "15m");

  const resetLink = `https://localhost:8787/reset-password?token=${resetToken}`;
  console.log(`Password reset link for ${user.email}: ${resetLink}`);

  return c.json({ message: "Password reset link sent (check console in dev)", resetLink });
};
