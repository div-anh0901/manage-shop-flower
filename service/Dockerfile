# Stage 1: Build (chỉ cần nếu có transpile TypeScript, nếu JS thì có thể bỏ)
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json + package-lock.json trước để cache npm install
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Nếu dùng TypeScript, build TS sang JS
# RUN npm run build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app

# Copy node_modules từ stage build
COPY --from=build /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose port
EXPOSE 5001

# Run server
CMD ["node", "src/server.js"]
