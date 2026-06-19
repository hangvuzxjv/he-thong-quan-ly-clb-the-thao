const express = require('express');
const path = require('path');
const mysql = require('mysql2'); // Sử dụng mysql2 thay cho sqlite3
const apiRoutes = require('./routes/api.routes'); 

const app = express();
// Lấy port từ cấu hình Docker, nếu không có thì chạy mặc định 3000
const PORT = process.env.PORT || 3000; 

// Khởi tạo Pool kết nối Database MySQL chung cho toàn bộ ứng dụng
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Docker sẽ truyền chữ 'db' vào đây
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'clb_thethao_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kiểm tra kết nối tới MySQL ngay khi khởi động
db.getConnection((err, connection) => {
    if (err) {
        console.error(' [TITAN FITNESS] Lỗi kết nối MySQL:', err.message);
    } else {
        console.log(' [TITAN FITNESS] Kết nối MySQL Database thành công.');
        connection.release(); // Trả lại connection cho pool để tái sử dụng
    }
});

// Cấu hình Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ĐOẠN QUAN TRỌNG NHẤT: Gắn bộ định tuyến API và truyền 'db' (MySQL Pool) sang api.routes.js
app.use('/api', (req, res, next) => {
    req.db = db;
    next();
}, apiRoutes);

// Khởi động hệ thống
// Thêm '0.0.0.0' để lắng nghe kết nối từ bên ngoài container
app.listen(PORT, '0.0.0.0', () => {
    console.log(` [TITAN FITNESS] Server Core đang chạy ổn định tại cổng ${PORT}`);
    console.log(` Truy cập giao diện: http://localhost:${PORT}`);
});