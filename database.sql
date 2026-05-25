-- 5. BẢNG THEO DÕI SỨC KHỎE BMI (SCRUM-9)
CREATE TABLE IF NOT EXISTS SucKhoeBMI (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_hoi_vien TEXT NOT NULL,
    chieu_cao REAL NOT NULL, -- đơn vị: cm
    can_nang REAL NOT NULL,  -- đơn vị: kg
    chi_so_bmi REAL NOT NULL,
    nhan_xet TEXT,
    ngay_do TEXT NOT NULL,
    FOREIGN KEY(ma_hoi_vien) REFERENCES HoiVien(ma_hoi_vien)
);

-- 6. BẢNG QUẢN LÝ SÂN BÃI DỊCH VỤ (SCRUM-10)
CREATE TABLE IF NOT EXISTS SanBai (
    ma_san TEXT PRIMARY KEY,
    ten_san TEXT NOT NULL,
    loai_san TEXT NOT NULL, -- Ví dụ: Sân Bóng Đá, Sân Cầu Lông, Sân Tennis
    trang_thai TEXT DEFAULT 'Trống' -- Trống / Đang sử dụng
);

-- CHÈN SẴN MỘT SỐ SÂN BÃI ĐỂ LÀM DỮ LIỆU CẤU HÌNH BAN ĐẦU
INSERT OR IGNORE INTO SanBai VALUES ('SB01', 'Sân Bóng Đá Thượng Hạng A', 'Sân Bóng Đá', 'Trống');
INSERT OR IGNORE INTO SanBai VALUES ('CL01', 'Sân Cầu Lông Tiêu Chuẩn 1', 'Sân Cầu Lông', 'Trống');
INSERT OR IGNORE INTO SanBai VALUES ('TN01', 'Sân Tennis Đỉnh Cao', 'Sân Tennis', 'Đang sử dụng');