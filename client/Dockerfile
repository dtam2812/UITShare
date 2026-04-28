# --- Stage 1: Build React app ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverages Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build production bundle into dist/
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy build output from stage 1 into Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (created separately)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]