const Toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true,
    didOpen: (toast) => { toast.addEventListener('mouseenter', Swal.stopTimer); toast.addEventListener('mouseleave', Swal.resumeTimer); }
});

const AppController = {
    qrScanner: null, tempHoTen: '', userSession: null, shopCart: [], shopProductsList: [], 

    init() {
        // Tự động setup giao diện chuẩn Mobile
        this.setupMobileResponsive();

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.loadPage(e.currentTarget.getAttribute('data-target'));
                
                // Tự động đóng Menu khi click trên Mobile
                if(window.innerWidth < 992) {
                    document.querySelector('.sidebar')?.classList.remove('show');
                    document.querySelector('.mobile-overlay')?.classList.remove('show');
                }
            });
        });
        const storedUser = localStorage.getItem('titan_user_session');
        if (storedUser) { this.userSession = JSON.parse(storedUser); this.showMainLayout(); } 
        else { this.showLoginLayout(); }
    },

    // --- HÀM TỰ ĐỘNG FIX GIAO DIỆN MOBILE ---
    setupMobileResponsive() {
        if (!document.getElementById('mobile-css')) {
            const style = document.createElement('style');
            style.id = 'mobile-css';
            style.innerHTML = `
                @media (max-width: 991.98px) {
                    .sidebar {
                        position: fixed !important;
                        top: 0; left: -280px; /* Ẩn menu ra ngoài */
                        width: 260px !important;
                        height: 100vh;
                        z-index: 1050 !important;
                        transition: 0.3s ease-in-out;
                        box-shadow: 5px 0 15px rgba(0,0,0,0.2);
                    }
                    .sidebar.show { left: 0 !important; }
                    #main-layout { overflow-x: hidden; }
                    /* Nội dung chiếm 100% khi ở mobile */
                    #main-layout > div:not(.sidebar) { width: 100% !important; max-width: 100% !important; flex: 1 !important; }
                    
                    /* Lớp mờ khi mở menu */
                    .mobile-overlay {
                        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.5); z-index: 1040;
                        opacity: 0; visibility: hidden; transition: 0.3s;
                    }
                    .mobile-overlay.show { opacity: 1; visibility: visible; }
                }
            `;
            document.head.appendChild(style);
        }

        // Thêm lớp mờ (overlay)
        if (!document.querySelector('.mobile-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            overlay.onclick = () => {
                document.querySelector('.sidebar')?.classList.remove('show');
                overlay.classList.remove('show');
            };
            document.body.appendChild(overlay);
        }

        // Thêm nút Hamburger vào Header
        const pageTitle = document.getElementById('page-title');
        if (pageTitle && !document.getElementById('mobileMenuBtn')) {
            const btn = document.createElement('button');
            btn.id = 'mobileMenuBtn';
            btn.className = 'btn btn-light border d-lg-none me-3 shadow-sm rounded-3';
            btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            btn.onclick = () => {
                document.querySelector('.sidebar')?.classList.add('show');
                document.querySelector('.mobile-overlay')?.classList.add('show');
            };
            
            pageTitle.parentNode.classList.add('d-flex', 'align-items-center');
            pageTitle.parentNode.insertBefore(btn, pageTitle);
            pageTitle.classList.add('mb-0', 'fs-4');
        }
    },
    // ----------------------------------------

    showLoginLayout() {
        document.getElementById('main-layout').classList.add('d-none'); document.getElementById('main-layout').classList.remove('d-flex');
        const loginLayout = document.getElementById('login-layout'); loginLayout.classList.remove('d-none');
        const loginCard = loginLayout.querySelector('.card');
        if(loginCard) { loginCard.classList.remove('animate-login'); setTimeout(() => { loginCard.classList.add('animate-login'); }, 10); }
    },

    showMainLayout() {
        document.getElementById('login-layout').classList.add('d-none');
        document.getElementById('main-layout').classList.remove('d-none'); document.getElementById('main-layout').classList.add('d-flex');
        if(this.userSession) {
            document.getElementById('currentUserName').innerText = this.userSession.name;
            document.getElementById('currentUserRole').innerText = this.userSession.role;
        }
        this.loadPage('dashboard'); this.loadNotifications();
    },

    async processLogin(e) {
        e.preventDefault(); const u = document.getElementById('loginUsername').value.trim(); const p = document.getElementById('loginPassword').value.trim();
        Swal.showLoading();
        try {
            let res = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username: u, password: p }) });
            let data = await res.json();
            if(data.success) {
                this.userSession = data.user; localStorage.setItem('titan_user_session', JSON.stringify(data.user)); 
                Swal.close(); Toast.fire({ icon: 'success', title: `Chào mừng, ${data.user.name}!` }); this.showMainLayout();
            } else { Swal.fire({title: 'Lỗi bảo mật', text: data.error, icon: 'error', customClass: { popup: 'rounded-4' }}); }
        } catch(err) { Swal.fire({title: 'Mất kết nối', text: 'Không thể kết nối đến máy chủ', icon: 'error', customClass: { popup: 'rounded-4' }}); }
    },

    logout() {
        Swal.fire({
            title: 'Khóa hệ thống?', text: 'Hệ thống sẽ trở về màn hình khóa bảo mật.', icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#4f46e5', cancelButtonColor: '#6c757d', confirmButtonText: '<i class="fa-solid fa-lock me-1"></i> Khóa máy ngay',
            customClass: { popup: 'rounded-4' }
        }).then((result) => {
            if(result.isConfirmed) {
                localStorage.removeItem('titan_user_session'); this.userSession = null;
                document.getElementById('loginUsername').value = ''; document.getElementById('loginPassword').value = '';
                if(this.qrScanner) this.qrScanner.clear();
                this.showLoginLayout(); Toast.fire({ icon: 'info', title: 'Hệ thống đã khóa an toàn' });
            }
        });
    },

    async loadNotifications() {
        try {
            let res = await fetch('/api/notifications'); let notifs = await res.json();
            const badge = document.getElementById('notifBadge'); const notifList = document.getElementById('notifList');
            if (notifs.length > 0) {
                badge.innerText = notifs.length; badge.classList.remove('d-none');
                notifList.innerHTML = notifs.map(n => `<li><a class="dropdown-item py-2 text-wrap small" href="#"><i class="fa-solid ${n.icon} text-${n.type} me-2"></i>${n.text}</a></li>`).join('');
            } else {
                badge.classList.add('d-none'); notifList.innerHTML = `<li><a class="dropdown-item py-2 text-muted text-center small" href="#">Không có thông báo mới</a></li>`;
            }
        } catch(e) {}
    },

    async loadPage(pageName, page = 1) {
        const viewport = document.getElementById('app-viewport'); const titleDOM = document.getElementById('page-title');
        if(this.qrScanner && pageName !== 'operations') { this.qrScanner.clear(); }

        switch(pageName) {
            case 'dashboard':
                titleDOM.innerText = 'Tổng Quan';
                let resDash = await fetch('/api/dashboard/stats'); viewport.innerHTML = ViewTemplates.dashboard(await resDash.json());
                this.searchRevenue('date'); 
                break;
            case 'pos': titleDOM.innerText = 'Quầy Thu Ngân'; viewport.innerHTML = ViewTemplates.pos(); break;
            case 'danh-ba':
                titleDOM.innerText = 'Danh Bạ';
                let resM = await fetch(`/api/members/list?page=${page}&limit=10`); let dataM = await resM.json();
                viewport.innerHTML = ViewTemplates['danh-ba'](dataM.members, page, dataM.totalPages);
                break;
            case 'shop':
                titleDOM.innerText = 'Gian Hàng';
                viewport.innerHTML = ViewTemplates.shop();
                let resShop = await fetch('/api/shop/products'); this.renderProducts(await resShop.json());
                break;
            case 'operations':
                titleDOM.innerText = 'Cổng Kiểm Soát';
                viewport.innerHTML = ViewTemplates.operations(); this.startScanner();
                break;
            case 'register': titleDOM.innerText = 'Đăng Ký Khách'; viewport.innerHTML = ViewTemplates.register(); break;
            default: this.loadPage('dashboard');
        }
    },

    searchMember() {
        const input = document.getElementById("searchInput").value.toLowerCase().trim();
        const rows = document.querySelectorAll(".member-row");
        rows.forEach(row => {
            const id = row.querySelector(".member-id")?.innerText.toLowerCase() || "";
            const name = row.querySelector(".member-name")?.innerText.toLowerCase() || "";
            const phone = row.querySelector(".member-phone")?.innerText.toLowerCase() || "";
            row.style.display = (id.includes(input) || name.includes(input) || phone.includes(input)) ? "" : "none";
        });
    },

    switchProfileTab(event, tabId) {
        event.preventDefault();
        document.querySelectorAll('.profile-tab-content').forEach(el => el.classList.add('d-none'));
        document.getElementById(tabId).classList.remove('d-none');
        document.querySelectorAll('.nav-pills .nav-link').forEach(el => {
            el.classList.remove('active', 'bg-white', 'text-primary', 'shadow-sm');
            el.classList.add('text-muted');
        });
        event.target.classList.remove('text-muted'); 
        event.target.classList.add('active', 'bg-white', 'text-primary', 'shadow-sm');
    },

    async viewMemberDetail(maHv) {
        Swal.showLoading();
        try {
            let res = await fetch(`/api/members/detail/${maHv}`);
            let data = await res.json();
            if (data.error) return Swal.fire({title:'Lỗi', text:data.error, icon:'error', customClass:{popup:'rounded-4'}});

            const user = data.user; const pack = data.package;
            let packageHtml = `<div class="p-4 bg-light rounded-4 border text-center text-muted small"><i class="fa-solid fa-box-open fa-2x mb-2 opacity-50"></i><br>Chưa đăng ký gói tập.</div>`;
            let historyHtml = `<div class="p-4 bg-light rounded-4 border text-center text-muted small"><i class="fa-solid fa-clock-rotate-left fa-2x mb-2 opacity-50"></i><br>Chưa có lịch sử.</div>`;
            
            if (pack) {
                const diffTime = new Date(pack.ngay_het_han) - new Date(); const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                let statusText = diffDays > 0 ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1">Còn ${diffDays} ngày</span>` : `<span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-2 py-1">Hết hạn</span>`;
                packageHtml = `
                    <div class="p-3 bg-white rounded-4 border shadow-sm text-start small">
                        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                            <span class="text-muted"><i class="fa-solid fa-dumbbell me-1"></i> Gói tập</span>
                            <span class="fw-bolder text-primary fs-6">${pack.ten_goi}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2"><span class="text-muted">Kích hoạt:</span><span class="fw-medium text-dark">${pack.ngay_giao_dich}</span></div>
                        <div class="d-flex justify-content-between mb-2"><span class="text-muted">Hết hạn:</span><span class="fw-medium text-dark">${pack.ngay_het_han}</span></div>
                        <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top"><span class="text-muted">Trạng thái:</span>${statusText}</div>
                    </div>`;
                historyHtml = `
                    <div class="p-3 bg-white rounded-4 border shadow-sm text-start mb-2 border-start border-primary border-4">
                        <div class="d-flex justify-content-between align-items-center mb-1"><span class="fw-bolder text-dark small">Mua ${pack.ten_goi}</span></div>
                        <p class="mb-0 text-muted" style="font-size:0.75rem;"><i class="fa-regular fa-clock me-1"></i> ${pack.ngay_giao_dich}</p>
                    </div>`;
            }

            Swal.fire({
                html: `
                    <div class="text-center" style="font-family: inherit;">
                        <div class="d-flex align-items-center mb-3 p-3 bg-white rounded-4 border shadow-sm text-start">
                            <div class="avatar bg-primary bg-gradient text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-3 shadow-sm flex-shrink-0" style="width: 55px; height: 55px;">
                                ${user.ho_ten.charAt(0).toUpperCase()}
                            </div>
                            <div class="ms-3 flex-grow-1 overflow-hidden">
                                <h6 class="fw-bolder mb-0 text-truncate text-dark" style="font-size: 1.1rem;">${user.ho_ten}</h6>
                                <span class="badge bg-light text-secondary border font-monospace mt-1">${user.ma_hv}</span>
                            </div>
                            <div class="text-center px-2 border-start ms-2">
                                <p class="text-muted mb-0" style="font-size: 0.65rem; font-weight: 800;">ĐIỂM</p>
                                <h5 class="text-warning fw-bolder mb-0">${user.diem_tich_luy || 0}</h5>
                            </div>
                        </div>
                        
                        <ul class="nav nav-pills nav-fill bg-light p-1 rounded-3 mb-3 shadow-sm" style="font-size: 0.85rem;">
                            <li class="nav-item">
                                <a class="nav-link active bg-white text-primary shadow-sm fw-bold px-2 py-1 rounded-2" href="#" onclick="AppController.switchProfileTab(event, 'tab-qr')" id="btn-tab-qr">Mã QR</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-muted fw-bold px-2 py-1 rounded-2" href="#" onclick="AppController.switchProfileTab(event, 'tab-package')" id="btn-tab-package">Gói Tập</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-muted fw-bold px-2 py-1 rounded-2" href="#" onclick="AppController.switchProfileTab(event, 'tab-history')" id="btn-tab-history">Lịch Sử</a>
                            </li>
                        </ul>
                        
                        <div id="tab-qr" class="profile-tab-content">
                            <div class="p-3 bg-light rounded-4 border d-inline-block shadow-sm">
                                <div id="swal-qr-profile" class="bg-white p-2 rounded-3 mx-auto"></div>
                            </div>
                        </div>
                        <div id="tab-package" class="profile-tab-content d-none fade-in">${packageHtml}</div>
                        <div id="tab-history" class="profile-tab-content d-none fade-in">${historyHtml}</div>
                    </div>
                `,
                showCancelButton: true, showDenyButton: true, showCloseButton: true,
                confirmButtonColor: '#0d6efd', cancelButtonColor: '#6c757d', denyButtonColor: '#dc3545',
                confirmButtonText: '<i class="fa-solid fa-bolt me-1"></i>Gia hạn', 
                cancelButtonText: '<i class="fa-solid fa-pen me-1"></i>Sửa', 
                denyButtonText: '<i class="fa-solid fa-trash me-1"></i>Xóa', 
                width: 'auto', customClass: { popup: 'rounded-4 shadow-lg', actions: 'gap-2' }, padding: '1.25em',
                didOpen: () => {
                    const qrSize = window.innerWidth < 400 ? 140 : 160;
                    new QRCode(document.getElementById("swal-qr-profile"), { text: user.ma_hv, width: qrSize, height: qrSize, colorDark : "#1e293b", colorLight : "#ffffff" });
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    document.querySelector('[data-target="pos"]').classList.add('active');
                    await this.loadPage('pos'); document.getElementById('billCode').value = user.ma_hv; this.previewMemberCard();
                } else if (result.isDenied) { this.deleteMember(user.ma_hv); } 
                else if (result.dismiss === Swal.DismissReason.cancel) { this.editMember(user.ma_hv); }
            });
        } catch (error) {}
    },

    async editMember(maHv) {
        Swal.showLoading();
        try {
            let res = await fetch(`/api/members/detail/${maHv}`); let data = await res.json();
            const { value: formValues } = await Swal.fire({
                title: '<span class="fs-5 fw-bold">Sửa thông tin</span>',
                html: `
                    <div class="text-start mt-2">
                        <div class="mb-3">
                            <label class="fw-bold small mb-1 text-muted">Họ và Tên</label>
                            <input type="text" id="editName" class="form-control form-control-lg bg-light border-0 shadow-sm" value="${data.user.ho_ten}">
                        </div>
                        <div class="mb-2">
                            <label class="fw-bold small mb-1 text-muted">Số điện thoại</label>
                            <input type="tel" id="editPhone" class="form-control form-control-lg bg-light border-0 shadow-sm" value="${data.user.sdt}">
                        </div>
                    </div>`,
                focusConfirm: false, showCancelButton: true, confirmButtonText: 'Lưu thay đổi', cancelButtonText: 'Hủy', 
                width: 'auto', customClass: { popup: 'rounded-4 shadow-lg', confirmButton:'px-4', cancelButton:'px-4' },
                preConfirm: () => {
                    const newName = document.getElementById('editName').value.trim(); const newPhone = document.getElementById('editPhone').value.trim();
                    if (!newName || !newPhone) { Swal.showValidationMessage('Nhập đủ thông tin!'); return false; }
                    return { hoTen: newName, sdt: newPhone };
                }
            });
            if (formValues) {
                let updateRes = await fetch('/api/members/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ maHv, ...formValues }) });
                let updateData = await updateRes.json();
                if(updateData.success) { Toast.fire({ icon: 'success', title: updateData.message }); this.loadPage('danh-ba'); } 
            }
        } catch (error) {}
    },

    async deleteMember(maHv) {
        const result = await Swal.fire({
            title: '<span class="fw-bold text-danger">Xóa hội viên?</span>', 
            html: `<p class="mb-0 text-muted small">Sẽ xóa vĩnh viễn dữ liệu của <b>${maHv}</b>.</p>`, 
            icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', cancelButtonColor: '#e9ecef', 
            confirmButtonText: 'Đồng ý xóa', cancelButtonText: '<span class="text-dark">Hủy</span>', 
            width: 'auto', customClass: { popup: 'rounded-4 shadow-lg' }
        });
        if (result.isConfirmed) {
            Swal.showLoading();
            let res = await fetch('/api/members/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ maHv }) });
            let data = await res.json();
            if(data.success) { Toast.fire({ icon: 'success', title: data.message }); this.loadPage('danh-ba'); } 
        }
    },

    async sellDailyTicket() {
        Swal.fire({
            title: '<span class="fw-bold">Vé vãng lai</span>', html: "<p class='text-muted small'>Xác nhận xuất vé ngày. Thu <b>50.000 ₫</b></p>", 
            icon: 'question', showCancelButton: true, confirmButtonColor: '#ffc107', cancelButtonColor: '#e9ecef', 
            confirmButtonText: '<span class="text-dark fw-bold"><i class="fa-solid fa-ticket me-1"></i> Đồng ý</span>', cancelButtonText: '<span class="text-dark">Hủy</span>', 
            width: 'auto', customClass: { popup: 'rounded-4 shadow-lg' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.showLoading();
                let res = await fetch('/api/operations/ticket', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ nguoiThuTien: this.userSession.name }) });
                let data = await res.json();
                Swal.fire({title: 'Thành công!', text: data.message, icon: 'success', customClass:{popup:'rounded-4'}}); this.loadPage('dashboard');
            }
        });
    },

    async registerMember() {
        const payload = { hoTen: document.getElementById('regName').value.trim(), sdt: document.getElementById('regPhone').value.trim() };
        if(!payload.hoTen || !payload.sdt) return Swal.fire({title:'Lỗi', text:'Điền đủ Tên và SĐT!', icon:'error', customClass:{popup:'rounded-4'}});
        if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(payload.sdt)) return Swal.fire({title:'Lỗi', text:'SĐT không hợp lệ!', icon:'warning', customClass:{popup:'rounded-4'}});
        Swal.showLoading();
        try {
            let res = await fetch('/api/members/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
            let data = await res.json();
            this.tempHoTen = data.hoTen; Toast.fire({ icon: 'success', title: 'Tạo hồ sơ thành công!' });
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active')); document.querySelector('[data-target="pos"]').classList.add('active');
            await this.loadPage('pos'); document.getElementById('billCode').value = data.maHv; this.previewMemberCard();
        } catch(err) { Swal.fire({title:'Lỗi', text:'Không kết nối được Server.', icon:'error', customClass:{popup:'rounded-4'}}); }
    },

    async previewMemberCard() {
        const maHv = document.getElementById('billCode').value.trim();
        const previewBox = document.getElementById('member-card-preview'); const printBtn = document.getElementById('btnPrintCard');
        if (maHv.length < 5) {
            previewBox.innerHTML = '<i class="fa-solid fa-qrcode text-muted mb-3" style="font-size: 40px; opacity: 0.5;"></i><p class="text-muted mb-0 small">Nhập mã hội viên bên phải</p>';
            printBtn.disabled = true; return;
        }
        try {
            let res = await fetch(`/api/members/detail/${maHv}`); let data = await res.json();
            if(data.user) {
                this.tempHoTen = data.user.ho_ten;
                previewBox.innerHTML = `<h6 class="fw-bold mb-1">${data.user.ho_ten}</h6><span class="badge bg-light text-secondary border font-monospace mb-3">${data.user.ma_hv}</span><div id="preview-qr" class="bg-white p-2 rounded-3 border shadow-sm"></div>`;
                new QRCode(document.getElementById("preview-qr"), { text: data.user.ma_hv, width: 110, height: 110 });
                printBtn.disabled = false;
            }
        } catch(e) { }
    },

    async upgradePackage() {
        const select = document.getElementById('billPackage'); const giaTien = parseInt(select.options[select.selectedIndex].getAttribute('data-price'));
        const maHv = document.getElementById('billCode').value.trim();
        if (!maHv) return Swal.fire({title:'Thiếu thông tin', text:'Quét mã hội viên trước!', icon:'warning', customClass:{popup:'rounded-4'}});
        
        const payload = { maHv, goiTap: select.value, phuongThuc: document.getElementById('billMethod').value, nguoiThuTien: this.userSession.name, soTien: giaTien };
        if (payload.phuongThuc === 'Tiền mặt') {
            const { value: tienKhach } = await Swal.fire({
                title: '<span class="fs-5 fw-bold">Thu Tiền Mặt</span>',
                html: `<div class="mb-4 mt-2"><p class="text-muted mb-1 small text-uppercase fw-bold">Cần thanh toán</p><h2 class="text-danger fw-bolder mb-0">${giaTien.toLocaleString()} <span class="fs-5">₫</span></h2></div><input type="number" id="tienKhach" class="form-control form-control-lg text-center fw-bold fs-4 bg-light border-0 shadow-sm rounded-3" placeholder="0">`,
                showCancelButton: true, confirmButtonText: 'Xác nhận thu', cancelButtonText: 'Hủy', width: 'auto', customClass: { popup: 'rounded-4 shadow-lg' },
                preConfirm: () => {
                    const val = document.getElementById('tienKhach').value;
                    if (!val || parseInt(val) < giaTien) { Swal.showValidationMessage('Số tiền khách đưa không đủ!'); return false; }
                    return parseInt(val);
                }
            });
            if (tienKhach) {
                await Swal.fire({ icon: 'success', title: '<span class="fw-bold">Thành công!</span>', html: `<div class="p-3 bg-light rounded-3 text-start small border"><div class="d-flex justify-content-between mb-2"><span class="text-muted">Khách đưa:</span><span class="fw-bold text-dark">${parseInt(tienKhach).toLocaleString()} ₫</span></div><div class="d-flex justify-content-between border-top pt-2"><span class="text-muted">Trả lại:</span><span class="fw-bold text-primary fs-6">${(tienKhach - giaTien).toLocaleString()} ₫</span></div></div>`, confirmButtonText: 'Hoàn tất', width: 'auto', customClass: { popup: 'rounded-4 shadow-lg' } });
                await this.hoanTatThanhToan(payload);
            }
        } else {
            const qrUrl = `https://img.vietqr.io/image/SACOMBANK-070145456744-compact.png?amount=${giaTien}&addInfo=${encodeURIComponent(payload.maHv + " THANH TOAN")}&accountName=VU TA HANG`;
            await Swal.fire({ title: '<span class="fs-5 fw-bold">Quét mã QR</span>', html: `<div class="bg-white p-2 rounded-4 shadow-sm border d-inline-block mb-3 mt-2"><img src="${qrUrl}" class="img-fluid rounded-3" style="max-width: 220px;"></div><p class="mb-0 text-muted small text-uppercase fw-bold">Số tiền</p><h3 class="text-danger fw-bolder">${giaTien.toLocaleString()} <span class="fs-5">₫</span></h3>`, confirmButtonText: 'Đã nhận tiền', showCancelButton: true, cancelButtonText: 'Hủy', width: 'auto', customClass: { popup: 'rounded-4 shadow-lg' } }).then(async (result) => { if (result.isConfirmed) await this.hoanTatThanhToan(payload); });
        }
    },

    async hoanTatThanhToan(payload) {
        Swal.showLoading();
        try {
            let res = await fetch('/api/members/upgrade', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
            let data = await res.json(); Swal.close(); 
            if(data.success) { Toast.fire({ icon: 'success', title: 'Cập nhật thành công!' }); document.getElementById('billCode').value = ''; this.previewMemberCard(); } 
            else { Swal.fire({title:'Lỗi', text:data.message, icon:'error', customClass:{popup:'rounded-4'}}); }
        } catch (err) { Swal.fire({title:'Lỗi', text:'Không kết nối được server', icon:'error', customClass:{popup:'rounded-4'}}); }
    },

    async processCheckinLogic(maHv) {
        const khuVuc = document.getElementById('opZone').value;
        try {
            let res = await fetch('/api/operations/checkin', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ maHv: maHv, khuVuc: khuVuc }) });
            let data = await res.json();
            if(data.success) { Toast.fire({ icon: 'success', title: `MỞ CỬA: ${data.user}` }); this.renderLiveLog(data.user, maHv, khuVuc, 'success'); } 
            else { Swal.fire({ icon: 'error', title: 'CÒI BÁO ĐỘNG', text: data.error, width: 'auto', customClass:{popup:'rounded-4'} }); this.renderLiveLog('Không hợp lệ', maHv, data.error, 'error'); }
        } catch(e) {}
    },

    renderLiveLog(name, id, detail, status) {
        const list = document.getElementById('liveCheckinList'); const emptyState = document.getElementById('empty-log-state');
        if(emptyState) emptyState.classList.add('d-none');
        if(list) {
            list.classList.remove('d-none'); const li = document.createElement('li');
            const borderClass = status === 'success' ? 'border-success' : 'border-danger';
            li.innerHTML = `<div class="p-2 mb-2 border-start ${borderClass} border-4 rounded-end bg-white shadow-sm small d-flex justify-content-between align-items-center"><div><span class="fw-bold text-dark">${name}</span><br><span class="text-muted" style="font-size:11px;">${detail}</span></div><span class="text-muted" style="font-size:10px;"><i class="fa-regular fa-clock"></i> ${new Date().toLocaleTimeString()}</span></div>`;
            list.prepend(li); 
        }
    },

    async renderProducts(products) {
        this.shopProductsList = products.map(p => ({ id: p.id, ten_sanpham: p.ten_sanpham, gia: p.gia_ban || p.gia || 20000 }));
        const container = document.getElementById('shopProducts'); if (!container) return;
        container.innerHTML = this.shopProductsList.map(p => `
            <div class="col-6 col-md-4"><div class="card h-100 shadow-sm border-0 bg-white rounded-4"><div class="card-body text-center p-3 p-md-4"><h6 class="fw-bold mb-2 text-secondary fs-6 text-truncate">${p.ten_sanpham}</h6><p class="text-danger fw-bold mb-3 fs-6">${p.gia.toLocaleString()} ₫</p><button class="btn btn-sm btn-light text-primary border border-primary border-opacity-25 w-100 fw-bold rounded-pill" onclick="AppController.addToCart(${p.id})"><i class="fa-solid fa-cart-plus me-1"></i>Thêm</button></div></div></div>`).join('');
    },
    addToCart(productId) {
        const product = this.shopProductsList.find(p => p.id === productId); if(!product) return;
        const existing = this.shopCartItems.find(item => item.id === productId);
        if(existing) { existing.qty += 1; } else { this.shopCartItems.push({ ...product, qty: 1 }); }
        this.updateCartUI(); Toast.fire({ icon: 'success', title: `Đã thêm ${product.ten_sanpham}` });
    },
    updateCartUI() {
        const list = document.getElementById('cartItemsList'); const totalEl = document.getElementById('shopTotalAmount');
        if(!list || !totalEl) return;
        if(this.shopCartItems.length === 0) { list.innerHTML = `<li class="list-group-item text-muted text-center small bg-transparent border-0">Giỏ hàng trống</li>`; totalEl.innerText = '0 ₫'; return; }
        let total = 0;
        list.innerHTML = this.shopCartItems.map(item => {
            total += item.gia * item.qty;
            return `<li class="list-group-item d-flex justify-content-between align-items-center px-2 bg-transparent"><div class="text-start"><span class="small fw-bold text-dark">${item.ten_sanpham}</span><br><span class="text-muted" style="font-size: 11px;">${item.gia.toLocaleString()} ₫ x ${item.qty}</span></div><div class="d-flex align-items-center"><span class="fw-bold text-danger small me-2">${(item.gia * item.qty).toLocaleString()}</span><button class="btn btn-sm btn-light text-danger p-1 rounded-circle border" style="width:25px;height:25px;line-height:1;" onclick="AppController.removeFromCart(${item.id})"><i class="fa-solid fa-xmark"></i></button></div></li>`;
        }).join('');
        totalEl.innerText = total.toLocaleString() + ' ₫';
    },
    removeFromCart(productId) { this.shopCartItems = this.shopCartItems.filter(item => item.id !== productId); this.updateCartUI(); },
    async checkoutShop() {
        if(this.shopCartItems.length === 0) return Swal.fire({title:'Giỏ trống', text:'Vui lòng chọn sản phẩm!', icon:'warning', customClass:{popup:'rounded-4'}});
        const total = this.shopCartItems.reduce((sum, item) => sum + (item.gia * item.qty), 0); const method = document.getElementById('shopPaymentMethod').value;
        if (method === 'Tiền mặt') {
            const { value: tienKhach } = await Swal.fire({ title: '<span class="fs-5 fw-bold">Thu Tiền Mặt</span>', html: `<div class="mb-4 mt-2"><p class="text-muted mb-1 small fw-bold text-uppercase">Hóa đơn Shop</p><h2 class="text-danger fw-bolder mb-0">${total.toLocaleString()} <span class="fs-5">₫</span></h2></div><input type="number" id="tienKhachShop" class="form-control form-control-lg text-center fs-4 fw-bold bg-light border-0 shadow-sm rounded-3" placeholder="0">`, showCancelButton: true, confirmButtonText: 'Xác nhận thu', cancelButtonText: 'Hủy', width: 'auto', customClass: { popup: 'rounded-4 shadow-lg' }, preConfirm: () => { const val = document.getElementById('tienKhachShop').value; if (!val || parseInt(val) < total) { Swal.showValidationMessage('Số tiền không đủ!'); return false; } return parseInt(val); } });
            if (tienKhach) { await Swal.fire({ icon: 'success', title: '<span class="fw-bold">Thành công!</span>', html: `<div class="p-3 bg-light rounded-3 text-start small border"><div class="d-flex justify-content-between mb-2"><span class="text-muted">Khách đưa:</span><span class="fw-bold text-dark">${parseInt(tienKhach).toLocaleString()} ₫</span></div><div class="d-flex justify-content-between border-top pt-2"><span class="text-muted">Trả lại:</span><span class="fw-bold text-primary fs-6">${(tienKhach - total).toLocaleString()} ₫</span></div></div>`, confirmButtonText: 'Hoàn tất', width: 'auto', customClass: { popup: 'rounded-4 shadow-lg' } }); this.completeShopCheckout(); }
        } else {
            const qrUrl = `https://img.vietqr.io/image/SACOMBANK-070145456744-compact.png?amount=${total}&addInfo=THANH TOAN GIAN HANG&accountName=VU TA HANG`;
            await Swal.fire({ title: '<span class="fs-5 fw-bold">Quét mã QR</span>', html: `<div class="bg-white p-2 rounded-4 shadow-sm border d-inline-block mb-3 mt-2"><img src="${qrUrl}" class="img-fluid rounded-3" style="max-width: 220px;"></div><p class="mb-0 small text-muted fw-bold text-uppercase">Số tiền</p><h3 class="text-danger fw-bolder">${total.toLocaleString()} <span class="fs-5">₫</span></h3>`, confirmButtonText: 'Đã nhận tiền', showCancelButton: true, cancelButtonText: 'Hủy', width: 'auto', customClass: { popup: 'rounded-4 shadow-lg' } }).then((result) => { if (result.isConfirmed) this.completeShopCheckout(); });
        }
    },
    completeShopCheckout() { this.shopCartItems = []; this.updateCartUI(); Toast.fire({ icon: 'success', title: 'Đã lưu đơn hàng!' }); },

    startScanner() { this.qrScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 200 }); this.qrScanner.render((t) => this.processCheckinLogic(t)); },
    setupUsbScannerListener() {}
};

window.addEventListener('DOMContentLoaded', () => AppController.init());