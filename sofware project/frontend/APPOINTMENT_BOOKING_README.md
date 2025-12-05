# Appointment Booking Interface Implementation

## Overview

A comprehensive appointment booking interface with all required features including service selection, doctor selection, date/time picker with available slot filtering, file upload, and GDPR consent.

## Features Implemented

### ✅ Form Fields
- **Service Type** - Dropdown select with service options
- **Doctor** - Dropdown select (filtered based on selected service)
- **Date & Time** - Calendar picker with available time slots
- **Reason** - Textarea for appointment reason
- **File Upload** - Drag & drop file upload for medical notes/exams
- **GDPR Consent** - Required checkbox for data processing consent

### ✅ Logic & Validation
- **Available Slot Fetching** - Fetches available doctor slots based on date
- **Time Slot Disabling** - Disables unavailable time slots dynamically
- **Client-side Validation** - Comprehensive Zod schema validation
- **React Query Mutation** - Optimistic updates for better UX
- **Error Handling** - Proper error states and user feedback

### ✅ UI Components
- **Responsive Layout** - Mobile-friendly form layout
- **Confirmation Modal** - Pre-submission confirmation dialog
- **Loading States** - Loading indicators for async operations
- **Error Messages** - Clear error messaging
- **Dark Mode Support** - Full dark mode compatibility

## Components

### AppointmentBookingForm
Main form component that orchestrates all booking functionality.

**Location:** `src/components/forms/AppointmentBookingForm.tsx`

**Key Features:**
- React Hook Form integration
- Zod validation schema
- React Query for data fetching and mutations
- Optimistic updates
- File upload handling
- Confirmation modal

### DateTimePicker
Custom date and time picker with available slot integration.

**Location:** `src/components/forms/DateTimePicker.tsx`

**Features:**
- Date input with calendar button
- Time slot grid (30-minute intervals)
- Disables unavailable slots
- Visual feedback for selected/available/unavailable slots

### FileUpload
Drag & drop file upload component with validation.

**Location:** `src/components/forms/FileUpload.tsx`

**Features:**
- Drag & drop support
- File type validation
- File size limits (10MB default)
- Max file count (5 files default)
- File preview and removal
- Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG

### Modal
Reusable modal component for confirmation dialogs.

**Location:** `src/components/ui/Modal.tsx`

## Validation Schema

```typescript
const appointmentBookingSchema = z
  .object({
    serviceId: z.string().min(1, "Service type is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    date: z.date({ required_error: "Date is required" }),
    time: z.string().min(1, "Time is required"),
    reason: z.string().optional(),
    files: z.array(z.instanceof(File)).optional(),
    gdprConsent: z.boolean().refine((val) => val === true, {
      message: "You must consent to GDPR data processing",
    }),
  })
  .refine(
    (data) => {
      const selectedDateTime = new Date(
        `${format(data.date, "yyyy-MM-dd")}T${data.time}`
      );
      return selectedDateTime > new Date();
    },
    {
      message: "Appointment date and time must be in the future",
      path: ["date"],
    }
  );
```

**Validation Rules:**
- Service type is required
- Doctor is required
- Date must be selected and in the future
- Time slot must be selected
- GDPR consent is mandatory
- File uploads are optional (max 5 files, 10MB each)

## API Integration

### Endpoints Used

1. **GET /api/doctors** - Fetch available doctors
2. **GET /api/services** - Fetch available services
3. **GET /api/appointments/available-slots** - Get available time slots
4. **POST /api/appointments** - Create appointment
5. **POST /api/appointments/:id/files** - Upload appointment files

### API Helpers

**Location:** `src/lib/api/doctors.ts`

```typescript
// Get all doctors
getDoctors(): Promise<Doctor[]>

// Get all services
getServices(): Promise<Service[]>

// Get available slots for doctor/date
getAvailableSlots(
  doctorId: string,
  date: string,
  serviceDuration?: number
): Promise<AvailableSlot[]>
```

## Optimistic Updates

The form implements optimistic updates using React Query:

```typescript
onMutate: async (newAppointment) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: ["appointments"] });
  
  // Snapshot previous value
  const previousAppointments = queryClient.getQueryData(["appointments"]);
  
  // Optimistically update
  queryClient.setQueryData(["appointments"], (old: any[]) => {
    const optimisticAppointment = {
      id: `temp-${Date.now()}`,
      ...newAppointment,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    return old ? [...old, optimisticAppointment] : [optimisticAppointment];
  });
  
  return { previousAppointments };
},
onError: (err, newAppointment, context) => {
  // Rollback on error
  if (context?.previousAppointments) {
    queryClient.setQueryData(["appointments"], context.previousAppointments);
  }
}
```

## Usage

The form is already integrated into the appointments page:

```tsx
// src/app/[locale]/appointments/new/page.tsx
import { AppointmentBookingForm } from "@/components/forms/AppointmentBookingForm";

export default function NewAppointmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AppointmentBookingForm />
    </div>
  );
}
```

## Server Response Structure

See `docs/API_EXAMPLES.md` for detailed server response examples.

### Example: Available Slots Response

```json
[
  {
    "date": "2024-01-15",
    "time": "09:00",
    "available": true
  },
  {
    "date": "2024-01-15",
    "time": "09:30",
    "available": true
  },
  {
    "date": "2024-01-15",
    "time": "10:00",
    "available": false
  }
]
```

### Example: Appointment Creation Response

```json
{
  "id": "apt_789",
  "userId": "user_456",
  "doctorId": "doc_123",
  "date": "2024-01-15T10:30:00.000Z",
  "status": "PENDING",
  "reason": "Regular check-up",
  "createdAt": "2024-01-10T08:00:00.000Z"
}
```

## File Upload

### Supported Formats
- PDF (`.pdf`)
- Word Documents (`.doc`, `.docx`)
- Images (`.jpg`, `.jpeg`, `.png`)

### Limits
- Max file size: 10MB per file
- Max files: 5 files per appointment

### Upload Flow
1. User selects/ drags files
2. Client-side validation (size, type, count)
3. Files stored in form state
4. On submission, files uploaded via multipart/form-data
5. Files associated with appointment ID

## GDPR Consent

The form includes a mandatory GDPR consent checkbox that must be checked before submission. The validation schema enforces this requirement.

## Error Handling

### Client-side Errors
- Form validation errors displayed inline
- File upload errors shown with alerts
- Date/time validation prevents past dates

### Server Errors
- Network errors handled gracefully
- Optimistic updates rolled back on error
- User-friendly error messages displayed

## Responsive Design

The form is fully responsive with:
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly controls
- Proper spacing on all devices

## Accessibility

- Proper label associations
- Keyboard navigation support
- ARIA attributes where needed
- Focus management in modals

## Future Enhancements

Possible improvements:
- [ ] Recurring appointments
- [ ] Appointment reminders
- [ ] Doctor availability calendar view
- [ ] Patient history integration
- [ ] Multi-language form labels
- [ ] Advanced file preview

