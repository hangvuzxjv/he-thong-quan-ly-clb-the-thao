# Sử dụng phiên bản Node.js ổn định
FROM node:18-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các thư viện
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Mở cổng 8080 để khớp với cấu hình server.js và docker-compose.yml
EXPOSE 8080

# Lệnh chạy ứng dụng
CMD ["node", "server.js"]