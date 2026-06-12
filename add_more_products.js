const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./qlclbtt.db');

const newProducts = [
    // --- THỰC PHẨM BỔ SUNG (Supplement) ---
    ['Creatine Monohydrate 300g', 350000, 'Supplement'],
    ['Glutamine Phục Hồi Cơ 250g', 420000, 'Supplement'],
    ['L-Carnitine Đốt Mỡ', 380000, 'Supplement'],
    ['Multivitamin Dành Cho Nam', 320000, 'Supplement'],
    ['Multivitamin Dành Cho Nữ', 320000, 'Supplement'],
    ['ZMA Phục Hồi Giấc Ngủ', 390000, 'Supplement'],
    ['Sữa Tăng Cơ Casein 2lbs', 850000, 'Supplement'],
    ['EAA Essential Amino Acids', 650000, 'Supplement'],
    ['Gói Bữa Ăn Thay Thế (Meal Replacement)', 80000, 'Supplement'],

    // --- ĐỒ UỐNG (Đồ uống) ---
    ['Nước Bò Húc Redbull', 15000, 'Đồ uống'],
    ['Nước Sting Dâu', 12000, 'Đồ uống'],
    ['Nước Aquarius 390ml', 12000, 'Đồ uống'],
    ['Nước Dừa Tươi Đóng Lon', 20000, 'Đồ uống'],
    ['Cà Phê Đen Đá Đóng Lon', 18000, 'Đồ uống'],

    // --- PHỤ KIỆN (Phụ kiện) ---
    ['Băng Bảo Vệ Đầu Gối (Cặp)', 150000, 'Phụ kiện'],
    ['Băng Bảo Vệ Cùi Chỏ (Cặp)', 120000, 'Phụ kiện'],
    ['Phấn Nước Chống Trượt (Liquid Chalk)', 95000, 'Phụ kiện'],
    ['Dây Kéo Lưng (Lifting Straps)', 110000, 'Phụ kiện'],
    ['Mũ Lưỡi Trai Thể Thao Titan', 120000, 'Phụ kiện'],
    ['Balo Dây Rút Tiện Lợi', 85000, 'Phụ kiện'],
    ['Băng Đô Chặn Mồ Hôi (Headband)', 45000, 'Phụ kiện'],
    ['Khóa Tạ Đòn Đôi (Cặp)', 65000, 'Phụ kiện'],

    // --- THIẾT BỊ (Thiết bị) ---
    ['Bóng Tập Yoga 65cm Cao Cấp', 180000, 'Thiết bị'],
    ['Đĩa Xoay Eo', 150000, 'Thiết bị'],
    ['Dây Kéo Kháng Lực Số 8', 90000, 'Thiết bị'],
    ['Bộ Dây Tập Mông Đùi (Mini Band)', 60000, 'Thiết bị'],
    ['Tạ Đeo Cổ Chân / Cổ Tay 1kg', 120000, 'Thiết bị'],

    // --- TRANG PHỤC (Trang phục) ---
    ['Áo Tank Top Tập Gym Nam', 130000, 'Trang phục'],
    ['Quần Jogger Thể Thao Nam', 220000, 'Trang phục'],
    ['Quần Legging Lửng Nữ', 150000, 'Trang phục'],
    ['Tất Thể Thao Chống Trượt (Set 3 Đôi)', 90000, 'Trang phục'],
    ['Áo Khoác Gió Thể Thao Mùa Đông', 280000, 'Trang phục']
];

db.serialize(() => {
    console.log("Đang thêm danh sách 30+ sản phẩm mới vào CSDL...");
    const stmt = db.prepare(`INSERT INTO SanPham (ten_sanpham, gia, category) VALUES (?, ?, ?)`);
    
    let count = 0;
    newProducts.forEach(product => {
        stmt.run(product, (err) => {
            if (err) {
                console.error("Lỗi thêm sản phẩm:", err.message);
            } else {
                count++;
            }
        });
    });
    
    stmt.finalize(() => {
        console.log(`✅ Hoàn tất! Đã thêm thành công ${count} sản phẩm vào Gian Hàng.`);
        db.close();
    });
});