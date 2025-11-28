# Database Schema & Migration Guide

## Overview

This directory contains the Prisma schema, SQL migration scripts, and seed data for the CareConnect database.

## Schema Features

### Normalized Structure
- Proper foreign key constraints
- CASCADE deletes for strict relation management
- Indexes on all foreign keys and date fields
- Composite indexes for common queries

### Security
- Encrypted medical records (LONGTEXT for base64 data)
- Audit logging for all sensitive operations
- User authentication and authorization support

## File Structure

```
prisma/
├── schema.prisma          # Prisma schema definition
├── seed.ts                # Database seeding script
├── migrations/
│   └── 001_init_schema.sql # SQL migration script
└── README.md              # This file
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the backend root:

```env
DATABASE_URL="mysql://user:password@localhost:3306/careconnect?schema=public"
```

### 2. Create Database

```sql
CREATE DATABASE careconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Run Migrations

**Option A: Using Prisma (Recommended)**
```bash
npm run prisma:generate
npm run prisma:migrate dev
```

**Option B: Using SQL Script**
```bash
mysql -u user -p careconnect < prisma/migrations/001_init_schema.sql
```

### 4. Seed Database

```bash
npm run prisma:seed
```

## Schema Entities

### Users
- Base user accounts with roles (STUDENT, DOCTOR, NURSE, ADMIN)
- Authentication support
- Active/inactive status

### StudentProfile
- Extended profile for students
- Medical history and allergies
- Emergency contact information

### DoctorProfile
- Doctor-specific information
- License numbers
- Specialties and qualifications
- Available hours

### Appointments
- Appointment scheduling
- Status tracking (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- Doctor assignment
- File attachments support

### MedicalRecord
- Encrypted medical records
- Encryption key references
- Audit trail support
- File attachments (scans, documents)

### EmergencyRequest
- Emergency request management
- Priority levels (LOW, MEDIUM, HIGH, CRITICAL)
- Status tracking
- Staff assignment

### AuditLog
- Comprehensive audit trail
- Tracks all sensitive operations
- User activity logging
- IP and user agent tracking

## Indexes

All foreign keys and date fields are indexed for optimal query performance:

- **User**: email, role, isActive, createdAt
- **Appointments**: userId, doctorId, date, status, createdAt, composite indexes
- **Medical Records**: userId, doctorId, createdAt, keyId, composite indexes
- **Emergency Requests**: userId, assignedTo, status, priority, createdAt, composite indexes
- **Audit Logs**: userId, action, resource, resourceId, createdAt, composite indexes

## Relationships

### Cascade Deletes (Strict Relations)
- StudentProfile → User (CASCADE)
- DoctorProfile → User (CASCADE)
- Appointment → User (CASCADE)
- AppointmentFile → Appointment (CASCADE)
- MedicalRecord → User (CASCADE)
- MedicalRecordFile → MedicalRecord (CASCADE)
- EmergencyRequest → User (CASCADE)
- ChatMessage → User (CASCADE)

### Set Null (Preserve Data)
- Appointment → Doctor (SET NULL)
- MedicalRecord → Doctor (SET NULL)
- EmergencyRequest → Assigned Staff (SET NULL)
- AuditLog → User (SET NULL) - Preserves audit trail

## Seed Data

The seed script creates:
- 1 Admin user
- 2 Doctor users with profiles
- 1 Nurse user
- 2 Student users with profiles
- 3 Sample appointments
- 1 Medical record
- 2 Emergency requests
- 2 Chat messages
- 3 Audit log entries

**Default Password**: `password123` (change in production!)

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate dev

# Apply migrations
npm run prisma:migrate deploy

# Seed database
npm run prisma:seed

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## Migration Workflow

1. Modify `schema.prisma`
2. Create migration: `npm run prisma:migrate dev --name description`
3. Review generated migration files
4. Apply: `npm run prisma:migrate deploy`
5. Generate client: `npm run prisma:generate`

## Production Considerations

1. **Backup Strategy**: Regular database backups
2. **Encryption Keys**: Store securely (not in database)
3. **Audit Logs**: Regular archival to prevent table bloat
4. **Indexes**: Monitor query performance
5. **Connection Pooling**: Configure Prisma connection limits
6. **Migration Strategy**: Test migrations in staging first

## Troubleshooting

### Migration Errors
- Check MySQL version (8.0+ required)
- Verify DATABASE_URL format
- Ensure database exists
- Check user permissions

### Seed Errors
- Verify all foreign key relationships
- Check enum values match schema
- Ensure database is empty or use `--force-reset`

### Connection Issues
- Verify DATABASE_URL
- Check MySQL server is running
- Verify network connectivity
- Check firewall settings


