<div align="center">
  <h1>📝 Note Pro</h1>
  <p><strong>A modern, collaborative note-taking application</strong></p>
  <p>Built with Next.js, NestJS, PostgreSQL, and Hasura GraphQL</p>

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![NestJS](https://img.shields.io/badge/NestJS-10-red?style=flat-square&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

  <p>
    <a href="#-demo">Demo</a> •
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-documentation">Documentation</a>
  </p>
</div>

---

## 🎥 Demo

<!-- Upload your demo video here -->

> **📹 Video Demo**: Coming soon...

https://github.com/user-attachments/assets/your-video-id

<!-- You can also add screenshots here -->
<div align="center">
  <img src="./docs/images/screenshot-1.png" alt="Note Pro Screenshot" width="45%" />
  <img src="./docs/images/screenshot-2.png" alt="Note Pro Screenshot" width="45%" />
</div>

---

## ✨ Features

<table>
  <tr>
    <td valign="top" width="50%">
      
### 🎨 Editor Features
- 📄 **Block-based editor** with TipTap
- ⚡ **Real-time collaboration**
- 💾 **Auto-save functionality**
- 🎯 **Drag & drop blocks**
- 🔍 **Full-text search**

    </td>
    <td valign="top" width="50%">

### 🗂️ Organization

- 📁 **Workspace management**
- 🗃️ **Folder organization**
- 🔄 **Smart sorting** by update time
- 🏷️ **Tagging system**
- 📱 **Responsive design**

    </td>
  </tr>
  <tr>
    <td valign="top" width="50%">

### 🔐 Security

- 🔑 **User authentication**
- 🛡️ **JWT-based auth**
- 👥 **Role-based access**
- 🔒 **Secure API endpoints**

    </td>
    <td valign="top" width="50%">

### 🚀 Performance

- ⚡ **Server-side rendering**
- 🔄 **GraphQL subscriptions**
- 💨 **Optimistic updates**
- 📦 **Code splitting**

      </td>

    </tr>
  </table>

---

## 🏗️ Tech Stack

<table>
  <tr>
    <td align="center" width="25%">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="48" height="48" alt="Next.js" />
      <br><strong>Next.js 15</strong>
      <br><sub>React Framework</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" width="48" height="48" alt="NestJS" />
      <br><strong>NestJS</strong>
      <br><sub>Backend Framework</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="48" height="48" alt="PostgreSQL" />
      <br><strong>PostgreSQL</strong>
      <br><sub>Database</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://hasura.io/brand-assets/hasura-icon-primary.svg" width="48" height="48" alt="Hasura" />
      <br><strong>Hasura</strong>
      <br><sub>GraphQL Engine</sub>
    </td>
  </tr>
</table>

### Additional Technologies

- **Frontend**: TypeScript, Tailwind CSS, TipTap, Apollo Client
- **Backend**: TypeScript, TypeORM, JWT, GraphQL
- **DevOps**: Docker Compose, PM2, GitHub Actions
- **Tools**: ESLint, Prettier, Husky

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `>= 18.0.0` ([Download](https://nodejs.org/))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

### One-Command Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/note_pro.git
cd note_pro

# First time setup (installs PM2 and dependencies)
./start-projects.sh --setup-startup

# Start all services
./start-projects.sh
```

### Manual Setup

<details>
<summary><strong>Click to expand manual setup instructions</strong></summary>

#### 1️⃣ Install Dependencies

```bash
npm run install:all
```

#### 2️⃣ Environment Configuration

Create `.env` files for client and server:

**Client** (`client/.env.local`):

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/v1/graphql
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

**Server** (`server/.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_ADMIN_SECRET=notepro_super_admin_secret
JWT_SECRET=SYohOxXyhqTUdbswC9GP+jWZ4ppwLTkzRY2AgJZKr5E=
```

#### 3️⃣ Start Services

```bash
# Start Docker services (PostgreSQL + Hasura)
npm run docker:up

# Start development servers with PM2
npm run pm2:dev
```

#### 4️⃣ Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Hasura Console**: http://localhost:8080
- **Database**: localhost:5432

</details>

---

## 📁 Project Structure

```
note_pro/
├── 📂 client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities & helpers
│   │   └── styles/           # Global styles
│   └── public/               # Static assets
│
├── 📂 server/                 # NestJS backend application
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   ├── common/           # Shared utilities
│   │   └── main.ts           # Entry point
│   └── test/                 # Test files
│
├── 📂 hasura-metadata/        # Hasura GraphQL configuration
│   ├── databases/            # Database schemas
│   ├── metadata/             # Hasura metadata
│   └── migrations/           # Database migrations
│
├── 📄 ecosystem.config.js     # PM2 process configuration
├── 📄 docker-compose.yml      # Docker services setup
├── 📄 start-projects.sh       # Deployment automation script
└── 📄 package.json            # Root package.json
```

---

## 🛠️ Available Commands

### Development

```bash
npm run pm2:dev              # Start all services in development mode
npm run pm2:logs             # View real-time logs
npm run pm2:monit            # Monitor processes (interactive)
npm run pm2:status           # Check process status
```

### Building & Deployment

```bash
npm run build:all            # Build client and server
npm run build:client         # Build frontend only
npm run build:server         # Build backend only
npm run update:project       # Pull latest, install deps, and reload
```

### Docker Management

```bash
npm run docker:up            # Start Docker services (detached)
npm run docker:down          # Stop and remove containers
npm run docker:logs          # View Docker logs
npm run docker:restart       # Restart Docker services
```

### Utility Commands

```bash
npm run install:all          # Install all dependencies
npm run clean                # Clean node_modules and build files
npm run lint                 # Run ESLint
npm run format               # Format code with Prettier
```

---

## 🌐 Service URLs

| Service               | URL                              | Description             |
| --------------------- | -------------------------------- | ----------------------- |
| 🎨 **Frontend**       | http://localhost:3000            | Next.js application     |
| ⚙️ **Backend API**    | http://localhost:3001            | NestJS REST API         |
| 🔷 **GraphQL API**    | http://localhost:8080/v1/graphql | Hasura GraphQL endpoint |
| 🎛️ **Hasura Console** | http://localhost:8080/console    | Hasura admin panel      |
| 🗄️ **PostgreSQL**     | localhost:5432                   | Database server         |

**Database Credentials:**

- Username: `postgres`
- Password: `postgres`
- Database: `postgres`

---

## 🔧 Configuration

### Environment Variables

<details>
<summary><strong>Client Configuration</strong></summary>

Create `client/.env.local`:

```env
# GraphQL Endpoint
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8080/v1/graphql

# Backend API URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3001

# Optional: Hasura Admin Secret (for admin operations)
NEXT_PUBLIC_HASURA_ADMIN_SECRET=notepro_super_admin_secret
```

</details>

<details>
<summary><strong>Server Configuration</strong></summary>

Create `server/.env`:

```env
# Server Port
PORT=3001

# Database Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Hasura Configuration
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_ADMIN_SECRET=notepro_super_admin_secret

# JWT Configuration
JWT_SECRET=SYohOxXyhqTUdbswC9GP+jWZ4ppwLTkzRY2AgJZKr5E=
JWT_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

</details>

---

## 🔍 Troubleshooting

### Common Issues

<details>
<summary><strong>Port already in use</strong></summary>

```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different ports in .env files
```

</details>

<details>
<summary><strong>Docker containers not starting</strong></summary>

```bash
# Check Docker status
docker ps -a

# Restart Docker services
npm run docker:down
npm run docker:up

# View Docker logs
npm run docker:logs
```

</details>

<details>
<summary><strong>Database connection issues</strong></summary>

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database connection
docker exec -it notepro-postgres psql -U postgres

# Reset database
npm run docker:down
docker volume rm note_pro_postgres-data
npm run docker:up
```

</details>

<details>
<summary><strong>Complete Reset</strong></summary>

```bash
# Stop all services
pm2 delete all
npm run docker:down

# Clean installation
rm -rf client/node_modules server/node_modules
rm -rf client/.next server/dist

# Reinstall and restart
npm run install:all
npm run docker:up
npm run pm2:dev
```

</details>

---

## 📖 Documentation

### Official Documentation

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [NestJS Documentation](https://docs.nestjs.com/) - NestJS framework documentation
- [Hasura Documentation](https://hasura.io/docs/) - Hasura GraphQL engine docs
- [TipTap Documentation](https://tiptap.dev/docs) - Rich text editor guide

### Useful Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🌟 Acknowledgments

- Thanks to all contributors who have helped this project grow
- Built with amazing open-source technologies
- Inspired by modern note-taking applications like Notion and Obsidian

---

<div align="center">
  <p>Made with ❤️ and ☕</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
