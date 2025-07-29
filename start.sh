#!/bin/bash

# Quick Start Script for Note Pro
echo "🚀 Quick starting Note Pro..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Install dependencies if node_modules don't exist
if [ ! -d "client/node_modules" ] || [ ! -d "server/node_modules" ]; then
    echo "Installing dependencies..."
    npm run install:all
fi

# Start docker services
echo "Starting Docker services..."
docker compose up -d

# Wait a bit for services to start
sleep 5

# Start PM2 services
echo "Starting PM2 services..."
pm2 start ecosystem.config.js --env development

# Show status
echo "✅ All services started!"
echo ""
echo "🌐 URLs:"
echo "  Client: http://localhost:3000"
echo "  Server: http://localhost:3001" 
echo "  Hasura: http://localhost:8080"
echo ""
echo "📊 Commands:"
echo "  Logs: pm2 logs"
echo "  Monitor: pm2 monit"
echo "  Stop: pm2 stop all" 