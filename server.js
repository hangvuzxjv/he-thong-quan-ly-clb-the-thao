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

// GỌI CHẠY THỬ (Sử dụng db.serialize để chạy tuần tự, tránh trùng mã)
db.serialize(() => {
    dangKyHoiVien("Nguyen Van A", "0912345678", "vana@gmail.com");
    
    // Đợi 500ms sau mới tạo người thứ 2 để database kịp cập nhật số lượng
    setTimeout(() => {
        dangKyHoiVien("Tran Thi B", "0987654321", "thib@gmail.com");
    }, 500);
});