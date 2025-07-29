#!/bin/bash

# Note Pro Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting Note Pro Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "ecosystem.config.ts" ]; then
    print_error "ecosystem.config.ts not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Pull latest code
print_status "Pulling latest code from git..."
git pull origin main

# Step 2: Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2 globally..."
    npm install -g pm2
fi

# Step 3: Install root dependencies
print_status "Installing root dependencies..."
npm install

# Step 4: Install client dependencies
print_status "Installing client dependencies..."
cd client
npm install
cd ..

# Step 5: Install server dependencies
print_status "Installing server dependencies..."
cd server
npm install
cd ..

# Step 6: Start/Restart Docker services
print_status "Starting Docker services..."
docker compose down 2>/dev/null || true
docker compose up -d

# Wait for Docker services to be ready
print_status "Waiting for Docker services to be ready..."
sleep 10

# Step 7: Check if processes are already running
if pm2 list | grep -q "note-pro"; then
    print_status "Reloading existing PM2 processes..."
    pm2 reload ecosystem.config.ts --env development
else
    print_status "Starting PM2 processes..."
    pm2 start ecosystem.config.ts --env development
fi

# Step 8: Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Step 9: Setup PM2 startup (optional)
if [ "$1" = "--setup-startup" ]; then
    print_status "Setting up PM2 startup..."
    pm2 startup
fi

# Final status
print_status "Deployment completed! 🎉"
echo ""
echo -e "${BLUE}Application URLs:${NC}"
echo -e "  • Client (Next.js): ${GREEN}http://localhost:3000${NC}"
echo -e "  • Server (NestJS): ${GREEN}http://localhost:3001${NC}"
echo -e "  • Hasura Console: ${GREEN}http://localhost:8080${NC}"
echo -e "  • PostgreSQL: ${GREEN}localhost:5432${NC}"
echo ""
echo -e "${BLUE}Useful PM2 commands:${NC}"
echo -e "  • View logs: ${GREEN}pm2 logs${NC}"
echo -e "  • Monitor: ${GREEN}pm2 monit${NC}"
echo -e "  • Restart all: ${GREEN}pm2 restart all${NC}"
echo -e "  • Stop all: ${GREEN}pm2 stop all${NC}"
echo ""
print_status "Happy coding! 💻" 