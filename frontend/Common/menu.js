/* ================== MENU CONFIG ================== */
const ROOT = ""; 
// nếu project có thư mục gốc ví dụ /QLTro thì đổi thành:
// const ROOT = "/QLTro";

const menus = {
    chutro: [
        { icon:"", text:"Dashboard", link:"../Dashboard/dashboard.html" },

        { icon:"", text:"Quản lý phòng", link:"../Rooms/rooms.html" },
        { icon:"", text:"Quản lý người thuê", link:"../Tenants/tenants.html" },
        { icon:"", text:"Quản lý nhân viên", link:"../Staff/staff.html" },

        { icon:"", text:"Hợp đồng", link:"../Contracts/contracts.html" },
        { icon:"", text:"Tài khoản", link:"../Accounts/accounts.html" },

        { icon:"", text:"Hóa đơn", link:"../Bills/bills.html" },
        { icon:"", text:"Điện nước", link:"../Meter/meter.html" },
        { icon:"", text:"Thống kê", link:"../Stats/stats.html" },

        { icon:"", text:"Cài đặt hệ thống", link:"../Settings/settings.html" }
    ],

    nhanvien: [
        { icon:"", text:"Dashboard", link:"../Dashboard/dashboard.html" },
        { icon:"", text:"Quản lý phòng", link:"../Rooms/rooms.html" },
        { icon:"", text:"Quản lý người thuê", link:"../Tenants/tenants.html" },

        { icon:"", text:"Hợp đồng", link:"../Contracts/contracts.html" },
        { icon:"", text:"Tài khoản", link:"../Accounts/accounts.html" },

        { icon:"", text:"Hóa đơn", link:"../Bills/bills.html" },
        { icon:"", text:"Điện nước", link:"../Meter/meter.html" },
        { icon:"", text:"Thống kê", link:"../Stats/stats.html" },

        { icon:"", text:"Thông báo", link:"../Notifications/notifications.html" }
    ],

    nguoithue: [
        { icon:"", text:"Dashboard", link:"../Dashboard/dashboard.html" },
        { icon:"", text:"Hóa đơn của tôi", link:"../Bills/mybills.html" },
        { icon:"", text:"Thông báo", link:"../Notifications/notifications.html" }
    ]
};


/* ================== RENDER MENU ================== */
function renderMenu(role){

    const sidebar = document.getElementById("sidebar");
    if (!sidebar || !menus[role]) return;

    sidebar.innerHTML = "";

    const currentPage = location.pathname.split("/").pop().toLowerCase();

    menus[role].forEach(m => {

        const item = document.createElement("div");
        item.className = "menu-item";

        const page = m.link.split("/").pop().toLowerCase();
        if (page === currentPage) item.classList.add("active");

        item.innerHTML = `
            <span class="icon">${m.icon}</span>
            <span class="text">${m.text}</span>
        `;

        item.onclick = ()=> location.href = ROOT + m.link;

        sidebar.appendChild(item);
    });
}


/* ================== USER NAV ================== */
function openMyInfo() {
    location.href = ROOT + "../Infor/infor.html";
}

function openChangePass() {
    location.href = ROOT + "../ChangePass/changepass.html";
}


/* ================== USER DISPLAY ================== */
function loadUserDisplay(){

    const role = localStorage.getItem("role");

    const name =
        localStorage.getItem("name") ||
        localStorage.getItem("username") ||
        localStorage.getItem("user") ||
        "";

    const u = document.getElementById("username");
    if (!u) return;

    if(!name){
        u.innerText = "Chưa đăng nhập";
        return;
    }

    u.innerText = name;
}


/* ================== INIT ================== */
document.addEventListener("DOMContentLoaded", () => {

    const role = localStorage.getItem("role");

    if (!role) {
        location.href = ROOT + "../Login/login.html";
        return;
    }

    renderMenu(role);
    loadUserDisplay();
});


/* ================== TOGGLE ================== */
function toggleMenu() {
    document.getElementById("sidebar")?.classList.toggle("show");
}

function toggleUserMenu() {
    const m = document.getElementById("userMenu");
    if (!m) return;
    m.style.display = m.style.display === "block" ? "none" : "block";
}


/* ================== CLICK OUTSIDE ================== */
document.addEventListener("click", e => {

    if (!e.target.closest(".sidebar") && !e.target.closest(".menu-btn")) {
        document.getElementById("sidebar")?.classList.remove("show");
    }

    if (!e.target.closest(".user-box")) {
        const um = document.getElementById("userMenu");
        if (um) um.style.display = "none";
    }
});


/* ================== LOGOUT ================== */
function logout() {
    localStorage.clear();
    location.href = ROOT + "../Login/login.html";
}