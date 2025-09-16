#!/bin/bash

# Note Pro Start Projects Script
# This script provides both quick start and full deployment options

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${CYAN}$1${NC}"
}

# Function to show usage
show_usage() {
    echo -e "${BLUE}Note Pro - Start Projects Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help           Show this help message"
    echo "  -q, --quick          Quick start (existing dependencies)"
    echo "  -f, --full           Full deployment with git pull and install"
    echo "  -s, --setup-startup  Full deployment + PM2 startup setup"
    echo "  -r, --restart        Stop and restart all services"
    echo "  -S, --stop           Stop all services"
    echo "  --status             Show services status"
    echo ""
    echo "Examples:"
    echo "  $0 --quick          # Quick start if dependencies exist"
    echo "  $0 --full           # Full deployment"
    echo "  $0 --setup-startup  # Full deployment + PM2 startup"
    echo "  $0 --restart        # Restart all services"
    echo ""
    echo "For more information, see README.md"
}

# Function to check if we're in the right directory
check_directory() {
    if [ ! -f "ecosystem.config.js" ]; then
        print_error "ecosystem.config.js not found. Please run this script from the project root."
        exit 1
    fi
}

# Function to install PM2 if not available
ensure_pm2() {
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2 globally..."
        npm install -g pm2
    fi
}

# Function to check services status
show_status() {
    print_header "�� Services Status"
    echo ""
    
    print_status "PM2 Processes:"
    pm2 list || echo "No PM2 processes running"
    echo ""
    
    print_status "Docker Containers:"
    if command -v docker &> /dev/null; then
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Docker not available or no containers running"
    else
        echo "Docker not available"
    fi
    echo ""
    
    print_status "Service URLs:"
    echo -e "  • Client (Next.js): ${GREEN}http://localhost:3000${NC}"
    echo -e "  • Server (NestJS): ${GREEN}http://localhost:3001${NC}"
    echo -e "  • Hasura Console: ${GREEN}http://localhost:8080${NC}"
    echo -e "  • PostgreSQL: ${GREEN}localhost:5432${NC}"
}

# Function to stop all services
stop_services() {
    print_header "🛑 Stopping All Services"
    
    print_status "Stopping PM2 processes..."
    pm2 stop all 2>/dev/null || true
    
    print_status "Stopping Docker services..."
    docker compose down 2>/dev/null || true
    
    print_status "All services stopped!"
}

# Function for quick start
quick_start() {
    print_header "🚀 Quick Starting Note Pro..."
    
    check_directory
    ensure_pm2
    
    # Install dependencies if node_modules don't exist
    if [ ! -d "client/node_modules" ] || [ ! -d "server/node_modules" ]; then
        print_status "Installing dependencies..."
        npm run install:all
    fi
    
    # Start docker services
    print_status "Starting Docker services..."
    docker compose up -d
    
    # Wait a bit for services to start
    print_status "Waiting for Docker services to be ready..."
    sleep 5
    
    # Start PM2 services
    print_status "Starting PM2 services..."
    pm2 start ecosystem.config.js --env development
    
    # Save PM2 configuration
    print_status "Saving PM2 configuration..."
    pm2 save
    
    print_success
}

# Function for full deployment
full_deployment() {
    local setup_startup=${1:-false}
    
    print_header "🚀 Starting Note Pro Full Deployment..."
    
    check_directory
    
    # Step 1: Pull latest code
    print_status "Pulling latest code from git..."
    git pull origin main
    
    # Step 2: Install PM2 globally if not installed
    ensure_pm2
    
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
        pm2 reload ecosystem.config.js --env development
    else
        print_status "Starting PM2 processes..."
        pm2 start ecosystem.config.js --env development
    fi
    
    # Step 8: Save PM2 configuration
    print_status "Saving PM2 configuration..."
    pm2 save
    
    # Step 9: Setup PM2 startup (optional)
    if [ "$setup_startup" = "true" ]; then
        print_status "Setting up PM2 startup..."
        pm2 startup
    fi
    
    print_success
}

# Function to restart services
restart_services() {
    print_header "🔄 Restarting All Services"
    
    print_status "Stopping services..."
    stop_services
    
    sleep 2
    
    print_status "Starting services..."
    quick_start
}

# Function to print success message
print_success() {
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
    echo -e "${BLUE}For more information, see README.md${NC}"
    echo ""
    print_status "Happy coding! 💻"
}

# Main script logic
main() {
    # Default to quick start if no arguments
    if [ $# -eq 0 ]; then
        quick_start
        return
    fi
    
    case $1 in
        -h|--help)
            show_usage
            ;;
        -q|--quick)
            quick_start
            ;;
        -f|--full)
            full_deployment false
            ;;
        -s|--setup-startup)
            full_deployment true
            ;;
        -r|--restart)
            restart_services
            ;;
        -S|--stop)
            stop_services
            ;;
        --status)
            show_status
            ;;
        *)
            print_error "Unknown option: $1"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
