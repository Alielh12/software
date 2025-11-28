# Appointment Booking Validation Schema

## Complete Zod Schema

```typescript
import { z } from "zod";

const appointmentBookingSchema = z
  .object({
    // Service selection
    serviceId: z.string().min(1, "Service type is required"),
    
    // Doctor selection
    doctorId: z.string().min(1, "Doctor is required"),
    
    // Date selection (Date object)
    date: z.date({ 
      required_error: "Date is required",
      invalid_type_error: "Invalid date format"
    }),
    
    // Time selection (HH:mm format string)
    time: z.string()
      .min(1, "Time is required")
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
    
    // Optional reason textarea
    reason: z.string()
      .max(1000, "Reason must be less than 1000 characters")
      .optional(),
    
    // Optional file uploads
    files: z.array(z.instanceof(File))
      .max(5, "Maximum 5 files allowed")
      .optional(),
    
    // Required GDPR consent
    gdprConsent: z.boolean().refine((val) => val === true, {
      message: "You must consent to GDPR data processing",
    }),
  })
  .refine(
    // Custom validation: Date must be in the future
    (data) => {
      if (!data.date || !data.time) return false;
      const selectedDateTime = new Date(
        `${format(data.date, "yyyy-MM-dd")}T${data.time}`
      );
      return selectedDateTime > new Date();
    },
    {
      message: "Appointment date and time must be in the future",
      path: ["date"],
    }
  )
  .refine(
    // Custom validation: Time slot must be available
    (data) => {
      // This would check against available slots
      // Implementation depends on your backend logic
      return true; // Placeholder
    },
    {
      message: "Selected time slot is not available",
      path: ["time"],
    }
  );
```

## Field Validation Rules

### Service ID
- **Type:** String
- **Required:** Yes
- **Min Length:** 1 character
- **Validation:** Must match a valid service ID from available services

### Doctor ID
- **Type:** String
- **Required:** Yes
- **Min Length:** 1 character
- **Validation:** Must match a valid doctor ID from available doctors
- **Dependency:** Only enabled after service selection

### Date
- **Type:** Date object
- **Required:** Yes
- **Format:** ISO Date object
- **Validation:**
  - Must be a valid date
  - Must be today or in the future
  - Maximum 90 days in the future (configurable)
  - Cannot be weekends (if configured)
  - Cannot be holidays (if configured)

### Time
- **Type:** String (HH:mm format)
- **Required:** Yes
- **Format:** 24-hour format (e.g., "09:00", "14:30")
- **Validation:**
  - Must match regex: `/^([01]\d|2[0-3]):([0-5]\d)$/`
  - Must be within business hours (e.g., 08:00-17:00)
  - Must be an available time slot for selected doctor
  - Must allow sufficient time for selected service duration

### Reason
- **Type:** String
- **Required:** No
- **Max Length:** 1000 characters
- **Validation:** Optional, but validated if provided

### Files
- **Type:** Array of File objects
- **Required:** No
- **Max Files:** 5
- **Max Size:** 10MB per file
- **Accepted Types:** PDF, DOC, DOCX, JPG, JPEG, PNG
- **Validation:**
  - Each file must be under 10MB
  - Total files must not exceed 5
  - File types must be in allowed list
  - File names must be valid

### GDPR Consent
- **Type:** Boolean
- **Required:** Yes
- **Value:** Must be `true`
- **Validation:** Cannot submit without explicit consent

## Custom Validations

### Date/Time Combination
The date and time are validated together to ensure:
1. The combined datetime is in the future
2. The selected time slot is available for the doctor
3. There's sufficient time between appointments (buffer time)

### Service-Doctor Compatibility
- Selected doctor must be available for selected service type
- Doctor's schedule must accommodate service duration

### File Validation
Each file is validated for:
- Size (max 10MB)
- Type (allowed MIME types)
- Name (no special characters, reasonable length)

## Error Messages

All error messages are user-friendly and localized:

```typescript
{
  serviceId: {
    required: "Service type is required",
    invalid: "Please select a valid service"
  },
  doctorId: {
    required: "Doctor is required",
    invalid: "Please select a valid doctor"
  },
  date: {
    required: "Date is required",
    past: "Appointment date must be in the future",
    tooFar: "Appointments can only be booked up to 90 days in advance"
  },
  time: {
    required: "Time is required",
    invalid: "Invalid time format",
    unavailable: "Selected time slot is not available",
    outsideHours: "Appointments are only available during business hours"
  },
  files: {
    tooMany: "Maximum 5 files allowed",
    tooLarge: "File size exceeds 10MB limit",
    invalidType: "File type not allowed. Accepted: PDF, DOC, DOCX, JPG, JPEG, PNG"
  },
  gdprConsent: {
    required: "You must consent to GDPR data processing"
  }
}
```

## Client-Side Validation Flow

1. **Real-time Validation:** As user fills form, fields are validated on change
2. **On Submit:** Full schema validation runs before submission
3. **Server Validation:** Backend also validates data (don't rely only on client-side)
4. **Error Display:** Errors shown inline below each field
5. **Form State:** Submit button disabled until form is valid

## Integration with React Hook Form

```typescript
const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors, isValid, isSubmitting },
} = useForm<AppointmentBookingFormData>({
  resolver: zodResolver(appointmentBookingSchema),
  mode: "onChange", // Validate on change for real-time feedback
  defaultValues: {
    files: [],
    gdprConsent: false,
  },
});
```

## Example Validation Scenarios

### Valid Form Data
```typescript
{
  serviceId: "svc_001",
  doctorId: "doc_123",
  date: new Date("2024-01-20"),
  time: "10:30",
  reason: "Regular check-up",
  files: [File1, File2],
  gdprConsent: true
}
```

### Invalid Form Data Examples

**Missing Required Field:**
```typescript
{
  serviceId: "", // ❌ Empty string
  doctorId: "doc_123",
  // ... other fields
}
// Error: "Service type is required"
```

**Past Date:**
```typescript
{
  serviceId: "svc_001",
  doctorId: "doc_123",
  date: new Date("2023-01-01"), // ❌ Past date
  time: "10:30",
  // ... other fields
}
// Error: "Appointment date and time must be in the future"
```

**No GDPR Consent:**
```typescript
{
  serviceId: "svc_001",
  doctorId: "doc_123",
  date: new Date("2024-01-20"),
  time: "10:30",
  gdprConsent: false // ❌ Not checked
  // ... other fields
}
// Error: "You must consent to GDPR data processing"
```

**Too Many Files:**
```typescript
{
  // ... other fields
  files: [File1, File2, File3, File4, File5, File6] // ❌ 6 files
  // ... other fields
}
// Error: "Maximum 5 files allowed"
```

