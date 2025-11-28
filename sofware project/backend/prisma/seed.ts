import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (in development only)
  if (process.env.NODE_ENV === "development") {
    console.log("🧹 Cleaning existing data...");
    await prisma.auditLog.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.emergencyRequest.deleteMany();
    await prisma.medicalRecordFile.deleteMany();
    await prisma.medicalRecord.deleteMany();
    await prisma.appointmentFile.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.doctorProfile.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.user.deleteMany();
  }

  // Hash password for all users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ============================================================================
  // CREATE USERS
  // ============================================================================

  console.log("👥 Creating users...");

  // Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@careconnect.edu",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      phone: "+1-555-0001",
      isActive: true,
    },
  });

  // Doctor Users
  const doctor1 = await prisma.user.create({
    data: {
      email: "dr.smith@careconnect.edu",
      password: hashedPassword,
      firstName: "John",
      lastName: "Smith",
      role: "DOCTOR",
      phone: "+1-555-0101",
      isActive: true,
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: "dr.jones@careconnect.edu",
      password: hashedPassword,
      firstName: "Sarah",
      lastName: "Jones",
      role: "DOCTOR",
      phone: "+1-555-0102",
      isActive: true,
    },
  });

  // Nurse Users
  const nurse1 = await prisma.user.create({
    data: {
      email: "nurse.brown@careconnect.edu",
      password: hashedPassword,
      firstName: "Emily",
      lastName: "Brown",
      role: "NURSE",
      phone: "+1-555-0201",
      isActive: true,
    },
  });

  // Student Users
  const student1 = await prisma.user.create({
    data: {
      email: "student1@university.edu",
      password: hashedPassword,
      firstName: "Alice",
      lastName: "Johnson",
      role: "STUDENT",
      phone: "+1-555-1001",
      isActive: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "student2@university.edu",
      password: hashedPassword,
      firstName: "Bob",
      lastName: "Williams",
      role: "STUDENT",
      phone: "+1-555-1002",
      isActive: true,
    },
  });

  // ============================================================================
  // CREATE PROFILES
  // ============================================================================

  console.log("📋 Creating profiles...");

  // Doctor Profiles
  await prisma.doctorProfile.create({
    data: {
      userId: doctor1.id,
      licenseNumber: "MD-LIC-12345",
      specialty: "General Medicine",
      qualifications: JSON.stringify([
        "MD - Medical School",
        "Board Certified in Internal Medicine",
      ]),
      availableHours: JSON.stringify({
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "15:00" },
      }),
      bio: "Experienced general practitioner with 10 years of practice.",
    },
  });

  await prisma.doctorProfile.create({
    data: {
      userId: doctor2.id,
      licenseNumber: "MD-LIC-12346",
      specialty: "Cardiology",
      qualifications: JSON.stringify([
        "MD - Medical School",
        "Fellowship in Cardiology",
      ]),
      availableHours: JSON.stringify({
        monday: { start: "08:00", end: "16:00" },
        wednesday: { start: "08:00", end: "16:00" },
        friday: { start: "08:00", end: "16:00" },
      }),
      bio: "Cardiologist specializing in preventive heart care.",
    },
  });

  // Student Profiles
  await prisma.studentProfile.create({
    data: {
      userId: student1.id,
      studentId: "STU-2024-001",
      dateOfBirth: new Date("2000-05-15"),
      address: "123 University Ave, Campus Housing",
      emergencyContact: "Jane Johnson",
      emergencyPhone: "+1-555-2001",
      bloodType: "O+",
      allergies: JSON.stringify(["Peanuts", "Dust"]),
      medicalHistory: JSON.stringify({
        chronicConditions: [],
        surgeries: [],
      }),
    },
  });

  await prisma.studentProfile.create({
    data: {
      userId: student2.id,
      studentId: "STU-2024-002",
      dateOfBirth: new Date("2001-08-22"),
      address: "456 College St, Campus Housing",
      emergencyContact: "Mary Williams",
      emergencyPhone: "+1-555-2002",
      bloodType: "A+",
      allergies: JSON.stringify(["Latex"]),
    },
  });

  // ============================================================================
  // CREATE APPOINTMENTS
  // ============================================================================

  console.log("📅 Creating appointments...");

  const appointment1 = await prisma.appointment.create({
    data: {
      userId: student1.id,
      doctorId: doctor1.id,
      date: new Date("2024-12-15T10:00:00Z"),
      duration: 30,
      status: "CONFIRMED",
      reason: "Annual health checkup",
      notes: "Routine examination",
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      userId: student2.id,
      doctorId: doctor1.id,
      date: new Date("2024-12-16T14:30:00Z"),
      duration: 30,
      status: "PENDING",
      reason: "Follow-up consultation",
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      userId: student1.id,
      doctorId: doctor2.id,
      date: new Date("2024-12-20T09:00:00Z"),
      duration: 60,
      status: "PENDING",
      reason: "Cardiology consultation",
    },
  });

  // ============================================================================
  // CREATE MEDICAL RECORDS (ENCRYPTED)
  // ============================================================================

  console.log("📋 Creating medical records...");

  // Example encrypted data (base64 encoded JSON)
  // In production, this would be properly encrypted
  const sampleEncryptedData = Buffer.from(
    JSON.stringify({
      diagnosis: "Common cold",
      treatment: "Rest and hydration",
      prescriptions: [
        {
          medication: "Acetaminophen",
          dosage: "500mg",
          frequency: "Every 6 hours",
          duration: "3 days",
        },
      ],
      doctorNotes: "Patient should rest and drink plenty of fluids.",
      vitalSigns: {
        temperature: "98.6°F",
        bloodPressure: "120/80",
        heartRate: 72,
      },
    })
  ).toString("base64");

  const record1 = await prisma.medicalRecord.create({
    data: {
      userId: student1.id,
      doctorId: doctor1.id,
      encryptedData: sampleEncryptedData,
      keyId: "key-001",
    },
  });

  // ============================================================================
  // CREATE EMERGENCY REQUESTS
  // ============================================================================

  console.log("🚨 Creating emergency requests...");

  await prisma.emergencyRequest.create({
    data: {
      userId: student1.id,
      priority: "MEDIUM",
      status: "PENDING",
      description: "Severe headache that started this morning",
      location: "Campus Library - 2nd Floor",
      phone: "+1-555-1001",
    },
  });

  const emergency2 = await prisma.emergencyRequest.create({
    data: {
      userId: student2.id,
      assignedTo: nurse1.id,
      priority: "HIGH",
      status: "ASSIGNED",
      description: "Allergic reaction - difficulty breathing",
      location: "Dormitory Building A - Room 205",
      phone: "+1-555-1002",
      notes: "Patient has known latex allergy",
    },
  });

  // ============================================================================
  // CREATE CHAT MESSAGES
  // ============================================================================

  console.log("💬 Creating chat messages...");

  await prisma.chatMessage.create({
    data: {
      userId: student1.id,
      message: "What are your operating hours?",
      isFromBot: false,
      conversationId: student1.id,
    },
  });

  await prisma.chatMessage.create({
    data: {
      userId: student1.id,
      message: "Our health center is open Monday through Friday from 8 AM to 5 PM.",
      response: "Our health center is open Monday through Friday from 8 AM to 5 PM.",
      isFromBot: true,
      conversationId: student1.id,
    },
  });

  // ============================================================================
  // CREATE AUDIT LOGS
  // ============================================================================

  console.log("📝 Creating audit logs...");

  await prisma.auditLog.create({
    data: {
      userId: doctor1.id,
      createdById: doctor1.id,
      action: "CREATE_RECORD",
      resource: "MedicalRecord",
      resourceId: record1.id,
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      metadata: JSON.stringify({ method: "POST", endpoint: "/api/records" }),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: student1.id,
      createdById: student1.id,
      action: "VIEW_RECORD",
      resource: "MedicalRecord",
      resourceId: record1.id,
      ipAddress: "192.168.1.101",
      metadata: JSON.stringify({ method: "GET", endpoint: "/api/records/" + record1.id }),
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: nurse1.id,
      createdById: nurse1.id,
      action: "ASSIGN_EMERGENCY",
      resource: "EmergencyRequest",
      resourceId: emergency2.id,
      metadata: JSON.stringify({ priority: "HIGH" }),
    },
  });

  console.log("✅ Database seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Users: 6 (1 Admin, 2 Doctors, 1 Nurse, 2 Students)`);
  console.log(`   - Profiles: 4 (2 Doctor, 2 Student)`);
  console.log(`   - Appointments: 3`);
  console.log(`   - Medical Records: 1`);
  console.log(`   - Emergency Requests: 2`);
  console.log(`   - Chat Messages: 2`);
  console.log(`   - Audit Logs: 3`);
  console.log("\n🔑 Test Credentials:");
  console.log(`   Admin: admin@careconnect.edu / password123`);
  console.log(`   Doctor: dr.smith@careconnect.edu / password123`);
  console.log(`   Nurse: nurse.brown@careconnect.edu / password123`);
  console.log(`   Student: student1@university.edu / password123`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

