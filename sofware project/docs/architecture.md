# Architecture Overview

## System Architecture

CareConnect follows a microservices architecture with clear separation of concerns.

## Components

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl (supports EN, AR, FR)

### Backend (Express + TypeScript)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: MySQL 8.0
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

### Chatbot Service (FastAPI)
- **Framework**: FastAPI
- **Language**: Python 3.11
- **AI**: OpenAI GPT-4
- **Conversation Management**: In-memory (can be extended to Redis)

## Data Flow

1. **User Request** → Frontend (Next.js)
2. **API Call** → Backend (Express) → Database (MySQL)
3. **Chat Request** → Frontend → Chatbot Service (FastAPI) → OpenAI

## Database Schema

Key models:
- **User**: Students, doctors, nurses, admins
- **Appointment**: Scheduling and management
- **PatientRecord**: Medical history and records
- **ChatMessage**: Conversation logs

## Authentication Flow

1. User submits credentials
2. Backend validates and creates JWT token
3. Frontend stores token (secure storage)
4. Token included in Authorization header for API calls
5. Backend middleware validates token

## Deployment Architecture

```
Internet
  ↓
Load Balancer (HTTPS)
  ↓
Frontend (Next.js) - Port 3000
  ↓
Backend API (Express) - Port 4000
  ↓
MySQL Database - Port 3306

Chatbot Service (FastAPI) - Port 8001
  ↓
OpenAI API
```

## Scalability Considerations

- Stateless API design
- Database connection pooling
- CDN for static assets
- Caching strategies (Redis)
- Horizontal scaling support

