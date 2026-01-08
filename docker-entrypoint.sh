#!/bin/bash

# Scanner Bridge Docker Entrypoint

set -e

echo "Starting Scanner Bridge..."

# Start Python backend in background
echo "Starting Python backend service..."
cd /app/backend
python app.py &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        echo "Backend is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 1
done

# Start frontend server
echo "Starting frontend server..."
cd /app/frontend
npx serve -s dist -l 3000 &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo "Waiting for frontend to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "Frontend is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 1
done

echo "Scanner Bridge is running!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"

# Keep the container running
wait $BACKEND_PID $FRONTEND_PID
