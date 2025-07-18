import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";

// Users table - stores admin user credentials
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity uploads table - stores metadata about CSV uploads
export const activityUploads = pgTable("activity_uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileName: text("file_name").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  totalActivities: integer("total_activities").notNull(),
  description: text("description"),
});

// Activities table - stores individual activity records
export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  uploadId: uuid("upload_id")
    .references(() => activityUploads.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: text("price").default("N/A"),
  loveVotes: integer("love_votes").default(0).notNull(),
  likeVotes: integer("like_votes").default(0).notNull(),
  passVotes: integer("pass_votes").default(0).notNull(),
  score: real("score").notNull(), // Calculated score
  groupNames: text("group_names"),
  websiteLink: text("website_link"),
  googleMapsUrl: text("google_maps_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ActivityUpload = typeof activityUploads.$inferSelect;
export type NewActivityUpload = typeof activityUploads.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

// Custom types for frontend compatibility
export type ActivityData = {
  id?: string;
  name: string;
  category: string;
  price: string;
  love_votes: number;
  like_votes: number;
  pass_votes: number;
  score: number;
  groupNames?: string;
  website_link?: string;
  google_maps_url?: string;
  uploadId?: string;
  createdAt?: Date;
};

// Validation schemas
export const csvActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().default("N/A"),
  love_votes: z.number().int().min(0),
  like_votes: z.number().int().min(0),
  pass_votes: z.number().int().min(0),
  groupNames: z.string().optional(),
  website_link: z.string().url().optional().or(z.literal("")),
  google_maps_url: z.string().url().optional().or(z.literal("")),
});

export type CsvActivityData = z.infer<typeof csvActivitySchema>;

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;
