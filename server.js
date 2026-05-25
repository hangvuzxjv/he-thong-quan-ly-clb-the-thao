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

// CHẠY THỬ NGHIỆM TỔNG HỢP SPRINT 1
db.serialize(() => {
    // 1. Test chức năng SCRUM-6 (Thêm gói tập)
    themGoiTap("GYM01", "Gói Gym Cơ Bản", 500000, 1);
    themGoiTap("YOGA06", "Gói Yoga Thượng Hạng", 2500000, 6);
    
    // 2. Xem danh sách gói tập
    setTimeout(() => {
        xemDanhSachGoiTap();
    }, 200);

    // 3. Test chức năng SCRUM-5 (Đăng ký hội viên)
    setTimeout(() => {
        console.log(`\n=== KẾT QUẢ ĐĂNG KÝ HỘI VIÊN ===`);
        dangKyHoiVien("Lê Văn C", "0933333333", "vanc@gmail.com");
    }, 400);
});