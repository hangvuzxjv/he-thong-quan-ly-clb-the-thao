const express = require('express');
const router = express.Router();

// Lấy db (MySQL Pool) từ request
const db = (req) => req.db; 

// ================= API: ĐĂNG NHẬP VỚI DATABASE =================
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    db(req).query(`SELECT * FROM NhanSu WHERE username = ? AND password = ?`, [username, password], (err, results) => {
        if (err) {
            console.error(">>> LỖI LOGIN:", err.message);
            return res.status(500).json({ success: false, error: 'Lỗi máy chủ cơ sở dữ liệu' });
        }
        
        const user = results ? results[0] : null; 
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

    db(req).query(`INSERT INTO HoiVien (ma_hv, ho_ten, sdt, email, ngay_dang_ky) VALUES (?, ?, ?, ?, ?)`, 
    [maHv, hoTen, sdt, '', today], (err, results) => {
        if (err) {
            console.error(">>> LỖI REGISTER:", err.message);
            return res.status(500).json({ error: err.message });
        }
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

    db(req).query(`INSERT INTO GiaoDich (ma_hv, ten_goi, so_tien, phuong_thuc, ngay_giao_dich, ngay_het_han, nguoi_thu_tien) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [maHv, tenGoi, giaTien, phuongThuc, ngayMua, ngayHetHan, nguoiThuTien], (err) => {
        if (err) {
            console.error(">>> LỖI UPGRADE GIAODICH:", err.message);
            return res.status(500).json({ error: err.message });
        }
                
        db(req).query(`UPDATE HoiVien SET loai_the = ? WHERE ma_hv = ?`, [tenGoi, maHv], (err2) => {
            if (err2) {
                console.error(">>> LỖI UPGRADE UPDATE:", err2.message);
                return res.status(500).json({ error: err2.message });
            }
            res.json({ success: true, message: 'Thành công' });
        });
    });
});

router.post('/operations/ticket', (req, res) => {
    const { nguoiThuTien } = req.body;
    const today = new Date().toISOString().split('T')[0];

    db(req).query(`INSERT INTO VeLeKhachVangLai (loai_ve, so_tien, ngay_ban, nguoi_thu_tien) VALUES ('Vé Tập Gym 1 Ngày', 50000, ?, ?)`, 
    [today, nguoiThuTien], (err) => {
        if (err) {
            console.error(">>> LỖI TICKET:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Đã xuất vé lẻ thành công' });
    });
});

router.post('/operations/checkin', (req, res) => {
    const { maHv, khuVuc } = req.body;
    // Fix định dạng ngày tháng chuẩn cho MySQL
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db(req).query(`SELECT * FROM HoiVien WHERE ma_hv = ?`, [maHv], (err, results) => {
        if (err) {
            console.error(">>> LỖI CHECKIN SELECT:", err.message);
            return res.status(500).json({ error: 'Lỗi truy vấn DB' });
        }
        const user = results ? results[0] : null;
        if (!user) return res.status(400).json({ error: 'Mã thẻ không tồn tại!' });
        if (user.loai_the === 'Chưa kích hoạt' || user.loai_the === 'Đã hủy') return res.status(403).json({ error: 'Thẻ chưa kích hoạt hoặc đã bị hủy!' });
        if (khuVuc === 'Khu Gym VIP' && !user.loai_the.includes('VIP')) return res.status(403).json({ error: 'Từ chối: Thẻ của bạn không có quyền vào Khu VIP!' });

        db(req).query(`INSERT INTO CheckInLog (ma_hv, khu_vuc, thoi_gian) VALUES (?, ?, ?)`, [maHv, khuVuc, now], (err) => {
            if (err) console.error(">>> LỖI CHECKIN INSERT:", err.message);
            db(req).query(`UPDATE HoiVien SET diem_thuong = diem_thuong + 10 WHERE ma_hv = ?`, [maHv]);
            res.json({ success: true, user: user.ho_ten, message: `Mở cửa: Check-in ${khuVuc} thành công!` });
        });
    });
});

router.get('/dashboard/stats', (req, res) => {
    const todayStr = new Date().toISOString().split('T')[0]; 
    const currentMonthStr = todayStr.substring(0, 7); 
    const currentYearStr = todayStr.substring(0, 4); 

    db(req).query(`SELECT * FROM GiaoDich`, [], (err, giaoDichList) => {
        if (err) console.error(">>> LỖI STATS GIAODICH:", err.message);
        db(req).query(`SELECT * FROM VeLeKhachVangLai`, [], (err, veLeList) => {
            if (err) console.error(">>> LỖI STATS VELE:", err.message);
            db(req).query(`SELECT COUNT(*) as totalMembers FROM HoiVien`, (err, countResults) => {
                if (err) console.error(">>> LỖI STATS HOIVIEN:", err.message);
                const r2 = countResults ? countResults[0] : null;
                
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

    db(req).query(`SELECT SUM(so_tien) as total FROM VeLeKhachVangLai WHERE ngay_ban LIKE ?`, [likeQuery], (err, vRes) => {
        if (err) console.error(">>> LỖI FILTER VELE:", err.message);
        tienMat += (vRes && vRes[0]?.total) ? Number(vRes[0].total) : 0;
        
        db(req).query(`SELECT phuong_thuc, SUM(so_tien) as total FROM GiaoDich WHERE ngay_giao_dich LIKE ? GROUP BY phuong_thuc`, [likeQuery], (err, gRes) => {
            if (err) console.error(">>> LỖI FILTER GIAODICH:", err.message);
            (gRes || []).forEach(g => {
                if (g.phuong_thuc === 'Tiền mặt') tienMat += Number(g.total);
                else chuyenKhoan += Number(g.total);
            });
            
            res.json({ success: true, tong: tienMat + chuyenKhoan, tienMat: tienMat, chuyenKhoan: chuyenKhoan });
        });
    });
});

router.get('/members/list', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db(req).query(`SELECT * FROM HoiVien ORDER BY ngay_dang_ky DESC LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
        if (err) {
            console.error(">>> LỖI MEMBERS LIST:", err.message);
            return res.status(500).json({ error: err.message });
        }
        
        db(req).query(`SELECT COUNT(*) as total FROM HoiVien`, (err, countResults) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const countRow = countResults[0];
            res.json({ 
                members: rows, 
                total: countRow.total,
                totalPages: Math.ceil(countRow.total / limit),
                currentPage: page
            });
        });
    });
});

router.get('/members/detail/:id', (req, res) => {
    const maHv = req.params.id;
    db(req).query(`SELECT * FROM HoiVien WHERE ma_hv = ?`, [maHv], (err, results) => {
        const user = results ? results[0] : null;
        if (!user) return res.status(404).json({ error: 'Không tìm thấy hội viên' });
        
        db(req).query(`SELECT * FROM GiaoDich WHERE ma_hv = ? ORDER BY id DESC LIMIT 10`, [maHv], (err, gdList) => {
            res.json({ user, package: gdList });
        });
    });
});

router.post('/members/cancel', (req, res) => {
    db(req).query(`UPDATE HoiVien SET loai_the = 'Đã hủy' WHERE ma_hv = ?`, [req.body.maHv], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Đã hủy thẻ thành công!' });
    });
});

router.post('/members/update', (req, res) => {
    db(req).query(`UPDATE HoiVien SET ho_ten = ?, sdt = ? WHERE ma_hv = ?`, [req.body.hoTen, req.body.sdt, req.body.maHv], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Đã cập nhật thông tin khách hàng!' });
    });
});

router.post('/members/delete', (req, res) => {
    const { maHv } = req.body;
    db(req).query(`DELETE FROM GiaoDich WHERE ma_hv = ?`, [maHv], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db(req).query(`DELETE FROM CheckInLog WHERE ma_hv = ?`, [maHv], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            db(req).query(`DELETE FROM HoiVien WHERE ma_hv = ?`, [maHv], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: 'Đã xóa vĩnh viễn khách hàng khỏi hệ thống!' });
            });
        });
    });
});

router.get('/shop/products', (req, res) => {
    db(req).query(`SELECT * FROM SanPham`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/checkout', (req, res) => {
    const { cartItems, phone, totalAmount, nguoiThuTien } = req.body;
    if (!cartItems || cartItems.length === 0) return res.status(400).json({ success: false, message: 'Giỏ hàng đang trống' });

    const tenCacSanPham = cartItems.map(item => `${item.ten_sanpham} (x${item.qty})`).join(', ');

    if (phone) {
        const earnedPoints = Math.floor(totalAmount / 10000);
        const today = new Date().toISOString().split('T')[0];

        db(req).query(`SELECT * FROM HoiVien WHERE sdt = ?`, [phone], (err, results) => {
            const hoivien = results ? results[0] : null;
            if (hoivien) {
                const maHv = hoivien.ma_hv;
                db(req).query(`UPDATE HoiVien SET diem_thuong = diem_thuong + ? WHERE ma_hv = ?`, [earnedPoints, maHv], () => {
                    db(req).query(`INSERT INTO GiaoDich (ma_hv, ten_goi, so_tien, phuong_thuc, ngay_giao_dich, ngay_het_han, nguoi_thu_tien) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                    [maHv, `Mua Shop: ${tenCacSanPham}`, totalAmount, 'Thanh toán Shop', today, today, nguoiThuTien || 'Hệ thống'], (err) => {
                        return res.json({ success: true, message: 'Thanh toán thành công' });
                    });
                });
            } else {
                db(req).query(`SELECT * FROM Customers WHERE phone = ?`, [phone], (err, custResults) => {
                    const row = custResults ? custResults[0] : null;
                    if (row) {
                        db(req).query(`UPDATE Customers SET points = points + ? WHERE phone = ?`, [earnedPoints, phone], () => {
                            return res.json({ success: true, message: 'Thanh toán thành công' });
                        });
                    } else {
                        db(req).query(`INSERT INTO Customers (phone, points) VALUES (?, ?)`, [phone, earnedPoints], () => {
                            return res.json({ success: true, message: 'Thanh toán thành công' });
                        });
                    }
                });
            }
        });
    } else {
        return res.json({ success: true, message: 'Thanh toán thành công' });
    }
});

router.get('/notifications', (req, res) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; 
    const next3Days = new Date(today);
    next3Days.setDate(today.getDate() + 3);
    const next3DaysStr = next3Days.toISOString().split('T')[0];

    let notifications = [];

    db(req).query(`SELECT * FROM GiaoDich WHERE ngay_het_han >= ? AND ngay_het_han <= ? AND ten_goi NOT LIKE 'Mua Shop%'`, 
    [todayStr, next3DaysStr], (err, expList) => {
        if (expList && expList.length > 0) {
            notifications.push({ type: 'warning', icon: 'fa-triangle-exclamation', text: `Cảnh báo: Có ${expList.length} hội viên sắp hết hạn thẻ.` });
        }
        db(req).query(`SELECT COUNT(*) as count FROM CheckInLog WHERE thoi_gian LIKE ?`, [`%${todayStr}%`], (err, countResults) => {
            const cRow = countResults ? countResults[0] : null;
            if (cRow && cRow.count > 0) {
                notifications.push({ type: 'info', icon: 'fa-qrcode', text: `Hôm nay đã có ${cRow.count} lượt quét thẻ.` });
            }
            res.json(notifications);
        });
    });
});

module.exports = router;