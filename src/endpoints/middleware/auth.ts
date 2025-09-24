import { verifyJWT } from "../utility/JWT";

export const authMiddleware = async (c: any, next: any) => {
  try {
    // Try to get token from Authorization header first
    let token = c.req.header("Authorization")?.replace("Bearer ", "");

    // If no token in header, try to get from cookie
    if (!token) {
      const cookieToken = c.req.header("Cookie")
        ?.split(";")
        .find((cookie: string) => cookie.trim().startsWith("token="))
        ?.split("=")[1];

      if (cookieToken) {
        token = cookieToken;
      }
    }

    if (!token) {
      return c.json({ error: "No authentication token provided" }, 401);
    }

    // Verify the token
    const payload = await verifyJWT(token, c.env);

    // Add user info to context
    c.set("user", {
      userId: payload.payload.userId,
      email: payload.payload.email,
      username: payload.payload.username,
      role: payload.payload.role,
    });

    await next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return c.json({ error: "Invalid or expired token" }, 401);
  }
};