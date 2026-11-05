/* DEV ONLY: wipes every table and loads demo data. Never run against production. */
import {
  PrismaClient, Role, ApptStatus, ApptSource, Gender, PaymentMethod, Channel,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

const db = new PrismaClient();
const TZ = "Asia/Karachi";
const PASSWORD = "Password123!";

// ── deterministic randomness ──
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(42);
const pick = <T,>(a: T[]): T => a[Math.floor(rand() * a.length)];
const shuffle = <T,>(a: T[]): T[] => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
};

// ── date helpers ──
const todayStr = formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");
const dayStr = (off: number) => {
  const d = new Date(`${todayStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + off);
  return d.toISOString().slice(0, 10);
};
const dateOnly = (s: string) => new Date(`${s}T00:00:00Z`);
const weekdayOf = (s: string) => dateOnly(s).getUTCDay();
const at = (s: string, hhmm: string) => fromZonedTime(`${s}T${hhmm}:00`, TZ);
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

let phoneCounter = 1;
const nextPhone = () => `+9230${String(phoneCounter++).padStart(8, "0")}`;
const randomDob = () => new Date(Date.UTC(1960 + Math.floor(rand() * 45), Math.floor(rand() * 12), 1 + Math.floor(rand() * 28)));

async function main() {
  if (/supabase\.(co|com)/.test(process.env.DATABASE_URL ?? "") && process.env.ALLOW_SEED !== "yes") {
    throw new Error("Refusing to seed a Supabase database. Set ALLOW_SEED=yes only for a throwaway project.");
  }

  // Wipe tables safely
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  await db.$executeRawUnsafe(
    `TRUNCATE TABLE ${tables.map((t) => `"${t.tablename}"`).join(", ")} RESTART IDENTITY CASCADE`,
  );

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // ── Specializations ──
  const specNames = ["Dermatology", "General Physician", "Cardiology", "Pediatrics",
    "Gynecology", "ENT", "Orthopedics", "Dentistry"];
  await db.specialization.createMany({ data: specNames.map((name) => ({ name })) });
  const spec = Object.fromEntries((await db.specialization.findMany()).map((s) => [s.name, s.id]));

  // ── Super Admin (Global: clinicId = null) ──
  await db.user.create({ data: { role: Role.SUPER_ADMIN, name: "Platform Owner", email: "super@mediai.test", phone: nextPhone(), passwordHash } });

  // ── Clinics ──
  const c1 = await db.clinic.create({ data: { name: "Shifa Demo Clinic", slug: "demo-clinic", city: "Lahore", phone: "+924235000000", address: "Main Boulevard, Lahore", brandColor: "#4f46e5" } });
  const c2 = await db.clinic.create({ data: { name: "Noor Family Clinic", slug: "noor-clinic", city: "Karachi", phone: "+922135000000", address: "Clifton, Karachi", brandColor: "#0891b2" } });

  // ── Staff (Clinic-scoped: clinicId required) ──
  const staff = (clinicId: string, role: Role, name: string, email: string) =>
    db.user.create({ data: { clinicId, role, name, email, phone: nextPhone(), passwordHash } });
  await staff(c1.id, Role.CLINIC_ADMIN, "Clinic Admin (Shifa)", "admin@demo-clinic.test");
  await staff(c1.id, Role.RECEPTIONIST, "Reception (Shifa)", "reception@demo-clinic.test");
  await staff(c2.id, Role.CLINIC_ADMIN, "Clinic Admin (Noor)", "admin@noor-clinic.test");
  await staff(c2.id, Role.RECEPTIONIST, "Reception (Noor)", "reception@noor-clinic.test");

  // ── Doctors ──
  type DocDef = { name: string; email: string; spec: string; fee: number; slot: number; video: boolean };
  const leaveDays = new Map<string, Set<string>>();
  async function createDoctor(clinicId: string, d: DocDef) {
    const user = await db.user.create({ data: { clinicId, role: Role.DOCTOR, name: d.name, email: d.email, phone: nextPhone(), passwordHash } });
    const doc = await db.doctor.create({
      data: {
        clinicId, userId: user.id, specializationId: spec[d.spec], fee: d.fee, slotMinutes: d.slot,
        videoEnabled: d.video, qualification: "MBBS, FCPS", experienceYears: 5 + Math.floor(rand() * 15),
        bio: `${d.spec} specialist.`,
      },
    });
    const rows = [];
    for (let wd = 1; wd <= 6; wd++) {
      rows.push({ doctorId: doc.id, weekday: wd, startTime: "09:00", endTime: "13:00" });
      rows.push({ doctorId: doc.id, weekday: wd, startTime: "17:00", endTime: "20:00" });
    }
    await db.doctorSchedule.createMany({ data: rows });
    return doc;
  }

  const docs1 = [];
  for (const d of [
    { name: "Dr. Ayesha Khan", email: "ayesha.khan@demo-clinic.test", spec: "Dermatology", fee: 2500, slot: 15, video: true },
    { name: "Dr. Usman Raza", email: "usman.raza@demo-clinic.test", spec: "General Physician", fee: 1500, slot: 10, video: true },
    { name: "Dr. Fatima Noor", email: "fatima.noor@demo-clinic.test", spec: "Pediatrics", fee: 2000, slot: 15, video: false },
    { name: "Dr. Imran Sheikh", email: "imran.sheikh@demo-clinic.test", spec: "Cardiology", fee: 3500, slot: 20, video: true },
    { name: "Dr. Sara Malik", email: "sara.malik@demo-clinic.test", spec: "Gynecology", fee: 3000, slot: 20, video: false },
  ] as DocDef[]) docs1.push(await createDoctor(c1.id, d));

  const docs2 = [];
  for (const d of [
    { name: "Dr. Hassan Ali", email: "hassan.ali@noor-clinic.test", spec: "ENT", fee: 2000, slot: 15, video: false },
    { name: "Dr. Mehwish Zafar", email: "mehwish.zafar@noor-clinic.test", spec: "Dermatology", fee: 2800, slot: 15, video: true },
  ] as DocDef[]) docs2.push(await createDoctor(c2.id, d));

  await db.doctorLeave.create({ data: { doctorId: docs1[1].id, startDate: dateOnly(dayStr(4)), endDate: dateOnly(dayStr(5)), reason: "Conference" } });
  leaveDays.set(docs1[1].id, new Set([dayStr(4), dayStr(5)]));

  // ── Patients (User is Global: clinicId = null; Patient table links to clinic) ──
  const mkPatient = (clinicId: string, name: string, o: { userId?: string; phone?: string; email?: string } = {}) =>
    db.patient.create({
      data: {
        clinicId, name, phone: o.phone ?? nextPhone(), email: o.email ?? null, userId: o.userId ?? null,
        gender: pick([Gender.MALE, Gender.FEMALE]), dob: randomDob(),
      },
    });

  const portalUsers = [];
  for (const [i, name] of ["Hamza Ali", "Sana Malik", "Bilal Ahmed"].entries()) {
    // Note: clinicId is omitted here because PATIENT users are global accounts
    portalUsers.push(await db.user.create({ data: { role: Role.PATIENT, name, email: `patient${i + 1}@mediai.test`, phone: nextPhone(), passwordHash } }));
  }
  const pts1 = [];
  for (const u of portalUsers) pts1.push(await mkPatient(c1.id, u.name, { userId: u.id, phone: u.phone!, email: u.email! }));
  for (const n of ["Ahmed Raza", "Zainab Fatima", "Kamran Akmal", "Nadia Hussain", "Tariq Mehmood", "Rabia Khan",
    "Farhan Saeed", "Hina Rauf", "Salman Butt", "Maryam Aslam", "Adeel Iqbal", "Saba Qamar", "Waqas Ahmad", "Iqra Shah", "Danish Ali"]) {
    pts1.push(await mkPatient(c1.id, n));
  }
  const pts2 = [await mkPatient(c2.id, portalUsers[0].name, { userId: portalUsers[0].id, phone: portalUsers[0].phone!, email: portalUsers[0].email! })];
  for (const n of ["Asif Zardari", "Noreen Bibi", "Rashid Minhas", "Shaista Gul", "Yasir Shah"]) pts2.push(await mkPatient(c2.id, n));

  // ── Appointments ──
  const now = new Date();
  const noteSamples = ["Routine check-up. Advised rest and fluids.", "Follow-up visit. Condition improving.",
    "Prescribed medication; review in one week.", "Referred for lab tests."];

  async function seedAppointments(clinicId: string, doctors: typeof docs1, patients: typeof pts1) {
    for (const doc of doctors) {
      for (let off = -10; off <= 6; off++) {
        const day = dayStr(off);
        if (weekdayOf(day) === 0) continue;
        if (leaveDays.get(doc.id)?.has(day)) continue;
        const perWindow = Math.floor(240 / doc.slotMinutes);
        const idx = shuffle([...Array(perWindow).keys()]).slice(0, 3);
        for (const i of idx) {
          const startsAt = at(day, hhmm(9 * 60 + i * doc.slotMinutes));
          const endsAt = new Date(startsAt.getTime() + doc.slotMinutes * 60000);
          const p = pick(patients);
          const isPast = endsAt < now;
          let status: ApptStatus;
          if (isPast) { const r = rand(); status = r < 0.72 ? ApptStatus.COMPLETED : r < 0.87 ? ApptStatus.CANCELLED : ApptStatus.NO_SHOW; }
          else status = rand() < 0.85 ? ApptStatus.BOOKED : ApptStatus.CANCELLED;

          const online = p.userId !== null;
          const appt = await db.appointment.create({
            data: {
              clinicId, doctorId: doc.id, patientId: p.id, startsAt, endsAt, apptDate: dateOnly(day),
              status, source: online ? ApptSource.ONLINE : ApptSource.RECEPTION, fee: doc.fee,
              reason: pick(["Fever and cough", "Skin rash", "Follow-up", "General check-up", "Headache"]),
              completedAt: status === ApptStatus.COMPLETED ? endsAt : null,
              noShowAt: status === ApptStatus.NO_SHOW ? endsAt : null,
              cancelledAt: status === ApptStatus.CANCELLED ? new Date(startsAt.getTime() - 86400000) : null,
              cancelledBy: status === ApptStatus.CANCELLED ? (online ? Role.PATIENT : Role.RECEPTIONIST) : null,
              cancelReason: status === ApptStatus.CANCELLED ? "Schedule conflict" : null,
            },
          });

          if (status === ApptStatus.COMPLETED) {
            await db.visit.create({ data: { clinicId, appointmentId: appt.id, patientId: p.id, doctorId: doc.id, notes: pick(noteSamples), advice: "Take rest, drink plenty of water." } });
            await db.payment.create({ data: { clinicId, appointmentId: appt.id, amount: doc.fee, method: PaymentMethod.CASH } });
          }
          if (status === ApptStatus.BOOKED && off >= 1 && off <= 2 && p.email) {
            await db.notification.create({
              data: {
                clinicId, appointmentId: appt.id, channel: Channel.EMAIL, template: "reminder_24h", toAddress: p.email,
                dedupeKey: `reminder_24h:${appt.id}`, scheduledFor: new Date(startsAt.getTime() - 24 * 3600 * 1000),
              },
            });
          }
        }
      }
    }
  }
  await seedAppointments(c1.id, docs1, pts1);
  await seedAppointments(c2.id, docs2, pts2);

  // ── Walk-in Queue ──
  const walkInPatients = pts1.filter((p) => p.userId === null);
  for (const doc of docs1.slice(0, 2)) {
    for (let n = 1; n <= 2; n++) {
      await db.appointment.create({
        data: {
          clinicId: c1.id, doctorId: doc.id, patientId: pick(walkInPatients).id, startsAt: now,
          endsAt: new Date(now.getTime() + doc.slotMinutes * 60000), apptDate: dateOnly(todayStr),
          status: ApptStatus.CHECKED_IN, source: ApptSource.WALK_IN, tokenNo: n, fee: doc.fee, checkedInAt: now,
        },
      });
    }
    await db.queueCounter.create({ data: { doctorId: doc.id, date: dateOnly(todayStr), last: 2 } });
  }

  // ── Demo rows ──
  await db.consentRecord.create({ data: { clinicId: c1.id, patientId: pts1[0].id, purpose: "skin_analysis", version: "v1" } });
  await db.modelVersion.create({
    data: {
      name: "mock-model", version: "0.0.1", checksum: "mock", isActive: false,
      thresholds: { temperature: 1.0, abstain_max_prob: 0.5, entropy_max: 1.5, urgent_mel_prob: 0.3 },
    },
  });
  const kd = await db.knowledgeDoc.create({ data: { title: "Clinic FAQ", source: "internal", approved: true } });
  await db.knowledgeChunk.createMany({
    data: [
      { docId: kd.id, ordinal: 0, content: "You can cancel an appointment up to 2 hours before its start time." },
      { docId: kd.id, ordinal: 1, content: "Please arrive 10 minutes early and bring any previous reports." },
      { docId: kd.id, ordinal: 2, content: "Video consultations are available only with doctors who have video enabled." },
    ],
  });
  await db.auditLog.create({ data: { action: "seed.completed", targetType: "System", targetId: "seed", meta: { at: new Date().toISOString() } } });

  console.log(`
Seed complete. All passwords: ${PASSWORD}
  super@mediai.test               SUPER_ADMIN
  admin@demo-clinic.test          CLINIC_ADMIN   (Shifa Demo Clinic)
  reception@demo-clinic.test      RECEPTIONIST
  ayesha.khan@demo-clinic.test    DOCTOR (Dermatology)
  patient1@mediai.test            PATIENT (registered at both clinics)
  admin@noor-clinic.test          CLINIC_ADMIN   (second clinic, for isolation tests)`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());