const API_URL = "http://localhost:8080/quanlyphongtro/api/users";

const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

/* ===== DATA ===== */
let listStaff = [];
let listTenants = [];
let listAll = [];
let editingId = null;

/* ===== LOAD DATA FROM API ===== */
async function loadUsers() {
    try {
        console.log("🔄 Fetching from:", API_URL);
        const token = localStorage.getItem("token");
        const response = await fetch(API_URL, {
            headers: {
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });
        console.log("✅ Response status:", response.status);
        
        if (!response.ok) {
            console.error("❌ API Error:", response.statusText);
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📥 API Response:", data);
        
        let users = Array.isArray(data) ? data : (data.data || data.users || []);
        console.log("📋 Parsed users list:", users, "count:", users.length);
        
        if (!users || users.length === 0) {
            console.warn("⚠️ No users returned from API");
            // Fallback: show empty state
            document.getElementById("total").innerText = "0";
            document.getElementById("staff").innerText = "0";
            document.getElementById("tenant").innerText = "0";
            return;
        }
        
        // Xử lý dữ liệu từ API
        listAll = users.map(u => {
            const userRole = (u.role || "").toUpperCase();
            let role = "guest";
            
            // Map role từ API
            if (userRole === "ADMIN" || userRole === "CHUTRO") {
                role = "admin";
            } else if (userRole === "STAFF" || userRole === "NHANVIEN") {
                role = "staff";
            } else {
                role = "guest";
            }
            
            return {
                id: u.userId || u.id || u.username,
                name: u.fullName || u.name || u.username || "Unknown",
                username: u.username || "",
                role: role,
                building: u.manageBuilding || u.building || u.buildingName || "",
                room: u.room || u.roomName || "",
                phone: u.phone || u.phoneNumber || "",
                cccd: u.cccd || u.idNumber || "N/A",
                time: u.createdAt || u.startDate || "N/A",
                endDate: u.endDate || "Chưa có",
                avatar: "https://i.pravatar.cc/150?u=" + (u.userId || u.id || u.username),
                active: u.active !== false
            };
        });
        
        // Split thành staff và tenants
        listStaff = listAll.filter(u => u.role === "staff");
        listTenants = listAll.filter(u => u.role === "guest");
        
        console.log("✅ Loaded", listAll.length, "users");
        console.log("   - Staff:", listStaff.length);
        console.log("   - Tenants:", listTenants.length);
        console.log("   - Processed data:", listAll);
        
        initBuildings();
        render();
    } catch (error) {
        console.error("❌ Lỗi tải dữ liệu:", error);
        console.error("   Error type:", error.name);
        console.error("   Error message:", error.message);
        alert("Lỗi tải danh sách tài khoản: " + error.message);
    }
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", () => {
    console.log("🔄 DOM Loaded, initializing...");
    console.log("   - role:", role);
    console.log("   - username:", username);
    
    // Setup username và menu
    const usernameEl = document.getElementById("username");
    console.log("   - usernameEl found:", !!usernameEl);
    
    if (usernameEl) {
        usernameEl.innerText = username || "";
        console.log("   - Set username text");
    }
    
    if (typeof renderMenu === 'function') {
        console.log("   - Calling renderMenu");
        renderMenu(role);
    } else {
        console.error("   ❌ renderMenu function not found!");
    }
    
    console.log("   - Calling loadUsers");
    // Load dữ liệu từ API
    loadUsers();
});

/* ===== FILTER ===== */
function getRoleFiltered(list) {
    // Nếu là admin/chutro, hiển thị toàn bộ
    if (role === "chutro" || role === "admin") return list;

    // Nếu là staff, chỉ hiển thị những người cùng building
    const myUser = listAll.find(a => a.name === username || a.username === username);
    const myBuilding = myUser?.building || null;

    if (myBuilding) {
        return list.filter(a => !a.building || a.building === myBuilding);
    }
    
    return list;
}

/* ===== INIT BUILDING ===== */
function initBuildings() {
    console.log("🏢 initBuildings called");
    const select = document.getElementById("buildingFilter");
    if (!select) {
        console.error("❌ buildingFilter element not found");
        return;
    }

    const data = getRoleFiltered(listAll);
    const buildings = [...new Set(data.map(a => a.building).filter(Boolean))];
    console.log("   - Buildings:", buildings);

    select.innerHTML = `<option value="">Tất cả tòa</option>`;
    buildings.forEach(b => {
        select.innerHTML += `<option value="${b}">${b}</option>`;
    });
}

/* ===== RENDER ===== */
function render() {
    console.log("📊 render() called");
    const keyEl = document.getElementById("key");
    const roleFilterEl = document.getElementById("roleFilter");
    const buildingEl = document.getElementById("buildingFilter");
    const tbody = document.getElementById("tbody");

    if (!tbody) {
        console.error("❌ tbody element not found");
        return;
    }

    const key = keyEl?.value?.toLowerCase() || "";
    const roleFilter = roleFilterEl?.value || "";
    const building = buildingEl?.value || "";

    console.log("   - Filters: key='" + key + "', role='" + roleFilter + "', building='" + building + "'");
    console.log("   - listAll count:", listAll.length);

    tbody.innerHTML = "";

    let total = 0, staff = 0, tenant = 0;

    getRoleFiltered(listAll)
        .filter(a => {
            // Kiểm tra tên
            if (!a.name.toLowerCase().includes(key)) return false;
            
            // Kiểm tra role filter
            if (roleFilter) {
                // roleFilter là "nhanvien" hoặc "nguoithue", role trong listAll là "staff" hoặc "guest"
                if (roleFilter === "nhanvien" && a.role !== "staff") return false;
                if (roleFilter === "nguoithue" && a.role !== "guest") return false;
            }
            
            // Kiểm tra building
            if (building && a.building !== building) return false;
            
            return true;
        })
        .forEach(a => {
            total++;
            if (a.role === "staff") staff++;
            if (a.role === "guest") tenant++;

            const roleDisplay = a.role === "staff" ? "Nhân viên" : "Người thuê";
            const deleteBtn = (role === "chutro" || role === "admin") ? `<button onclick="event.stopPropagation(); deleteAcc('${a.id}')">🗑</button>` : "";
            
            tbody.innerHTML += `
                <tr onclick="openDetail('${a.id}')">
                    <td>${a.id}</td>
                    <td>${a.name}</td>
                    <td>${roleDisplay}</td>
                    <td>${a.building || ""}</td>
                    <td>${a.room || ""}</td>
                    <td>${a.phone || ""}</td>
                    <td>
                        <button onclick="event.stopPropagation(); editAcc('${a.id}')">✏️</button>
                        ${deleteBtn}
                    </td>
                </tr>
            `;
        });

    console.log("   - Rendered:", total, "rows (staff:", staff, ", tenant:", tenant + ")");
    
    const totalEl = document.getElementById("total");
    const staffEl = document.getElementById("staff");
    const tenantEl = document.getElementById("tenant");
    
    if (totalEl) totalEl.innerText = total;
    if (staffEl) staffEl.innerText = staff;
    if (tenantEl) tenantEl.innerText = tenant;
}

/* ===== DETAIL (SỬA CHÍNH Ở ĐÂY) ===== */
function openDetail(id) {

    const u = listAll.find(x => x.id == id);
    if (!u) return;

    document.getElementById("dAvatar").src = u.avatar;
    document.getElementById("dName").innerText = u.name;

    document.getElementById("dRole").innerText =
        u.role === "staff" ? "Nhân viên" : "Người thuê";

    document.getElementById("dBuilding").innerText = u.building || "";
    document.getElementById("dRoom").innerText = u.room || "";
    document.getElementById("dPhone").innerText = u.phone || "";
    document.getElementById("dCCCD").innerText = u.cccd || "";

    // ===== HIỂN THỊ NGÀY =====
    if (u.role === "staff") {

        document.getElementById("timeLabel").innerHTML =
            "<b>Ngày tạo tài khoản:</b> <span id='dTime'></span>";

        document.getElementById("dTime").innerText = u.time || "";

    } else {

        document.getElementById("timeLabel").innerHTML = `
            <b>Ngày bắt đầu thuê:</b> <span id="dTime"></span><br>
            <b>Ngày kết thúc:</b> <span id="dEnd"></span>
        `;

        document.getElementById("dTime").innerText = u.time || "";
        document.getElementById("dEnd").innerText = u.endDate || "Chưa có";
    }

    document.getElementById("detailModal").style.display = "flex";
}

function closeDetail() {
    document.getElementById("detailModal").style.display = "none";
}

/* ===== FORM ===== */
function openAdd() {
    editingId = null;
    document.getElementById("formTitle").innerText = "Thêm tài khoản";

    clearForm();
    document.getElementById("formModal").style.display = "flex";
}

function editAcc(id) {
    const u = listAll.find(x => x.id == id);
    if (!u) return;

    editingId = id;
    document.getElementById("formTitle").innerText = "Sửa tài khoản";

    document.getElementById("fName").value = u.name;
    
    // Map role từ API (staff/guest) sang form values (nhanvien/nguoithue)
    let formRole = u.role === "staff" ? "nhanvien" : "nguoithue";
    document.getElementById("fRole").value = formRole;
    
    document.getElementById("fBuilding").value = u.building || "";
    document.getElementById("fRoom").value = u.room || "";
    document.getElementById("fPhone").value = u.phone || "";
    document.getElementById("fStart").value = u.time || "";
    document.getElementById("fEnd").value = u.endDate || "";

    document.getElementById("formModal").style.display = "flex";
}

function closeForm() {
    document.getElementById("formModal").style.display = "none";
}

function clearForm() {
    document.getElementById("fName").value = "";
    document.getElementById("fBuilding").value = "";
    document.getElementById("fRoom").value = "";
    document.getElementById("fPhone").value = "";
    document.getElementById("fStart").value = "";
    document.getElementById("fEnd").value = "";
}

/* ===== SAVE ===== */
function saveAcc() {
    const name = document.getElementById("fName").value;
    const roleVal = document.getElementById("fRole").value;  // "nhanvien" hoặc "nguoithue"
    const building = document.getElementById("fBuilding").value;
    const room = document.getElementById("fRoom").value;
    const phone = document.getElementById("fPhone").value;
    const start = document.getElementById("fStart").value;
    const end = document.getElementById("fEnd").value;

    if (!name) return alert("Nhập tên!");

    // Map role từ form (nhanvien/nguoithue) sang internal format (staff/guest)
    const internalRole = roleVal === "nhanvien" ? "staff" : "guest";

    if (editingId) {
        let u = listAll.find(x => x.id == editingId);
        if (!u) return;

        u.name = name;
        u.role = internalRole;
        u.building = building;
        u.room = room;
        u.phone = phone;
        u.time = start;
        u.endDate = end;

    } else {
        const newId = "ID" + Date.now();

        const newAcc = {
            id: newId,
            name,
            role: internalRole,
            building,
            room,
            phone,
            cccd: "000000000000",
            time: start,
            endDate: internalRole === "guest" ? end : "",
            avatar: "https://i.pravatar.cc/150?u=" + newId
        };

        listAll.push(newAcc);
    }

    closeForm();
    initBuildings();
    render();
}

/* ===== DELETE ===== */
function deleteAcc(id) {
    if (role !== "chutro" && role !== "admin") return;

    if (confirm("Xóa tài khoản " + id + " ?")) {
        listAll = listAll.filter(a => a.id !== id);
        initBuildings();
        render();
    }
}