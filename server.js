const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./qlclbtt.db');

app.use(express.json());

// Hiển thị giao diện Web index.html khi truy cập
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API nhận dữ liệu từ Web và lưu vào Database thật
app.post('/api/dang-ky', (req, res) => {
    const { hoTen, soDienThoai, email } = req.body;
    const namHienTai = new Date().getFullYear();
    const ngayHomNay = new Date().toISOString().split('T')[0];

    db.get(`SELECT COUNT(*) AS count FROM HoiVien`, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        const soThuTu = String(row.count + 1).padStart(4, '0');
        const maHoiVienMoi = `HV${namHienTai}${soThuTu}`;

        const stmt = db.prepare(`INSERT INTO HoiVien VALUES (?, ?, ?, ?, ?, ?)`);
        stmt.run(maHoiVienMoi, hoTen, soDienThoai, email, ngayHomNay, 'Hoat dong', (insertErr) => {
            if (insertErr) return res.status(500).json({ error: insertErr.message });
            
            res.json({
                success: true,
                maHoiVien: maHoiVienMoi,
                hoTen: hoTen
            });
        });
        stmt.finalize();
    });
});

app.listen(8080, () => {
    console.log('=== SERVER QUẢN LÝ CLB ĐANG CHẠY TẠI CỔNG 8080 ===');
});