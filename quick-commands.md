# Note Pro - Quick Commands Reference

## 🚀 Quick Start

### First Time Setup

```bash
# Make deployment script executable
chmod +x deployment.sh

# Run full deployment with PM2 startup setup
./deployment.sh --setup-startup

# Or just run deployment
./deployment.sh
```

### Using NPM Scripts

```bash
# Install all dependencies and start docker
npm run setup:all

# Start all services with PM2 (development)
npm run pm2:dev

# Start all services with PM2 (production)
npm run pm2:prod

# Quick update and restart
npm run update:project
```

## 📋 PM2 Management Commands

### Basic Operations

```bash
# Start all services
pm2 start ecosystem.configjs --env development

# Stop all services
pm2 stop all

# Restart all services
pm2 restart all

# Reload all services (zero downtime)
pm2 reload all

# Delete all services
pm2 delete all
```

### Monitoring & Logs

```bash
# View all logs
pm2 logs

# View logs for specific app
pm2 logs note-pro-server

# Real-time monitoring
pm2 monit

# List all processes
pm2 list

# Show detailed info
pm2 show note-pro-server
```

### Advanced Operations

```bash
# Scale an application
pm2 scale note-pro-server 2

# Reload with specific environment
pm2 reload ecosystem.config.js --env production

# Save current PM2 configuration
pm2 save

# Resurrect saved configuration
pm2 resurrect
```

## 🐳 Docker Commands

```bash
# Start Docker services
npm run docker:up

# Stop Docker services
npm run docker:down

# View Docker logs
npm run docker:logs

# Restart specific service
docker-compose restart hasura
```

## 🔧 Development Workflow

### Manual Development

```bash
# Terminal 1: Start Docker services
npm run docker:up

# Terminal 2: Start Server
npm run dev:server

# Terminal 3: Start Client
npm run dev:client
```

### With PM2 (Recommended)

```bash
# Start everything with PM2
npm run pm2:dev

# View logs
npm run pm2:logs

# Monitor processes
npm run pm2:monit
```

## 🚀 Deployment

### Development Deployment

```bash
pm2 deploy development
```

### Production Deployment

```bash
npm run build:all
pm2 deploy production
```

## 🔍 Troubleshooting

### Reset Everything

```bash
# Stop all PM2 processes
pm2 delete all

# Stop Docker
docker-compose down

# Clean install
rm -rf client/node_modules server/node_modules
npm run install:all

# Restart everything
./start-projects.sh --full
```

### Check Port Usage

```bash
# Check what's running on ports
lsof -i :3000  # Client
lsof -i :3001  # Server
lsof -i :8080  # Hasura
lsof -i :5432  # PostgreSQL
```

### View Process Status

```bash
# PM2 processes
pm2 list

# Docker containers
docker-compose ps

# System processes
ps aux | grep node
```

## 📍 Application URLs

- **Client (Next.js)**: http://localhost:3000
- **Server (NestJS)**: http://localhost:3001
- **Hasura Console**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## 🔑 Environment Variables

Create `.env` files in client and server directories as needed:

### client/.env.local

```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

### server/.env

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_ADMIN_SECRET=notepro_super_admin_secret
JWT_SECRET=SYohOxXyhqTUdbswC9GP+jWZ4ppwLTkzRY2AgJZKr5E=
```
