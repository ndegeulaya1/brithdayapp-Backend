import { Hono } from "hono";
import { fromHono } from "chanfana";
import { cors } from "hono/cors";

//import end point
import { Signup } from "./endpoints/auth/signup";
import { Signin } from "./endpoints/auth/signin";

import { Logout } from "./endpoints/auth/logout";
import { ResetPasswordRequest } from "./endpoints/auth/reset";
import { ResetPasswordConfirm } from "./endpoints/auth/forgot";

//import users 
import {deleteUser} from "./endpoints/users/deleteuser"
import {getUsersWithBirthdays } from "./endpoints/users/getAllUser";
import { getUserById } from "./endpoints/users/getuserById";
import { updateUser } from "./endpoints/users/updateUser";
import { updateProfile } from "./endpoints/users/updateprofile";




type Env = {
  JWT_SECRET: string;
  DB: D1Database;
  RESEND_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

//cors 
app.use("/*", cors({
  origin: ["*"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// document api
const openapi = fromHono(app, {
  docs_url: "/",
});


  // end point // --- Root ---

//auth endpoint
openapi.post("/signup", Signup);

openapi.post("/signin", Signin);
openapi.post("/logout", Logout);
openapi.post("/reset", ResetPasswordRequest);
openapi.post("/reset-password", ResetPasswordConfirm);


//user managent endpoints
openapi.get("/user", getUsersWithBirthdays);
openapi.post("/deleteUser/:id", deleteUser);
openapi.get("/user/:id",getUserById);
openapi.post("/updateuser", updateUser);
openapi.post("/updateProfile/:id",updateProfile)





//without docs
app.get("/app", (c) => c.text("Birthday App API running"));

export default app;
