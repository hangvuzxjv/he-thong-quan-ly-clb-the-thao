const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api.routes'); // Nhúng module API

const app = express();
const PORT = 8080;

// Cấu hình Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gắn bộ định tuyến API
app.use('/api', apiRoutes);

// Khởi động hệ thống
app.listen(PORT, () => {
    console.log(` [TITAN FITNESS] Server Core đang chạy ổn định tại cổng ${PORT}`);
    console.log(` Truy cập giao diện: http://localhost:${PORT}`);
});