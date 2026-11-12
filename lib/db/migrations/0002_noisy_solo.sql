CREATE TABLE "journal_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"payload" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_journal_entry_owner_created" ON "journal_entry" USING btree ("owner_id","created_at");