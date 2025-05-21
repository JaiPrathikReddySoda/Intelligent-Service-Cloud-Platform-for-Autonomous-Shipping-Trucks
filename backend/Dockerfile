# Base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and lock file first (better cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the codebase
COPY . .

# Build TypeScript -> JavaScript
RUN npm run build

# Expose backend port (adjust if needed)
EXPOSE 5001

# Start backend server (compiled output)
CMD ["node", "dist/server.js"]
