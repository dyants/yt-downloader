# Base image dengan Node.js
FROM node:22-slim

# Install ffmpeg (needed for audio/video processing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files dulu (untuk cache layer)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Install TypeScript untuk build (devDependency)
RUN npm install typescript tsx --save-dev

# Build TypeScript
RUN npm run build

# Buat folder temp
RUN mkdir -p /app/temp

# Expose port (Railway inject PORT env secara otomatis)
EXPOSE 3000

# Jalankan app
CMD ["node", "dist/server.js"]
