const ViewTemplates = {
    // ================= TRANG TỔNG QUAN (DASHBOARD) =================
    dashboard: (data) => {
        const todayStr = new Date().toISOString().split('T')[0]; 
        
        return `
        <div class="fade-in">
            <div class="row g-4 mb-4">
                <div class="col-xl-6 col-sm-6">
                    <div class="stat-card border-start border-success border-4 shadow-sm">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <p class="text-muted mb-0 fw-bold small text-uppercase">Doanh Thu Hôm Nay (Chốt Ca)</p>
                                <h2 class="fw-bolder text-dark mb-0 mt-2">${data.tongDoanhThu.toLocaleString()} ₫</h2>
                            </div>
                            <div class="bg-success bg-opacity-10 text-success d-flex justify-content-center align-items-center rounded-4 flex-shrink-0" style="width: 65px; height: 65px; font-size: 2rem;">
                                <i class="fa-solid fa-wallet"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 col-sm-6">
                    <div class="stat-card border-start border-primary border-4 shadow-sm">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <p class="text-muted mb-0 fw-bold small text-uppercase">Hội Viên Đã Đăng Ký</p>
                                <h2 class="fw-bolder text-dark mb-0 mt-2">${data.totalMembers} Người</h2>
                            </div>
                            <div class="bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center rounded-4 flex-shrink-0" style="width: 65px; height: 65px; font-size: 2rem;">
                                <i class="fa-solid fa-users"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <div class="col-lg-6">
                    <div class="stat-card h-100 shadow-sm border-0">
                        <h5 class="fw-bold mb-4 text-warning"><i class="fa-solid fa-ticket me-2"></i>Doanh Thu Khách Lẻ</h5>
                        <div class="table-responsive">
                            <table class="table table-borderless align-middle mb-0">
                                <thead class="border-bottom text-muted small text-uppercase">
                                    <tr>
                                        <th>Thời gian</th>
                                        <th class="text-center">Số lượt bán</th>
                                        <th class="text-end">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="py-3"><span class="fw-bold text-dark">Hôm nay</span></td>
                                        <td class="text-center py-3"><span class="badge bg-warning text-dark px-3 py-2 rounded-pill">${data.veLe.dayCount}</span></td>
                                        <td class="text-end fw-bold text-success fs-6 py-3">${data.veLe.dayRev.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3"><span class="fw-bold text-dark">Tháng này</span></td>
                                        <td class="text-center py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-pill">${data.veLe.monthCount}</span></td>
                                        <td class="text-end fw-bold text-success fs-6 py-3">${data.veLe.monthRev.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="border-bottom-0 py-3"><span class="fw-bold text-dark">Năm nay</span></td>
                                        <td class="border-bottom-0 text-center py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-pill">${data.veLe.yearCount}</span></td>
                                        <td class="border-bottom-0 text-end fw-bold text-success fs-6 py-3">${data.veLe.yearRev.toLocaleString()} ₫</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="stat-card h-100 shadow-sm border-0">
                        <h5 class="fw-bold mb-4 text-primary"><i class="fa-solid fa-address-card me-2"></i>Doanh Thu Hội Viên</h5>
                        <div class="table-responsive">
                            <table class="table table-borderless align-middle mb-0">
                                <thead class="border-bottom text-muted small text-uppercase">
                                    <tr>
                                        <th>Thời gian</th>
                                        <th class="text-center">Lượt đăng ký</th>
                                        <th class="text-end">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="py-3"><span class="fw-bold text-dark">Hôm nay</span></td>
                                        <td class="text-center py-3"><span class="badge bg-primary px-3 py-2 rounded-pill">${data.goiTap.dayCount}</span></td>
                                        <td class="text-end fw-bold text-success fs-6 py-3">${data.goiTap.dayRev.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="py-3"><span class="fw-bold text-dark">Tháng này</span></td>
                                        <td class="text-center py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-pill">${data.goiTap.monthCount}</span></td>
                                        <td class="text-end fw-bold text-success fs-6 py-3">${data.goiTap.monthRev.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="border-bottom-0 py-3"><span class="fw-bold text-dark">Năm nay</span></td>
                                        <td class="border-bottom-0 text-center py-3"><span class="badge bg-light text-dark border px-3 py-2 rounded-pill">${data.goiTap.yearCount}</span></td>
                                        <td class="border-bottom-0 text-end fw-bold text-success fs-6 py-3">${data.goiTap.yearRev.toLocaleString()} ₫</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-12">
                    <div class="stat-card shadow-sm border-0 bg-white">
                        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                            <h5 class="fw-bold text-dark mb-0"><i class="fa-solid fa-magnifying-glass-chart text-info me-2"></i>Tra Cứu & Đối Soát Doanh Thu</h5>
                        </div>
                        
                        <div class="row g-3 mb-4 bg-light p-3 rounded-3 border">
                            <div class="col-md-5">
                                <label class="fw-bold small mb-1 text-muted">Tra cứu theo Ngày (Chốt ca)</label>
                                <div class="input-group">
                                    <input type="date" id="filterDate" class="form-control" value="${todayStr}">
                                    <button class="btn btn-dark fw-bold px-3" onclick="AppController.searchRevenue('date')"><i class="fa-solid fa-search"></i> Lọc Ngày</button>
                                </div>
                            </div>
                            <div class="col-md-2 text-center d-flex align-items-center justify-content-center">
                                <span class="badge bg-secondary rounded-pill">HOẶC</span>
                            </div>
                            <div class="col-md-5">
                                <label class="fw-bold small mb-1 text-muted">Tra cứu theo Tháng (Tổng kết)</label>
                                <div class="input-group">
                                    <input type="month" id="filterMonth" class="form-control">
                                    <button class="btn btn-outline-dark fw-bold px-3" onclick="AppController.searchRevenue('month')"><i class="fa-solid fa-search"></i> Lọc Tháng</button>
                                </div>
                            </div>
                        </div>

                        <div id="revenueResultArea" class="row g-3 text-center pt-2">
                            <div class="col-12"><p class="text-muted">Đang tải dữ liệu hôm nay...</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // ================= TRANG ĐĂNG KÝ HỘI VIÊN =================
    register: () => `
        <div class="row g-4 fade-in align-items-stretch">
            <div class="col-lg-5">
                <div class="stat-card shadow-sm border-0 h-100 d-flex flex-column justify-content-center p-xl-5">
                    <div class="text-center mb-4">
                        <div class="avatar text-white rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3" style="width: 70px; height: 70px; font-size: 24px;">
                            <i class="fa-solid fa-user-plus"></i>
                        </div>
                        <h4 class="fw-bold text-dark">Tạo Hồ Sơ Khách Hàng</h4>
                        <p class="text-muted small">Khởi tạo mã định danh và cấp thẻ nhanh</p>
                    </div>
                    
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="fw-bold small mb-2 text-dark">Họ và Tên khách hàng <span class="text-danger">*</span></label>
                            <input type="text" id="regName" class="form-control form-control-lg bg-light">
                        </div>
                        
                        <div class="col-md-6">
                            <label class="fw-bold small mb-2 text-dark">Số điện thoại <span class="text-danger">*</span></label>
                            <input type="text" id="regPhone" class="form-control form-control-lg bg-light">
                        </div>

                        <div class="col-md-6">
                            <label class="fw-bold small mb-2 text-dark">Giới tính</label>
                            <select id="regGender" class="form-select form-select-lg bg-light text-muted">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label class="fw-bold small mb-2 text-dark">Email liên hệ (Tùy chọn)</label>
                            <input type="email" id="regEmail" class="form-control form-control-lg bg-light">
                        </div>
                    </div>
                    
                    <button onclick="AppController.registerMember()" class="btn btn-primary btn-lg w-100 fw-bold shadow-sm mt-4 rounded-pill">
                        Khởi Tạo & Thanh Toán <i class="fa-solid fa-arrow-right ms-2"></i>
                    </button>
                </div>
            </div>

            <div class="col-lg-7 d-none d-lg-block">
                <div class="stat-card border-0 shadow-sm p-0 overflow-hidden position-relative h-100" style="min-height: 600px; border-radius: 16px;">
                    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1500" alt="Gym" class="w-100 h-100 position-absolute" style="object-fit: cover;">
                    <div class="position-absolute top-0 start-0 w-100 h-100" style="background: linear-gradient(to right, #0f172a 0%, rgba(15, 23, 42, 0.3) 100%);"></div>
                    
                    <div class="position-relative z-1 p-5 d-flex flex-column justify-content-center h-100 text-white w-75">
                        <div class="mb-4">
                            <span class="badge bg-primary text-uppercase px-3 py-2 mb-3 shadow-sm rounded-pill">Thẻ Hội Viên Điện Tử</span>
                            <h2 class="fw-bolder mb-3 display-6 lh-sm">Đẳng cấp sống khỏe cùng <span class="text-primary">TITAN</span></h2>
                            <p class="text-white-50 fs-6">Trở thành hội viên chính thức để mở khóa toàn bộ tiện ích không giới hạn của phòng tập 5 sao.</p>
                        </div>
                        
                        <ul class="list-unstyled mb-0 mt-2">
                            <li class="mb-4 d-flex align-items-center">
                                <div class="bg-primary bg-opacity-25 p-3 rounded-circle me-3 d-flex justify-content-center align-items-center shadow-sm" style="width: 45px; height: 45px;">
                                    <i class="fa-solid fa-qrcode text-primary"></i>
                                </div>
                                <span class="fw-medium fs-6">Check-in nhận diện QR Code siêu tốc 3s</span>
                            </li>
                            <li class="mb-4 d-flex align-items-center">
                                <div class="bg-primary bg-opacity-25 p-3 rounded-circle me-3 d-flex justify-content-center align-items-center shadow-sm" style="width: 45px; height: 45px;">
                                    <i class="fa-solid fa-gift text-primary"></i>
                                </div>
                                <span class="fw-medium fs-6">Tích lũy điểm thưởng đổi quà sau mỗi lần tập</span>
                            </li>
                            <li class="mb-4 d-flex align-items-center">
                                <div class="bg-primary bg-opacity-25 p-3 rounded-circle me-3 d-flex justify-content-center align-items-center shadow-sm" style="width: 45px; height: 45px;">
                                    <i class="fa-solid fa-spa text-primary"></i>
                                </div>
                                <span class="fw-medium fs-6">Trải nghiệm miễn phí Khu vực Xông hơi & Relax</span>
                            </li>
                            <li class="d-flex align-items-center">
                                <div class="bg-primary bg-opacity-25 p-3 rounded-circle me-3 d-flex justify-content-center align-items-center shadow-sm" style="width: 45px; height: 45px;">
                                    <i class="fa-solid fa-snowflake text-primary"></i>
                                </div>
                                <span class="fw-medium fs-6">Tính năng bảo lưu thẻ khi công tác dài ngày</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,

    // ================= TRANG QUẦY THU NGÂN (POS) =================
    pos: () => `
        <div class="row g-4 fade-in">
            <div class="col-lg-5">
                <div class="stat-card h-100 border border-primary border-opacity-25 d-flex flex-column align-items-center text-center shadow-sm">
                    <h5 class="fw-bold text-primary border-bottom border-primary border-opacity-25 pb-3 mb-4 w-100 text-start">
                        <i class="fa-solid fa-id-card me-2"></i> Thẻ Hội Viên Hệ Thống
                    </h5>
                    
                    <div id="member-card-preview" class="p-4 bg-light rounded-4 border w-100 d-flex flex-column align-items-center justify-content-center" style="min-height: 350px;">
                        <i class="fa-solid fa-qrcode text-muted mb-3" style="font-size: 40px; opacity: 0.5;"></i>
                        <p class="text-muted mb-0">Nhập mã hội viên bên phải</p>
                        <p class="text-muted small">để tải dữ liệu thẻ</p>
                    </div>
                    
                    <button onclick="AppController.printCurrentCard()" class="btn btn-outline-primary fw-bold mt-4 w-100 py-2 rounded-pill" id="btnPrintCard" disabled>
                        <i class="fa-solid fa-print me-2"></i> In Thẻ Cứng Cho Khách
                    </button>
                </div>
            </div>

            <div class="col-lg-7">
                <div class="row g-4">
                    <div class="col-12">
                        <div class="stat-card bg-warning bg-opacity-10 border border-warning border-opacity-50 shadow-sm d-flex justify-content-between align-items-center p-4">
                            <div>
                                <h5 class="fw-bold text-dark mb-1"><i class="fa-solid fa-ticket-simple text-warning me-2"></i> Khách Lẻ (Vé Ngày)</h5>
                                <small class="text-muted">Tập vé ngày. Không cần tạo mã hồ sơ hệ thống.</small>
                            </div>
                            <button onclick="AppController.sellDailyTicket()" class="btn btn-warning fw-bold px-4 py-2 shadow-sm rounded-pill">Thu 50.000 ₫</button>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="stat-card border border-primary border-opacity-25 shadow-sm p-4">
                            <h5 class="fw-bold text-primary border-bottom border-primary border-opacity-25 pb-3 mb-4">
                                <i class="fa-solid fa-credit-card me-2"></i> Thanh Toán Gói Hội Viên
                            </h5>
                            
                            <div class="mb-3">
                                <label class="fw-bold small mb-2 text-dark">Mã thẻ hội viên</label>
                                <div class="input-group input-group-lg shadow-sm">
                                    <span class="input-group-text bg-light border-end-0"><i class="fa-solid fa-barcode text-muted"></i></span>
                                    <input type="text" id="billCode" class="form-control border-start-0 bg-light fw-bold text-primary fs-5" placeholder="Hệ thống tự động điền hoặc nhập tay..." oninput="AppController.previewMemberCard()">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="fw-bold small mb-2 text-dark">Cấp độ gói tập</label>
                                <select id="billPackage" class="form-select form-select-lg bg-light shadow-sm">
                                    <optgroup label="Gói Gym Cơ Bản">
                                        <option value="GYM_1M">Gym Cơ Bản (1 Tháng) - 500,000 ₫</option>
                                        <option value="GYM_3M">Gym Cơ Bản (3 Tháng) - 1,400,000 ₫</option>
                                    </optgroup>
                                    <optgroup label="Gói VIP Đặc Quyền">
                                        <option value="VIP_6M">VIP Yoga & Gym (6 Tháng) - 2,500,000 ₫</option>
                                        <option value="VIP_12M">VIP Thượng Hạng (1 Năm) - 4,500,000 ₫</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label class="fw-bold small mb-2 text-dark">Hình thức thanh toán</label>
                                <select id="billMethod" class="form-select form-select-lg bg-light shadow-sm">
                                    <option value="Tiền mặt">💵 Tiền mặt tại quầy</option>
                                    <option value="Chuyển khoản">💳 Chuyển khoản (Sacombank QR)</option>
                                </select>
                            </div>
                            
                            <button onclick="AppController.upgradePackage()" class="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-pill mt-2">
                                <i class="fa-solid fa-check-circle me-2"></i> Xác Nhận Thu Tiền
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // ================= TRANG QUẢN LÝ DỮ LIỆU HỘI VIÊN =================
    memberList: (data) => `
        <div class="fade-in">
            <div class="stat-card">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <h5 class="fw-bold mb-0"><i class="fa-solid fa-address-book text-primary me-2"></i> Hệ Thống Dữ Liệu Khách Hàng</h5>
                    <div class="input-group" style="max-width: 350px;">
                        <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-search text-muted"></i></span>
                        <input type="text" id="searchInput" onkeyup="AppController.searchMember()" class="form-control border-start-0 ps-0" placeholder="Tìm kiếm theo Tên hoặc Mã thẻ...">
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0" style="font-size:14px;" id="memberTable">
                        <thead class="table-light">
                            <tr>
                                <th>Mã thẻ</th>
                                <th>Họ và Tên</th>
                                <th>Số điện thoại</th>
                                <th>Gói / Loại thẻ</th>
                                <th class="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(data && data.length > 0) ? data.map(m => {
                                let badgeColor = m.loai_the.includes('VIP') ? 'bg-danger' : (m.loai_the === 'Chưa kích hoạt' ? 'bg-secondary' : 'bg-success');
                                if(m.loai_the === 'Đã hủy') badgeColor = 'bg-dark';
                                
                                return `
                                <tr class="member-row">
                                    <td class="member-id">
                                        <span class="badge bg-light text-dark border font-monospace px-2 py-1">${m.ma_hv}</span>
                                    </td>
                                    <td class="member-name">
                                        <b class="text-primary" style="cursor:pointer;" onclick="AppController.viewMemberDetail('${m.ma_hv}')">${m.ho_ten}</b>
                                    </td>
                                    <td class="font-monospace">${m.sdt}</td>
                                    <td>
                                        <span class="badge ${badgeColor} px-2 py-1">${m.loai_the}</span>
                                    </td>
                                    <td class="text-center">
                                        <div class="btn-group shadow-sm" role="group">
                                            <button type="button" class="btn btn-sm btn-outline-info" onclick="AppController.viewMemberDetail('${m.ma_hv}')" title="Xem chi tiết">
                                                <i class="fa-solid fa-eye"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-warning" onclick="AppController.editMember('${m.ma_hv}')" title="Sửa thông tin">
                                                <i class="fa-solid fa-pen"></i>
                                            </button>
                                            <button type="button" class="btn btn-sm btn-outline-danger" onclick="AppController.deleteMember('${m.ma_hv}')" title="Xóa khách hàng">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>`
                            }).join('') : '<tr><td colspan="5" class="text-center text-muted py-4">Chưa có dữ liệu hội viên</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    // ================= TRANG CỔNG KIỂM SOÁT QR (ĐÃ THIẾT KẾ LẠI KIỂU KIOSK) =================
    operations: () => `
        <div class="row g-4 fade-in">
            <!-- Cột Trái: Trạm Quét Thẻ (Kiosk) -->
            <div class="col-lg-5">
                <div class="stat-card shadow-sm border-0 h-100 d-flex flex-column text-center p-4">
                    <h5 class="fw-bold text-primary mb-3"><i class="fa-solid fa-expand me-2"></i>Khu Vực Quét Thẻ (Kiosk)</h5>
                    <p class="text-muted small mb-4">Đưa mã QR hội viên vào khu vực camera để nhận diện</p>

                    <!-- Khu vực camera giả lập thành màn hình thiết bị -->
                    <div class="position-relative mx-auto mb-4" style="width: 100%; max-width: 320px;">
                        <div id="qr-reader" class="overflow-hidden border border-3 border-primary rounded-4 shadow-sm" style="background: #000; min-height: 250px;"></div>
                        <!-- Viền khung nhắm giả lập -->
                        <div class="position-absolute top-0 start-0 w-25 h-25 border-start border-top border-4 border-primary rounded-top-4 ms-2 mt-2" style="pointer-events: none;"></div>
                        <div class="position-absolute bottom-0 end-0 w-25 h-25 border-end border-bottom border-4 border-primary rounded-bottom-4 me-2 mb-2" style="pointer-events: none;"></div>
                    </div>

                    <div class="mt-auto bg-light p-3 rounded-3 text-start border mb-3">
                        <label class="fw-bold small mb-2 text-dark"><i class="fa-solid fa-sliders me-2"></i>Thiết lập cổng trực:</label>
                        <select id="opZone" class="form-select form-select-lg border-0 shadow-sm fw-bold text-primary">
                            <option value="Khu Gym Cơ Bản">Phòng Gym Cơ Bản</option>
                            <option value="Khu Gym VIP">Phòng Gym Chỉ Dành Cho Hội Viên</option>
                        </select>
                    </div>

                    <!-- Ô nhập tay hỗ trợ USB -->
                    <div class="input-group">
                        <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-barcode text-muted"></i></span>
                        <input type="text" id="manualQrInput" class="form-control border-start-0 text-center" placeholder="Nhập mã ...">
                    </div>
                </div>
            </div>

            <!-- Cột Phải: Bảng điện tử Live Log -->
            <div class="col-lg-7">
                <div class="stat-card shadow-sm border-0 h-100 p-0 overflow-hidden d-flex flex-column">
                    <div class="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0"><i class="fa-solid fa-list-check me-2"></i>Luồng Vào Ra Trực Tiếp (Live)</h6>
                        <span class="badge bg-success" style="animation: pulse 2s infinite;">● Đang hoạt động</span>
                    </div>
                    
                    <div class="p-4 flex-grow-1 bg-light" id="checkin-log-container" style="max-height: 550px; overflow-y: auto;">
                        <!-- Trạng thái chờ -->
                        <div class="text-center text-muted mt-5 pt-4" id="empty-log-state">
                            <i class="fa-solid fa-door-open fa-4x mb-3 opacity-50"></i>
                            <h5 class="fw-bold">Cổng đang mở</h5>
                            <p class="small">Chưa có hội viên nào quét thẻ trong phiên này.</p>
                        </div>

                        <!-- Danh sách log -->
                        <ul id="liveCheckinList" class="list-unstyled mb-0 d-none">
                            <!-- Các lượt checkin sẽ được đẩy vào đây bằng JS -->
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Thêm animation nhấp nháy cho đèn báo hoạt động -->
        <style>
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.4; }
                100% { opacity: 1; }
            }
        </style>
    `
};