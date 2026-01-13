#!/bin/bash

# Deployment Script for Geotree API
# Usage: bash .deploy.sh

echo "🚀 Starting Deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created. Please update it with your credentials!"
        exit 1
    else
        echo "❌ .env.example not found!"
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "✅ PM2 found"
    
    # Stop existing process if running
    pm2 stop geotree-api 2>/dev/null || true
    pm2 delete geotree-api 2>/dev/null || true
    
    # Start with PM2
    echo "🚀 Starting server with PM2..."
    npm run pm2:start
    
    # Save PM2 process list
    pm2 save
    
    echo "✅ Server started with PM2!"
    echo "📊 View logs: npm run pm2:logs"
    echo "📊 View status: pm2 status"
else
    echo "⚠️  PM2 not found. Starting with node directly..."
    echo "💡 Install PM2: npm install -g pm2"
    npm start
fi

echo "✅ Deployment completed!"

