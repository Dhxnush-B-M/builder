ALTER TABLE "agent_actions" DROP CONSTRAINT "agent_actions_thread_id_agent_threads_id_fkey";--> statement-breakpoint
ALTER TABLE "agent_actions" DROP CONSTRAINT "agent_actions_message_id_agent_messages_id_fkey";--> statement-breakpoint
ALTER TABLE "agent_attachments" DROP CONSTRAINT "agent_attachments_thread_id_agent_threads_id_fkey";--> statement-breakpoint
ALTER TABLE "agent_attachments" DROP CONSTRAINT "agent_attachments_message_id_agent_messages_id_fkey";--> statement-breakpoint
ALTER TABLE "agent_messages" DROP CONSTRAINT "agent_messages_thread_id_agent_threads_id_fkey";--> statement-breakpoint
ALTER TABLE "agent_threads" DROP CONSTRAINT "agent_threads_ai_provider_id_ai_providers_id_fkey";--> statement-breakpoint
DROP TABLE "agent_actions";--> statement-breakpoint
DROP TABLE "agent_attachments";--> statement-breakpoint
DROP TABLE "agent_messages";--> statement-breakpoint
DROP TABLE "agent_threads";--> statement-breakpoint
DROP TABLE "ai_providers";--> statement-breakpoint
DROP TABLE "application";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscription_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "payment_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "order_id" text;