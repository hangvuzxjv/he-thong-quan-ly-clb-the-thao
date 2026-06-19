CREATE TABLE IF NOT EXISTS NhanSu (
    ma_nv TEXT PRIMARY KEY,
    ho_ten TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    vai_tro TEXT NOT NULL
);

INSERT OR IGNORE INTO NhanSu (ma_nv, ho_ten, username, password, vai_tro) VALUES 
('NV01', 'Phan Huỳnh Phúc', 'admin', 'admin', 'Quản trị viên'),
('NV02', 'Huỳnh Ngọc Minh Thư', 'letan_lan', '123456', 'Nhân viên trực cổng');

CREATE TABLE IF NOT EXISTS HoiVien (
    ma_hv TEXT PRIMARY KEY,
    ho_ten TEXT NOT NULL,
    sdt TEXT NOT NULL,
    email TEXT,
    loai_the TEXT DEFAULT 'Chưa kích hoạt',
    ngay_dang_ky TEXT NOT NULL,
    diem_thuong INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS GiaoDich (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_hv TEXT NOT NULL,
    ten_goi TEXT NOT NULL,
    so_tien INTEGER NOT NULL,
    phuong_thuc TEXT NOT NULL,
    ngay_giao_dich TEXT NOT NULL,
    ngay_het_han TEXT NOT NULL,
    nguoi_thu_tien TEXT NOT NULL,
    FOREIGN KEY(ma_hv) REFERENCES HoiVien(ma_hv) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS VeLeKhachVangLai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loai_ve TEXT NOT NULL,
    so_tien INTEGER NOT NULL,
    ngay_ban TEXT NOT NULL,
    nguoi_thu_tien TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS CheckInLog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_hv TEXT NOT NULL,
    khu_vuc TEXT NOT NULL,
    thoi_gian TEXT NOT NULL,
    FOREIGN KEY(ma_hv) REFERENCES HoiVien(ma_hv) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS SanPham (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_sanpham TEXT UNIQUE NOT NULL,
    gia INTEGER NOT NULL,
    category TEXT
);

INSERT OR IGNORE INTO SanPham (ten_sanpham, gia, category) VALUES 
('Pre-workout C4', 550000, 'Supplement'),
('BCAA Xtend', 450000, 'Supplement'),
('Mass Gainer Serious', 850000, 'Supplement'),
('Whey Protein Gold Standard', 1450000, 'Supplement'),
('Creatine Monohydrate', 350000, 'Supplement'),
('Vitamin tổng hợp', 400000, 'Supplement'),
('Dầu cá Omega-3', 300000, 'Supplement'),
('Sữa tăng cơ Iso100', 1600000, 'Supplement'),
('Thanh Protein Bar', 35000, 'Supplement'),
('Thảm tập Yoga Cao Cấp', 250000, 'Phụ kiện'),
('Dây nhảy thể lực', 120000, 'Phụ kiện'),
('Băng quấn bảo vệ cổ tay', 85000, 'Phụ kiện'),
('Băng quấn đầu gối', 150000, 'Phụ kiện'),
('Bình lắc Shaker 700ml', 95000, 'Phụ kiện'),
('Khăn lau mồ hôi thể thao', 60000, 'Phụ kiện'),
('Găng tay tập Gym', 120000, 'Phụ kiện'),
('Đai lưng tập tạ', 290000, 'Phụ kiện'),
('Dây kháng lực (Mini band)', 150000, 'Phụ kiện'),
('Bình nước giữ nhiệt 1L', 220000, 'Phụ kiện'),
('Dầu massage giảm đau cơ', 110000, 'Phụ kiện'),
('Móc khóa dây đeo Gym', 45000, 'Phụ kiện'),
('Túi đựng đồ tập du lịch', 350000, 'Phụ kiện'),
('Cân điện tử sức khỏe', 320000, 'Thiết bị'),
('Con lăn tập bụng', 180000, 'Thiết bị'),
('Dây TRX tập đa năng', 450000, 'Thiết bị'),
('Quần đùi tập Gym Nam', 180000, 'Trang phục'),
('Áo thun thể thao Dry-fit', 150000, 'Trang phục'),
('Quần Legging Nữ', 220000, 'Trang phục'),
('Áo Bra thể thao', 190000, 'Trang phục'),
('Tất (vớ) thể thao cao cấp', 40000, 'Trang phục'),
('Băng đô cài tóc thể thao', 30000, 'Trang phục');