import { resetConfirmSchema } from "../validator/auth";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../db/schema";
import { hashPassword } from "../utility/password";
import { verifyJWT } from "../utility/JWT";


export const ResetPasswordConfirm = async (c: any) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();

  const parsed = resetConfirmSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const { token, newPassword } = parsed.data;

  try {
    const { payload } = await verifyJWT(token, c.env);
    if (!payload || typeof payload.userId !== "number") return c.json({ error: "Invalid token" }, 401);

    const hashedPassword = await hashPassword(newPassword);
    await db.update(users).set({ password: hashedPassword }).where((users.id).eq(payload.userId));

    return c.json({ message: "Password updated successfully" });
  } catch (err) {
    return c.json({ error: "Invalid or expired token" }, 400);
  }
};
