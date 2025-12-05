# CareConnect Frontend Structure

## 📁 Complete File Tree

```
frontend/
├── i18n/
│   ├── messages/
│   │   ├── en.json          # English translations
│   │   ├── ar.json          # Arabic translations
│   │   └── fr.json          # French translations
│   ├── request.ts           # next-intl request configuration
│   └── routing.ts           # Routing configuration
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/        # Locale-based routing
│   │   │   ├── appointments/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── chatbot/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── doctor/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── staff/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── student/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── emergency/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── records/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx   # Locale layout with providers
│   │   │   └── page.tsx     # Home page
│   │   └── layout.tsx       # Root layout (redirects to /en)
│   ├── components/
│   │   ├── forms/
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── providers/
│   │   │   └── Providers.tsx  # React Query + Theme + Auth providers
│   │   ├── ui/
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   ├── AppointmentCard.tsx
│   │   └── RecordCard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── hooks/
│   │   └── useAuth/          # Custom hooks (if needed)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── appointments.ts
│   │   │   ├── auth.ts
│   │   │   └── axios.ts      # Axios instance with interceptors
│   │   └── utils.ts          # Utility functions (cn, etc.)
│   ├── middleware.ts         # Next.js middleware (auth + i18n)
│   ├── styles/
│   │   └── globals.css       # Global styles + Tailwind
│   └── types/
│       ├── appointment.ts
│       ├── record.ts
│       └── user.ts
├── .env.example
├── .eslintrc.json
├── next.config.js           # Next.js config with next-intl plugin
├── package.json
├── postcss.config.js
├── tailwind.config.js       # Tailwind + dark mode config
└── tsconfig.json
```

## 🎯 Key Features Implemented

### ✅ Routing Structure
- All routes under `/[locale]` for i18n support
- Protected routes with middleware
- Dynamic routes for appointments and records

### ✅ Authentication
- JWT stored in HttpOnly cookies (handled by backend)
- Auth context with React Query
- Route protection via middleware
- Login and Register forms with validation

### ✅ Internationalization (i18n)
- next-intl configured for EN/AR/FR
- Translation files for all text
- RTL support for Arabic
- Locale switching in Navbar

### ✅ State Management
- React Query (TanStack Query) for server state
- Auth context for user state
- Query invalidation on mutations

### ✅ UI Components
- Reusable Button, Input, Card, Badge components
- Dark mode support via next-themes
- Responsive design with TailwindCSS
- Lucide React icons

### ✅ Forms
- React Hook Form + Zod validation
- AppointmentForm with date/time inputs
- LoginForm and RegisterForm
- Error handling and loading states

### ✅ API Integration
- Axios client with interceptors
- Automatic token handling
- Error handling and retries
- Type-safe API functions

## 🔧 Configuration Files

### next.config.js
- next-intl plugin integration
- API rewrites for backend proxy
- Image domains configuration

### tailwind.config.js
- Dark mode class strategy
- Custom primary color palette
- RTL support configuration

### middleware.ts
- Authentication checks
- Route protection
- i18n routing
- Cookie-based auth verification

## 📦 Dependencies

### Core
- `next@15.0.0` - React framework
- `react@18.3.1` - UI library
- `typescript@5.3.3` - Type safety

### State & Data
- `@tanstack/react-query@5.17.0` - Server state management
- `axios@1.6.5` - HTTP client

### Forms & Validation
- `react-hook-form@7.50.0` - Form management
- `zod@3.22.4` - Schema validation
- `@hookform/resolvers@3.3.4` - Zod resolver

### i18n
- `next-intl@3.10.0` - Internationalization

### UI
- `tailwindcss@3.4.1` - Utility-first CSS
- `lucide-react@0.309.0` - Icons
- `next-themes@0.2.1` - Dark mode
- `clsx@2.1.0` & `tailwind-merge@2.2.0` - Class utilities

### Utils
- `date-fns@3.0.6` - Date formatting
- `js-cookie@3.0.5` - Cookie handling

## 🚀 Usage

### Starting Development
```bash
npm install
npm run dev
```

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CHATBOT_URL=http://localhost:8001
```

### Building
```bash
npm run build
npm start
```

## 📝 Notes

- All authentication tokens handled via HttpOnly cookies
- Dark mode persisted in localStorage
- React Query devtools available in development
- All API calls include credentials for cookie-based auth
- Forms validate on both client and server side

