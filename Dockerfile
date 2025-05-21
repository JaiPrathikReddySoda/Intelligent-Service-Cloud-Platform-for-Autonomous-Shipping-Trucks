# ================================
# Stage 1: Build the Vite frontend
# ================================
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build


# ===============================
# Stage 2: Serve with NGINX
# ===============================
FROM nginx:stable-alpine

# Clean default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from Stage 1 to NGINX's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (standard HTTP)
EXPOSE 80

# Start NGINX in foreground mode
CMD ["nginx", "-g", "daemon off;"]
