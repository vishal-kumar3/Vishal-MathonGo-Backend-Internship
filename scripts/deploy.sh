#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | xargs)
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Remove old images
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start new containers
echo "🏗️ Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000/health; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed!"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

echo "🎉 Deployment completed successfully!"
