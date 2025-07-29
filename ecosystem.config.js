module.exports = {
  apps: [
    // NestJS Server
    {
      name: 'note-pro-server',
      cwd: './server',
      script: 'npm',
      args: 'run start:dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      watch: false,
      max_memory_restart: '1G',
      instances: 1,
      exec_mode: 'fork',
    },
    // Next.js Client
    {
      name: 'note-pro-client',
      cwd: './client',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: false,
      max_memory_restart: '1G',
      instances: 1,
      exec_mode: 'fork',
    },
  ],

  deploy: {
    development: {
      user: process.env.USER || 'user',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:QuaTaAnh/note_pro.git',
      path: '/home/anh/Projects/Learn/note_pro',
      'pre-deploy': 'git pull origin main',
      'post-deploy': 'npm run setup:all && pm2 reload ecosystem.config.js --env development',
      env: {
        NODE_ENV: 'development',
      },
    },
    production: {
      user: process.env.USER || 'user',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:QuaTaAnh/note_pro.git',
      path: '/home/anh/Projects/Learn/note_pro',
      'pre-deploy': 'git pull origin main',
      'post-deploy': 'npm run setup:all && npm run build:all && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
}; 