#!/bin/bash

# Globe Link - Development Helper Scripts
# Run from root directory: ./start.sh

echo "🌍 Starting Globe Link Development Environment..."
echo ""

# Check if running on Windows (Git Bash)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "📦 Starting Backend Server..."
    cd backend
    start cmd /k "npm run dev"
    cd ..
    
    echo "⏳ Waiting 3 seconds for backend to start..."
    sleep 3
    
    echo "📦 Starting Frontend Server..."
    cd frontend
    start cmd /k "npm run dev"
    cd ..
else
    # Mac/Linux
    echo "📦 Starting Backend Server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    echo "⏳ Waiting 3 seconds for backend to start..."
    sleep 3
    
    echo "📦 Starting Frontend Server..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
fi

echo ""
echo "✅ Globe Link is starting up!"
echo ""
echo "🔗 Frontend:  http://localhost:5173"
echo "🔗 Backend:   http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"
