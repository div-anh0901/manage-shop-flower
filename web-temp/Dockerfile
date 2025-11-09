# Stage 1: Build React App
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json + package-lock.json để cache npm install
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build project production
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:alpine
# Xóa default HTML
RUN rm -rf /usr/share/nginx/html/*

# Copy build từ stage trước sang Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy config Nginx custom (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
