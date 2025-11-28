# API Documentation

## Base URL

- Development: `http://localhost:4000/api`
- Production: `https://api.careconnect.example.com/api`

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check

**GET** `/api/health`

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### Authentication

#### Register

**POST** `/api/auth/register`

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login

**POST** `/api/auth/login`

Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Appointments

#### Get Appointments

**GET** `/api/appointments`

Get all appointments (user's own or all if staff).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "clx456...",
    "userId": "clx123...",
    "doctorId": "clx789...",
    "date": "2024-01-15T10:00:00.000Z",
    "status": "CONFIRMED",
    "reason": "Annual checkup",
    "user": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

#### Create Appointment

**POST** `/api/appointments`

Create a new appointment.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "date": "2024-01-15T10:00:00.000Z",
  "reason": "Annual checkup"
}
```

**Response:**
```json
{
  "id": "clx456...",
  "userId": "clx123...",
  "date": "2024-01-15T10:00:00.000Z",
  "status": "PENDING",
  "reason": "Annual checkup"
}
```

### Patients

#### Get All Patients

**GET** `/api/patients`

Get all patients (staff only).

**Headers:**
- `Authorization: Bearer <token>` (requires DOCTOR, NURSE, or ADMIN role)

**Response:**
```json
[
  {
    "id": "clx123...",
    "email": "patient@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }
]
```

#### Get Patient Records

**GET** `/api/patients/:id/records`

Get medical records for a patient.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "clx789...",
    "userId": "clx123...",
    "diagnosis": "Common cold",
    "treatment": "Rest and hydration",
    "createdAt": "2024-01-10T00:00:00.000Z",
    "doctor": {
      "firstName": "Dr. Jane",
      "lastName": "Smith"
    }
  }
]
```

## Chatbot API

### Base URL

- Development: `http://localhost:8001`
- Production: `https://chatbot.careconnect.example.com`

### Chat

**POST** `/chat`

Send a message to the chatbot.

**Request Body:**
```json
{
  "message": "What are your operating hours?",
  "user_id": "clx123...",
  "conversation_id": "optional-conversation-id"
}
```

**Response:**
```json
{
  "response": "Our health center is open Monday through Friday from 8 AM to 5 PM...",
  "conversation_id": "clx123..."
}
```

### Get Conversation History

**GET** `/conversations/:conversation_id`

Get conversation history.

**Headers:**
- `Authorization: Bearer <token>` (optional)

**Response:**
```json
{
  "conversation_id": "clx123...",
  "messages": [
    {
      "role": "user",
      "content": "What are your operating hours?"
    },
    {
      "role": "assistant",
      "content": "Our health center is open..."
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

