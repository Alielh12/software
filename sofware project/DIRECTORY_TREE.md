# CareConnect Monorepo Directory Tree

```
careconnect-monorepo/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD pipeline
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts       # Prisma client configuration
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT authentication middleware
│   │   │   ├── errorHandler.ts   # Error handling
│   │   │   └── rateLimiter.ts    # Rate limiting
│   │   ├── routes/
│   │   │   ├── auth.ts           # Authentication routes
│   │   │   ├── appointments.ts   # Appointment routes
│   │   │   ├── patients.ts       # Patient routes
│   │   │   └── health.ts         # Health check routes
│   │   ├── services/             # Business logic
│   │   ├── types/                # TypeScript types
│   │   ├── utils/                # Utility functions
│   │   └── index.ts              # Express server entry point
│   ├── .env.example              # Environment variables example
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── chatbot/
│   ├── app/
│   │   ├── api/                  # API endpoints (if needed)
│   │   ├── services/
│   │   │   └── chat_service.py   # Chat service with OpenAI
│   │   └── utils/
│   │       ├── auth.py           # JWT verification
│   │       └── conversation_manager.py  # Conversation management
│   ├── .env.example
│   ├── Dockerfile
│   ├── main.py                   # FastAPI application entry point
│   ├── requirements.txt          # Python dependencies
│   └── __init__.py
├── docs/
│   ├── api.md                    # API documentation
│   ├── architecture.md           # System architecture
│   ├── auth.md                   # Authentication guide
│   ├── deployment.md             # Deployment instructions
│   └── security.md               # Security best practices
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── dashboard/        # Staff dashboard pages
│   │   │   ├── student/          # Student portal pages
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── page.tsx          # Home page
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx    # Navigation component
│   │   │       └── Footer.tsx    # Footer component
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Library configurations
│   │   ├── middleware/           # Next.js middleware
│   │   ├── styles/
│   │   │   └── globals.css       # Global styles
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Utility functions
│   ├── .env.example
│   ├── .dockerignore
│   ├── .eslintrc.json
│   ├── Dockerfile
│   ├── next.config.js            # Next.js configuration
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js        # TailwindCSS configuration
│   └── tsconfig.json
├── infra/                        # Infrastructure configurations
├── .dockerignore
├── .prettierignore
├── .prettierrc                   # Prettier configuration
├── .gitignore
├── docker-compose.yml            # Docker Compose configuration
├── package.json                  # Root package.json (workspaces)
├── README.md                     # Project documentation
└── DIRECTORY_TREE.md             # This file

```

## Key Directories

### Frontend (`/frontend`)
- Next.js 15 application with App Router
- TypeScript + TailwindCSS
- Internationalization support (EN, AR, FR)

### Backend (`/backend`)
- Express.js API server
- Prisma ORM with MySQL
- JWT authentication
- RESTful API endpoints

### Chatbot (`/chatbot`)
- FastAPI Python service
- OpenAI integration
- Conversation management

### Infrastructure (`/infra`)
- Deployment configurations
- Infrastructure as code (if applicable)

### Documentation (`/docs`)
- API documentation
- Architecture overview
- Deployment guides
- Security practices

