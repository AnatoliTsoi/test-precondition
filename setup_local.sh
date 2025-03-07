#!/bin/bash

set -e

echo "🚀 Installing dependencies..."
npm install

if ! command -v docker &> /dev/null
then
    echo "❌ Docker is not installed. Please install it and try again."
    exit 1
fi

if ! command -v docker-compose &> /dev/null
then
    echo "❌ Docker Compose is not installed. Please install it and try again."
    exit 1
fi

echo "🛠 Running database in Docker..."
docker-compose up -d

echo "⏳ Waiting for database to become ready..."
sleep 5
echo "✅ Database is ready!"

echo "📦 Running migrations..."
npm run migrate

echo "🌱 Running seeders..."
npm run seed

echo "🚀 Starting the server..."
npm run dev
