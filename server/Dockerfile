# Lấy image Node.js phiên bản 20, bản alpine (nhẹ hơn)
FROM node:20-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy file package.json vào trước (để tận dụng cache)
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code server vào
COPY . .

# Tạo thư mục uploads (server cần thư mục này để lưu file)
RUN mkdir -p uploads/avatar uploads/coverImage uploads/temp

# Mở cổng 8080
EXPOSE 8080

# Lệnh chạy khi container khởi động
CMD ["node", "server.js"]