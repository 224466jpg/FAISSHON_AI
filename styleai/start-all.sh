#!/bin/bash

echo "╔═══════════════════════════════════════════════╗"
echo "║                                               ║"
echo "║   🚀 STARTING STYLEAI FULL-STACK APP        ║"
echo "║                                               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running. Starting..."
    brew services start mongodb-community 2>/dev/null || echo "❌ Please start MongoDB manually"
fi

echo ""
echo "🔧 Installing dependencies..."

# Install frontend dependencies
cd "$(dirname "$0")"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Install backend dependencies
if [ ! -d "server/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd server && npm install && cd ..
fi

echo ""
echo "🚀 Starting servers..."
echo ""
echo "Backend API will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173 (or next available port)"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend in background
cd server
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
cd ..
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for both processes
wait
