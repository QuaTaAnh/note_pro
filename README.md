# Note Pro 📝

Modern note-taking application with real-time collaboration, built with Next.js, NestJS, PostgreSQL, and Hasura GraphQL.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Hasura GraphQL
- **Process Manager**: PM2
- **Containerization**: Docker Compose

## 🚀 Quick Start

### One-Command Setup (Recommended)

```bash
# First time setup
./start-projects.sh --setup-startup

# Quick start
./start-projects.sh
```

### Manual Setup

```bash
# Install dependencies
npm run install:all

# Start services
npm run docker:up
npm run pm2:dev
```

## 📁 Project Structure

```
note_pro/
├── client/              # Next.js frontend
├── server/              # NestJS backend  
├── hasura-metadata/     # Hasura configuration
├── ecosystem.config.js  # PM2 configuration
└── start-projects.sh    # Deployment script
```

## 🛠️ Key Commands

```bash
# Development
npm run pm2:dev          # Start all services
npm run pm2:logs         # View logs
npm run pm2:monit        # Monitor processes

# Building & Deployment
npm run build:all        # Build all projects
npm run update:project   # Pull + install + reload

# Docker Management
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
```

## 🌐 Service URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001  
- **Hasura Console**: http://localhost:8080
- **Database**: localhost:5432

## 🔧 Environment Setup

### Client (`client/.env.local`)
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

### Server (`server/.env`)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_ADMIN_SECRET=notepro_super_admin_secret
JWT_SECRET=SYohOxXyhqTUdbswC9GP+jWZ4ppwLTkzRY2AgJZKr5E=
```

## 🎯 Features

- ✅ Real-time document editing
- ✅ Block-based editor with TipTap
- ✅ Workspace & folder organization
- ✅ User authentication
- ✅ Auto-save functionality
- ✅ Document sorting by update time
- ✅ Responsive design

## 📄 Prerequisites

- Node.js ≥ 18.0.0
- Docker & Docker Compose
- PM2 (auto-installed)

## 🔍 Troubleshooting

```bash
# Reset everything
pm2 delete all && docker-compose down
rm -rf client/node_modules server/node_modules
npm run setup:all

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com/)
- [Hasura Docs](https://hasura.io/docs/)
