CREATE TABLE "state_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"issue_id" uuid NOT NULL,
	"from_state_id" uuid,
	"to_state_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(20) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_transitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_state_id" uuid NOT NULL,
	"to_state_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_state_history_issue_created" ON "state_history" USING btree ("issue_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_workflow_states_team_name" ON "workflow_states" USING btree ("team_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_workflow_states_team_position" ON "workflow_states" USING btree ("team_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_workflow_transitions_from_to" ON "workflow_transitions" USING btree ("from_state_id","to_state_id");