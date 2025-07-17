CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"upload_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" text DEFAULT 'N/A',
	"love_votes" integer DEFAULT 0 NOT NULL,
	"like_votes" integer DEFAULT 0 NOT NULL,
	"pass_votes" integer DEFAULT 0 NOT NULL,
	"score" real NOT NULL,
	"group_names" text,
	"website_link" text,
	"google_maps_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"total_activities" integer NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_upload_id_activity_uploads_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."activity_uploads"("id") ON DELETE cascade ON UPDATE no action;