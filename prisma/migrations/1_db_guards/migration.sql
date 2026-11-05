-- ═══════════ 1. Slot Guard ═══════════
-- Prevents double-booking: A doctor cannot have two active appointments at the exact same start time.
CREATE UNIQUE INDEX uniq_active_slot
  ON "Appointment" ("doctorId", "startsAt")
  WHERE status IN ('BOOKED','CHECKED_IN','IN_PROGRESS')
    AND source <> 'WALK_IN';

-- ═══════════ 2. CHECK Constraints ═══════════
-- Data safety rules enforced at the database layer.
ALTER TABLE "User"
  ADD CONSTRAINT user_contact_present CHECK (email IS NOT NULL OR phone IS NOT NULL),
  ADD CONSTRAINT user_email_lower     CHECK (email IS NULL OR email = lower(email)),
  ADD CONSTRAINT user_phone_e164      CHECK (phone IS NULL OR phone ~ '^\+[1-9][0-9]{7,14}$'),
  ADD CONSTRAINT user_role_clinic CHECK (
       (role IN ('SUPER_ADMIN','PATIENT') AND "clinicId" IS NULL)
    OR (role IN ('CLINIC_ADMIN','RECEPTIONIST','DOCTOR') AND "clinicId" IS NOT NULL));

ALTER TABLE "Patient"
  ADD CONSTRAINT patient_phone_e164 CHECK (phone ~ '^\+[1-9][0-9]{7,14}$'),
  ADD CONSTRAINT patient_email_lower CHECK (email IS NULL OR email = lower(email));

ALTER TABLE "Doctor"
  ADD CONSTRAINT doctor_fee_nonneg   CHECK (fee >= 0),
  ADD CONSTRAINT doctor_slot_range   CHECK ("slotMinutes" BETWEEN 5 AND 120);

ALTER TABLE "DoctorSchedule"
  ADD CONSTRAINT sched_weekday CHECK (weekday BETWEEN 0 AND 6),
  ADD CONSTRAINT sched_times   CHECK (
       "startTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
   AND "endTime"   ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
   AND "startTime" < "endTime");

ALTER TABLE "DoctorLeave"  ADD CONSTRAINT leave_dates CHECK ("endDate" >= "startDate");

ALTER TABLE "Appointment"
  ADD CONSTRAINT appt_time_order CHECK ("endsAt" > "startsAt"),
  ADD CONSTRAINT appt_fee_nonneg CHECK (fee IS NULL OR fee >= 0),
  ADD CONSTRAINT appt_token_pos  CHECK ("tokenNo" IS NULL OR "tokenNo" > 0);

ALTER TABLE "Payment"       ADD CONSTRAINT payment_amount_pos CHECK (amount > 0);

ALTER TABLE "Clinic"
  ADD CONSTRAINT clinic_rules CHECK ("cancelWindowHrs" >= 0 AND "advanceBookingDays" BETWEEN 1 AND 365
                                     AND "minLeadMinutes" >= 0 AND "noShowGraceMinutes" >= 0);

ALTER TABLE "SkinAssessment"
  ADD CONSTRAINT assess_conf_range CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1));

-- ═══════════ 3. Tenant Guard ═══════════
-- Ensures doctors and patients involved in an appointment belong to the same clinic.
CREATE OR REPLACE FUNCTION appt_tenant_guard() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "Doctor" d WHERE d.id = NEW."doctorId" AND d."clinicId" = NEW."clinicId") THEN
    RAISE EXCEPTION 'tenant violation: doctor not in clinic';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "Patient" p WHERE p.id = NEW."patientId" AND p."clinicId" = NEW."clinicId") THEN
    RAISE EXCEPTION 'tenant violation: patient not in clinic';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER appt_tenant_guard_trg
  BEFORE INSERT OR UPDATE OF "doctorId","patientId","clinicId" ON "Appointment"
  FOR EACH ROW EXECUTE FUNCTION appt_tenant_guard();

-- ═══════════ 4. Append-Only Audit Log ═══════════
-- Blocks UPDATE and DELETE operations on audit records.
CREATE OR REPLACE FUNCTION audit_immutable() RETURNS trigger AS $$
BEGIN RAISE EXCEPTION 'AuditLog is append-only'; END $$ LANGUAGE plpgsql;

CREATE TRIGGER audit_no_change
  BEFORE UPDATE OR DELETE ON "AuditLog"
  FOR EACH ROW EXECUTE FUNCTION audit_immutable();

-- ═══════════ 5. Performance Indexes ═══════════
CREATE INDEX notif_due_idx ON "Notification" ("scheduledFor") WHERE status = 'QUEUED';
CREATE INDEX patient_name_trgm  ON "Patient" USING gin (name  gin_trgm_ops);
CREATE INDEX patient_phone_trgm ON "Patient" USING gin (phone gin_trgm_ops);
CREATE INDEX chunk_embedding_hnsw ON "KnowledgeChunk" USING hnsw (embedding vector_cosine_ops);
CREATE UNIQUE INDEX one_active_model ON "ModelVersion" ((1)) WHERE "isActive";

-- ═══════════ 6. Row-Level Security ═══════════
-- Blocks unauthorized direct REST API access to public tables via Supabase keys.
CREATE OR REPLACE FUNCTION enable_rls_all() RETURNS void AS $$
DECLARE t record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables
           WHERE schemaname = 'public' AND tablename <> '_prisma_migrations' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END $$ LANGUAGE plpgsql;

SELECT enable_rls_all();