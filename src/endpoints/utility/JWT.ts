import { JWTPayload } from "hono/utils/jwt/types";
import { SignJWT, jwtVerify } from "jose";

export const getJWTSecret = (env: any) => env.JWT_SECRET || "supersecretkey";

// Sign a JWT
export const signJWT = async (payload: JWTPayload, env: any, expiresIn = "1h") => {
  const secret = new TextEncoder().encode(getJWTSecret(env));
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
};

// Verify a JWT
export const verifyJWT = async (token: string, env: any) => {
  const secret = new TextEncoder().encode(getJWTSecret(env));
  return jwtVerify(token, secret);
};
