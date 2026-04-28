# --- Stage 1: Build React app ---
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Declare ARGs to receive values passed from docker-compose
ARG VITE_API_URL
ARG VITE_MARKETPLACE_CONTRACT_ADDRESS
ARG VITE_NFT_CONTRACT_ADDRESS

# 2. Convert ARGs to ENVs so Vite can "bake" them into the code
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MARKETPLACE_CONTRACT_ADDRESS=$VITE_MARKETPLACE_CONTRACT_ADDRESS
ENV VITE_NFT_CONTRACT_ADDRESS=$VITE_NFT_CONTRACT_ADDRESS

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# 3. Run build. Vite will use the ENVs above to embed into the bundle
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy build output from Stage 1 to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]