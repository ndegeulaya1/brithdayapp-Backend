import { Hono } from "hono";
import { fromHono } from "chanfana";
import { cors } from "hono/cors";

//import end point
import { Signup } from "./endpoints/auth/signup";
import { Signin } from "./endpoints/auth/signin";
import { getUsersWithBirthdays } from "./endpoints/auth/getuser";
import { Logout } from "./endpoints/auth/logout";
import { ResetPasswordRequest } from "./endpoints/auth/reset";
import { ResetPasswordConfirm } from "./endpoints/auth/forgot";




type Env = {
  JWT_SECRET: string;
  DB: D1Database;
  RESEND_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

//cors 
app.use("/*", cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://yourfrontend.com"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// document api
const openapi = fromHono(app, {
  docs_url: "/",
});


  // end point // --- Root ---


openapi.post("/signup", Signup);
openapi.get("/user", getUsersWithBirthdays );
openapi.post("/signin", Signin);
openapi.post("/logout", Logout);
openapi.post("/reset", ResetPasswordRequest);
openapi.post("/reset-password", ResetPasswordConfirm);




//without docs
app.get("/app", (c) => c.text("Birthday App API running"));

export default app;
