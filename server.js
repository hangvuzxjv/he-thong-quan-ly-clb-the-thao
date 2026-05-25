const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./qlclbtt.db');

// HÀM LOGIC: Đăng ký hội viên mới & Tự động cấp mã số thẻ (6 cột)
function dangKyHoiVien(hoTen, soDienThoai, email) {
    const namHienTai = new Date().getFullYear(); 
    const ngayHomNay = new Date().toISOString().split('T')[0]; 
    
    db.get(`SELECT COUNT(*) AS count FROM HoiVien`, [], (err, row) => {
        if (err) return console.error(err.message);
        
        const soThuTu = String(row.count + 1).padStart(4, '0'); 
        const maHoiVienMoi = `HV${namHienTai}${soThuTu}`; 
        
        // Dùng dấu hỏi (?) truyền đúng 6 giá trị
        const stmt = db.prepare(`INSERT INTO HoiVien VALUES (?, ?, ?, ?, ?, ?)`);
        stmt.run(maHoiVienMoi, hoTen, soDienThoai, email, ngayHomNay, 'Hoat dong');
        stmt.finalize();
        
        // Sử dụng chính xác dấu nháy ngược ` để in biến ra màn hình Terminal
        console.log(`=== ĐĂNG KÝ THÀNH CÔNG ===`);
        console.log(`Hội viên: ${hoTen} | Mã số thẻ được cấp: ${maHoiVienMoi}\n`);
    });
}



// HÀM LOGIC: Thêm gói tập mới (SCRUM-6)
function themGoiTap(maGoi, tenGoi, giaTien, thoiHan) {
    const stmt = db.prepare(`INSERT INTO GoiTap VALUES (?, ?, ?, ?)`);
    stmt.run(maGoi, tenGoi, giaTien, thoiHan, (err) => {
        if (err) return console.error(`Lỗi thêm gói tập: ${err.message}`);
        console.log(`[GÓI TẬP] Thêm thành công: ${tenGoi} (${giaTien} VND)`);
    });
    stmt.finalize();
}

// HÀM LOGIC: Xem danh sách gói tập đang có
function xemDanhSachGoiTap() {
    console.log(`\n=== DANH SÁCH GÓI TẬP HIỆN CÓ ===`);
    db.each(`SELECT * FROM GoiTap`, [], (err, row) => {
        if (err) return console.error(err.message);
        console.log(`Mã: ${row.ma_goi_tap} | Tên: ${row.ten_goi_tap} | Giá: ${row.gia_tien} VND | Thời hạn: ${row.thoi_han_thang} tháng`);
    });
}



// Tạo thêm bảng Thẻ Hội Viên để quản lý ngày hết hạn nếu chưa có
db.run(`CREATE TABLE IF NOT EXISTS TheHoiVien (
    ma_hoi_vien TEXT PRIMARY KEY,
    ma_goi_tap TEXT,
    ngay_bat_dau TEXT,
    ngay_het_han TEXT,
    FOREIGN KEY(ma_hoi_vien) REFERENCES HoiVien(ma_hoi_vien),
    FOREIGN KEY(ma_goi_tap) REFERENCES GoiTap(ma_goi_tap)
)`);

// HÀM LOGIC: Xử lý thanh toán và gia hạn thẻ (SCRUM-7)
function thanhToanVaGiaHan(maHoiVien, maGoiTap) {
    // 1. Lấy thông tin số tháng của gói tập từ DB
    db.get(`SELECT * FROM GoiTap WHERE ma_goi_tap = ?`, [maGoiTap], (err, goiTap) => {
        if (err || !goiTap) return console.error("Không tìm thấy gói tập!");

        const ngayBatDau = new Date();
        const ngayHetHan = new Date();
        // Cộng thêm số tháng của gói tập vào ngày hết hạn
        ngayHetHan.setMonth(ngayBatDau.getMonth() + goiTap.thoi_han_thang);

        const ngayBatDauStr = ngayBatDau.toISOString().split('T')[0];
        const ngayHetHanStr = ngayHetHan.toISOString().split('T')[0];

        // 2. Lưu thông tin gia hạn vào bảng TheHoiVien
        const stmt = db.prepare(`INSERT OR REPLACE INTO TheHoiVien VALUES (?, ?, ?, ?)`);
        stmt.run(maHoiVien, maGoiTap, ngayBatDauStr, ngayHetHanStr);
        stmt.finalize();

        console.log(`=== THANH TOÁN & GIA HẠN THÀNH CÔNG ===`);
        console.log(`Hội viên: ${maHoiVien} | Đã mua: ${goiTap.ten_goi_tap}`);
        console.log(`Thời hạn thẻ: Từ ${ngayBatDauStr} đến ${ngayHetHanStr}\n`);
    });
}

// CHẠY THỬ NGHIỆM TỔNG HỢP TOÀN BỘ SPRINT 1 (SCRUM-5, 6, 7)
db.serialize(() => {
    console.log(`--- HỆ THỐNG QUẢN LÝ CLB THỂ THAO ĐANG CHẠY ---`);

    // Chạy thử tính năng thanh toán sau khi các dữ liệu trên đã sẵn sàng
    setTimeout(() => {
        // Giả sử hội viên mã số HV20260004 đăng ký mua gói YOGA06
        thanhToanVaGiaHan("HV20260004", "YOGA06");
    }, 600);
});