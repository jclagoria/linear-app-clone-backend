CREATE TABLE "issue_labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issue_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issue_statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(20) NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "issue_statuses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" varchar(20) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"team_id" uuid NOT NULL,
	"project_id" uuid,
	"assignee_id" uuid,
	"priority" integer DEFAULT 0 NOT NULL,
	"status_id" uuid NOT NULL,
	"parent_id" uuid,
	"cycle_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"sequence" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"canceled_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_issues_identifier_team" ON "issues" USING btree ("team_id","identifier") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_issues_sequence_team" ON "issues" USING btree ("team_id","sequence");