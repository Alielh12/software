# CareConnect Web Platform

A comprehensive web-based university health center system built as a monorepo.

## 🏗️ Architecture

This monorepo consists of:

- **Frontend**: Next.js 15 + TypeScript + TailwindCSS
- **Backend API**: Node.js + Express + TypeScript + Prisma + MySQL
- **Chatbot Service**: Python + FastAPI + OpenAI
- **Infrastructure**: Docker, docker-compose

## 📁 Project Structure

```
careconnect-monorepo/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # Next.js app router
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│   └── public/
├── backend/           # Express API server
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── config/
│   └── prisma/
├── chatbot/           # FastAPI chatbot service
│   └── app/
├── infra/             # Infrastructure configurations
├── docs/              # Documentation
└── docker-compose.yml # Multi-service orchestration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Python >= 3.10
- Docker & Docker Compose
- MySQL 8.0+ (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd careconnect-monorepo
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env.local

   # Backend
   cp backend/.env.example backend/.env

   # Chatbot
   cp chatbot/.env.example chatbot/.env
   ```

4. **Start with Docker (Recommended)**
   ```bash
   # Build and start all services
   npm run docker:build
   npm run docker:up

   # Or use docker-compose directly
   docker-compose up -d
   ```

5. **Or start services individually**

   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   **Backend:**
   ```bash
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

   **Chatbot:**
   ```bash
   cd chatbot
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8001
   ```

## 🌍 Internationalization

The platform supports three languages:
- English (en) - Default
- Arabic (ar)
- French (fr)

Language switching is available in the navigation bar.

## 🔐 Authentication

Two authentication options are available:

1. **JWT-based Authentication** (Default)
   - Token-based stateless authentication
   - Refresh token support

2. **Firebase Authentication** (Alternative)
   - OAuth providers support
   - Email/password authentication

See authentication documentation in `/docs/auth.md`.

## 🗄️ Database

The backend uses Prisma ORM with MySQL. Database migrations are managed via Prisma:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio  # Database GUI
```

## 🧪 Development

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## 🐳 Docker Services

When running with Docker Compose, the following services are available:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Chatbot API**: http://localhost:8001
- **MySQL**: localhost:3306
- **Prisma Studio**: http://localhost:5555 (when enabled)

## 📚 Documentation

Additional documentation is available in the `/docs` directory:

- [Architecture Overview](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Authentication Guide](docs/auth.md)
- [Deployment Guide](docs/deployment.md)
- [Security Best Practices](docs/security.md)

## 🔒 Security

- HTTPS enforced in production
- GDPR compliant data handling
- Environment variables for sensitive data
- JWT token expiration
- Input validation and sanitization
- CORS configuration
- Rate limiting

See [Security Documentation](docs/security.md) for more details.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

[Add your license here]

## 🆘 Support

For issues and questions, please open an issue in the repository.

