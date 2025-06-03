# Chatbot Application Makefile

.PHONY: help build up down logs shell-backend shell-frontend clean restart

# Default target
help:
	@echo "Available commands:"
	@echo "  make build      - Build all Docker images"
	@echo "  make up         - Start all services"
	@echo "  make down       - Stop all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make restart    - Restart all services"
	@echo "  make clean      - Clean up Docker resources"
	@echo "  make shell-backend  - Access backend container shell"
	@echo "  make shell-frontend - Access frontend container shell"

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Start all services
up:
	@echo "Starting all services..."
	docker-compose up -d
	@echo ""
	@echo "🎉 Application is starting!"
	@echo "📱 Frontend: http://localhost:5173"
	@echo "🖥️  Backend:  http://localhost:8000"
	@echo "👤 Admin:    http://localhost:8000/admin (admin/admin123)"
	@echo ""
	@echo "Use 'make logs' to see application logs"

# Stop all services
down:
	@echo "Stopping all services..."
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Restart services
restart: down up

# Clean up Docker resources
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Access backend container shell
shell-backend:
	docker-compose exec backend bash

# Access frontend container shell  
shell-frontend:
	docker-compose exec frontend sh

# Quick start (build and run)
start: build up