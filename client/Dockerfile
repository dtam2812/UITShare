# --- Giai đoạn 1: Build React app ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy code vào
COPY . .

# Build ra thư mục dist/
RUN npm run build

# --- Giai đoạn 2: Serve bằng Nginx ---
FROM nginx:alpine

# Copy kết quả build từ giai đoạn 1 vào Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy config Nginx (tạo ở bước tiếp)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]