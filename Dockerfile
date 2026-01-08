# Multi-stage build for Scanner Bridge

# Stage 1: Python backend
FROM python:3.11-slim as backend-builder

WORKDIR /app/backend

# Install system dependencies for scanner support
RUN apt-get update && apt-get install -y \
    libusb-1.0-0 \
    libusb-dev \
    sane-utils \
    libsane-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Stage 2: Node.js frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend code
COPY frontend/ .

# Build frontend
RUN npm run build

# Stage 3: Final image
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libusb-1.0-0 \
    sane-utils \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python backend from builder
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /app/backend /app/backend

# Copy frontend build from builder
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Copy configuration
COPY config/ /app/config/

# Create necessary directories
RUN mkdir -p /app/temp /app/cache /app/scans /app/logs

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
