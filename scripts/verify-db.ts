import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
let failed = 0;

async function expectFail(label: string, fn: () => Promise<unknown>) {
  try { 
    await fn(); 
    console.log(`FAIL  ${label}  (no error was thrown)`); 
    failed++; 
  } catch { 
    console.log(`PASS  ${label}`); 
  }
}

async function expectOk(label: string, fn: () => Promise<unknown>) {
  try { 
    await fn(); 
    console.log(`PASS  ${label}`); 
  } catch (e) { 
    console.log(`FAIL  ${label}`, e); 
    failed++; 
  }
}

async function main() {
  const clinic = await db.clinic.findUniqueOrThrow({ where: { slug: "demo-clinic" } });
  const other = await db.clinic.findUniqueOrThrow({ where: { slug: "noor-clinic" } });
  const doctor = await db.doctor.findFirstOrThrow({ where: { clinicId: clinic.id } });
  const patient = await db.patient.findFirstOrThrow({ where: { clinicId: clinic.id } });
  const foreign = await db.patient.findFirstOrThrow({ where: { clinicId: other.id } });

  const mk = (hour: number, patientId = patient.id, minutes = 15) => {
    const startsAt = new Date(`2031-03-03T${String(hour).padStart(2, "0")}:00:00Z`);
    return {
      clinicId: clinic.id, doctorId: doctor.id, patientId, startsAt,
      endsAt: new Date(startsAt.getTime() + minutes * 60000), apptDate: new Date("2031-03-03"),
    };
  };

  const a = await db.appointment.create({ data: mk(5) });
  await expectFail("double-booking the same slot is rejected", () => db.appointment.create({ data: mk(5) }));
  await db.appointment.update({ where: { id: a.id }, data: { status: "CANCELLED", cancelledAt: new Date() } });
  await expectOk("a cancelled slot can be booked again", () => db.appointment.create({ data: mk(5) }));
  await expectFail("endsAt before startsAt is rejected", () => db.appointment.create({ data: mk(6, patient.id, -15) }));
  await expectFail("patient from another clinic is rejected (tenant guard)", () => db.appointment.create({ data: mk(7, foreign.id) }));
  await expectFail("invalid phone format is rejected", () => db.patient.create({ data: { clinicId: clinic.id, name: "X", phone: "0300" } }));
  await expectFail("uppercase email is rejected", () => db.user.create({ data: { role: "PATIENT", name: "X", email: "Bad@Mail.com", passwordHash: "x" } }));
  await expectFail("staff user without a clinic is rejected", () => db.user.create({ data: { role: "DOCTOR", name: "X", email: "nodoc@x.test", passwordHash: "x" } }));

  const log = await db.auditLog.create({ data: { action: "verify.test", targetType: "System", targetId: "verify" } });
  await expectFail("audit log UPDATE is rejected", () => db.auditLog.update({ where: { id: log.id }, data: { action: "tampered" } }));
  await expectFail("audit log DELETE is rejected", () => db.auditLog.delete({ where: { id: log.id } }));

  await db.appointment.deleteMany({ where: { startsAt: { gte: new Date("2031-01-01") } } });
  console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll database guards work.");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });