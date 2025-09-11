
import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";

// Import everything from schema
import * as schema from "./schema";

export const initDb = (db: D1Database) =>
  drizzle(db, {
    schema, // schema contains all exported tables
  });
