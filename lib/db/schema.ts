import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";

// Users table - stores admin user credentials
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").unique().notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_users_username").on(table.username)]
);

// Activity uploads table - stores metadata about CSV uploads
export const activityUploads = pgTable("activity_uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileName: text("file_name").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  totalActivities: integer("total_activities").notNull(),
  description: text("description"),
});

// Activities table - stores individual activity records
export const activities = pgTable(
  "activities",
  {
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
  },
  (table) => [index("idx_activities_category").on(table.category)]
);

// Category icon mappings table - stores admin-configured category-to-icon mappings
export const categoryIconMappings = pgTable("category_icon_mappings", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull().unique(),
  iconName: text("icon_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// App configuration table - stores persistent flags and settings
export const appConfig = pgTable("app_config", {
  key: text("key").primaryKey(),
  value: text("value"),
});

// Broadcasts table - stores site-wide broadcast messages/banners
export const broadcasts = pgTable(
  "broadcasts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    level: text("level").notNull().default("info"), // info | warn | critical
    active: boolean("active").notNull().default(false),
    version: integer("version").notNull().default(1),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_broadcasts_active").on(table.active),
    index("idx_broadcasts_schedule").on(table.startsAt, table.endsAt),
  ]
);

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ActivityUpload = typeof activityUploads.$inferSelect;
export type NewActivityUpload = typeof activityUploads.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type CategoryIconMapping = typeof categoryIconMappings.$inferSelect;
export type NewCategoryIconMapping = typeof categoryIconMappings.$inferInsert;

export type Broadcast = typeof broadcasts.$inferSelect;
export type NewBroadcast = typeof broadcasts.$inferInsert;

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

// Broadcast validation schema
export const broadcastSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  bodyMarkdown: z.string().min(1, "Content is required"),
  level: z.enum(["info", "warn", "critical"]).default("info"),
  active: z.boolean().default(false),
  startsAt: z.date().optional().nullable(),
  endsAt: z.date().optional().nullable(),
});

export type BroadcastFormData = z.infer<typeof broadcastSchema>;
