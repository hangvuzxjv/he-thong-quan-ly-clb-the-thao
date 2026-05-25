-- 1. BẢNG GÓI TẬP (Môi trường/Cấu hình hệ thống)
CREATE TABLE IF NOT EXISTS GoiTap (
    ma_goi_tap TEXT PRIMARY KEY,
    ten_goi_tap TEXT NOT NULL,
    gia_tien INTEGER NOT NULL,
    thoi_han_thang INTEGER NOT NULL
);

-- 2. BẢNG HỘI VIÊN (Thông tin cá nhân)
CREATE TABLE IF NOT EXISTS HoiVien (
    ma_hoi_vien TEXT PRIMARY KEY,
    ho_ten TEXT NOT NULL,
    so_dien_thoai TEXT,
    email TEXT,
    ngay_dang_ky TEXT NOT NULL,
    trang_thai TEXT DEFAULT 'Hoat dong'
);

-- 3. BẢNG THẺ HỘI VIÊN (Quản lý hạn sử dụng dịch vụ)
CREATE TABLE IF NOT EXISTS TheHoiVien (
    ma_hoi_vien TEXT PRIMARY KEY,
    ma_goi_tap TEXT,
    ngay_bat_dau TEXT NOT NULL,
    ngay_het_han TEXT NOT NULL,
    FOREIGN KEY(ma_hoi_vien) REFERENCES HoiVien(ma_hoi_vien),
    FOREIGN KEY(ma_goi_tap) REFERENCES GoiTap(ma_goi_tap)
);

-- 4. BẢNG ĐIỂM DANH CHECK-IN (Lịch sử ra vào)
CREATE TABLE IF NOT EXISTS DiemDanh (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_hoi_vien TEXT NOT NULL,
    thoi_gian TEXT NOT NULL,
    trang_thai TEXT NOT NULL,
    FOREIGN KEY(ma_hoi_vien) REFERENCES HoiVien(ma_hoi_vien)
);

-- CHÈN SẴN DỮ LIỆU CẤU HÌNH BAN ĐẦU ĐỂ CHẠY HỆ THỐNG
INSERT OR IGNORE INTO GoiTap VALUES ('GYM01', 'Gói Gym Cơ Bản', 500000, 1);
INSERT OR IGNORE INTO GoiTap VALUES ('YOGA06', 'Gói Yoga Thượng Hạng', 2500000, 6);