import { fromHono } from "chanfana";
import { Hono } from "hono";

// Import endpoints


// Start Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/", // OpenAPI docs at "/"
});



// You may also register routes directly on Hono
app.get("/health", (c) => c.text("OK"));

// Export app
export default app;
