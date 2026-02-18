CREATE TABLE IF NOT EXISTS "invite_guestbook" (
	"id" serial PRIMARY KEY NOT NULL,
	"invite_id" text NOT NULL,
	"author_name" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invite_rsvp" (
	"id" serial PRIMARY KEY NOT NULL,
	"invite_id" text NOT NULL,
	"guest_name" text NOT NULL,
	"guest_phone" text,
	"guest_count" integer DEFAULT 1 NOT NULL,
	"attending" boolean NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invite" (
	"id" text PRIMARY KEY NOT NULL,
	"share_id" text NOT NULL,
	"owner_id" text,
	"template_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"greeting" text NOT NULL,
	"event_date" text NOT NULL,
	"event_time" text NOT NULL,
	"venue_name" text NOT NULL,
	"venue_address" text NOT NULL,
	"host_name" text,
	"is_premium" boolean DEFAULT false NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"extra_data" text DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invite_guestbook_invite_id_idx" ON "invite_guestbook" USING btree ("invite_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invite_rsvp_invite_id_idx" ON "invite_rsvp" USING btree ("invite_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invite_share_id_unique_idx" ON "invite" USING btree ("share_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invite_owner_id_idx" ON "invite" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invite_status_idx" ON "invite" USING btree ("status");