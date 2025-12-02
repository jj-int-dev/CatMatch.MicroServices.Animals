-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "usertypes" (
	"type" varchar(100) NOT NULL,
	"user_type_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"rehomer_last_active_at" timestamp with time zone,
	"adopter_last_active_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"last_message_at" timestamp with time zone,
	"adopter_id" uuid NOT NULL,
	"rehomer_id" uuid NOT NULL,
	"conversation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"email" varchar(100) NOT NULL,
	"phone_number" varchar(100),
	"display_name" varchar(300),
	"created_at" timestamp with time zone NOT NULL,
	"date_of_birth" date,
	"avatar_url" text,
	"bio" text,
	"gender" varchar,
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_type_id" uuid DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"content" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"sender_id" uuid NOT NULL,
	"message_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "swipes" (
	"swiped_at" timestamp with time zone NOT NULL,
	"rehomer_id" uuid NOT NULL,
	"potential_adopter_id" uuid NOT NULL,
	"swipe_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_search_preferences" (
	"gender" varchar(50),
	"max_distance_km" integer,
	"user_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"neutered" boolean,
	"min_age_months" real,
	"max_age_months" real,
	"user_search_preference_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT "user_search_preferences_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "animals_adopted" (
	"created_at" timestamp with time zone NOT NULL,
	"rehomer_id" uuid NOT NULL,
	"animal_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"animal_adoption_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animal_photos" (
	"photo_url" text NOT NULL,
	"order" integer NOT NULL,
	"animal_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"animal_photo_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "animals" (
	"name" varchar(200) NOT NULL,
	"gender" varchar(50) NOT NULL,
	"age_in_weeks" real NOT NULL,
	"address_display_name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"last_updated_at" timestamp with time zone,
	"address_latitude" numeric(8, 6) NOT NULL,
	"address_longitude" numeric(9, 6) NOT NULL,
	"rehomer_id" uuid NOT NULL,
	"neutered" boolean NOT NULL,
	"animal_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"content" text NOT NULL,
	"redirect_url" text NOT NULL,
	"seen" boolean DEFAULT false,
	"created_at" timestamp with time zone NOT NULL,
	"target_user_id" uuid NOT NULL,
	"notification_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "fk_conversations_adopterid_users" FOREIGN KEY ("adopter_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "fk_conversations_rehomerid__users" FOREIGN KEY ("rehomer_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "public"."usertypes"("user_type_id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_users" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("conversation_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "swipes" ADD CONSTRAINT "fk_swipes_adopterid_users" FOREIGN KEY ("potential_adopter_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "swipes" ADD CONSTRAINT "fk_swipes_users" FOREIGN KEY ("rehomer_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_search_preferences" ADD CONSTRAINT "fk_user_search_preferences_users" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animals_adopted" ADD CONSTRAINT "animals_adopted_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("animal_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "animals_adopted" ADD CONSTRAINT "fk_animals_adopted_rehomerid__users" FOREIGN KEY ("rehomer_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "animal_photos" ADD CONSTRAINT "animal_photos_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("animal_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "animals" ADD CONSTRAINT "fk_animals_rehomerid__users" FOREIGN KEY ("rehomer_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_users" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
*/