# Note Pro 📝

Full-stack note-taking application built with Next.js, NestJS, PostgreSQL, and Hasura GraphQL.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL
- **GraphQL**: Hasura GraphQL Engine
- **Process Manager**: PM2
- **Containerization**: Docker Compose

## 🚀 Quick Start

### Option 1: One-Command Deployment (Recommended)

```bash
# First time setup with PM2 startup configuration
./deployment.sh --setup-startup

# Regular deployment
./deployment.sh
```

### Option 2: Quick Start (Existing Dependencies)

```bash
# If dependencies are already installed
./start.sh
```

### Option 3: Manual Step-by-Step

```bash
# Install dependencies
npm run install:all

# Start Docker services
npm run docker:up

# Start all services with PM2
npm run pm2:dev
```

## 📁 Project Structure

```
note_pro/
├── client/          # Next.js frontend
├── server/          # NestJS backend
├── hasura-metadata/ # Hasura configuration
├── ecosystem.config.js    # PM2 configuration
├── docker-compose.yml     # Docker services
├── deployment.sh          # Full deployment script
└── start.sh              # Quick start script
```

## 🛠️ Available Commands

### NPM Scripts

```bash
# Setup & Installation
npm run setup:all          # Install all deps + start docker
npm run install:all         # Install all dependencies
npm run install:client      # Install client dependencies
npm run install:server      # Install server dependencies

# Building
npm run build:all           # Build all projects
npm run build:client        # Build Next.js client
npm run build:server        # Build NestJS server

# Development
npm run dev:client          # Start client in dev mode
npm run dev:server          # Start server in dev mode

# Production
npm run start:client        # Start client in production
npm run start:server        # Start server in production

# Docker
npm run docker:up           # Start Docker services
npm run docker:down         # Stop Docker services
npm run docker:logs         # View Docker logs

# PM2 Management
npm run pm2:dev             # Start PM2 in development mode
npm run pm2:prod            # Start PM2 in production mode
npm run pm2:stop            # Stop all PM2 processes
npm run pm2:restart         # Restart all PM2 processes
npm run pm2:reload          # Reload all PM2 processes
npm run pm2:delete          # Delete all PM2 processes
npm run pm2:logs            # View PM2 logs
npm run pm2:monit           # PM2 monitoring dashboard

# Deployment
npm run deploy:dev          # Deploy to development
npm run deploy:prod         # Deploy to production
npm run update:project      # Pull + install + reload
```

### PM2 Commands

```bash
# Process Management
pm2 start ecosystem.config.js --env development
pm2 stop all
pm2 restart all
pm2 reload all
pm2 delete all

# Monitoring
pm2 logs                    # View all logs
pm2 logs note-pro-server    # View server logs
pm2 logs note-pro-client    # View client logs
pm2 monit                   # Real-time monitoring
pm2 list                    # List all processes
```

## 🌐 Service URLs

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (NestJS)**: http://localhost:3001
- **Hasura Console**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## 🔧 Configuration

### Environment Variables

Create these files as needed:

#### `client/.env.local`

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

#### `server/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_ADMIN_SECRET=notepro_super_admin_secret
JWT_SECRET=SYohOxXyhqTUdbswC9GP+jWZ4ppwLTkzRY2AgJZKr5E=
```

### PM2 Ecosystem

The `ecosystem.config.js` file contains:

- **note-pro-server**: NestJS backend on port 3001
- **note-pro-client**: Next.js frontend on port 3000
- **note-pro-docker**: Docker Compose services

## 🐳 Docker Services

- **postgres**: PostgreSQL database on port 5432
- **hasura**: Hasura GraphQL Engine on port 8080

## 🔍 Troubleshooting

### Reset Everything

```bash
pm2 delete all
docker-compose down
rm -rf client/node_modules server/node_modules
npm run install:all
./deployment.sh
```

### Check Port Usage

```bash
lsof -i :3000  # Client
lsof -i :3001  # Server
lsof -i :8080  # Hasura
lsof -i :5432  # PostgreSQL
```

### View Status

```bash
pm2 list                # PM2 processes
docker-compose ps       # Docker containers
```

## 📚 Development Workflow

1. **Start Development**: `./start.sh` or `npm run pm2:dev`
2. **View Logs**: `npm run pm2:logs`
3. **Monitor**: `npm run pm2:monit`
4. **Update Code**: `npm run update:project`
5. **Stop Services**: `npm run pm2:stop`

## 🚀 Deployment

### Development

```bash
pm2 deploy development
```

### Production

```bash
npm run build:all
pm2 deploy production
```

## 📄 Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 8.0.0
- Docker & Docker Compose
- PM2 (installed automatically)

## 🎯 Features

- ✅ Auto-deployment with git pull
- ✅ Dependency management
- ✅ Docker services management
- ✅ Process monitoring with PM2
- ✅ Zero-downtime reloads
- ✅ Comprehensive logging
- ✅ Development & production modes

## 📖 Additional Resources

- See `quick-commands.md` for detailed command reference
- Check PM2 documentation: https://pm2.keymetrics.io/
- Next.js documentation: https://nextjs.org/docs
- NestJS documentation: https://docs.nestjs.com/
- Hasura documentation: https://hasura.io/docs/
