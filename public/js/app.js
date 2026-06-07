const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const AppController = {
    qrScanner: null,
    tempHoTen: '',
    userSession: null,

    init() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.loadPage(e.currentTarget.getAttribute('data-target'));
            });
        });
        
        const storedUser = localStorage.getItem('titan_user_session');
        if (storedUser) {
            this.userSession = JSON.parse(storedUser);
            this.showMainLayout();
        } else {
            this.showLoginLayout();
        }
    },

    showLoginLayout() {
        document.getElementById('main-layout').classList.add('d-none');
        document.getElementById('main-layout').classList.remove('d-flex');
        
        const loginLayout = document.getElementById('login-layout');
        loginLayout.classList.remove('d-none');
        
        const loginCard = loginLayout.querySelector('.card');
        if(loginCard) {
            loginCard.classList.remove('animate-login');
            setTimeout(() => {
                loginCard.classList.add('animate-login');
            }, 10);
        }
    },

    showMainLayout() {
        document.getElementById('login-layout').classList.add('d-none');
        document.getElementById('main-layout').classList.remove('d-none');
        document.getElementById('main-layout').classList.add('d-flex');
        
        if(this.userSession) {
            document.getElementById('currentUserName').innerText = this.userSession.name;
            document.getElementById('currentUserRole').innerText = this.userSession.role;
        }
        
        this.loadPage('dashboard');
        this.loadNotifications();
    },

    async processLogin(e) {
        e.preventDefault();
        const u = document.getElementById('loginUsername').value.trim();
        const p = document.getElementById('loginPassword').value.trim();

        Swal.showLoading();
        try {
            let res = await fetch('/api/auth/login', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username: u, password: p })
            });
            let data = await res.json();
            
            if(data.success) {
                this.userSession = data.user;
                localStorage.setItem('titan_user_session', JSON.stringify(data.user)); 
                
                Swal.close();
                Toast.fire({ icon: 'success', title: `Chào mừng, ${data.user.name}!` });
                this.showMainLayout();
            } else {
                Swal.fire('Lỗi bảo mật', data.error, 'error');
            }
        } catch(err) {
            Swal.fire('Mất kết nối', 'Không thể kết nối đến máy chủ', 'error');
        }
    },

    logout() {
        Swal.fire({
            title: 'Khóa hệ thống?',
            text: 'Hệ thống sẽ trở về màn hình khóa bảo mật.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fa-solid fa-lock me-1"></i> Khóa máy ngay'
        }).then((result) => {
            if(result.isConfirmed) {
                localStorage.removeItem('titan_user_session');
                this.userSession = null;
                
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
                
                if(this.qrScanner) this.qrScanner.clear();

                this.showLoginLayout();
                Toast.fire({ icon: 'info', title: 'Hệ thống đã khóa an toàn' });
            }
        });
    },

    async loadNotifications() {
        try {
            let res = await fetch('/api/notifications');
            let notifs = await res.json();
            
            const badge = document.getElementById('notifBadge');
            const notifList = document.getElementById('notifList');
            
            if (notifs.length > 0) {
                badge.innerText = notifs.length;
                badge.classList.remove('d-none');
                notifList.innerHTML = notifs.map(n => `<li><a class="dropdown-item py-2 text-wrap" href="#"><i class="fa-solid ${n.icon} text-${n.type} me-2"></i>${n.text}</a></li>`).join('');
            } else {
                badge.classList.add('d-none');
                notifList.innerHTML = `<li><a class="dropdown-item py-2 text-muted text-center" href="#">Không có thông báo mới</a></li>`;
            }
        } catch(e) { console.error(e); }
    },

    async loadPage(pageName) {
        const viewport = document.getElementById('app-viewport');
        const titleDOM = document.getElementById('page-title');
        
        if(this.qrScanner && pageName !== 'operations') { this.qrScanner.clear(); }

        if (pageName === 'dashboard') {
            titleDOM.innerText = 'Tổng Quan Kinh Doanh';
            let res = await fetch('/api/dashboard/stats');
            let data = await res.json();
            viewport.innerHTML = ViewTemplates.dashboard(data);
            this.searchRevenue('date'); 

        } else if (pageName === 'register') {
            titleDOM.innerText = 'Đăng Ký Hồ Sơ Khách Hàng';
            viewport.innerHTML = ViewTemplates.register();
        } else if (pageName === 'pos') {
            titleDOM.innerText = 'Quầy Thu Ngân (POS)';
            viewport.innerHTML = ViewTemplates.pos();
        } else if (pageName === 'memberList') {
            titleDOM.innerText = 'Quản Lý Data Khách Hàng';
            let res = await fetch('/api/members/list');
            let memberList = await res.json();
            viewport.innerHTML = ViewTemplates.memberList(memberList);
        } else if (pageName === 'operations') {
            titleDOM.innerText = 'Hệ Thống An Ninh Vào Ra';
            viewport.innerHTML = ViewTemplates.operations();
            
            this.startScanner(); // Bật camera dự phòng
            this.setupUsbScannerListener(); // Bật lắng nghe Súng quét USB
        }
    },

    async searchRevenue(type) {
        let timeValue = ''; let labelText = '';
        if (type === 'date') {
            timeValue = document.getElementById('filterDate').value;
            const parts = timeValue.split('-'); labelText = `Ngày ${parts[2]}/${parts[1]}/${parts[0]}`;
        } else if (type === 'month') {
            timeValue = document.getElementById('filterMonth').value;
            if(!timeValue) return Swal.fire('Lỗi', 'Vui lòng chọn Tháng để tra cứu', 'warning');
            const parts = timeValue.split('-'); labelText = `Tháng ${parts[1]}/${parts[0]}`;
        }
        if (!timeValue) return;

        try {
            let res = await fetch(`/api/dashboard/filter?timeValue=${timeValue}`);
            let data = await res.json();
            
            document.getElementById('revenueResultArea').innerHTML = `
                <div class="col-12 mt-2"><h6 class="fw-bold text-secondary mb-3">Kết quả đối soát: <span class="text-primary">${labelText}</span></h6></div>
                <div class="col-md-4"><div class="p-3 bg-white border rounded-3 shadow-sm"><p class="text-muted small fw-bold mb-1"><i class="fa-solid fa-money-bill-wave text-success me-1"></i> Tổng Tiền Mặt (Trong két)</p><h4 class="fw-bold text-success mb-0">${data.tienMat.toLocaleString()} ₫</h4></div></div>
                <div class="col-md-4"><div class="p-3 bg-white border rounded-3 shadow-sm"><p class="text-muted small fw-bold mb-1"><i class="fa-solid fa-qrcode text-primary me-1"></i> Tổng Chuyển Khoản (Trong TK)</p><h4 class="fw-bold text-primary mb-0">${data.chuyenKhoan.toLocaleString()} ₫</h4></div></div>
                <div class="col-md-4"><div class="p-3 bg-dark border rounded-3 shadow-sm"><p class="text-light small fw-bold mb-1"><i class="fa-solid fa-calculator text-warning me-1"></i> TỔNG THỰC THU</p><h4 class="fw-bold text-warning mb-0">${data.tong.toLocaleString()} ₫</h4></div></div>
            `;
        } catch (error) { Swal.fire('Lỗi', 'Không thể lấy dữ liệu đối soát', 'error'); }
    },

    searchMember() {
        const input = document.getElementById("searchInput").value.toLowerCase();
        const rows = document.querySelectorAll(".member-row");
        rows.forEach(row => {
            const id = row.querySelector(".member-id").innerText.toLowerCase();
            const name = row.querySelector(".member-name").innerText.toLowerCase();
            row.style.display = (id.includes(input) || name.includes(input)) ? "" : "none";
        });
    },

    async viewMemberDetail(maHv) {
        Swal.showLoading();
        try {
            let res = await fetch(`/api/members/detail/${maHv}`);
            let data = await res.json();
            if (data.error) return Swal.fire('Lỗi', data.error, 'error');

            const user = data.user; const pack = data.package;
            let packageHtml = `<div class="alert alert-secondary mt-3">Khách hàng chưa đăng ký gói tập nào.</div>`;
            
            if (pack) {
                const diffTime = new Date(pack.ngay_het_han) - new Date();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                let daysLeftText = diffDays > 0 ? `<span class="badge bg-success fs-6 mt-2">Còn lại ${diffDays} ngày</span>` : `<span class="badge bg-danger fs-6 mt-2">Đã hết hạn ${Math.abs(diffDays)} ngày trước</span>`;
                packageHtml = `
                    <div class="bg-light p-3 rounded-3 text-start mt-3 shadow-sm border">
                        <p class="mb-1"><strong>Gói hiện tại:</strong> <span class="text-primary fw-bold">${pack.ten_goi}</span></p>
                        <p class="mb-1"><strong>Ngày kích hoạt:</strong> ${pack.ngay_giao_dich}</p>
                        <p class="mb-1"><strong>Ngày hết hạn:</strong> <span class="text-danger fw-bold">${pack.ngay_het_han}</span></p>
                        ${daysLeftText}
                    </div>
                `;
            }

            Swal.fire({
                title: 'HỒ SƠ HỘI VIÊN',
                html: `
                    <div class="text-center">
                        <div class="avatar text-white rounded-circle d-flex justify-content-center align-items-center fw-bold mx-auto mb-3 shadow" style="width: 70px; height: 70px; font-size: 24px;">
                            ${user.ho_ten.charAt(0).toUpperCase()}
                        </div>
                        <h4 class="fw-bold mb-0">${user.ho_ten}</h4>
                        <p class="text-muted font-monospace mb-2">${user.ma_hv}</p>
                        <div class="d-flex justify-content-center gap-3 text-muted small mb-3">
                            <span><i class="fa-solid fa-phone me-1"></i> ${user.sdt}</span>
                        </div>
                        
                        <div id="swal-qr-profile" class="d-flex justify-content-center bg-white p-2 rounded-3 border d-inline-block mx-auto mb-2"></div>
                        
                        ${packageHtml}
                    </div>
                `,
                showCancelButton: true, showDenyButton: true, confirmButtonColor: '#198754', denyButtonColor: '#dc3545', cancelButtonColor: '#6c757d',
                confirmButtonText: '<i class="fa-solid fa-rotate-right me-1"></i> Chuyển sang Gia hạn', denyButtonText: '<i class="fa-solid fa-ban me-1"></i> Khóa thẻ này', cancelButtonText: 'Đóng', width: '500px',
                didOpen: () => {
                    new QRCode(document.getElementById("swal-qr-profile"), {
                        text: user.ma_hv, width: 120, height: 120, colorDark : "#0f172a", colorLight : "#ffffff"
                    });
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    document.querySelector('[data-target="pos"]').classList.add('active');
                    await this.loadPage('pos');
                    document.getElementById('billCode').value = user.ma_hv;
                    this.previewMemberCard();
                    Toast.fire({ icon: 'info', title: 'Đã điền mã để sẵn sàng thanh toán' });
                } else if (result.isDenied) {
                    if(confirm("Bạn có chắc chắn muốn KHÓA QUYỀN truy cập của thẻ này?")) {
                        await fetch('/api/members/cancel', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ maHv: user.ma_hv }) });
                        Toast.fire({ icon: 'success', title: 'Đã khóa thẻ thành công!' });
                        this.loadPage('memberList'); 
                    }
                }
            });
        } catch (error) {}
    },

    async editMember(maHv) {
        Swal.showLoading();
        try {
            let res = await fetch(`/api/members/detail/${maHv}`);
            let data = await res.json();

            const { value: formValues } = await Swal.fire({
                title: 'Sửa thông tin khách hàng',
                html: `<div class="text-start"><div class="mb-3"><label class="fw-bold small mb-1">Họ và Tên</label><input type="text" id="editName" class="form-control" value="${data.user.ho_ten}"></div><div class="mb-3"><label class="fw-bold small mb-1">Số điện thoại</label><input type="text" id="editPhone" class="form-control" value="${data.user.sdt}"></div></div>`,
                focusConfirm: false, showCancelButton: true, confirmButtonText: '<i class="fa-solid fa-save me-1"></i> Lưu thay đổi', cancelButtonText: 'Hủy',
                preConfirm: () => {
                    const newName = document.getElementById('editName').value.trim(); const newPhone = document.getElementById('editPhone').value.trim();
                    if (!newName || !newPhone) { Swal.showValidationMessage('Vui lòng nhập đầy đủ thông tin!'); return false; }
                    return { hoTen: newName, sdt: newPhone };
                }
            });

            if (formValues) {
                let updateRes = await fetch('/api/members/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ maHv, ...formValues }) });
                let updateData = await updateRes.json();
                if(updateData.success) { Toast.fire({ icon: 'success', title: updateData.message }); this.loadPage('memberList'); } 
            }
        } catch (error) {}
    },

    async deleteMember(maHv) {
        const result = await Swal.fire({
            title: 'Xóa hội viên?', text: `Bạn có chắc muốn XÓA VĨNH VIỄN toàn bộ dữ liệu của hội viên [${maHv}]? Thao tác này không thể hoàn tác!`,
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#6c757d', confirmButtonText: '<i class="fa-solid fa-trash me-1"></i> Đồng ý Xóa', cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            Swal.showLoading();
            let res = await fetch('/api/members/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ maHv }) });
            let data = await res.json();
            if(data.success) { Toast.fire({ icon: 'success', title: data.message }); this.loadPage('memberList'); } 
        }
    },

    async sellDailyTicket() {
        Swal.fire({
            title: 'Xuất vé vãng lai?', text: "Xác nhận thu 50.000 ₫ cho vé tập ngày.", icon: 'question',
            showCancelButton: true, confirmButtonColor: '#ffc107', cancelButtonColor: '#6c757d', confirmButtonText: '<i class="fa-solid fa-ticket"></i> Đồng ý xuất vé', cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.showLoading();
                let res = await fetch('/api/operations/ticket', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ nguoiThuTien: this.userSession.name }) });
                let data = await res.json();
                Swal.fire('Thành công!', data.message, 'success');
                this.loadPage('dashboard');
            }
        });
    },

    async registerMember() {
        const payload = {
            hoTen: document.getElementById('regName').value.trim(),
            sdt: document.getElementById('regPhone').value.trim()
        };

        if(!payload.hoTen || !payload.sdt) return Swal.fire('Lỗi nhập liệu', 'Vui lòng điền đầy đủ Tên và Số điện thoại!', 'error');
        if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(payload.sdt)) return Swal.fire('Lỗi định dạng', 'Số điện thoại không hợp lệ!', 'warning');

        Swal.showLoading();
        try {
            let res = await fetch('/api/members/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
            let data = await res.json();
            
            this.tempHoTen = data.hoTen; 
            Toast.fire({ icon: 'success', title: 'Tạo hồ sơ thành công!' });

            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelector('[data-target="pos"]').classList.add('active');
            await this.loadPage('pos');
            
            document.getElementById('billCode').value = data.maHv;
            this.previewMemberCard();
            this.loadNotifications(); 
            
        } catch(err) { Swal.fire('Lỗi hệ thống', 'Không thể kết nối tới Server.', 'error'); }
    },

    async previewMemberCard() {
        const maHv = document.getElementById('billCode').value.trim();
        const previewBox = document.getElementById('member-card-preview');
        const printBtn = document.getElementById('btnPrintCard');

        if (maHv.length < 5) {
            previewBox.innerHTML = '<i class="fa-solid fa-qrcode text-muted mb-3" style="font-size: 40px; opacity: 0.5;"></i><p class="text-muted mb-0">Nhập mã hội viên bên phải</p><p class="text-muted small">để tải dữ liệu thẻ</p>';
            printBtn.disabled = true;
            return;
        }

        try {
            let res = await fetch(`/api/members/detail/${maHv}`);
            let data = await res.json();

            if(data.user) {
                this.tempHoTen = data.user.ho_ten;
                previewBox.innerHTML = `
                    <h4 class="fw-bold text-dark mt-2 mb-1">TITAN GYM</h4>
                    <p class="small text-muted text-uppercase mb-3">Official Member</p>
                    <h5 class="fw-bolder text-primary mb-1">${data.user.ho_ten}</h5>
                    <p class="font-monospace text-muted small mb-3">ID: ${data.user.ma_hv}</p>
                    <div id="preview-qr" class="d-flex justify-content-center bg-white p-2 rounded-3 border d-inline-block mx-auto mb-2"></div>
                `;
                new QRCode(document.getElementById("preview-qr"), {
                    text: data.user.ma_hv, width: 130, height: 130, colorDark : "#0f172a", colorLight : "#ffffff"
                });
                printBtn.disabled = false;
            }
        } catch(e) { }
    },

    async upgradePackage() {
        const payload = {
            maHv: document.getElementById('billCode').value.trim(),
            goiTap: document.getElementById('billPackage').value,
            phuongThuc: document.getElementById('billMethod').value,
            nguoiThuTien: this.userSession.name
        };
        if(!payload.maHv) return Swal.fire('Thiếu thông tin', 'Vui lòng nhập hoặc quét mã hội viên!', 'warning');

        let giaTien = 0;
        if(payload.goiTap === 'GYM_1M') giaTien = 500000;
        if(payload.goiTap === 'GYM_3M') giaTien = 1400000;
        if(payload.goiTap === 'VIP_6M') giaTien = 2500000;
        if(payload.goiTap === 'VIP_12M') giaTien = 4500000;

        if (payload.phuongThuc === 'Tiền mặt') {
            const { value: tienKhach } = await Swal.fire({
                title: 'Thanh toán Tiền mặt', html: `<div class="mb-3"><p class="mb-1 text-muted">Tổng hóa đơn:</p><h2 class="text-danger fw-bold">${giaTien.toLocaleString()} ₫</h2></div><p class="text-muted small mb-2">Nhập số tiền khách đưa:</p>`,
                input: 'number', inputPlaceholder: 'Ví dụ: 1000000', showCancelButton: true, confirmButtonText: 'Xác nhận thu tiền',
                inputValidator: (value) => { if (!value || parseInt(value) < giaTien) return 'Số tiền khách đưa chưa đủ!'; }
            });

            if (tienKhach) {
                let tienThoi = parseInt(tienKhach) - giaTien;
                await Swal.fire({ icon: 'success', title: 'Thu tiền thành công!', html: `<div class="text-start p-3 bg-light rounded-3 mt-3"><p class="mb-2">Khách đưa: <b>${parseInt(tienKhach).toLocaleString()} ₫</b></p><p class="mb-0">Trả lại: <b class="text-primary fs-5">${tienThoi.toLocaleString()} ₫</b></p></div>`, timer: 3500, showConfirmButton: false });
                this.hoanTatThanhToan(payload);
            }
        } else {
            let qrUrl = `https://img.vietqr.io/image/sacombank-070145456744-compact.png?amount=${giaTien}&addInfo=${payload.maHv} THANH TOAN GOI TAP`;
            const result = await Swal.fire({
                title: 'Quét mã Sacombank QR', html: `<img src="${qrUrl}" class="img-fluid border rounded-3 p-2 mb-3 shadow-sm" style="max-width: 220px;">`,
                showCancelButton: true, confirmButtonText: 'Đã nhận được tiền', showLoaderOnConfirm: true,
                preConfirm: () => new Promise(resolve => setTimeout(resolve, 1000))
            });

            if (result.isConfirmed) {
                await Swal.fire({ icon: 'success', title: 'Thành công', text: 'Giao dịch chuyển khoản đã hoàn tất...', timer: 1500, showConfirmButton: false });
                this.hoanTatThanhToan(payload);
            }
        }
    },

    async hoanTatThanhToan(payload) {
        await fetch('/api/members/upgrade', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
        document.getElementById('billCode').value = '';
        this.previewMemberCard(); 
        this.loadNotifications(); 
    },

    printCurrentCard() {
        this.printMemberCard(document.getElementById('billCode').value.trim(), this.tempHoTen || 'Hội Viên Trân Quý');
    },

    printMemberCard(maHv, hoTen) {
        let printWindow = window.open('', '_blank', 'width=450,height=650');
        printWindow.document.write(`
            <html><head><title>In Thẻ Hội Viên</title><style>
                body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; padding: 30px; background: #f8fafc; margin: 0; }
                .member-card { background: #fff; border: 2px solid #1e293b; border-radius: 16px; padding: 30px 20px; width: 280px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                .qr-container { display: flex; justify-content: center; align-items: center; margin: 0 auto 20px auto; padding: 15px; border: 2px dashed #cbd5e1; border-radius: 12px; width: 150px; height: 150px; }
            </style></head>
            <body><div class="member-card"><h2>TITAN GYM</h2><p style="font-size:22px; font-weight:bold;">${hoTen}</p><p>ID: <b>${maHv}</b></p><div id="qr-print" class="qr-container"></div><p style="font-size:11px; color:#64748b;">Xuất trình thẻ khi qua cổng</p></div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script><script>new QRCode(document.getElementById("qr-print"), { text: "${maHv}", width: 140, height: 140 }); setTimeout(() => window.print(), 800);</script></body></html>
        `);
    },

    // ================= XỬ LÝ SỰ KIỆN SÚNG QUÉT USB VÀ CHUNG MỘT LUỒNG CHECK-IN =================
    setupUsbScannerListener() {
        const inputStr = document.getElementById('manualQrInput');
        if (inputStr) {
            // Khi nhấn phím Enter (Hành vi đặc trưng của súng quét mã vạch)
            inputStr.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const maHv = inputStr.value.trim();
                    if (maHv) {
                        this.processCheckinLogic(maHv);
                        inputStr.value = ''; // Xóa sạch để chờ khách tiếp theo
                    }
                }
            });
            // Tự động focus vào ô này để sẵn sàng tít mã
            inputStr.focus();
        }
    },

    startScanner() {
        this.qrScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 200 });
        this.qrScanner.render((decodedText) => {
            this.processCheckinLogic(decodedText);
            this.qrScanner.pause(true);
            setTimeout(() => this.qrScanner.resume(), 3000);
        });
    },

    // Luồng xử lý check-in tập trung
    async processCheckinLogic(maHv) {
        const khuVuc = document.getElementById('opZone').value;
        try {
            let res = await fetch('/api/operations/checkin', { 
                method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ maHv: maHv, khuVuc: khuVuc }) 
            });
            let data = await res.json();
            
            if(data.success) {
                Toast.fire({ icon: 'success', title: `MỞ CỬA: ${data.user}` });
                this.renderLiveLog(data.user, maHv, khuVuc, 'success');
                this.loadNotifications(); 
            } else {
                Swal.fire({ icon: 'error', title: 'CÒI BÁO ĐỘNG', text: data.error }); 
                this.renderLiveLog('Không hợp lệ', maHv, data.error, 'error');
            }
        } catch(e) { console.error(e); }
    },

    // Đổ dữ liệu thật lên bảng Bảng Live Log (bên phải)
    renderLiveLog(name, id, detail, status) {
        const list = document.getElementById('liveCheckinList');
        const emptyState = document.getElementById('empty-log-state');
        
        if(emptyState) emptyState.classList.add('d-none');
        if(list) {
            list.classList.remove('d-none');
            
            const time = new Date().toLocaleTimeString('vi-VN');
            const isSuccess = status === 'success';
            
            const icon = isSuccess ? '<i class="fa-solid fa-circle-check text-success"></i>' : '<i class="fa-solid fa-circle-xmark text-danger"></i>';
            const bgClass = isSuccess ? 'bg-white' : 'bg-danger bg-opacity-10';
            const textClass = isSuccess ? 'text-primary' : 'text-danger';

            const li = document.createElement('li');
            li.className = `p-3 mb-2 rounded-3 shadow-sm border ${bgClass}`;
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="avatar rounded-circle d-flex justify-content-center align-items-center text-white me-3 shadow-sm" style="width: 45px; height: 45px; font-size: 18px; background: ${isSuccess ? 'linear-gradient(135deg, #4f46e5, #3b82f6)' : '#dc3545'};">
                            ${name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1 ${textClass}">${name}</h6>
                            <small class="text-muted font-monospace border px-1 rounded bg-light">${id}</small>
                            <small class="ms-2 text-muted fw-medium">${detail}</small>
                        </div>
                    </div>
                    <div class="text-end">
                        <span class="fs-4">${icon}</span>
                        <div class="small text-muted fw-bold mt-1">${time}</div>
                    </div>
                </div>
            `;
            
            // Đẩy dòng log mới lên đầu danh sách
            list.prepend(li); 
        }
    }
};

window.addEventListener('DOMContentLoaded', () => AppController.init());