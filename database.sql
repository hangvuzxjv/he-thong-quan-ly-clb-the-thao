CREATE TABLE IF NOT EXISTS HoiVien (
    ma_hv TEXT PRIMARY KEY, 
    ho_ten TEXT NOT NULL, 
    sdt TEXT NOT NULL, 
    email TEXT NOT NULL, 
    ngay_dang_ky TEXT NOT NULL, 
    loai_the TEXT DEFAULT 'Chưa kích hoạt', 
    diem_thuong INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS GiaoDich (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    ma_hv TEXT NOT NULL, 
    ten_goi TEXT NOT NULL, 
    so_tien REAL NOT NULL, 
    phuong_thuc TEXT NOT NULL, 
    ngay_giao_dich TEXT NOT NULL, 
    ngay_het_han TEXT NOT NULL, 
    nguoi_thu_tien TEXT, 
    FOREIGN KEY(ma_hv) REFERENCES HoiVien(ma_hv)
);

CREATE TABLE IF NOT EXISTS VeLeKhachVangLai (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    loai_ve TEXT NOT NULL, 
    so_tien REAL NOT NULL, 
    ngay_ban TEXT NOT NULL, 
    nguoi_thu_tien TEXT
);

CREATE TABLE IF NOT EXISTS CheckInLog (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    ma_hv TEXT NOT NULL, 
    khu_vuc TEXT NOT NULL, 
    thoi_gian TEXT NOT NULL, 
    trang_thai TEXT DEFAULT 'Thành công', 
    FOREIGN KEY(ma_hv) REFERENCES HoiVien(ma_hv)
);

CREATE TABLE IF NOT EXISTS NhanSu (
    ma_nv TEXT PRIMARY KEY, 
    ho_ten TEXT NOT NULL, 
    vai_tro TEXT NOT NULL, 
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL
);

-- Khởi tạo 3 tài khoản nhân sự ban đầu
INSERT OR IGNORE INTO NhanSu VALUES ('NV01', 'Admin Tổng', 'Quản trị viên', 'admin', '123456');
INSERT OR IGNORE INTO NhanSu VALUES ('NV02', 'Lễ Tân Nữ', 'Lễ tân trực quầy', 'letan_nu', '123456');
INSERT OR IGNORE INTO NhanSu VALUES ('NV03', 'Lễ Tân Nam', 'Lễ tân trực quầy', 'letan_nam', '123456');