# CareConnect Backend Architecture

## Overview

Node.js + Express + TypeScript backend with layered architecture, comprehensive middleware, and Prisma ORM.

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration management
│   │   └── index.ts
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── appointments.controller.ts
│   │   ├── records.controller.ts
│   │   ├── emergency.controller.ts
│   │   └── chatbot.controller.ts
│   ├── middlewares/      # Express middlewares
│   │   ├── auth.ts       # JWT authentication
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── validation.ts
│   ├── routes/           # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── appointments.routes.ts
│   │   ├── records.routes.ts
│   │   ├── emergency.routes.ts
│   │   ├── chatbot.routes.ts
│   │   └── health.routes.ts
│   ├── services/         # Business logic
│   │   ├── auth.service.ts
│   │   ├── appointments.service.ts
│   │   ├── records.service.ts
│   │   ├── emergency.service.ts
│   │   └── chatbot.service.ts
│   ├── validators/       # Zod schemas
│   │   ├── auth.validator.ts
│   │   └── appointments.validator.ts
│   ├── prisma/           # Prisma client
│   │   └── client.ts
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── server.ts         # Express app setup
├── prisma/
│   └── schema.prisma     # Database schema
└── .env.example
```

## Architecture Layers

### 1. Routes Layer (`/routes`)
- Define API endpoints
- Apply middleware
- Route requests to controllers
- Swagger documentation annotations

### 2. Controllers Layer (`/controllers`)
- Handle HTTP requests/responses
- Extract request data
- Call service methods
- Handle errors

### 3. Services Layer (`/services`)
- Business logic
- Database operations via Prisma
- External API calls
- Data transformations

### 4. Middleware Layer (`/middlewares`)
- Authentication (JWT)
- Authorization (RBAC)
- Rate limiting
- Input validation
- Error handling

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- HTTP-only cookie support
- Token refresh mechanism

### Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting per IP
- Input validation with Zod
- SQL injection protection (Prisma)

### Logging
- Pino logger (structured logging)
- Request logging middleware
- Error logging with context
- Development pretty printing

### API Documentation
- Swagger/OpenAPI 3.0
- Auto-generated from annotations
- Available at `/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Appointments
- `GET /api/appointments` - Get appointments (filtered)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `GET /api/appointments/available-slots` - Get available time slots

### Medical Records
- `GET /api/records` - Get medical records
- `GET /api/records/:id` - Get record by ID
- `GET /api/records/:id/encrypted` - Get encrypted record
- `GET /api/records/:id/key` - Get decryption key
- `GET /api/records/:id/verify-access` - Verify access
- `POST /api/records` - Create record (staff only)

### Emergency
- `POST /api/emergency` - Create emergency request
- `GET /api/emergency` - Get emergency requests (staff)
- `GET /api/emergency/:id` - Get emergency by ID
- `PATCH /api/emergency/:id/assign` - Assign staff
- `PATCH /api/emergency/:id/status` - Update status

### Chatbot
- `POST /api/chatbot/chat` - Forward chat to Python service
- `GET /api/chatbot/conversations/:id` - Get conversation history

## Database Schema

### Models
- **User** - User accounts with roles
- **StudentProfile** - Student-specific data
- **DoctorProfile** - Doctor-specific data
- **Appointment** - Appointment bookings
- **MedicalRecord** - Encrypted medical records
- **EmergencyRequest** - Emergency requests
- **ChatMessage** - Chatbot messages
- **AuditLog** - Access and action logs

## Middleware

### Authentication Middleware
```typescript
authenticateToken - Verifies JWT token
requireRole(...roles) - Requires specific roles
requireOwnershipOrRole(...roles) - Allows own resource or roles
```

### Validation Middleware
```typescript
validate(schema) - Validates request with Zod schema
```

### Rate Limiting
- Global: 100 requests per 15 minutes
- Auth endpoints: 5 attempts per 15 minutes

## Error Handling

Custom error classes and centralized error handler:
- `AppError` - Operational errors
- Zod validation errors
- Prisma errors
- Unknown errors

## Example: Appointments Flow

1. **Route** (`appointments.routes.ts`)
   - Defines endpoint
   - Applies middleware
   - Routes to controller

2. **Controller** (`appointments.controller.ts`)
   - Extracts request data
   - Calls service
   - Returns response

3. **Service** (`appointments.service.ts`)
   - Validates business rules
   - Checks doctor availability
   - Performs database operations

4. **Prisma** (`client.ts`)
   - Executes database queries
   - Returns data

## Running the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Database
npm run prisma:generate
npm run prisma:migrate
```

## Environment Variables

See `.env.example` for required variables.

## API Documentation

Access Swagger UI at: `http://localhost:4000/api-docs`

## Security Best Practices

1. ✅ JWT tokens with expiration
2. ✅ Password hashing (bcrypt)
3. ✅ Rate limiting
4. ✅ Input validation
5. ✅ SQL injection protection
6. ✅ CORS configuration
7. ✅ Security headers (Helmet)
8. ✅ HTTPS in production
9. ✅ Audit logging
10. ✅ Error message sanitization

