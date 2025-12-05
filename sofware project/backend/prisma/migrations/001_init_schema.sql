-- CareConnect Database Migration
-- Creates normalized MySQL schema with proper indexes and constraints
-- Run this after creating the database

-- ============================================================================
-- ENUMS (MySQL ENUM types)
-- ============================================================================

-- Note: MySQL doesn't support CREATE TYPE, so we'll use ENUM in table definitions

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `role` ENUM('STUDENT', 'DOCTOR', 'NURSE', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
  `phone` VARCHAR(50) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_isActive` (`isActive`),
  INDEX `idx_users_createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- STUDENT PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL UNIQUE,
  `studentId` VARCHAR(255) NOT NULL UNIQUE,
  `dateOfBirth` DATETIME(3) NULL,
  `address` TEXT NULL,
  `emergencyContact` VARCHAR(255) NULL,
  `emergencyPhone` VARCHAR(50) NULL,
  `medicalHistory` TEXT NULL,
  `allergies` TEXT NULL,
  `bloodType` VARCHAR(10) NULL,
  `insuranceNumber` VARCHAR(100) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  INDEX `idx_student_profiles_userId` (`userId`),
  INDEX `idx_student_profiles_studentId` (`studentId`),
  
  CONSTRAINT `fk_student_profiles_user` 
    FOREIGN KEY (`userId`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DOCTOR PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `doctor_profiles` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL UNIQUE,
  `licenseNumber` VARCHAR(255) NOT NULL UNIQUE,
  `specialty` VARCHAR(255) NOT NULL,
  `qualifications` TEXT NULL,
  `availableHours` TEXT NULL,
  `bio` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  INDEX `idx_doctor_profiles_userId` (`userId`),
  INDEX `idx_doctor_profiles_licenseNumber` (`licenseNumber`),
  INDEX `idx_doctor_profiles_specialty` (`specialty`),
  
  CONSTRAINT `fk_doctor_profiles_user` 
    FOREIGN KEY (`userId`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `appointments` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `doctorId` VARCHAR(255) NULL,
  `serviceId` VARCHAR(255) NULL,
  `date` DATETIME(3) NOT NULL,
  `duration` INT NOT NULL DEFAULT 30,
  `status` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `reason` TEXT NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  INDEX `idx_appointments_userId` (`userId`),
  INDEX `idx_appointments_doctorId` (`doctorId`),
  INDEX `idx_appointments_date` (`date`),
  INDEX `idx_appointments_status` (`status`),
  INDEX `idx_appointments_createdAt` (`createdAt`),
  INDEX `idx_appointments_userId_date` (`userId`, `date`),
  INDEX `idx_appointments_doctorId_date` (`doctorId`, `date`),
  
  CONSTRAINT `fk_appointments_user` 
    FOREIGN KEY (`userId`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_appointments_doctor` 
    FOREIGN KEY (`doctorId`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- APPOINTMENT FILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `appointment_files` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `appointmentId` VARCHAR(255) NOT NULL,
  `fileName` VARCHAR(255) NOT NULL,
  `fileUrl` VARCHAR(500) NOT NULL,
  `mimeType` VARCHAR(100) NOT NULL,
  `size` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  
  INDEX `idx_appointment_files_appointmentId` (`appointmentId`),
  INDEX `idx_appointment_files_createdAt` (`createdAt`),
  
  CONSTRAINT `fk_appointment_files_appointment` 
    FOREIGN KEY (`appointmentId`) 
    REFERENCES `appointments` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MEDICAL RECORDS TABLE (ENCRYPTED)
-- ============================================================================

CREATE TABLE IF NOT EXISTS `medical_records` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `doctorId` VARCHAR(255) NULL,
  `encryptedData` LONGTEXT NOT NULL,
  `keyId` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  INDEX `idx_medical_records_userId` (`userId`),
  INDEX `idx_medical_records_doctorId` (`doctorId`),
  INDEX `idx_medical_records_createdAt` (`createdAt`),
  INDEX `idx_medical_records_keyId` (`keyId`),
  INDEX `idx_medical_records_userId_createdAt` (`userId`, `createdAt`),
  
  CONSTRAINT `fk_medical_records_user` 
    FOREIGN KEY (`userId`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_medical_records_doctor` 
    FOREIGN KEY (`doctorId`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MEDICAL RECORD FILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `medical_record_files` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `recordId` VARCHAR(255) NOT NULL,
  `fileName` VARCHAR(255) NOT NULL,
  `encryptedData` LONGTEXT NOT NULL,
  `mimeType` VARCHAR(100) NOT NULL,
  `size` INT NOT NULL,
  `keyId` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  
  INDEX `idx_medical_record_files_recordId` (`recordId`),
  INDEX `idx_medical_record_files_createdAt` (`createdAt`),
  
  CONSTRAINT `fk_medical_record_files_record` 
    FOREIGN KEY (`recordId`) 
    REFERENCES `medical_records` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- EMERGENCY REQUESTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `emergency_requests` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `assignedTo` VARCHAR(255) NULL,
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
  `status` ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NULL,
  `phone` VARCHAR(50) NULL,
  `notes` TEXT NULL,
  `resolvedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  
  INDEX `idx_emergency_requests_userId` (`userId`),
  INDEX `idx_emergency_requests_assignedTo` (`assignedTo`),
  INDEX `idx_emergency_requests_status` (`status`),
  INDEX `idx_emergency_requests_priority` (`priority`),
  INDEX `idx_emergency_requests_createdAt` (`createdAt`),
  INDEX `idx_emergency_requests_status_priority` (`status`, `priority`),
  INDEX `idx_emergency_requests_assignedTo_status` (`assignedTo`, `status`),
  
  CONSTRAINT `fk_emergency_requests_user` 
    FOREIGN KEY (`userId`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_emergency_requests_assignedTo` 
    FOREIGN KEY (`assignedTo`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CHAT MESSAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `response` TEXT NULL,
  `isFromBot` BOOLEAN NOT NULL DEFAULT FALSE,
  `conversationId` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  
  INDEX `idx_chat_messages_userId` (`userId`),
  INDEX `idx_chat_messages_conversationId` (`conversationId`),
  INDEX `idx_chat_messages_createdAt` (`createdAt`),
  INDEX `idx_chat_messages_userId_conversationId` (`userId`, `conversationId`),
  INDEX `idx_chat_messages_createdAt_conversationId` (`createdAt`, `conversationId`),
  
  CONSTRAINT `fk_chat_messages_user` 
    FOREIGN KEY (`userId`) 
    REFERENCES `users` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(255) NULL,
  `createdById` VARCHAR(255) NULL,
  `action` VARCHAR(100) NOT NULL,
  `resource` VARCHAR(100) NOT NULL,
  `resourceId` VARCHAR(255) NULL,
  `ipAddress` VARCHAR(45) NULL,
  `userAgent` VARCHAR(500) NULL,
  `metadata` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  
  INDEX `idx_audit_logs_userId` (`userId`),
  INDEX `idx_audit_logs_action` (`action`),
  INDEX `idx_audit_logs_resource` (`resource`),
  INDEX `idx_audit_logs_resourceId` (`resourceId`),
  INDEX `idx_audit_logs_createdAt` (`createdAt`),
  INDEX `idx_audit_logs_resource_resourceId` (`resource`, `resourceId`),
  INDEX `idx_audit_logs_createdAt_action` (`createdAt`, `action`),
  
  CONSTRAINT `fk_audit_logs_user` 
    FOREIGN KEY (`userId`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_audit_logs_createdBy` 
    FOREIGN KEY (`createdById`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_audit_logs_medical_record` 
    FOREIGN KEY (`resourceId`) 
    REFERENCES `medical_records` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

