const express = require('express');
const router = express.Router();

// LƯU Ý QUAN TRỌNG: Lấy db từ request (do server.js truyền vào), không tự require sqlite3 nữa
const db = (req) => req.db; 

// ================= API: ĐĂNG NHẬP VỚI DATABASE =================
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    db(req).get(`SELECT * FROM NhanSu WHERE username = ? AND password = ?`, [username, password], (err, user) => {
        if (err) return res.status(500).json({ success: false, error: 'Lỗi máy chủ cơ sở dữ liệu' });
        
        if (user) {
            res.json({ success: true, user: { id: user.ma_nv, name: user.ho_ten, role: user.vai_tro } });
        } else {
            res.status(401).json({ success: false, error: 'Sai tài khoản hoặc mật khẩu!' });
        }
    });
});

// ================= CÁC API NGHIỆP VỤ CHÍNH =================
router.post('/members/register', (req, res) => {
    const { hoTen, sdt } = req.body;
    const maHv = 'HV' + Date.now().toString().slice(-6); 
    const today = new Date().toISOString().split('T')[0];

    db(req).run(`INSERT INTO HoiVien (ma_hv, ho_ten, sdt, email, ngay_dang_ky) VALUES (?, ?, ?, ?, ?)`, 
    [maHv, hoTen, sdt, '', today], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, maHv, hoTen, message: 'Thành công' });
    });
});

router.post('/members/upgrade', (req, res) => {
    const { maHv, goiTap, phuongThuc, nguoiThuTien } = req.body;
    const today = new Date();
    
    let giaTien = 0, months = 1, tenGoi = '';
    if(goiTap === 'GYM_1M') { giaTien = 500000; months = 1; tenGoi = 'Gym Cơ Bản 1 Tháng'; }
    if(goiTap === 'GYM_3M') { giaTien = 1400000; months = 3; tenGoi = 'Gym Cơ Bản 3 Tháng'; }
    if(goiTap === 'VIP_6M') { giaTien = 2500000; months = 6; tenGoi = 'VIP 6 Tháng'; }
    if(goiTap === 'VIP_12M') { giaTien = 4500000; months = 12; tenGoi = 'VIP 1 Năm'; }

    const ngayMua = today.toISOString().split('T')[0];
    today.setMonth(today.getMonth() + months);
    const ngayHetHan = today.toISOString().split('T')[0];

    db(req).serialize(() => {
        db(req).run(`INSERT INTO GiaoDich (ma_hv, ten_goi, so_tien, phuong_thuc, ngay_giao_dich, ngay_het_han, nguoi_thu_tien) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [maHv, tenGoi, giaTien, phuongThuc, ngayMua, ngayHetHan, nguoiThuTien]);
                
        db(req).run(`UPDATE HoiVien SET loai_the = ? WHERE ma_hv = ?`, [tenGoi, maHv], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Thành công' });
        });
    });
});

router.post('/operations/ticket', (req, res) => {
    const { nguoiThuTien } = req.body;
    const today = new Date().toISOString().split('T')[0];

    db(req).run(`INSERT INTO VeLeKhachVangLai (loai_ve, so_tien, ngay_ban, nguoi_thu_tien) VALUES ('Vé Tập Gym 1 Ngày', 50000, ?, ?)`, 
    [today, nguoiThuTien], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Đã xuất vé lẻ thành công' });
    });
});

router.post('/operations/checkin', (req, res) => {
    const { maHv, khuVuc } = req.body;
    const now = new Date().toLocaleString('vi-VN');

    db(req).get(`SELECT * FROM HoiVien WHERE ma_hv = ?`, [maHv], (err, user) => {
        if (!user) return res.status(400).json({ error: 'Mã thẻ không tồn tại!' });
        if (user.loai_the === 'Chưa kích hoạt' || user.loai_the === 'Đã hủy') return res.status(403).json({ error: 'Thẻ chưa kích hoạt hoặc đã bị hủy!' });
        if (khuVuc === 'Khu Gym VIP' && !user.loai_the.includes('VIP')) return res.status(403).json({ error: 'Từ chối: Thẻ của bạn không có quyền vào Khu VIP!' });

        db(req).run(`INSERT INTO CheckInLog (ma_hv, khu_vuc, thoi_gian) VALUES (?, ?, ?)`, [maHv, khuVuc, now], () => {
            db(req).run(`UPDATE HoiVien SET diem_thuong = diem_thuong + 10 WHERE ma_hv = ?`, [maHv]);
            res.json({ success: true, user: user.ho_ten, message: `Mở cửa: Check-in ${khuVuc} thành công!` });
        });
    });
});

router.get('/dashboard/stats', (req, res) => {
    const todayStr = new Date().toISOString().split('T')[0]; 
    const currentMonthStr = todayStr.substring(0, 7); 
    const currentYearStr = todayStr.substring(0, 4); 

    db(req).all(`SELECT * FROM GiaoDich`, [], (err, giaoDichList) => {
        db(req).all(`SELECT * FROM VeLeKhachVangLai`, [], (err, veLeList) => {
            db(req).get(`SELECT COUNT(*) as totalMembers FROM HoiVien`, (err, r2) => {
                
                let stats = {
                    totalMembers: r2?.totalMembers || 0,
                    tongDoanhThu: 0, 
                    veLe: { dayCount: 0, dayRev: 0, monthCount: 0, monthRev: 0, yearCount: 0, yearRev: 0 },
                    goiTap: { dayCount: 0, dayRev: 0, monthCount: 0, monthRev: 0, yearCount: 0, yearRev: 0 }
                };

                (veLeList || []).forEach(v => {
                    if (v.ngay_ban === todayStr) { 
                        stats.tongDoanhThu += v.so_tien;
                        stats.veLe.dayCount++; 
                        stats.veLe.dayRev += v.so_tien; 
                    }
                    if (v.ngay_ban.startsWith(currentMonthStr)) { stats.veLe.monthCount++; stats.veLe.monthRev += v.so_tien; }
                    if (v.ngay_ban.startsWith(currentYearStr)) { stats.veLe.yearCount++; stats.veLe.yearRev += v.so_tien; }
                });

                (giaoDichList || []).forEach(g => {
                    if (g.ngay_giao_dich === todayStr) { 
                        stats.tongDoanhThu += g.so_tien;
                        stats.goiTap.dayCount++; 
                        stats.goiTap.dayRev += g.so_tien; 
                    }
                    if (g.ngay_giao_dich.startsWith(currentMonthStr)) { stats.goiTap.monthCount++; stats.goiTap.monthRev += g.so_tien; }
                    if (g.ngay_giao_dich.startsWith(currentYearStr)) { stats.goiTap.yearCount++; stats.goiTap.yearRev += g.so_tien; }
                });

                res.json(stats);
            });
        });
    });
});

router.get('/dashboard/filter', (req, res) => {
    const { timeValue } = req.query; 
    if (!timeValue) return res.status(400).json({ error: 'Thiếu tham số thời gian' });

    let likeQuery = timeValue + '%'; 
    let tienMat = 0;
    let chuyenKhoan = 0;

    db(req).all(`SELECT SUM(so_tien) as total FROM VeLeKhachVangLai WHERE ngay_ban LIKE ?`, [likeQuery], (err, vRes) => {
        tienMat += (vRes[0]?.total || 0);
        
        db(req).all(`SELECT phuong_thuc, SUM(so_tien) as total FROM GiaoDich WHERE ngay_giao_dich LIKE ? GROUP BY phuong_thuc`, [likeQuery], (err, gRes) => {
            (gRes || []).forEach(g => {
                if (g.phuong_thuc === 'Tiền mặt') tienMat += g.total;
                else chuyenKhoan += g.total;
            });
            
            res.json({ success: true, tong: tienMat + chuyenKhoan, tienMat: tienMat, chuyenKhoan: chuyenKhoan });
        });
    });
});

// ================= PHÂN TRANG DANH SÁCH HỘI VIÊN =================
router.get('/members/list', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db(req).serialize(() => {
        db(req).all(`SELECT * FROM HoiVien ORDER BY ngay_dang_ky DESC LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            
            db(req).get(`SELECT COUNT(*) as total FROM HoiVien`, (err, countRow) => {
                if (err) return res.status(500).json({ error: err.message });
                
                res.json({ 
                    members: rows, 
                    total: countRow.total,
                    totalPages: Math.ceil(countRow.total / limit),
                    currentPage: page
                });
            });
        });
    });
});

// --- CHI TIẾT HỘI VIÊN VÀ LỊCH SỬ GIAO DỊCH ---
router.get('/members/detail/:id', (req, res) => {
    const maHv = req.params.id;
    db(req).get(`SELECT * FROM HoiVien WHERE ma_hv = ?`, [maHv], (err, user) => {
        if (!user) return res.status(404).json({ error: 'Không tìm thấy hội viên' });
        
        db(req).all(`SELECT * FROM GiaoDich WHERE ma_hv = ? ORDER BY id DESC LIMIT 10`, [maHv], (err, gdList) => {
            res.json({ user, package: gdList });
        });
    });
});

router.post('/members/cancel', (req, res) => {
    db(req).run(`UPDATE HoiVien SET loai_the = 'Đã hủy' WHERE ma_hv = ?`, [req.body.maHv], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Đã hủy thẻ thành công!' });
    });
});

router.post('/members/update', (req, res) => {
    db(req).run(`UPDATE HoiVien SET ho_ten = ?, sdt = ? WHERE ma_hv = ?`, [req.body.hoTen, req.body.sdt, req.body.maHv], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Đã cập nhật thông tin khách hàng!' });
    });
});

router.post('/members/delete', (req, res) => {
    const { maHv } = req.body;
    db(req).serialize(() => {
        db(req).run(`DELETE FROM GiaoDich WHERE ma_hv = ?`, [maHv]);
        db(req).run(`DELETE FROM CheckInLog WHERE ma_hv = ?`, [maHv]);
        db(req).run(`DELETE FROM HoiVien WHERE ma_hv = ?`, [maHv], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Đã xóa vĩnh viễn khách hàng khỏi hệ thống!' });
        });
    });
});

// ================= GIAN HÀNG MUA SẮM VÀ TÍCH ĐIỂM =================
router.get('/shop/products', (req, res) => {
    db(req).all(`SELECT * FROM SanPham`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/checkout', (req, res) => {
    const { cartItems, phone, totalAmount, nguoiThuTien } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: 'Giỏ hàng đang trống' });
    }

    const tenCacSanPham = cartItems.map(item => `${item.ten_sanpham} (x${item.qty})`).join(', ');

    if (phone) {
        const earnedPoints = Math.floor(totalAmount / 10000);
        const today = new Date().toISOString().split('T')[0];

        db(req).get(`SELECT * FROM HoiVien WHERE sdt = ?`, [phone], (err, hoivien) => {
            if (err) return res.status(500).json({ success: false, message: 'Lỗi truy vấn cơ sở dữ liệu' });

            if (hoivien) {
                const maHv = hoivien.ma_hv;
                
                db(req).serialize(() => {
                    db(req).run(`UPDATE HoiVien SET diem_thuong = diem_thuong + ? WHERE ma_hv = ?`, [earnedPoints, maHv]);
                    db(req).run(`INSERT INTO GiaoDich (ma_hv, ten_goi, so_tien, phuong_thuc, ngay_giao_dich, ngay_het_han, nguoi_thu_tien) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                            [maHv, `Mua Shop: ${tenCacSanPham}`, totalAmount, 'Thanh toán Shop', today, today, nguoiThuTien || 'Hệ thống'], (err) => {
                        if (err) console.error("Lỗi ghi giao dịch shop:", err);
                        
                        return res.json({ 
                            success: true, 
                            earnedPoints: earnedPoints, 
                            totalPoints: hoivien.diem_thuong + earnedPoints, 
                            message: 'Thanh toán thành công' 
                        });
                    });
                });
            } else {
                db(req).get(`SELECT * FROM Customers WHERE phone = ?`, [phone], (err, row) => {
                    if (row) {
                        const newTotal = row.points + earnedPoints;
                        db(req).run(`UPDATE Customers SET points = ? WHERE phone = ?`, [newTotal, phone], () => {
                            return res.json({ success: true, earnedPoints: earnedPoints, totalPoints: newTotal, message: 'Thanh toán thành công' });
                        });
                    } else {
                        db(req).run(`INSERT INTO Customers (phone, points) VALUES (?, ?)`, [phone, earnedPoints], () => {
                            return res.json({ success: true, earnedPoints: earnedPoints, totalPoints: earnedPoints, message: 'Thanh toán thành công' });
                        });
                    }
                });
            }
        });
    } else {
        return res.json({ success: true, message: 'Thanh toán thành công' });
    }
});

// ================= API: CHUÔNG THÔNG BÁO =================
router.get('/notifications', (req, res) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; 
    
    const next3Days = new Date(today);
    next3Days.setDate(today.getDate() + 3);
    const next3DaysStr = next3Days.toISOString().split('T')[0];

    let notifications = [];

    // 1. Cảnh báo sắp hết hạn
    db(req).all(`SELECT * FROM GiaoDich WHERE ngay_het_han >= ? AND ngay_het_han <= ? AND ten_goi NOT LIKE 'Mua Shop%'`, 
    [todayStr, next3DaysStr], (err, expList) => {
        
        if (expList && expList.length > 0) {
            notifications.push({ 
                type: 'warning', icon: 'fa-triangle-exclamation', 
                text: `Cảnh báo: Có <b class="text-danger">${expList.length} hội viên</b> sắp hết hạn thẻ (trong 3 ngày tới).` 
            });
        }

        // 2. Tóm tắt quét thẻ hôm nay
        const vnDateStr = today.toLocaleDateString('vi-VN'); 
        const checkinLike = `%${vnDateStr}%`;
        db(req).get(`SELECT COUNT(*) as count FROM CheckInLog WHERE thoi_gian LIKE ?`, [checkinLike], (err, cRow) => {
            if (cRow && cRow.count > 0) {
                notifications.push({ 
                    type: 'info', icon: 'fa-qrcode', 
                    text: `Hôm nay đã có <b>${cRow.count} lượt</b> quét thẻ vào cổng.` 
                });
            }

            // 3. Tóm tắt doanh thu hôm nay
            db(req).get(`SELECT SUM(so_tien) as t1 FROM GiaoDich WHERE ngay_giao_dich = ?`, [todayStr], (err, gRow) => {
                db(req).get(`SELECT SUM(so_tien) as t2 FROM VeLeKhachVangLai WHERE ngay_ban = ?`, [todayStr], (err, vRow) => {
                    const totalRev = (gRow?.t1 || 0) + (vRow?.t2 || 0);
                    if (totalRev > 0) {
                        notifications.push({ 
                            type: 'success', icon: 'fa-sack-dollar', 
                            text: `Doanh thu trong ngày: <b class="text-success">${totalRev.toLocaleString()} ₫</b>.` 
                        });
                    }
                    res.json(notifications);
                });
            });
        });
    });
});

module.exports = router;