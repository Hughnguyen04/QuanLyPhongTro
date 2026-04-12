document.addEventListener("DOMContentLoaded", () => {

    // ========== LẤY THÔNG TIN TỪ LOCALSTORAGE ==========
    let systemRole = localStorage.getItem("role"); // admin, staff, guest
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName") || username;

    console.log("🔐 ===== DASHBOARD DEBUG =====");
    console.log("System Role from localStorage:", systemRole);
    console.log("Username:", username);
    console.log("Token exists:", !!token);

    // ========== KIỂM TRA ĐĂNG NHẬP ==========
    if (!username || !token) {
        console.log("❌ Chưa đăng nhập, chuyển về login");
        location.href = "../Login/login.html";
        return;
    }

    // ========== MAP ROLE CHÍNH XÁC ==========
    // Chuyển đổi role từ localStorage sang dạng chuẩn
    let displayRole = "";
    let dashboardType = "";
    
    // Xử lý role
    if (systemRole === "admin" || systemRole === "chutro" || systemRole === "ADMIN") {
        displayRole = "Chủ trọ";
        dashboardType = "manager";
        systemRole = "admin";
        console.log("✅ Role xác định: ADMIN (Chủ trọ)");
    } 
    else if (systemRole === "staff" || systemRole === "nhanvien" || systemRole === "STAFF") {
        displayRole = "Nhân viên";
        dashboardType = "manager";
        systemRole = "staff";
        console.log("✅ Role xác định: STAFF (Nhân viên)");
    } 
    else {
        displayRole = "Người thuê";
        dashboardType = "tenant";
        systemRole = "guest";
        console.log("✅ Role xác định: GUEST (Người thuê)");
    }
    
    // Lưu lại role chuẩn
    localStorage.setItem("role", systemRole);
    localStorage.setItem("roleDisplay", displayRole);

    // ========== HIỂN THỊ TÊN NGƯỜI DÙNG ==========
    const usernameElement = document.getElementById("username");
    if (usernameElement) {
        usernameElement.innerText = fullName || username;
    }
    
    // Cập nhật avatar
    const avatarElement = document.querySelector(".avatar-text");
    if (avatarElement) {
        avatarElement.textContent = (fullName || username).charAt(0).toUpperCase();
    }

    // ========== RENDER MENU SIDEBAR ==========
    if (typeof renderMenu === 'function') {
        renderMenu(systemRole);
    }

    // ========== LẤY UI ELEMENTS ==========
    const managerUI = document.getElementById("dashboardManager");
    const tenantUI = document.getElementById("dashboardTenant");

    if (!managerUI || !tenantUI) {
        console.error("❌ Không tìm thấy UI elements!");
        return;
    }

    // ========== HIỂN THỊ GIAO DIỆN ĐÚNG THEO ROLE ==========
    console.log("🎯 Dashboard type:", dashboardType);
    
    if (dashboardType === "tenant") {
        console.log("👤 Hiển thị giao diện NGƯỜI THUÊ");
        managerUI.style.display = "none";
        tenantUI.style.display = "block";
    } else {
        console.log("👔 Hiển thị giao diện QUẢN LÝ (Admin/Staff)");
        managerUI.style.display = "block";
        tenantUI.style.display = "none";
    }

    // ========== SET TITLE ==========
    let titleText = "";
    if (systemRole === "admin") {
        titleText = "🏢 Dashboard Chủ trọ";
    } else if (systemRole === "staff") {
        titleText = "👔 Dashboard Nhân viên";
    } else {
        titleText = "🏠 Dashboard Người thuê";
    }
    document.getElementById("title").innerText = titleText;
    console.log("Title set to:", titleText);

    // ========== FIX CLICK AVATAR ==========
    const userBox = document.querySelector(".user-box");
    const userMenu = document.getElementById("userMenu");

    if (userBox && userMenu) {
        // Xóa event cũ nếu có
        const newUserBox = userBox.cloneNode(true);
        userBox.parentNode.replaceChild(newUserBox, userBox);
        
        const newUserMenu = document.getElementById("userMenu");
        
        newUserBox.addEventListener("click", (e) => {
            e.stopPropagation();
            newUserMenu.classList.toggle("show");
            console.log("Menu toggled");
        });

        // Click ra ngoài thì đóng menu
        document.addEventListener("click", (e) => {
            if (!newUserBox.contains(e.target) && !newUserMenu.contains(e.target)) {
                newUserMenu.classList.remove("show");
            }
        });
    } else {
        console.log("⚠️ Không tìm thấy user-box hoặc user-menu");
    }

    // ========== GỌI API LẤY DỮ LIỆU ==========
    (async () => {

        try {
            console.log("📡 Đang gọi API...");
            
            const [roomsRaw, tenantsRaw, billsRaw] = await Promise.all([
                API.getRooms(),
                API.getTenants(),
                API.getBills()
            ]);

            console.log("📊 API Responses:");
            console.log("- Rooms:", roomsRaw);
            console.log("- Tenants:", tenantsRaw);
            console.log("- Bills:", billsRaw);

            // ========== XỬ LÝ DỮ LIỆU PHÒNG ==========
            let rooms = [];
            if (roomsRaw) {
                if (Array.isArray(roomsRaw)) {
                    rooms = roomsRaw;
                } else if (roomsRaw.data && Array.isArray(roomsRaw.data)) {
                    rooms = roomsRaw.data;
                }
            }
            
            const mappedRooms = rooms.map(r => ({
                id: r.RoomID || r.id,
                name: r.RoomName || r.room_name || "Không tên",
                building: r.BuildingName || r.building_name || (r.RoomName ? r.RoomName.charAt(0) : ''),
                price: Number(r.BasePrice || r.base_price || 0),
                status: (r.Status || r.status || "TRONG").toUpperCase()
            }));

            // ========== XỬ LÝ DỮ LIỆU NGƯỜI THUÊ ==========
            let tenants = [];
            if (tenantsRaw) {
                if (Array.isArray(tenantsRaw)) {
                    tenants = tenantsRaw;
                } else if (tenantsRaw.data && Array.isArray(tenantsRaw.data)) {
                    tenants = tenantsRaw.data;
                }
            }
            
            const mappedTenants = tenants.map(t => ({
                id: t.TenantID || t.id,
                name: t.FullName || t.full_name || "Không tên",
                room: t.RoomName || t.room_name,
                building: t.BuildingName || t.building_name,
                phone: t.Phone || t.phone
            }));

            // ========== XỬ LÝ DỮ LIỆU HÓA ĐƠN ==========
            let bills = [];
            if (billsRaw) {
                if (Array.isArray(billsRaw)) {
                    bills = billsRaw;
                } else if (billsRaw.data && Array.isArray(billsRaw.data)) {
                    bills = billsRaw.data;
                }
            }
            
            const mappedBills = bills.map(b => {
                const room = mappedRooms.find(r => r.name === (b.RoomName || b.room_name));
                
                let total = 0;
                if (b.TotalAmount) {
                    total = Number(b.TotalAmount);
                } else {
                    total = (Number(b.RoomPrice) || 0) + 
                            (Number(b.ElectricCost) || 0) + 
                            (Number(b.WaterCost) || 0) +
                            (Number(b.ServiceFee) || 0) +
                            (Number(b.LateFee) || 0);
                }
                
                let status = "CHUA_THANH_TOAN";
                const rawStatus = (b.Status || b.status || "").toUpperCase();
                if (rawStatus.includes("DA") || rawStatus === "PAID") status = "DA_THANH_TOAN";
                else if (rawStatus.includes("QUA") || rawStatus === "OVERDUE") status = "QUA_HAN";
                
                return {
                    id: b.BillID || b.id,
                    room: b.RoomName || b.room_name,
                    building: room?.building || "Không rõ",
                    total: total,
                    status: status,
                    tenantName: b.FullName || b.full_name || "",
                    tenantNames: b.TenantNames || b.tenant_names || "",
                    month: b.Month || b.month,
                    year: b.Year || b.year,
                    dueDate: b.DueDate || b.due_date,
                    paymentDate: b.PaymentDate || b.payment_date,
                    roomPrice: Number(b.RoomPrice) || 0,
                    electricCost: Number(b.ElectricCost) || 0,
                    waterCost: Number(b.WaterCost) || 0,
                    serviceFee: Number(b.ServiceFee) || 0,
                    lateFee: Number(b.LateFee) || 0
                };
            });

            console.log("✅ Processed data:");
            console.log("- Rooms:", mappedRooms.length);
            console.log("- Tenants:", mappedTenants.length);
            console.log("- Bills:", mappedBills.length);

            // ========== XỬ LÝ THEO ROLE ==========
            if (systemRole === "admin" || systemRole === "staff") {
                console.log("📊 Đang tải dữ liệu cho QUẢN LÝ...");
                loadManagerDashboard(mappedRooms, mappedTenants, mappedBills, fullName || username);
            } 
            else {
                console.log("👤 Đang tải dữ liệu cho NGƯỜI THUÊ...");
                loadTenantDashboard(mappedRooms, mappedTenants, mappedBills, username, fullName || username);
            }

        } catch (err) {
            console.error("❌ Lỗi API:", err);
            showError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối!");
            
            if (systemRole === "admin" || systemRole === "staff") {
                setText("tongPhong", "0");
                setText("phongThue", "0");
                setText("phongTrong", "0");
                setText("soNguoi", "0");
                setText("hoaDonNo", "0");
                setHTML("phongTrongTable", "全天<td colspan='3'>⚠️ Không thể tải dữ liệu</td> </tr>");
                setHTML("noTable", "全天<td colspan='3'>⚠️ Không thể tải dữ liệu</td> </tr>");
            }
        }

    })();

});

// ========== DASHBOARD CHO ADMIN VÀ STAFF ==========
function loadManagerDashboard(rooms, tenants, bills, displayName) {
    setText("welcomeName", `Chào ${displayName}!`);
    renderDate();

    // Thống kê phòng
    const totalRooms = rooms.length;
    const rentedRooms = rooms.filter(r => r.status === "DANG_THUE" || r.status === "ACTIVE").length;
    const emptyRooms = rooms.filter(r => r.status === "TRONG" || r.status === "EMPTY").length;
    const totalTenants = tenants.length;

    setText("tongPhong", totalRooms);
    setText("phongThue", rentedRooms);
    setText("phongTrong", emptyRooms);
    setText("soNguoi", totalTenants);

    // Hóa đơn chưa thanh toán
    const unpaidBills = bills.filter(b => 
        b.status === "CHUA_THANH_TOAN" || b.status === "QUA_HAN"
    );

    setText("hoaDonNo", unpaidBills.length);
    
    console.log("📊 Manager Stats:", {
        totalRooms, rentedRooms, emptyRooms, totalTenants, unpaidBills: unpaidBills.length
    });

    // Load danh sách phòng trống
    loadPhongTrong(rooms);
    
    // Load danh sách hóa đơn chưa thu
    loadUnpaidBills(unpaidBills);
    
    // Load việc cần làm
    loadTodo(unpaidBills.length, emptyRooms, totalTenants);
}

// ========== DASHBOARD CHO GUEST (NGƯỜI THUÊ) ==========
function loadTenantDashboard(rooms, tenants, bills, username, displayName) {
    setText("welcomeTenant", `Chào ${displayName}!`);
    renderDateTenant();

    // Tìm phòng của người thuê
    const myTenant = tenants.find(t => t.name === username);
    console.log("My tenant:", myTenant);
    
    const myRoom = rooms.find(r => r.name === myTenant?.room);
    console.log("My room:", myRoom);
    
    const myBills = bills.filter(b => b.room === myTenant?.room)
                          .sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month));
    const latestBill = myBills[0];
    console.log("My bills:", myBills.length);
    console.log("Latest bill:", latestBill);

    setText("myRoom", myTenant?.room || "Chưa có phòng");
    setText("myBuilding", myTenant?.building || "Chưa có");
    setText("myPrice", myRoom ? formatCurrency(myRoom.price) : "0đ");

    if (latestBill) {
        setText("myBill", formatCurrency(latestBill.total));
        setText("myBillStatus", formatStatus(latestBill.status));
        setHTML("todoTenant", `
            <li>💰 Hóa đơn tháng ${latestBill.month}/${latestBill.year}: ${formatCurrency(latestBill.total)}</li>
            <li>🏠 Tiền phòng: ${formatCurrency(latestBill.roomPrice)}</li>
            <li>⚡ Tiền điện: ${formatCurrency(latestBill.electricCost)}</li>
            <li>💧 Tiền nước: ${formatCurrency(latestBill.waterCost)}</li>
            <li>🛎️ Phí dịch vụ: ${formatCurrency(latestBill.serviceFee)}</li>
            ${latestBill.lateFee > 0 ? `<li>⚠️ Phí trễ hạn: ${formatCurrency(latestBill.lateFee)}</li>` : ""}
            ${latestBill.status === "CHUA_THANH_TOAN" ? `<li>⏰ Hạn thanh toán: ${latestBill.dueDate ? new Date(latestBill.dueDate).toLocaleDateString('vi-VN') : "Chưa có"}</li>` : ""}
            <li>📌 Trạng thái: ${formatStatus(latestBill.status)}</li>
        `);
    } else {
        setText("myBill", "0đ");
        setText("myBillStatus", "Chưa có hóa đơn");
        setHTML("todoTenant", "<li>📋 Chưa có hóa đơn tháng này</li>");
    }
}

// ========== CÁC HÀM HỖ TRỢ ==========

function loadPhongTrong(rooms) {
    const emptyRooms = rooms.filter(r => r.status === "TRONG" || r.status === "EMPTY");
    
    const tbody = document.getElementById("phongTrongTable");
    if (!tbody) return;
    
    if (emptyRooms.length === 0) {
        tbody.innerHTML = '全天<td colspan="3">✅ Không có phòng trống</td> </tr>';
    } else {
        tbody.innerHTML = emptyRooms.map(r => `
            <tr>
                <td><b>${r.name || "N/A"}</b></td>
                <td>${r.building || "N/A"}</td>
                <td>${formatCurrency(r.price)}</td>
            </tr>
        `).join("");
    }
}

function loadUnpaidBills(unpaidBills) {
    const grouped = {};
    
    unpaidBills.forEach(bill => {
        if (!grouped[bill.room]) {
            grouped[bill.room] = {
                room: bill.room,
                total: 0,
                tenants: []
            };
        }
        grouped[bill.room].total += bill.total;
        
        if (bill.tenantNames) {
            bill.tenantNames.split(',').forEach(name => {
                name = name.trim();
                if (name && !grouped[bill.room].tenants.includes(name)) {
                    grouped[bill.room].tenants.push(name);
                }
            });
        } else if (bill.tenantName && !grouped[bill.room].tenants.includes(bill.tenantName)) {
            grouped[bill.room].tenants.push(bill.tenantName);
        }
    });
    
    const result = Object.values(grouped);
    const tbody = document.getElementById("noTable");
    if (!tbody) return;
    
    if (result.length === 0) {
        tbody.innerHTML = '全天<td colspan="3">✅ Không có hóa đơn chưa thu</td> </tr>';
    } else {
        tbody.innerHTML = result.map(r => `
            <tr>
                <td><b>${r.room || "N/A"}</b></td>
                <td>${r.tenants.join(", ") || "Chưa có"}</td>
                <td style="color:#c62828; font-weight:600;">${formatCurrency(r.total)}</td>
            </tr>
        `).join("");
    }
}

function loadTodo(unpaidCount, emptyRoomsCount, totalTenants) {
    const todoList = document.getElementById("todoList");
    if (!todoList) return;
    
    let items = [];
    
    if (unpaidCount > 0) {
        items.push(`💰 Thu ${unpaidCount} hóa đơn chưa thanh toán`);
    } else {
        items.push(`✅ Đã thu hết hóa đơn tháng này`);
    }
    
    if (emptyRoomsCount > 0) {
        items.push(`🏠 Có ${emptyRoomsCount} phòng trống cần cho thuê`);
    }
    
    if (totalTenants > 0) {
        items.push(`👥 Quản lý ${totalTenants} người thuê`);
    }
    
    items.push(`📋 Kiểm tra hợp đồng sắp hết hạn`);
    
    todoList.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString("vi-VN") + " đ";
}

function formatStatus(status) {
    const map = {
        'DA_THANH_TOAN': '✅ Đã thanh toán',
        'CHUA_THANH_TOAN': '⏳ Chưa thanh toán',
        'CHUA_DEN_KY': '📅 Chưa đến kỳ',
        'QUA_HAN': '⚠️ Quá hạn'
    };
    return map[status] || status || 'Chưa xác định';
}

function showError(message) {
    const toast = document.createElement("div");
    toast.className = "toast error";
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value ?? "0";
}

function setHTML(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value ?? "";
}

function renderDate() {
    const d = new Date();
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    setText("today", `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
}

function renderDateTenant() {
    const d = new Date();
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    setText("todayTenant", `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
}

function logout() {
    localStorage.clear();
    window.location.href = "../Login/login.html";
}

function openMyInfo() {
    window.location.href = "../Infor/infor.html";
}

function openChangePass() {
    window.location.href = "../ChangePass/changepass.html";
}

function toggleUserMenu() {
    const menu = document.getElementById("userMenu");
    if (menu) menu.classList.toggle("show");
}