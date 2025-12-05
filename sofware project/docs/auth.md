# Authentication Guide

## Overview

CareConnect supports two authentication methods:

1. **JWT-based Authentication** (Default)
2. **Firebase Authentication** (Alternative)

## JWT Authentication

### Implementation

The JWT authentication system uses:
- Access tokens (short-lived, default: 7 days)
- Refresh tokens (long-lived, default: 30 days)
- Secure token storage

### Registration

```typescript
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

### Login

```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response includes user data and JWT token.

### Using Tokens

Include the token in the Authorization header:

```typescript
Authorization: Bearer <your-jwt-token>
```

### Token Storage (Frontend)

**Recommended**: HTTP-only cookies (most secure)

**Alternative**: Secure storage (localStorage/sessionStorage with caution)

Example with React:

```typescript
// Store token after login
localStorage.setItem('token', response.token);

// Include in API calls
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## Firebase Authentication

### Setup

1. Create a Firebase project
2. Enable Authentication
3. Configure sign-in methods (Email/Password, OAuth, etc.)
4. Add Firebase config to `.env.local`

### Implementation

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Usage

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    // Use idToken for backend API calls
  } catch (error) {
    console.error('Authentication error:', error);
  }
};
```

## Protected Routes

### Frontend (Next.js Middleware)

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/student/:path*'],
};
```

### Backend (Express Middleware)

```typescript
import { authenticateToken, requireRole } from './middleware/auth';

// Protect route
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Require specific role
router.get('/admin', authenticateToken, requireRole('ADMIN'), (req, res) => {
  res.json({ message: 'Admin access' });
});
```

## User Roles

- **STUDENT**: Access to student portal, own records
- **DOCTOR**: Access to dashboard, all patient records
- **NURSE**: Access to dashboard, patient records
- **ADMIN**: Full system access

## Security Best Practices

1. **Never expose tokens in URLs**
2. **Use HTTPS in production**
3. **Implement token refresh**
4. **Set appropriate token expiration**
5. **Log out on token expiration**
6. **Validate tokens on every request**
7. **Use secure password hashing** (bcrypt)
8. **Implement rate limiting** on auth endpoints

## Password Requirements

- Minimum 8 characters
- Recommended: Mix of uppercase, lowercase, numbers, special characters
- Client and server-side validation

## Password Reset Flow

1. User requests password reset
2. System sends reset token via email
3. User submits new password with token
4. System validates token and updates password

## Multi-Factor Authentication (Future)

- SMS-based 2FA
- Authenticator app support
- Backup codes

