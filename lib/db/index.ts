import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create the neon client
const sql = neon(process.env.DATABASE_URL);

// Create the drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export all schema for convenience
export * from "./schema";
