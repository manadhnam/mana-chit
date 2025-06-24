-- Add eligibility fields to users table
ALTER TABLE "public"."users"
ADD COLUMN "cibil_score" INTEGER,
ADD COLUMN "monthly_income" NUMERIC(10,2),
ADD COLUMN "date_of_birth" DATE;

-- Create nominations table
CREATE TABLE IF NOT EXISTS "public"."nominations" (
    "id" UUID DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "user_id" UUID NOT NULL,
    "nominee_name" VARCHAR(255) NOT NULL,
    "relationship" VARCHAR(100) NOT NULL,
    "id_proof_type" VARCHAR(50) NOT NULL,
    "id_proof_number" VARCHAR(100) NOT NULL,
    "contact_number" VARCHAR(20),
    "address" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE
);

-- Create insurance policies table
CREATE TABLE IF NOT EXISTS "public"."insurance_policies" (
    "id" UUID DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "policy_name" VARCHAR(255) NOT NULL,
    "policy_number" VARCHAR(100) UNIQUE NOT NULL,
    "coverage_type" VARCHAR(100) NOT NULL,
    "coverage_amount" NUMERIC(12,2) NOT NULL,
    "premium_amount" NUMERIC(10,2) NOT NULL,
    "terms_and_conditions" TEXT,
    "is_active" BOOLEAN DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- Create customer insurance table
CREATE TABLE IF NOT EXISTS "public"."customer_insurance" (
    "id" UUID DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "user_id" UUID NOT NULL,
    "policy_id" UUID NOT NULL,
    "enrollment_date" DATE NOT NULL,
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE,
    FOREIGN KEY ("policy_id") REFERENCES "public"."insurance_policies"("id") ON DELETE CASCADE
);

-- Add triggers for updated_at
CREATE TRIGGER "update_nominations_updated_at" BEFORE UPDATE ON "public"."nominations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_insurance_policies_updated_at" BEFORE UPDATE ON "public"."insurance_policies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_customer_insurance_updated_at" BEFORE UPDATE ON "public"."customer_insurance" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- Insert default insurance policy
INSERT INTO "public"."insurance_policies" ("policy_name", "policy_number", "coverage_type", "coverage_amount", "premium_amount", "terms_and_conditions") VALUES
('SmartChit Basic Coverage', 'SCB-001-2024', 'Death and Disability', 500000.00, 0.00, 'Covers outstanding loan liabilities in case of death or permanent disability. Premium included in chit plan.');

-- Create RLS policies
ALTER TABLE "public"."nominations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."insurance_policies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."customer_insurance" ENABLE ROW LEVEL SECURITY;

-- Nominations RLS policies
CREATE POLICY "Users can view their own nominations" ON "public"."nominations" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own nominations" ON "public"."nominations" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nominations" ON "public"."nominations" FOR UPDATE USING (auth.uid() = user_id);

-- Insurance policies RLS policies (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view insurance policies" ON "public"."insurance_policies" FOR SELECT USING (auth.role() = 'authenticated');

-- Customer insurance RLS policies
CREATE POLICY "Users can view their own insurance" ON "public"."customer_insurance" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own insurance" ON "public"."customer_insurance" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insurance" ON "public"."customer_insurance" FOR UPDATE USING (auth.uid() = user_id);

-- Super admin policies
CREATE POLICY "Super admin can manage all nominations" ON "public"."nominations" FOR ALL USING (auth.jwt() ->> 'role' = 'superAdmin');
CREATE POLICY "Super admin can manage all insurance policies" ON "public"."insurance_policies" FOR ALL USING (auth.jwt() ->> 'role' = 'superAdmin');
CREATE POLICY "Super admin can manage all customer insurance" ON "public"."customer_insurance" FOR ALL USING (auth.jwt() ->> 'role' = 'superAdmin');

