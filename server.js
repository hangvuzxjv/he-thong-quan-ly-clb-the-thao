const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const apiRoutes = require('./routes/api.routes'); 

const app = express();
const PORT = 8080;

// Khởi tạo Database chung cho toàn bộ ứng dụng
const db = new sqlite3.Database('./qlclbtt.db', (err) => {
    if (err) console.error('Lỗi kết nối database:', err.message);
    else console.log(' [TITAN FITNESS] Kết nối Database thành công.');
});

// Cấu hình Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ĐOẠN QUAN TRỌNG NHẤT: Gắn bộ định tuyến API và truyền 'db' sang api.routes.js
app.use('/api', (req, res, next) => {
    req.db = db;
    next();
}, apiRoutes);

// Khởi động hệ thống
app.listen(PORT, () => {
    console.log(` [TITAN FITNESS] Server Core đang chạy ổn định tại cổng ${PORT}`);
    console.log(` Truy cập giao diện: http://localhost:${PORT}`);
});