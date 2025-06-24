

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."chit_group_status" AS ENUM (
    'pending',
    'active',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."chit_group_status" OWNER TO "postgres";


CREATE TYPE "public"."id_proof_type" AS ENUM (
    'AADHAR',
    'PAN',
    'PASSPORT',
    'DRIVING_LICENSE'
);


ALTER TYPE "public"."id_proof_type" OWNER TO "postgres";


CREATE TYPE "public"."loan_status" AS ENUM (
    'pending',
    'approved',
    'rejected',
    'disbursed',
    'completed',
    'defaulted'
);


ALTER TYPE "public"."loan_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_status" AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


CREATE TYPE "public"."permission_action" AS ENUM (
    'CREATE',
    'READ',
    'UPDATE',
    'DELETE'
);


ALTER TYPE "public"."permission_action" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'superAdmin',
    'departmentHead',
    'mandalHead',
    'branchManager',
    'agent',
    'user'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_agent_dashboard_metrics"("p_agent_id" "uuid") RETURNS TABLE("total_customers" bigint, "active_loans" bigint, "todays_collection" numeric, "pending_payments" bigint)
    LANGUAGE "plpgsql"
    AS $$
begin
    return query
    with agent_customers as (
        select id from customers where agent_id = p_agent_id
    )
    select
        (select count(*) from agent_customers) as total_customers,
        
        (select count(*) from loans l where l.user_id in (select id from agent_customers) and l.status = 'disbursed') as active_loans,

        (select coalesce(sum(c.amount), 0) from contributions c 
         where c.created_by = p_agent_id and c.payment_date = current_date) as todays_collection,

        (select count(*) from contributions c 
         where c.user_id in (select id from agent_customers) and c.status = 'pending') as pending_payments;
end;
$$;


ALTER FUNCTION "public"."get_agent_dashboard_metrics"("p_agent_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."attendance" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "agent_id" "uuid",
    "selfie_url" "text",
    "lat" double precision,
    "lng" double precision,
    "remarks" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "action" character varying(255) NOT NULL,
    "entity_type" character varying(255) NOT NULL,
    "entity_id" "uuid" NOT NULL,
    "old_values" "jsonb",
    "new_values" "jsonb",
    "ip_address" character varying(45),
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."branches" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "address" "text" NOT NULL,
    "mandal_id" "uuid",
    "manager_id" "uuid",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."branches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chit_groups" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "duration" integer NOT NULL,
    "max_members" integer NOT NULL,
    "current_cycle" integer DEFAULT 0,
    "status" "public"."chit_group_status" DEFAULT 'pending'::"public"."chit_group_status",
    "branch_id" "uuid",
    "start_date" "date",
    "end_date" "date",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."chit_groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chit_members" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "chit_group_id" "uuid",
    "user_id" "uuid",
    "joined_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "cycle_number" integer,
    "grab_date" "date"
);


ALTER TABLE "public"."chit_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contributions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "chit_group_id" "uuid",
    "user_id" "uuid",
    "amount" numeric(12,2) NOT NULL,
    "cycle_number" integer NOT NULL,
    "payment_date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."contributions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."departments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "head_id" "uuid",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."departments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "type" "text",
    "message" "text",
    "status" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."file_storage" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "file_name" character varying(255) NOT NULL,
    "file_type" character varying(100) NOT NULL,
    "file_size" integer NOT NULL,
    "file_path" "text" NOT NULL,
    "uploaded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."file_storage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."flags" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "type" character varying(20) NOT NULL,
    "reference_id" "uuid" NOT NULL,
    "reason" "text",
    "status" character varying(20) DEFAULT 'open'::character varying,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."flags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "amount" integer NOT NULL,
    "members" "uuid"[],
    "active" boolean DEFAULT true
);


ALTER TABLE "public"."groups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loan_repayments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "loan_id" "uuid",
    "amount" numeric(12,2) NOT NULL,
    "payment_date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."loan_repayments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loan_requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "group_id" "uuid",
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "requested_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."loan_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."loans" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "amount" numeric(12,2) NOT NULL,
    "interest_rate" numeric(5,2) NOT NULL,
    "duration" integer NOT NULL,
    "status" "public"."loan_status" DEFAULT 'pending'::"public"."loan_status",
    "approved_by" "uuid",
    "approved_at" timestamp with time zone,
    "disbursed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."loans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mandals" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "department_id" "uuid",
    "head_id" "uuid",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."mandals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meetings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "agent_id" "uuid",
    "customer_id" "uuid",
    "scheduled_at" timestamp with time zone,
    "location" "text",
    "purpose" "text",
    "status" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."meetings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "title" "text",
    "message" "text",
    "read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "group_id" "uuid",
    "amount" integer NOT NULL,
    "mode" character varying(20) NOT NULL,
    "paid_on" "date" NOT NULL,
    "fine" integer DEFAULT 0,
    "manual" boolean DEFAULT false,
    "agent_id" "uuid",
    "screenshot_url" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "module" character varying(255) NOT NULL,
    "action" "public"."permission_action" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."qr_codes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "branch_id" "uuid",
    "upi_id" character varying(100) NOT NULL,
    "qr_image_url" "text" NOT NULL
);


ALTER TABLE "public"."qr_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."receipts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "payment_id" "uuid",
    "issued_by" "uuid",
    "receipt_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."receipts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "role_id" "uuid" NOT NULL,
    "permission_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "level" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "key" character varying(255) NOT NULL,
    "value" "jsonb" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "subject" "text",
    "description" "text",
    "status" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tickets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "amount" numeric(12,2) NOT NULL,
    "type" character varying(50) NOT NULL,
    "reference_id" "uuid",
    "reference_type" character varying(50),
    "status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" "uuid" NOT NULL,
    "role_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "mobile" character varying(15) NOT NULL,
    "role" "public"."user_role" DEFAULT 'user'::"public"."user_role" NOT NULL,
    "branch_id" "uuid",
    "mandal_id" "uuid",
    "department_id" "uuid",
    "id_proof_type" "public"."id_proof_type",
    "id_proof_file" "text",
    "id_proof_verified" boolean DEFAULT false,
    "wallet_balance" numeric(12,2) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "status" character varying(50) DEFAULT 'active'::character varying
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."branches"
    ADD CONSTRAINT "branches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chit_groups"
    ADD CONSTRAINT "chit_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chit_members"
    ADD CONSTRAINT "chit_members_chit_group_id_user_id_key" UNIQUE ("chit_group_id", "user_id");



ALTER TABLE ONLY "public"."chit_members"
    ADD CONSTRAINT "chit_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contributions"
    ADD CONSTRAINT "contributions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."file_storage"
    ADD CONSTRAINT "file_storage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."flags"
    ADD CONSTRAINT "flags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."loan_repayments"
    ADD CONSTRAINT "loan_repayments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."loan_requests"
    ADD CONSTRAINT "loan_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."loans"
    ADD CONSTRAINT "loans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mandals"
    ADD CONSTRAINT "mandals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meetings"
    ADD CONSTRAINT "meetings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."qr_codes"
    ADD CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."receipts"
    ADD CONSTRAINT "receipts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_mobile_key" UNIQUE ("mobile");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_chit_groups_branch" ON "public"."chit_groups" USING "btree" ("branch_id");



CREATE INDEX "idx_chit_groups_status" ON "public"."chit_groups" USING "btree" ("status");



CREATE INDEX "idx_contributions_chit_group" ON "public"."contributions" USING "btree" ("chit_group_id");



CREATE INDEX "idx_contributions_group_user" ON "public"."contributions" USING "btree" ("chit_group_id", "user_id");



CREATE INDEX "idx_contributions_user" ON "public"."contributions" USING "btree" ("user_id");



CREATE INDEX "idx_flags_reference_id" ON "public"."flags" USING "btree" ("reference_id");



CREATE INDEX "idx_loan_repayments_loan" ON "public"."loan_repayments" USING "btree" ("loan_id");



CREATE INDEX "idx_loan_requests_group_id" ON "public"."loan_requests" USING "btree" ("group_id");



CREATE INDEX "idx_loan_requests_user_id" ON "public"."loan_requests" USING "btree" ("user_id");



CREATE INDEX "idx_loans_status" ON "public"."loans" USING "btree" ("status");



CREATE INDEX "idx_loans_user" ON "public"."loans" USING "btree" ("user_id");



CREATE INDEX "idx_payments_group_id" ON "public"."payments" USING "btree" ("group_id");



CREATE INDEX "idx_payments_user_id" ON "public"."payments" USING "btree" ("user_id");



CREATE INDEX "idx_permissions_module" ON "public"."permissions" USING "btree" ("module");



CREATE INDEX "idx_role_permissions_permission" ON "public"."role_permissions" USING "btree" ("permission_id");



CREATE INDEX "idx_role_permissions_role" ON "public"."role_permissions" USING "btree" ("role_id");



CREATE INDEX "idx_roles_level" ON "public"."roles" USING "btree" ("level");



CREATE INDEX "idx_transactions_type" ON "public"."transactions" USING "btree" ("type");



CREATE INDEX "idx_transactions_user" ON "public"."transactions" USING "btree" ("user_id");



CREATE INDEX "idx_user_roles_role" ON "public"."user_roles" USING "btree" ("role_id");



CREATE INDEX "idx_user_roles_user" ON "public"."user_roles" USING "btree" ("user_id");



CREATE INDEX "idx_users_branch" ON "public"."users" USING "btree" ("branch_id");



CREATE INDEX "idx_users_role" ON "public"."users" USING "btree" ("role");



CREATE OR REPLACE TRIGGER "update_branches_updated_at" BEFORE UPDATE ON "public"."branches" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_chit_groups_updated_at" BEFORE UPDATE ON "public"."chit_groups" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_contributions_updated_at" BEFORE UPDATE ON "public"."contributions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_departments_updated_at" BEFORE UPDATE ON "public"."departments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_loan_repayments_updated_at" BEFORE UPDATE ON "public"."loan_repayments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_loans_updated_at" BEFORE UPDATE ON "public"."loans" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_mandals_updated_at" BEFORE UPDATE ON "public"."mandals" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_permissions_updated_at" BEFORE UPDATE ON "public"."permissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_roles_updated_at" BEFORE UPDATE ON "public"."roles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_transactions_updated_at" BEFORE UPDATE ON "public"."transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."branches"
    ADD CONSTRAINT "branches_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."chit_groups"
    ADD CONSTRAINT "chit_groups_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."chit_members"
    ADD CONSTRAINT "chit_members_chit_group_id_fkey" FOREIGN KEY ("chit_group_id") REFERENCES "public"."chit_groups"("id");



ALTER TABLE ONLY "public"."chit_members"
    ADD CONSTRAINT "chit_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."contributions"
    ADD CONSTRAINT "contributions_chit_group_id_fkey" FOREIGN KEY ("chit_group_id") REFERENCES "public"."chit_groups"("id");



ALTER TABLE ONLY "public"."contributions"
    ADD CONSTRAINT "contributions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "departments_head_id_fkey" FOREIGN KEY ("head_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."file_storage"
    ADD CONSTRAINT "file_storage_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."branches"
    ADD CONSTRAINT "fk_branches_mandal" FOREIGN KEY ("mandal_id") REFERENCES "public"."mandals"("id");



ALTER TABLE ONLY "public"."mandals"
    ADD CONSTRAINT "fk_mandals_department" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "fk_users_branch" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "fk_users_department" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "fk_users_mandal" FOREIGN KEY ("mandal_id") REFERENCES "public"."mandals"("id");



ALTER TABLE ONLY "public"."loan_repayments"
    ADD CONSTRAINT "loan_repayments_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id");



ALTER TABLE ONLY "public"."loan_requests"
    ADD CONSTRAINT "loan_requests_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."loan_requests"
    ADD CONSTRAINT "loan_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."loans"
    ADD CONSTRAINT "loans_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."loans"
    ADD CONSTRAINT "loans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."mandals"
    ADD CONSTRAINT "mandals_head_id_fkey" FOREIGN KEY ("head_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."meetings"
    ADD CONSTRAINT "meetings_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."meetings"
    ADD CONSTRAINT "meetings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."qr_codes"
    ADD CONSTRAINT "qr_codes_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."receipts"
    ADD CONSTRAINT "receipts_issued_by_fkey" FOREIGN KEY ("issued_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."receipts"
    ADD CONSTRAINT "receipts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."get_agent_dashboard_metrics"("p_agent_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_agent_dashboard_metrics"("p_agent_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_agent_dashboard_metrics"("p_agent_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."attendance" TO "anon";
GRANT ALL ON TABLE "public"."attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."attendance" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."branches" TO "anon";
GRANT ALL ON TABLE "public"."branches" TO "authenticated";
GRANT ALL ON TABLE "public"."branches" TO "service_role";



GRANT ALL ON TABLE "public"."chit_groups" TO "anon";
GRANT ALL ON TABLE "public"."chit_groups" TO "authenticated";
GRANT ALL ON TABLE "public"."chit_groups" TO "service_role";



GRANT ALL ON TABLE "public"."chit_members" TO "anon";
GRANT ALL ON TABLE "public"."chit_members" TO "authenticated";
GRANT ALL ON TABLE "public"."chit_members" TO "service_role";



GRANT ALL ON TABLE "public"."contributions" TO "anon";
GRANT ALL ON TABLE "public"."contributions" TO "authenticated";
GRANT ALL ON TABLE "public"."contributions" TO "service_role";



GRANT ALL ON TABLE "public"."departments" TO "anon";
GRANT ALL ON TABLE "public"."departments" TO "authenticated";
GRANT ALL ON TABLE "public"."departments" TO "service_role";



GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";



GRANT ALL ON TABLE "public"."file_storage" TO "anon";
GRANT ALL ON TABLE "public"."file_storage" TO "authenticated";
GRANT ALL ON TABLE "public"."file_storage" TO "service_role";



GRANT ALL ON TABLE "public"."flags" TO "anon";
GRANT ALL ON TABLE "public"."flags" TO "authenticated";
GRANT ALL ON TABLE "public"."flags" TO "service_role";



GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";



GRANT ALL ON TABLE "public"."loan_repayments" TO "anon";
GRANT ALL ON TABLE "public"."loan_repayments" TO "authenticated";
GRANT ALL ON TABLE "public"."loan_repayments" TO "service_role";



GRANT ALL ON TABLE "public"."loan_requests" TO "anon";
GRANT ALL ON TABLE "public"."loan_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."loan_requests" TO "service_role";



GRANT ALL ON TABLE "public"."loans" TO "anon";
GRANT ALL ON TABLE "public"."loans" TO "authenticated";
GRANT ALL ON TABLE "public"."loans" TO "service_role";



GRANT ALL ON TABLE "public"."mandals" TO "anon";
GRANT ALL ON TABLE "public"."mandals" TO "authenticated";
GRANT ALL ON TABLE "public"."mandals" TO "service_role";



GRANT ALL ON TABLE "public"."meetings" TO "anon";
GRANT ALL ON TABLE "public"."meetings" TO "authenticated";
GRANT ALL ON TABLE "public"."meetings" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."permissions" TO "anon";
GRANT ALL ON TABLE "public"."permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON TABLE "public"."qr_codes" TO "anon";
GRANT ALL ON TABLE "public"."qr_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."qr_codes" TO "service_role";



GRANT ALL ON TABLE "public"."receipts" TO "anon";
GRANT ALL ON TABLE "public"."receipts" TO "authenticated";
GRANT ALL ON TABLE "public"."receipts" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";



GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";



GRANT ALL ON TABLE "public"."transactions" TO "anon";
GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."transactions" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
