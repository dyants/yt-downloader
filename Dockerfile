# Base image dengan Node.js
FROM node:22-slim

# Install python3, pip, dan yt-dlp (dibutuhkan oleh youtube-dl-exec)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    --no-install-recommends && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
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
