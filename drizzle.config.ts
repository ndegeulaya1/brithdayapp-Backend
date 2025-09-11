import 'dotenv/config';
import {dbCredentials} from "./src/db/credential";

import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle/migrations',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials,
});