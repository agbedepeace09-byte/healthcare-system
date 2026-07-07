const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Create Staff
  const staffData = [
    { staffId: "DOC-001", firstName: "John", lastName: "Doe", email: "j.doe@mcpherson.edu", role: "DOCTOR", passwordHash },
    { staffId: "NUR-001", firstName: "Jane", lastName: "Smith", email: "j.smith@mcpherson.edu", role: "NURSE", passwordHash },
    { staffId: "REC-001", firstName: "Alice", lastName: "Johnson", email: "a.johnson@mcpherson.edu", role: "RECEPTIONIST", passwordHash },
    { staffId: "PHA-001", firstName: "Bob", lastName: "Brown", email: "b.brown@mcpherson.edu", role: "PHARMACIST", passwordHash },
    { staffId: "LAB-001", firstName: "Carol", lastName: "Davis", email: "c.davis@mcpherson.edu", role: "LABORATORIST", passwordHash },
    { staffId: "ADM-001", firstName: "Admin", lastName: "User", email: "admin@mcpherson.edu", role: "ADMIN", passwordHash },
  ];

  for (const s of staffData) {
    await prisma.staff.upsert({
      where: { email: s.email },
      update: {},
      create: s,
    });
  }
  console.log(`Created ${staffData.length} staff members`);

  // Create Patients
  const patientData = [
    { matricNumber: "220202001", firstName: "Ade", lastName: "Ogun", dateOfBirth: new Date("2002-05-15"), gender: "Male", department: "Engineering", level: 300 },
    { matricNumber: "220202002", firstName: "Bisi", lastName: "Adebayo", dateOfBirth: new Date("2003-08-22"), gender: "Female", department: "Sciences", level: 200 },
    { matricNumber: "220202003", firstName: "Chidi", lastName: "Okonkwo", dateOfBirth: new Date("2001-11-30"), gender: "Male", department: "Arts", level: 400 },
  ];

  for (const p of patientData) {
    await prisma.patient.upsert({
      where: { matricNumber: p.matricNumber },
      update: {},
      create: p,
    });
  }
  console.log(`Created ${patientData.length} patients`);

  // Create Wards
  const ward1 = await prisma.ward.upsert({
    where: { code: "MMW" },
    update: {},
    create: { name: "Male Medical Ward", code: "MMW", floor: 1, description: "General medical ward for male patients" },
  });

  const ward2 = await prisma.ward.upsert({
    where: { code: "FMW" },
    update: {},
    create: { name: "Female Medical Ward", code: "FMW", floor: 1, description: "General medical ward for female patients" },
  });

  const ward3 = await prisma.ward.upsert({
    where: { code: "ISO" },
    update: {},
    create: { name: "Isolation Ward", code: "ISO", floor: 2, description: "Isolation for infectious disease cases" },
  });

  const ward4 = await prisma.ward.upsert({
    where: { code: "ERW" },
    update: {},
    create: { name: "Emergency Ward", code: "ERW", floor: 1, description: "Emergency room observation ward" },
  });

  console.log("Created/verified wards");

  // Create Beds for Male Medical Ward (12 beds)
  for (let i = 1; i <= 12; i++) {
    await prisma.bed.upsert({
      where: { id: i },
      update: {},
      create: {
        bedNumber: `MMW-${String(i).padStart(2, "0")}`,
        wardId: ward1.id,
        status: i <= 6 ? "OCCUPIED" : i <= 10 ? "AVAILABLE" : "MAINTENANCE",
      },
    });
  }

  // Create Beds for Female Medical Ward (10 beds)
  for (let i = 13; i <= 22; i++) {
    await prisma.bed.upsert({
      where: { id: i },
      update: {},
      create: {
        bedNumber: `FMW-${String(i - 12).padStart(2, "0")}`,
        wardId: ward2.id,
        status: i <= 16 ? "OCCUPIED" : "AVAILABLE",
      },
    });
  }

  // Create Beds for Isolation Ward (6 beds)
  for (let i = 23; i <= 28; i++) {
    await prisma.bed.upsert({
      where: { id: i },
      update: {},
      create: {
        bedNumber: `ISO-${String(i - 22).padStart(2, "0")}`,
        wardId: ward3.id,
        status: i === 26 ? "MAINTENANCE" : "AVAILABLE",
      },
    });
  }

  // Create Beds for Emergency Ward (8 beds)
  for (let i = 29; i <= 36; i++) {
    await prisma.bed.upsert({
      where: { id: i },
      update: {},
      create: {
        bedNumber: `ERW-${String(i - 28).padStart(2, "0")}`,
        wardId: ward4.id,
        status: i <= 34 ? "OCCUPIED" : "AVAILABLE",
      },
    });
  }

  console.log("Created/verified beds");

  // Create Drip Stands
  const dripData = [
    { code: "DRIP-001", wardId: ward1.id },
    { code: "DRIP-002", wardId: ward1.id },
    { code: "DRIP-003", wardId: ward2.id },
    { code: "DRIP-004", wardId: ward4.id },
    { code: "DRIP-005", wardId: null, status: "MAINTENANCE" },
    { code: "DRIP-006", wardId: ward3.id },
    { code: "DRIP-007", wardId: ward2.id },
    { code: "DRIP-008", wardId: ward4.id },
  ];

  for (const d of dripData) {
    await prisma.dripStand.upsert({
      where: { standCode: d.code },
      update: {},
      create: { standCode: d.code, wardId: d.wardId, status: d.status || "AVAILABLE" },
    });
  }

  console.log("Created/verified drip stands");

  // Summary
  const wardCount = await prisma.ward.count();
  const bedCount = await prisma.bed.count();
  const availableBeds = await prisma.bed.count({ where: { status: "AVAILABLE" } });
  const dripCount = await prisma.dripStand.count();
  const staffCount = await prisma.staff.count();
  const patientCount = await prisma.patient.count();

  console.log(`\nSummary:`);
  console.log(`  Staff: ${staffCount}`);
  console.log(`  Patients: ${patientCount}`);
  console.log(`  Wards: ${wardCount}`);
  console.log(`  Beds: ${bedCount} (${availableBeds} available)`);
  console.log(`  Drip Stands: ${dripCount}`);
  console.log("\nDefault password for all staff: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
