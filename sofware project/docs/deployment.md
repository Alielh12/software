# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured (for production)
- SSL certificates (Let's Encrypt recommended)
- Environment variables configured

## Production Deployment

### 1. Environment Setup

Create production `.env` files from examples:

```bash
cp frontend/.env.example frontend/.env.production
cp backend/.env.example backend/.env
cp chatbot/.env.example chatbot/.env
```

Update all secrets and configuration values.

### 2. Database Migration

Before starting services, ensure database migrations are applied:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate deploy
```

### 3. Docker Deployment

Build and start all services:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. Health Checks

Verify all services are running:

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:4000/api/health

# Chatbot
curl http://localhost:8001/health
```

### 5. Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name careconnect.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name careconnect.example.com;

    ssl_certificate /etc/letsencrypt/live/careconnect.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/careconnect.example.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Chatbot API
    location /chatbot {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

## CI/CD Pipeline

The GitHub Actions workflow automatically:
- Lints code
- Runs tests
- Builds Docker images
- (Optional) Deploys to staging/production

## Monitoring

Set up monitoring for:
- Application health
- Database performance
- API response times
- Error rates
- Resource usage

## Backup Strategy

1. Database backups (daily)
2. Environment variable backups (encrypted)
3. Configuration backups

## Scaling

### Horizontal Scaling

- Frontend: Multiple instances behind load balancer
- Backend: Multiple instances, shared database
- Chatbot: Multiple instances, shared conversation store (Redis)

### Vertical Scaling

- Increase container resources
- Database connection pooling
- Cache frequently accessed data

## Security Checklist

- [ ] HTTPS enabled
- [ ] Secrets rotated
- [ ] Database access restricted
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Regular security updates
- [ ] Monitoring and alerting set up

