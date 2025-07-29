interface PM2ProcessConfig {
  name: string;
  cwd?: string;
  script: string;
  args?: string;
  env?: Record<string, any>;
  env_production?: Record<string, any>;
  watch?: boolean;
  max_memory_restart?: string;
  instances?: number;
  exec_mode?: 'fork' | 'cluster';
}

interface EcosystemConfig {
  apps: PM2ProcessConfig[];
  deploy?: {
    [key: string]: {
      user: string;
      host: string;
      ref: string;
      repo: string;
      path: string;
      'pre-deploy': string;
      'post-deploy': string;
      env: {
        NODE_ENV: string;
      };
    };
  };
}

const config: EcosystemConfig = {
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
      repo: 'your-git-repo-url', // Change this to your actual git repo URL
      path: '/home/anh/Projects/Learn/note_pro',
      'pre-deploy': 'git pull origin main',
      'post-deploy': 'npm run setup:all && pm2 reload ecosystem.config.ts --env development',
      env: {
        NODE_ENV: 'development',
      },
    },
    production: {
      user: process.env.USER || 'user',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'your-git-repo-url', // Change this to your actual git repo URL
      path: '/home/anh/Projects/Learn/note_pro',
      'pre-deploy': 'git pull origin main',
      'post-deploy': 'npm run setup:all && npm run build:all && pm2 reload ecosystem.config.ts --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};

export default config; 