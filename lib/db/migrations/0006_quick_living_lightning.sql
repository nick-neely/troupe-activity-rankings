CREATE TABLE "broadcasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"body_markdown" text NOT NULL,
	"level" text DEFAULT 'info' NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "broadcasts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "idx_broadcasts_active" ON "broadcasts" USING btree ("active");--> statement-breakpoint
CREATE INDEX "idx_broadcasts_schedule" ON "broadcasts" USING btree ("starts_at","ends_at");