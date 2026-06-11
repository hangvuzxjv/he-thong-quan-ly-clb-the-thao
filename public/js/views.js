const ViewTemplates = {
    // ================= TRANG TỔNG QUAN (DASHBOARD) =================
    dashboard: (data) => {
        const todayStr = new Date().toISOString().split('T')[0]; 
        
        return `
        <div class="fade-in p-2 p-md-3">
            <div class="row g-3 g-md-4 mb-4">
                <div class="col-12 col-md-6">
                    <div class="stat-card border-start border-success border-4 shadow-sm h-100 p-3 p-md-4 bg-white rounded-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <p class="text-muted mb-0 fw-bold small text-uppercase">Doanh Thu Hôm Nay</p>
                                <h3 class="fw-bolder text-dark mb-0 mt-2">${data.tongDoanhThu.toLocaleString()} ₫</h3>
                            </div>
                            <div class="bg-success bg-opacity-10 text-success d-flex justify-content-center align-items-center rounded-circle flex-shrink-0" style="width: 55px; height: 55px; font-size: 1.5rem;">
                                <i class="fa-solid fa-wallet"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="stat-card border-start border-primary border-4 shadow-sm h-100 p-3 p-md-4 bg-white rounded-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <p class="text-muted mb-0 fw-bold small text-uppercase">Hội Viên Đăng Ký</p>
                                <h3 class="fw-bolder text-dark mb-0 mt-2">${data.totalMembers} Người</h3>
                            </div>
                            <div class="bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center rounded-circle flex-shrink-0" style="width: 55px; height: 55px; font-size: 1.5rem;">
                                <i class="fa-solid fa-users"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3 g-md-4 mb-4">
                <div class="col-lg-6">
                    <div class="stat-card h-100 shadow-sm border-0 bg-white rounded-4 p-3 p-md-4">
                        <h6 class="fw-bold mb-3 text-warning"><i class="fa-solid fa-ticket me-2"></i>Doanh Thu Khách Lẻ</h6>
                        <div class="table-responsive">
                            <table class="table table-borderless align-middle mb-0" style="min-width: 300px;">
                                <thead class="border-bottom text-muted small text-uppercase">
                                    <tr>
                                        <th>Thời gian</th>
                                        <th class="text-center">Số lượt</th>
                                        <th class="text-end">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="py-2"><span class="fw-bold text-dark small">Hôm nay</span></td>
                                        <td class="text-center py-2"><span class="badge bg-warning text-dark px-2 py-1 rounded-pill">${data.veLe.dayCount}</span></td>
                                        <td class="text-end fw-bold text-success small py-2">${data.veLe.dayRev.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="py-2"><span class="fw-bold text-dark small">Tháng này</span></td>
                                        <td class="text-center py-2"><span class="badge bg-light text-dark border px-2 py-1 rounded-pill">${data.veLe.monthCount}</span></td>
                                        <td class="text-end fw-bold text-success small py-2">${data.veLe.monthRev.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="border-bottom-0 py-2"><span class="fw-bold text-dark small">Năm nay</span></td>
                                        <td class="border-bottom-0 text-center py-2"><span class="badge bg-light text-dark border px-2 py-1 rounded-pill">${data.veLe.yearCount}</span></td>
                                        <td class="border-bottom-0 text-end fw-bold text-success small py-2">${data.veLe.yearRev.toLocaleString()} ₫</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="stat-card h-100 shadow-sm border-0 bg-white rounded-4 p-3 p-md-4">
                        <h6 class="fw-bold mb-3 text-primary"><i class="fa-solid fa-address-card me-2"></i>Doanh Thu Hội Viên</h6>
                        <div class="table-responsive">
                            <table class="table table-borderless align-middle mb-0" style="min-width: 300px;">
                                <thead class="border-bottom text-muted small text-uppercase">
                                    <tr>
                                        <th>Thời gian</th>
                                        <th class="text-center">Đăng ký</th>
                                        <th class="text-end">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="py-2"><span class="fw-bold text-dark small">Hôm nay</span></td>
                                        <td class="text-center py-2"><span class="badge bg-primary px-2 py-1 rounded-pill">${data.goiTap.dayCount}</span></td>
                                        <td class="text-end fw-bold text-success small py-2">${data.goiTap.dayRev.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="py-2"><span class="fw-bold text-dark small">Tháng này</span></td>
                                        <td class="text-center py-2"><span class="badge bg-light text-dark border px-2 py-1 rounded-pill">${data.goiTap.monthCount}</span></td>
                                        <td class="text-end fw-bold text-success small py-2">${data.goiTap.monthRev.toLocaleString()} ₫</td>
                                    </tr>
                                    <tr>
                                        <td class="border-bottom-0 py-2"><span class="fw-bold text-dark small">Năm nay</span></td>
                                        <td class="border-bottom-0 text-center py-2"><span class="badge bg-light text-dark border px-2 py-1 rounded-pill">${data.goiTap.yearCount}</span></td>
                                        <td class="border-bottom-0 text-end fw-bold text-success small py-2">${data.goiTap.yearRev.toLocaleString()} ₫</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-12">
                    <div class="stat-card shadow-sm border-0 bg-white rounded-4 p-3 p-md-4">
                        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <h6 class="fw-bold text-dark mb-0"><i class="fa-solid fa-magnifying-glass-chart text-info me-2"></i>Tra Cứu Đối Soát</h6>
                        </div>
                        
                        <div class="row g-3 mb-3 bg-light p-3 rounded-4 border align-items-end mx-0">
                            <div class="col-12 col-md-5 px-0 px-md-2">
                                <label class="fw-bold small mb-1 text-muted">Theo Ngày</label>
                                <div class="input-group">
                                    <input type="date" id="filterDate" class="form-control border-0 shadow-sm" value="${todayStr}">
                                    <button class="btn btn-dark fw-bold px-3 shadow-sm" onclick="AppController.searchRevenue('date')"><i class="fa-solid fa-search"></i></button>
                                </div>
                            </div>
                            <div class="col-12 col-md-2 text-center py-1 py-md-0">
                                <span class="badge bg-secondary rounded-pill small">HOẶC</span>
                            </div>
                            <div class="col-12 col-md-5 px-0 px-md-2">
                                <label class="fw-bold small mb-1 text-muted">Theo Tháng</label>
                                <div class="input-group">
                                    <input type="month" id="filterMonth" class="form-control border-0 shadow-sm">
                                    <button class="btn btn-outline-dark fw-bold px-3 bg-white shadow-sm" onclick="AppController.searchRevenue('month')"><i class="fa-solid fa-search"></i></button>
                                </div>
                            </div>
                        </div>

                        <div id="revenueResultArea" class="row g-3 text-center pt-2">
                            <div class="col-12"><p class="text-muted small">Đang tải dữ liệu...</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // ================= TRANG ĐĂNG KÝ HỘI VIÊN =================
    register: () => `
        <div class="fade-in p-2 p-md-3">
            <div class="card shadow-sm border-0 overflow-hidden rounded-4" style="min-height: 550px;">
                <div class="row g-0 h-100">
                    
                    <div class="col-lg-5 p-4 p-xl-5 bg-white d-flex flex-column justify-content-center">
                        <div class="text-center mb-4">
                            <div class="avatar bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3" style="width: 60px; height: 60px; font-size: 24px;">
                                <i class="fa-solid fa-user-plus"></i>
                            </div>
                            <h5 class="fw-bold text-dark">Tạo Hồ Sơ Khách Hàng</h5>
                            <p class="text-muted small mb-0">Khởi tạo mã định danh và cấp thẻ nhanh</p>
                        </div>
                        
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="fw-bold small mb-1 text-muted">Họ và Tên <span class="text-danger">*</span></label>
                                <input type="text" id="regName" class="form-control form-control-lg bg-light border-0 shadow-sm fs-6">
                            </div>
                            
                            <div class="col-12 col-md-6">
                                <label class="fw-bold small mb-1 text-muted">Số điện thoại <span class="text-danger">*</span></label>
                                <input type="tel" id="regPhone" class="form-control form-control-lg bg-light border-0 shadow-sm fs-6">
                            </div>

                            <div class="col-12 col-md-6">
                                <label class="fw-bold small mb-1 text-muted">Giới tính</label>
                                <select id="regGender" class="form-select form-select-lg bg-light border-0 text-dark shadow-sm fs-6">
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div class="col-12">
                                <label class="fw-bold small mb-1 text-muted">Email (Tùy chọn)</label>
                                <input type="email" id="regEmail" class="form-control form-control-lg bg-light border-0 shadow-sm fs-6">
                            </div>
                        </div>
                        
                        <button onclick="AppController.registerMember()" class="btn btn-primary btn-lg w-100 fw-bold shadow-sm mt-4 rounded-3 fs-6 py-3">
                            Khởi Tạo & Thanh Toán <i class="fa-solid fa-arrow-right ms-2"></i>
                        </button>
                    </div>

                    <div class="col-lg-7 d-none d-lg-block position-relative">
                        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1500" alt="Gym" class="w-100 h-100 position-absolute" style="object-fit: cover; left: 0; top: 0;">
                        <div class="position-absolute top-0 start-0 w-100 h-100" style="background: linear-gradient(to right, #0f172a 0%, rgba(15, 23, 42, 0.5) 100%);"></div>
                        
                        <div class="position-relative z-1 p-5 d-flex flex-column justify-content-center h-100 text-white w-100">
                            <div class="mb-4">
                                <span class="badge bg-primary text-uppercase px-3 py-2 mb-3 shadow-sm rounded-pill">Thẻ Hội Viên Điện Tử</span>
                                <h2 class="fw-bolder mb-2 display-6 lh-sm">Đẳng cấp sống khỏe<br>cùng <span class="text-primary">TITAN</span></h2>
                            </div>
                            
                            <ul class="list-unstyled mb-0 mt-2">
                                <li class="mb-3 d-flex align-items-center">
                                    <div class="bg-primary bg-opacity-25 p-2 rounded-circle me-3 d-flex justify-content-center align-items-center shadow-sm flex-shrink-0" style="width: 40px; height: 40px;">
                                        <i class="fa-solid fa-qrcode text-primary"></i>
                                    </div>
                                    <span class="fw-medium small">Check-in nhận diện QR Code siêu tốc 3s</span>
                                </li>
                                <li class="mb-3 d-flex align-items-center">
                                    <div class="bg-primary bg-opacity-25 p-2 rounded-circle me-3 d-flex justify-content-center align-items-center shadow-sm flex-shrink-0" style="width: 40px; height: 40px;">
                                        <i class="fa-solid fa-gift text-primary"></i>
                                    </div>
                                    <span class="fw-medium small">Tích lũy điểm thưởng đổi quà</span>
                                </li>
                                <li class="d-flex align-items-center">
                                    <div class="bg-primary bg-opacity-25 p-2 rounded-circle me-3 d-flex justify-content-center align-items-center shadow-sm flex-shrink-0" style="width: 40px; height: 40px;">
                                        <i class="fa-solid fa-spa text-primary"></i>
                                    </div>
                                    <span class="fw-medium small">Trải nghiệm miễn phí Xông hơi & Relax</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `,

    // ================= TRANG QUẦY THU NGÂN (POS) =================
    pos: () => `
        <div class="row g-3 g-md-4 fade-in p-2 p-md-3">
            <div class="col-lg-5">
                <div class="stat-card h-100 bg-white rounded-4 border-0 d-flex flex-column align-items-center text-center shadow-sm p-3 p-md-4">
                    <h6 class="fw-bold text-primary border-bottom pb-3 mb-4 w-100 text-start">
                        <i class="fa-solid fa-id-card me-2"></i> Thẻ Hội Viên Hệ Thống
                    </h6>
                    
                    <div id="member-card-preview" class="p-4 bg-light rounded-4 border w-100 d-flex flex-column align-items-center justify-content-center" style="min-height: 250px;">
                        <i class="fa-solid fa-qrcode text-muted mb-3" style="font-size: 40px; opacity: 0.5;"></i>
                        <p class="text-muted mb-0 small">Nhập mã hội viên bên phải</p>
                    </div>
                    
                    <button onclick="AppController.printCurrentCard()" class="btn btn-outline-primary fw-bold mt-4 w-100 py-2 rounded-3 fs-6" id="btnPrintCard" disabled>
                        <i class="fa-solid fa-print me-2"></i> In Thẻ Cứng
                    </button>
                </div>
            </div>

            <div class="col-lg-7">
                <div class="row g-3 g-md-4">
                    <div class="col-12">
                        <div class="stat-card bg-warning bg-opacity-10 border border-warning border-opacity-50 shadow-sm rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center p-3 p-md-4 gap-3">
                            <div>
                                <h6 class="fw-bold text-dark mb-1"><i class="fa-solid fa-ticket-simple text-warning me-2"></i> Khách Lẻ (Vé Ngày)</h6>
                                <small class="text-muted">Tập vé ngày. Không cần mã hồ sơ.</small>
                            </div>
                            <button onclick="AppController.sellDailyTicket()" class="btn btn-warning fw-bold px-4 py-2 shadow-sm rounded-3 w-100 w-md-auto">Thu 50.000 ₫</button>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="stat-card bg-white border-0 shadow-sm rounded-4 p-3 p-md-4">
                            <h6 class="fw-bold text-primary border-bottom pb-3 mb-4">
                                <i class="fa-solid fa-credit-card me-2"></i> Thanh Toán Gói Hội Viên
                            </h6>
                            
                            <div class="mb-3">
                                <label class="fw-bold small mb-1 text-muted">Mã thẻ hội viên</label>
                                <div class="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                                    <span class="input-group-text bg-light border-0"><i class="fa-solid fa-barcode text-muted"></i></span>
                                    <input type="text" id="billCode" class="form-control border-0 bg-light fw-bold text-primary fs-6" placeholder="Nhập mã..." oninput="AppController.previewMemberCard()">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label class="fw-bold small mb-1 text-muted">Cấp độ gói tập</label>
                                <select id="billPackage" class="form-select form-select-lg bg-light border-0 shadow-sm rounded-3 fs-6">
                                <optgroup label="Gói Gym Cơ Bản">
                                    <option value="GYM_1M" data-price="500000">Gym Cơ Bản (1 Tháng) - 500k ₫</option>
                                    <option value="GYM_3M" data-price="1400000">Gym Cơ Bản (3 Tháng) - 1.4tr ₫</option>
                                </optgroup>
                                <optgroup label="Gói VIP Đặc Quyền">
                                    <option value="VIP_6M" data-price="2500000">VIP Yoga & Gym (6T) - 2.5tr ₫</option>
                                    <option value="VIP_12M" data-price="4500000">VIP Thượng Hạng (1N) - 4.5tr ₫</option>
                                </optgroup>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label class="fw-bold small mb-1 text-muted">Hình thức thanh toán</label>
                                <select id="billMethod" class="form-select form-select-lg bg-light border-0 shadow-sm rounded-3 fs-6">
                                    <option value="Tiền mặt">💵 Tiền mặt tại quầy</option>
                                    <option value="Chuyển khoản">💳 Chuyển khoản (Mã QR)</option>
                                </select>
                            </div>
                            
                            <button onclick="AppController.upgradePackage()" class="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3 py-3 mt-2 fs-6">
                                <i class="fa-solid fa-check-circle me-2"></i> Xác Nhận Thu Tiền
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // ================= 1. DANH BẠ HỘI VIÊN =================
    'danh-ba': (data, currentPage, totalPages) => `
    <div class="fade-in p-2 p-md-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
            <h5 class="fw-bold text-primary mb-0">Danh bạ hội viên</h5>
            <div class="input-group shadow-sm rounded-3 overflow-hidden w-100" style="max-width: 400px;">
                <span class="input-group-text bg-white border-0"><i class="fa-solid fa-search text-primary"></i></span>
                <input type="text" id="searchInput" class="form-control border-0" placeholder="Tìm tên, SĐT, mã thẻ..." onkeyup="AppController.searchMember()">
            </div>
        </div>
        
        <div class="table-responsive bg-white shadow-sm rounded-4 border-0">
            <table class="table table-hover align-middle mb-0" style="min-width: 500px;">
                <thead class="table-light"><tr><th class="ps-4">Mã thẻ</th><th>Họ tên</th><th>SĐT</th></tr></thead>
                <tbody>
                    ${(data || []).map(m => `
                        <tr class="member-row">
                            <td class="member-id fw-bold text-secondary small ps-4">${m.ma_hv}</td>
                            <td class="member-name text-primary fw-bold" style="cursor:pointer;" onclick="AppController.viewMemberDetail('${m.ma_hv}')">${m.ho_ten}</td>
                            <td class="member-phone small">${m.sdt}</td>
                        </tr>`).join('')}
                </tbody>
            </table>
        </div>
        
        <nav class="mt-4 d-flex justify-content-center justify-content-md-start">
            <ul class="pagination pagination-sm shadow-sm rounded-3 overflow-hidden">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link text-dark fw-bold border-0" href="#" onclick="AppController.loadPage('danh-ba', ${currentPage - 1})">Trước</a>
                </li>
                <li class="page-item disabled"><a class="page-link bg-light text-primary fw-bold px-3 border-0">${currentPage} / ${totalPages}</a></li>
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link text-dark fw-bold border-0" href="#" onclick="AppController.loadPage('danh-ba', ${currentPage + 1})">Sau</a>
                </li>
            </ul>
        </nav>
    </div>`,

    // ================= 2. GIAN HÀNG MUA SẮM (SHOP) =================
    shop: () => `
    <div class="fade-in p-2 p-md-3 row g-3 g-md-4">
        <div class="col-12 col-lg-8">
            <h5 class="fw-bold text-primary mb-3"><i class="fa-solid fa-store me-2"></i>Gian hàng mua sắm</h5>
            <div id="shopProducts" class="row g-3"></div>
        </div>
        <div class="col-12 col-lg-4">
            <div class="card shadow-sm p-3 border-0 bg-white rounded-4 sticky-lg-top" style="top: 20px;">
                <h6 class="border-bottom pb-2 mb-3 fw-bold text-dark"><i class="fa-solid fa-cart-shopping me-2 text-primary"></i>Giỏ hàng</h6>
                <ul id="cartItemsList" class="list-group list-group-flush mb-3 border rounded-3 bg-light" style="max-height: 250px; overflow-y: auto;">
                    <li class="list-group-item text-muted text-center small bg-transparent border-0 py-3">Giỏ hàng trống</li>
                </ul>
                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3 border">
                    <span class="fw-bold text-secondary small">Tổng thanh toán:</span>
                    <h5 class="text-danger fw-bold mb-0" id="shopTotalAmount">0 ₫</h5>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold text-muted">Phương thức:</label>
                    <select id="shopPaymentMethod" class="form-select border-0 shadow-sm small rounded-3 bg-light">
                        <option value="Chuyển khoản">💳 QR Chuyển khoản</option>
                        <option value="Tiền mặt">💵 Tiền mặt</option>
                    </select>
                </div>
                <button class="btn btn-success w-100 fw-bold py-3 shadow-sm fs-6 rounded-3" onclick="AppController.checkoutShop()">THANH TOÁN</button>
            </div>
        </div>
    </div>
    `,

    // ================= CỔNG KIỂM SOÁT =================
    operations: () => `
        <div class="row g-3 g-md-4 fade-in p-2 p-md-3">
            <div class="col-lg-5">
                <div class="stat-card shadow-sm border-0 h-100 d-flex flex-column text-center p-3 p-md-4 bg-white rounded-4">
                    <h6 class="fw-bold text-primary mb-3"><i class="fa-solid fa-expand me-2"></i>Khu Vực Quét Thẻ (Kiosk)</h6>
                    <p class="text-muted small mb-3">Đưa mã QR vào khu vực camera</p>

                    <div class="position-relative mx-auto mb-4 w-100" style="max-width: 300px;">
                        <div id="qr-reader" class="overflow-hidden border border-3 border-primary rounded-4 shadow-sm" style="background: #000; min-height: 220px;"></div>
                    </div>

                    <div class="mt-auto bg-light p-3 rounded-4 text-start border mb-3">
                        <label class="fw-bold small mb-2 text-dark"><i class="fa-solid fa-sliders me-2"></i>Thiết lập cổng trực:</label>
                        <select id="opZone" class="form-select border-0 shadow-sm fw-bold text-primary small rounded-3">
                            <option value="Khu Gym Cơ Bản">Phòng Gym Cơ Bản</option>
                            <option value="Khu Gym VIP">Phòng Gym VIP</option>
                        </select>
                    </div>

                    <div class="input-group shadow-sm rounded-3 overflow-hidden">
                        <span class="input-group-text bg-white border-0"><i class="fa-solid fa-barcode text-muted"></i></span>
                        <input type="text" id="manualQrInput" class="form-control border-0 text-center small" placeholder="Nhập mã tay...">
                    </div>
                </div>
            </div>

            <div class="col-lg-7">
                <div class="stat-card shadow-sm border-0 h-100 p-0 overflow-hidden d-flex flex-column bg-white rounded-4">
                    <div class="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0 small"><i class="fa-solid fa-list-check me-2"></i>Vào Ra Trực Tiếp</h6>
                        <span class="badge bg-success small" style="animation: pulse 2s infinite;">● Đang hoạt động</span>
                    </div>
                    
                    <div class="p-3 p-md-4 flex-grow-1 bg-light" id="checkin-log-container" style="max-height: 500px; overflow-y: auto;">
                        <div class="text-center text-muted mt-5 pt-4" id="empty-log-state">
                            <i class="fa-solid fa-door-open fa-3x mb-3 opacity-50"></i>
                            <h6 class="fw-bold">Cổng đang mở</h6>
                            <p class="small">Chưa có lượt quét thẻ nào.</p>
                        </div>
                        <ul id="liveCheckinList" class="list-unstyled mb-0 d-none"></ul>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        </style>
    `
};