# Appointment Booking API Examples

## Server Response Structures

### 1. Get Doctors

**Endpoint:** `GET /api/doctors`

**Response:**
```json
[
  {
    "id": "doc_123",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@university.edu",
    "specialty": "General Medicine",
    "phone": "+1-555-0123"
  },
  {
    "id": "doc_456",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@university.edu",
    "specialty": "Cardiology",
    "phone": "+1-555-0456"
  }
]
```

### 2. Get Services

**Endpoint:** `GET /api/services`

**Response:**
```json
[
  {
    "id": "svc_001",
    "name": "General Consultation",
    "description": "Routine health check-up",
    "duration": 30,
    "price": 50.00
  },
  {
    "id": "svc_002",
    "name": "Specialist Consultation",
    "description": "Consultation with specialist doctor",
    "duration": 60,
    "price": 100.00
  },
  {
    "id": "svc_003",
    "name": "Follow-up",
    "description": "Follow-up appointment",
    "duration": 15,
    "price": 25.00
  }
]
```

### 3. Get Available Slots

**Endpoint:** `GET /api/appointments/available-slots?doctorId=doc_123&date=2024-01-15&duration=30`

**Response:**
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
  },
  {
    "date": "2024-01-15",
    "time": "10:30",
    "available": true
  }
]
```

### 4. Create Appointment

**Endpoint:** `POST /api/appointments`

**Request Body:**
```json
{
  "doctorId": "doc_123",
  "date": "2024-01-15T10:30:00.000Z",
  "reason": "Regular check-up",
  "serviceId": "svc_001"
}
```

**Response:**
```json
{
  "id": "apt_789",
  "userId": "user_456",
  "doctorId": "doc_123",
  "date": "2024-01-15T10:30:00.000Z",
  "status": "PENDING",
  "reason": "Regular check-up",
  "notes": null,
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z",
  "doctor": {
    "id": "doc_123",
    "firstName": "John",
    "lastName": "Smith"
  },
  "user": {
    "id": "user_456",
    "firstName": "Alice",
    "lastName": "Johnson",
    "email": "alice@student.university.edu"
  }
}
```

### 5. Upload Appointment Files

**Endpoint:** `POST /api/appointments/:appointmentId/files`

**Request:** `multipart/form-data`

**Form Data:**
```
files: [File1.pdf, File2.jpg]
```

**Response:**
```json
{
  "urls": [
    "https://storage.example.com/files/apt_789/file1.pdf",
    "https://storage.example.com/files/apt_789/file2.jpg"
  ],
  "files": [
    {
      "id": "file_001",
      "name": "file1.pdf",
      "url": "https://storage.example.com/files/apt_789/file1.pdf",
      "size": 245760,
      "mimeType": "application/pdf"
    },
    {
      "id": "file_002",
      "name": "file2.jpg",
      "url": "https://storage.example.com/files/apt_789/file2.jpg",
      "size": 512000,
      "mimeType": "image/jpeg"
    }
  ]
}
```

### 6. Get Appointment Files

**Endpoint:** `GET /api/appointments/:appointmentId/files`

**Response:**
```json
[
  {
    "id": "file_001",
    "name": "medical_report.pdf",
    "url": "https://storage.example.com/files/apt_789/file1.pdf",
    "size": 245760,
    "mimeType": "application/pdf",
    "uploadedAt": "2024-01-10T08:05:00.000Z"
  }
]
```

## Error Responses

### Validation Error (400)
```json
{
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [
      {
        "field": "date",
        "message": "Date must be in the future"
      }
    ]
  }
}
```

### Unauthorized (401)
```json
{
  "error": {
    "message": "Authentication required",
    "statusCode": 401
  }
}
```

### Conflict (409)
```json
{
  "error": {
    "message": "Time slot already booked",
    "statusCode": 409
  }
}
```

## Validation Rules

### Appointment Creation
- `date`: Required, must be in the future, ISO 8601 format
- `doctorId`: Required, must be a valid doctor ID
- `serviceId`: Optional, must be a valid service ID
- `reason`: Optional, max 1000 characters
- `files`: Optional, max 5 files, max 10MB per file

### File Upload
- Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
- Max file size: 10MB
- Max files per appointment: 5

