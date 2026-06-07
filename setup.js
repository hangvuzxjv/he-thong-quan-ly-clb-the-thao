const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Tạo file database mới
const db = new sqlite3.Database('./qlclbtt.db');

// Đọc công thức từ file database.sql
const sqlCode = fs.readFileSync('./database.sql', 'utf8');

// Thực thi lệnh để tạo các bảng
db.exec(sqlCode, (err) => {
    if (err) {
        console.error("Lỗi khi khởi tạo Database:", err.message);
    } else {
        console.log(" KHỞI TẠO DATABASE THÀNH CÔNG!");
        console.log("Đã nạp 3 tài khoản: admin, letan_nu, letan_nam");
    }
    db.close();
});