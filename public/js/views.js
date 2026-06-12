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

    // ================= TRANG ĐĂNG KÝ HỘI VIÊN (CHỈ CÓ FORM ĐĂNG KÝ - CĂN GIỮA) =================
    register: () => `
        <div class="fade-in p-2 p-md-4 d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 120px);">
            <div class="card shadow-lg border-0 overflow-hidden rounded-4 w-100" style="max-width: 550px; background: #ffffff;">
                <div class="p-4 p-xl-5 d-flex flex-column justify-content-center position-relative">
                    
                    <div class="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-10" style="clip-path: polygon(0 0, 100% 0, 100% 120px, 0 80px);"></div>

                    <div class="text-center mb-5 position-relative z-1 mt-3">
                        <div class="avatar text-white rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3 shadow-sm" style="width: 75px; height: 75px; font-size: 32px; background: linear-gradient(135deg, #4f46e5, #3b82f6);">
                            <i class="fa-solid fa-user-astronaut"></i>
                        </div>
                        <h4 class="fw-bolder text-dark mb-1">Tạo Hồ Sơ Khách Hàng</h4>
                        <p class="text-muted small mb-0">Thiết lập thẻ hội viên định danh</p>
                    </div>

                    <div class="row g-3 position-relative z-1">
                        <div class="col-12">
                            <div class="form-floating shadow-sm mb-2">
                                <input type="text" id="regName" class="form-control border-0 bg-light rounded-3 fw-bold text-primary px-4" placeholder="Họ và tên">
                                <label class="text-muted px-3"><i class="fa-solid fa-signature me-2"></i>Họ và tên <span class="text-danger">*</span></label>
                            </div>
                        </div>

                        <div class="col-12 col-md-6">
                            <div class="form-floating shadow-sm mb-2">
                                <input type="tel" id="regPhone" class="form-control border-0 bg-light rounded-3 fw-bold text-primary px-4" placeholder="Số điện thoại">
                                <label class="text-muted px-3"><i class="fa-solid fa-phone me-2"></i>Số điện thoại <span class="text-danger">*</span></label>
                            </div>
                        </div>

                        <div class="col-12 col-md-6">
                            <div class="form-floating shadow-sm mb-2">
                                <select id="regGender" class="form-select border-0 bg-light rounded-3 fw-bold text-primary px-4">
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                                <label class="text-muted px-3"><i class="fa-solid fa-venus-mars me-2"></i>Giới tính</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="form-floating shadow-sm mb-4">
                                <input type="email" id="regEmail" class="form-control border-0 bg-light rounded-3 px-4" placeholder="Email">
                                <label class="text-muted px-3"><i class="fa-solid fa-envelope me-2"></i>Email (Tùy chọn)</label>
                            </div>
                        </div>
                    </div>

                    <button onclick="AppController.registerMember()" class="btn btn-primary btn-lg w-100 fw-bolder shadow-lg mt-3 rounded-pill fs-6 py-3 position-relative z-1" style="background: linear-gradient(135deg, #4f46e5, #3b82f6); border: none; transition: 0.3s;">
                        KHỞI TẠO & THANH TOÁN <i class="fa-solid fa-arrow-right ms-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `,

    // ================= TRANG QUẦY THU NGÂN  =================
    pos: () => `
        <style>
            .pos-card-preview { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid rgba(255,255,255,0.1); }
            .pos-pattern { background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px; }
            .btn-check:checked + .btn-outline-success { background-color: #198754; color: white; border-color: #198754; box-shadow: 0 4px 10px rgba(25,135,84,0.3); }
            .btn-check:checked + .btn-outline-primary { background-color: #0d6efd; color: white; border-color: #0d6efd; box-shadow: 0 4px 10px rgba(13,110,253,0.3); }
            .focus-ring:focus-within { box-shadow: 0 0 0 0.25rem rgba(13,110,253,0.25); }
        </style>
        <div class="row g-3 g-md-4 fade-in p-2 p-md-3">
            
            <div class="col-lg-5">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0 px-4">
                        <h6 class="fw-bolder text-dark mb-0"><i class="fa-solid fa-id-badge text-primary me-2"></i>ĐỊNH DANH HỘI VIÊN</h6>
                    </div>
                    <div class="card-body p-4 d-flex flex-column align-items-center">
                        
                        <div id="member-card-preview" class="w-100 rounded-4 shadow pos-card-preview position-relative overflow-hidden d-flex flex-column align-items-center justify-content-center transition-all" style="min-height: 240px;">
                            <div class="position-absolute top-0 start-0 w-100 h-100 opacity-25 pos-pattern"></div>
                            <div class="z-1 text-center w-100 p-3">
                                <i class="fa-solid fa-qrcode text-white opacity-50 mb-3" style="font-size: 55px;"></i>
                                <p class="text-white opacity-75 mb-0 small fw-medium">Chưa có thông tin thẻ</p>
                            </div>
                        </div>
                        
                        <div class="w-100 mt-4">
                            <label class="fw-bold small mb-2 text-muted">Nhập hoặc dùng máy quét mã thẻ</label>
                            <div class="input-group input-group-lg shadow-sm rounded-3 overflow-hidden border focus-ring">
                                <span class="input-group-text bg-light border-0"><i class="fa-solid fa-barcode text-primary"></i></span>
                                <input type="text" id="billCode" class="form-control border-0 bg-light fw-bold text-primary fs-5 text-uppercase" placeholder="VD: HV123456" oninput="AppController.previewMemberCard()">
                            </div>
                        </div>
                        
                        <button onclick="AppController.printCurrentCard()" class="btn btn-outline-primary fw-bold mt-4 w-100 py-3 rounded-3 d-flex justify-content-center align-items-center gap-2" id="btnPrintCard" disabled>
                            <i class="fa-solid fa-print"></i> In Thẻ Cứng Cho Khách
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-lg-7">
                <div class="row g-3 g-md-4">
                    
                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);">
                            <div class="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <div class="d-flex align-items-center mb-1">
                                        <div class="bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center me-2 shadow-sm" style="width: 32px; height: 32px;">
                                            <i class="fa-solid fa-ticket"></i>
                                        </div>
                                        <h6 class="fw-bolder text-dark mb-0">Vé Khách Lẻ</h6>
                                    </div>
                                    <small class="text-muted fw-medium ms-5">Tập ngày không cần hồ sơ.</small>
                                </div>
                                <button onclick="AppController.sellDailyTicket()" class="btn btn-warning fw-bolder px-4 py-3 py-md-2 shadow-sm rounded-pill text-dark border-0">
                                    THU 50.000 ₫
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                            <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0 px-4">
                                <h6 class="fw-bolder text-dark mb-0"><i class="fa-solid fa-credit-card text-success me-2"></i>THANH TOÁN GÓI TẬP</h6>
                            </div>
                            <div class="card-body p-4">
                                <div class="row g-4">
                                    <div class="col-12">
                                        <label class="fw-bold small mb-2 text-muted">Chọn cấp độ gói</label>
                                        <div class="position-relative">
                                            <select id="billPackage" class="form-select form-select-lg bg-light border-0 shadow-sm rounded-3 fs-6 fw-medium text-dark ps-3 py-3 cursor-pointer">
                                                <optgroup label="Gói Ưu Đãi (HSSV)">
                                                    <option value="STUDENT_1M" data-price="350000">HSSV (1 Tháng) - 350.000 ₫</option>
                                                    <option value="STUDENT_3M" data-price="950000">HSSV (3 Tháng) - 950.000 ₫</option>
                                                </optgroup>
                                                <optgroup label="Gói Gym Cơ Bản">
                                                    <option value="GYM_1M" data-price="500000">Gym Cơ Bản (1 Tháng) - 500.000 ₫</option>
                                                    <option value="GYM_3M" data-price="1400000">Gym Cơ Bản (3 Tháng) - 1.400.000 ₫</option>
                                                    <option value="GYM_6M" data-price="2500000">Gym Cơ Bản (6 Tháng) - 2.500.000 ₫</option>
                                                    <option value="GYM_12M" data-price="4500000">Gym Cơ Bản (1 Năm) - 4.500.000 ₫</option>
                                                </optgroup>
                                                <optgroup label="Gói VIP Đặc Quyền">
                                                    <option value="VIP_1M" data-price="800000">VIP (1 Tháng) - 800.000 ₫</option>
                                                    <option value="VIP_3M" data-price="2200000">VIP (3 Tháng) - 2.200.000 ₫</option>
                                                    <option value="VIP_6M" data-price="4000000">VIP (6 Tháng) - 4.000.000 ₫</option>
                                                    <option value="VIP_12M" data-price="7500000">VIP Thượng Hạng (1 Năm) - 7.500.000 ₫</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <label class="fw-bold small mb-2 text-muted">Phương thức thanh toán</label>
                                        <div class="d-flex gap-3">
                                            <div class="flex-grow-1">
                                                <input type="radio" class="btn-check" name="paymentMethod" id="methodCash" value="Tiền mặt" autocomplete="off" checked onchange="document.getElementById('billMethod').value = this.value">
                                                <label class="btn btn-outline-success w-100 py-3 rounded-3 fw-bold shadow-sm d-flex flex-column align-items-center gap-2 bg-light border-0 transition-all" for="methodCash">
                                                    <i class="fa-solid fa-money-bill-wave fs-4"></i> Tiền Mặt
                                                </label>
                                            </div>
                                            <div class="flex-grow-1">
                                                <input type="radio" class="btn-check" name="paymentMethod" id="methodQR" value="Chuyển khoản" autocomplete="off" onchange="document.getElementById('billMethod').value = this.value">
                                                <label class="btn btn-outline-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex flex-column align-items-center gap-2 bg-light border-0 transition-all" for="methodQR">
                                                    <i class="fa-solid fa-qrcode fs-4"></i> Mã QR
                                                </label>
                                            </div>
                                        </div>
                                        <input type="hidden" id="billMethod" value="Tiền mặt">
                                    </div>
                                    
                                    <div class="col-12 mt-4">
                                        <button onclick="AppController.upgradePackage()" class="btn btn-success btn-lg w-100 fw-bolder shadow rounded-3 py-3 fs-5 d-flex justify-content-center align-items-center gap-2 border-0" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                                            <i class="fa-solid fa-check-circle"></i> XÁC NHẬN THU TIỀN
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // ================= 1. DANH BẠ HỘI VIÊN (TỐI ƯU HIỂN THỊ TRÊN DI ĐỘNG) =================
    'danh-ba': (data, currentPage, totalPages) => `
    <div class="fade-in p-2 p-md-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
            <h5 class="fw-bold text-primary mb-0">Danh bạ hội viên</h5>
            <div class="input-group shadow-sm rounded-3 overflow-hidden w-100" style="max-width: 400px;">
                <span class="input-group-text bg-white border-0"><i class="fa-solid fa-search text-primary"></i></span>
                <input type="text" id="searchInput" class="form-control border-0" placeholder="Tìm tên, SĐT, mã thẻ..." onkeyup="AppController.searchMember()">
            </div>
        </div>
        
        <div class="bg-white shadow-sm rounded-4 border-0 overflow-hidden">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0 text-nowrap">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-3 ps-md-4 py-3">Mã thẻ</th>
                            <th class="py-3">Họ tên</th>
                            <th class="pe-3 pe-md-4 py-3 text-end text-md-start">SĐT</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(data || []).map(m => `
                            <tr class="member-row">
                                <td class="member-id fw-bold text-secondary small ps-3 ps-md-4">${m.ma_hv}</td>
                                <td class="member-name text-primary fw-bold" style="cursor:pointer;" onclick="AppController.viewMemberDetail('${m.ma_hv}')">${m.ho_ten}</td>
                                <td class="member-phone small pe-3 pe-md-4 text-end text-md-start">${m.sdt}</td>
                            </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <nav class="mt-4 d-flex justify-content-center justify-content-md-start">
            <ul class="pagination pagination-sm shadow-sm rounded-3 overflow-hidden">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link text-dark fw-bold border-0 px-3" href="#" onclick="AppController.loadPage('danh-ba', ${currentPage - 1})">Trước</a>
                </li>
                <li class="page-item disabled"><a class="page-link bg-light text-primary fw-bold px-4 border-0">${currentPage} / ${totalPages}</a></li>
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
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold text-primary mb-0"><i class="fa-solid fa-store me-2"></i>Gian hàng mua sắm</h5>
                <div class="input-group shadow-sm rounded-3 overflow-hidden w-50">
                    <span class="input-group-text bg-white border-0"><i class="fa-solid fa-search text-primary"></i></span>
                    <input type="text" id="shopSearchInput" class="form-control border-0" placeholder="Tìm sản phẩm..." onkeyup="AppController.searchProducts()">
                </div>
            </div>
            
            <div id="shopProducts" class="row g-3"></div>
            
            <div id="shopPagination" class="mt-4 w-100 d-flex justify-content-center"></div>
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
                    <label class="fw-bold small mb-1 text-muted" for="shopCustomerPhone">SĐT Tích Điểm (Không bắt buộc)</label>
                    <div class="input-group input-group-sm shadow-sm rounded-3 overflow-hidden">
                        <span class="input-group-text bg-white border-0"><i class="fa-solid fa-phone text-muted"></i></span>
                        <input type="tel" id="shopCustomerPhone" class="form-control border-0 bg-light" placeholder="Ví dụ: 0987654321">
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label small fw-bold text-muted">Phương thức:</label>
                    <select id="shopPaymentMethod" class="form-select border-0 shadow-sm small rounded-3 bg-light">
                        <option value="Chuyển khoản">QR Chuyển khoản</option>
                        <option value="Tiền mặt">Tiền mặt</option>
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