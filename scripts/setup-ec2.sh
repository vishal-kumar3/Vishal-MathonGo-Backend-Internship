#!/bin/bash

# EC2 Initial Setup Script
# Run this once on your EC2 instance

set -e

echo "🔧 Setting up EC2 instance for deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for health checks)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application directory
sudo mkdir -p /home/ubuntu/mathongo
sudo chown ubuntu:ubuntu /home/ubuntu/mathongo

# Clone repository (replace with your repo URL)
cd /home/ubuntu
git clone https://github.com/vishal-kumar3/mathongo.git
cd mathongo

# Copy environment file
cp .env.production .env

echo "✅ EC2 setup completed!"
echo "📝 Don't forget to:"
echo "   1. Configure your .env file with actual values"
echo "   2. Set up GitHub secrets for deployment"
echo "   3. Configure your domain/SSL if needed"
