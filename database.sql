-- ============================================================
-- DATABASE: HỆ THỐNG QUẢN LÝ CLB THỂ THAO / PHÒNG GYM
-- Mô tả: Quản lý nhân sự, hội viên, giao dịch gói tập,
--        vé lẻ khách vãng lai, lịch sử check-in và shop bán đồ
-- ============================================================

-- 1. BẢNG NHÂN SỰ
-- Lưu thông tin tài khoản đăng nhập của nhân viên hệ thống
-- (admin, lễ tân...) dùng để phân quyền truy cập phần mềm
CREATE TABLE IF NOT EXISTS NhanSu (
    ma_nv TEXT PRIMARY KEY,       -- Mã nhân viên (khóa chính)
    ho_ten TEXT NOT NULL,         -- Họ tên nhân viên
    username TEXT UNIQUE NOT NULL,-- Tên đăng nhập (duy nhất)
    password TEXT NOT NULL,       -- Mật khẩu đăng nhập
    vai_tro TEXT NOT NULL         -- Vai trò: Quản trị viên / Nhân viên trực cổng...
);

-- Dữ liệu mẫu: 1 admin và 1 nhân viên trực cổng
INSERT OR IGNORE INTO NhanSu (ma_nv, ho_ten, username, password, vai_tro) VALUES 
('NV01', 'Phan Huỳnh Phúc', 'admin', 'admin', 'Quản trị viên'),
('NV02', 'Huỳnh Ngọc Minh Thư', 'letan_lan', '123456', 'Nhân viên trực cổng');

-- 2. BẢNG HỘI VIÊN
-- Lưu thông tin khách hàng đã đăng ký làm hội viên CLB
CREATE TABLE IF NOT EXISTS HoiVien (
    ma_hv TEXT PRIMARY KEY,                       -- Mã hội viên (khóa chính)
    ho_ten TEXT NOT NULL,                         -- Họ tên hội viên
    sdt TEXT NOT NULL,                            -- Số điện thoại liên hệ
    email TEXT,                                   -- Email (có thể để trống)
    loai_the TEXT DEFAULT 'Chưa kích hoạt',       -- Loại thẻ thành viên hiện tại
    ngay_dang_ky TEXT NOT NULL,                   -- Ngày đăng ký làm hội viên
    diem_thuong INTEGER DEFAULT 0                 -- Điểm tích lũy/thưởng của hội viên
);

-- 3. BẢNG GIAO DỊCH
-- Gộp chung lịch sử mua gói tập và mua hàng tại shop của hội viên
CREATE TABLE IF NOT EXISTS GiaoDich (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID giao dịch tự tăng
    ma_hv TEXT NOT NULL,                   -- Hội viên thực hiện giao dịch
    ten_goi TEXT NOT NULL,                 -- Tên gói tập / sản phẩm đã mua
    so_tien INTEGER NOT NULL,              -- Số tiền giao dịch
    phuong_thuc TEXT NOT NULL,             -- Phương thức thanh toán (tiền mặt, chuyển khoản...)
    ngay_giao_dich TEXT NOT NULL,          -- Ngày thực hiện giao dịch
    ngay_het_han TEXT NOT NULL,            -- Ngày hết hạn gói (nếu có)
    nguoi_thu_tien TEXT NOT NULL,          -- Nhân viên thu tiền giao dịch
    FOREIGN KEY(ma_hv) REFERENCES HoiVien(ma_hv) ON DELETE CASCADE
    -- Khi xóa hội viên thì các giao dịch liên quan cũng bị xóa theo
);

-- 4. BẢNG VÉ LẺ (KHÁCH VÃNG LAI)
-- Lưu thông tin bán vé lẻ cho khách không phải hội viên
CREATE TABLE IF NOT EXISTS VeLeKhachVangLai (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID vé tự tăng
    loai_ve TEXT NOT NULL,                 -- Loại vé (ngày, buổi tập...)
    so_tien INTEGER NOT NULL,              -- Giá vé
    ngay_ban TEXT NOT NULL,                -- Ngày bán vé
    nguoi_thu_tien TEXT NOT NULL           -- Nhân viên thu tiền
);

-- 5. BẢNG LỊCH SỬ CHECK-IN
-- Ghi nhận mỗi lần hội viên ra/vào các khu vực tập luyện
CREATE TABLE IF NOT EXISTS CheckInLog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID lượt check-in tự tăng
    ma_hv TEXT NOT NULL,                   -- Hội viên check-in
    khu_vuc TEXT NOT NULL,                 -- Khu vực check-in (phòng gym, hồ bơi...)
    thoi_gian TEXT NOT NULL,               -- Thời gian check-in
    FOREIGN KEY(ma_hv) REFERENCES HoiVien(ma_hv) ON DELETE CASCADE
);

-- 6. BẢNG KHÁCH HÀNG TÍCH ĐIỂM VÃNG LAI
-- Dành cho khách mua hàng ở shop nhưng không phải hội viên CLB,
-- vẫn được tích điểm theo số điện thoại
CREATE TABLE IF NOT EXISTS Customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID khách hàng tự tăng
    phone TEXT UNIQUE NOT NULL,            -- Số điện thoại (duy nhất, dùng để định danh khách)
    points INTEGER DEFAULT 0               -- Điểm tích lũy của khách vãng lai
);

-- 7. BẢNG SẢN PHẨM (GIAN HÀNG)
-- Danh mục sản phẩm bán tại shop của CLB (thực phẩm bổ sung, phụ kiện...)
CREATE TABLE IF NOT EXISTS SanPham (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID sản phẩm tự tăng
    ten_sanpham TEXT NOT NULL,             -- Tên sản phẩm
    gia INTEGER NOT NULL,                  -- Giá bán
    category TEXT                          -- Phân loại (Supplement, Phụ kiện, Thiết bị, Trang phục...)
);

-- Dữ liệu mẫu: danh sách sản phẩm có sẵn trong shop
INSERT OR IGNORE INTO SanPham (ten_sanpham, gia, category) VALUES 
('Pre-workout C4', 550000, 'Supplement'),
('BCAA Xtend', 450000, 'Supplement'),
('Mass Gainer Serious', 850000, 'Supplement'),
('Thảm tập Yoga Cao Cấp', 250000, 'Phụ kiện'),
('Dây nhảy thể lực', 120000, 'Phụ kiện'),
('Băng quấn bảo vệ cổ tay', 85000, 'Phụ kiện'),
('Bình lắc Shaker 700ml', 95000, 'Phụ kiện'),
('Cân điện tử sức khỏe', 320000, 'Thiết bị'),
('Quần đùi tập Gym Nam', 180000, 'Trang phục'),
('Đai lưng tập tạ', 290000, 'Phụ kiện');
