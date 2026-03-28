# Base image
FROM node:22-slim

# Install ffmpeg + python3 + yt-dlp
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    --no-install-recommends && \
    pip3 install yt-dlp --break-system-packages && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install semua dependencies termasuk devDependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Buat folder temp
RUN mkdir -p /app/temp

# Expose port
EXPOSE 3000

# Jalankan app
CMD ["node", "dist/server.js"]