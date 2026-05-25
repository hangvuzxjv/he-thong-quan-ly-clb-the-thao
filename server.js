const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./qlclbtt.db');

app.use(express.json());

// Giao diện Web chính
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API 1: Đăng ký hội viên mới (SCRUM-5)
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
            res.json({ success: true, maHoiVien: maHoiVienMoi, hoTen: hoTen });
        });
        stmt.finalize();
    });
});

// API 2: Thanh toán & Mua gói tập (SCRUM-7)
app.post('/api/gia-han', (req, res) => {
    const { maHoiVien, maGoiTap } = req.body;

    db.get(`SELECT * FROM GoiTap WHERE ma_goi_tap = ?`, [maGoiTap], (err, goiTap) => {
        if (err || !goiTap) return res.status(404).json({ error: "Không tìm thấy gói tập!" });

        const ngayBatDau = new Date();
        const ngayHetHan = new Date();
        ngayHetHan.setMonth(ngayBatDau.getMonth() + goiTap.thoi_han_thang);

        const ngayBatDauStr = ngayBatDau.toISOString().split('T')[0];
        const ngayHetHanStr = ngayHetHan.toISOString().split('T')[0];

        const stmt = db.prepare(`INSERT OR REPLACE INTO TheHoiVien VALUES (?, ?, ?, ?)`);
        stmt.run(maHoiVien, maGoiTap, ngayBatDauStr, ngayHetHanStr, (insertErr) => {
            if (insertErr) return res.status(500).json({ error: insertErr.message });
            res.json({
                success: true,
                maHoiVien: maHoiVien,
                tenGoiTap: goiTap.ten_goi_tap,
                ngayBatDau: ngayBatDauStr,
                ngayHetHan: ngayHetHanStr
            });
        });
        stmt.finalize();
    });
});

// API 3: Cổng điểm danh Check-in (SCRUM-8)
app.post('/api/check-in', (req, res) => {
    const { maHoiVien } = req.body;
    const ngayHomNayStr = new Date().toISOString().split('T')[0];
    const thoiGianHienTai = new Date().toLocaleString('vi-VN');

    db.get(`SELECT * FROM TheHoiVien WHERE ma_hoi_vien = ?`, [maHoiVien], (err, the) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!the) return res.json({ success: false, message: "Thẻ chưa kích hoạt gói tập hoặc không tồn tại!" });

        if (the.ngay_het_han < ngayHomNayStr) {
            return res.json({ success: false, message: `Thẻ đã hết hạn vào ngày ${the.ngay_het_han}!` });
        }

        const stmt = db.prepare(`INSERT INTO DiemDanh (ma_hoi_vien, thoi_gian, trang_thai) VALUES (?, ?, ?)`);
        stmt.run(maHoiVien, thoiGianHienTai, 'Thành công', (insertErr) => {
            if (insertErr) return res.status(500).json({ error: insertErr.message });
            res.json({
                success: true,
                message: "HỢP LỆ! MỜI VÀO PHÒNG TẬP.",
                maHoiVien: maHoiVien,
                thoiGian: thoiGianHienTai,
                ngayHetHan: the.ngay_het_han
            });
        });
        stmt.finalize();
    });
});

app.listen(8080, () => {
 console.log('=== SERVER QUẢN LÝ CLB ĐANG CHẠY TẠI CỔNG 8080 ===');
});