-- Thiết lập chuẩn tiếng Việt (UTF8mb4) cho toàn bộ Database
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS NhanSu (
    ma_nv VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO NhanSu (ma_nv, ho_ten, username, password, vai_tro) VALUES 
('NV01', 'Phan Huỳnh Phúc', 'admin', 'admin', 'Quản trị viên'),
('NV02', 'Huỳnh Ngọc Minh Thư', 'letan_lan', '123456', 'Nhân viên trực cổng');

CREATE TABLE IF NOT EXISTS HoiVien (
    ma_hv VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(255) NOT NULL,
    sdt VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    loai_the VARCHAR(50) DEFAULT 'Chưa kích hoạt',
    ngay_dang_ky VARCHAR(20) NOT NULL,
    diem_thuong INTEGER DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS GiaoDich (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_hv VARCHAR(50) NOT NULL,
    ten_goi VARCHAR(255) NOT NULL,
    so_tien INTEGER NOT NULL,
    phuong_thuc VARCHAR(50) NOT NULL,
    ngay_giao_dich VARCHAR(20) NOT NULL,
    ngay_het_han VARCHAR(20) NOT NULL,
    nguoi_thu_tien VARCHAR(100) NOT NULL,
    FOREIGN KEY(ma_hv) REFERENCES HoiVien(ma_hv) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS VeLeKhachVangLai (
    id INT PRIMARY KEY AUTO_INCREMENT,
    loai_ve VARCHAR(100) NOT NULL,
    so_tien INTEGER NOT NULL,
    ngay_ban VARCHAR(20) NOT NULL,
    nguoi_thu_tien VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS CheckInLog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_hv VARCHAR(50) NOT NULL,
    khu_vuc VARCHAR(100) NOT NULL,
    thoi_gian VARCHAR(50) NOT NULL,
    FOREIGN KEY(ma_hv) REFERENCES HoiVien(ma_hv) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) UNIQUE NOT NULL,
    points INTEGER DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS SanPham (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_sanpham VARCHAR(255) UNIQUE NOT NULL,
    gia INTEGER NOT NULL,
    category VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO SanPham (ten_sanpham, gia, category) VALUES 
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