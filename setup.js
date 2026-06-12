const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Kết nối đến (hoặc tạo mới) file cơ sở dữ liệu
const db = new sqlite3.Database('./qlclbtt.db', (err) => {
    if (err) {
        console.error('Lỗi khi mở CSDL:', err.message);
        return;
    }
    console.log('Đã kết nối tới file qlclbtt.db thành công.');
});

// Đọc toàn bộ nội dung của file database.sql
const sqlScript = fs.readFileSync('./database.sql', 'utf8');

// Thực thi đoạn script SQL
db.exec(sqlScript, (err) => {
    if (err) {
        console.error('Lỗi khi thực thi file SQL:', err.message);
    } else {
        console.log('Đã khởi tạo bảng và chèn dữ liệu mẫu thành công!');
    }
    
    // Đóng kết nối
    db.close((err) => {
        if (err) {
            console.error('Lỗi khi đóng CSDL:', err.message);
        } else {
            console.log('Đã đóng kết nối CSDL an toàn.');
        }
    });
});