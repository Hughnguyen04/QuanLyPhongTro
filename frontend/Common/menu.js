/* ================== MENU CONFIG ================== */
const menus = {
    chutro: [
        { text: "🏠 Dashboard", link: "dashboard.html" },
        { text: "🏘 Quản lý phòng", link: "../Rooms/rooms.html" },
        { text: "👤 Quản lý người thuê", link: "../Accounts/tenants.html" },
        { text: "🧑‍💼 Quản lý nhân viên", link: "../Accounts/staff.html" },

        { text: "📄 Hợp đồng (người thuê)", link: "contracts-tenant.html" },
        { text: "📄 Hợp đồng (nhân viên)", link: "contracts-staff.html" },

        { text: "💵 Hóa đơn", link: "bills.html" },
        { text: "⚡ Điện nước", link: "meters.html" },
        { text: "📊 Thống kê", link: "reports.html" },

        { text: "🔑 Tài khoản nhân viên", link: "../Accounts/staff.html" },
        { text: "🔑 Tài khoản người thuê", link: "../Accounts/tenants.html" },

        { text: "⚙ Cài đặt hệ thống", link: "settings.html" }
    ],

    nhanvien: [
        { text: "🏠 Dashboard", link: "dashboard.html" },
        { text: "🏘 Quản lý phòng", link: "../Rooms/rooms.html" },
        { text: "👤 Quản lý người thuê", link: "../Accounts/tenants.html" },

        { text: "📄 Hợp đồng (người thuê)", link: "contracts-tenant.html" },

        { text: "💵 Hóa đơn", link: "bills.html" },
        { text: "⚡ Điện nước", link: "meters.html" },
        { text: "📊 Thống kê", link: "reports.html" },

        { text: "🔑 Tài khoản người thuê", link: "../Accounts/tenants.html" },
        { text: "🔔 Thông báo", link: "notifications.html" }
    ],

    nguoithue: [
        { text: "🏠 Dashboard", link: "dashboard.html" },
        { text: "🧾 Hóa đơn của tôi", link: "my-bills.html" },
        { text: "🔔 Thông báo", link: "notifications.html" }
    ]
};

/* ================== RENDER MENU ================== */
function renderMenu(role) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || !menus[role]) return;

    sidebar.innerHTML = "";

    menus[role].forEach(m => {
        const btn = document.createElement("button");
        btn.innerText = m.text;

        // active menu
        const currentPage = location.pathname.split("/").pop();
        if (currentPage === m.link.split("/").pop()) {
            btn.classList.add("active");
        }

        btn.onclick = () => location.href = m.link;
        sidebar.appendChild(btn);
    });
}

/* ================== AUTO INIT ================== */
document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("role");
    if (!role) {
        location.href = "../Login/login.html";
        return;
    }
    renderMenu(role);
});

/* ================== TOGGLE ================== */
function toggleMenu() {
    document.getElementById("sidebar")?.classList.toggle("show");
}

function toggleUserMenu() {
    const m = document.getElementById("userMenu");
    if (m) m.style.display = m.style.display === "block" ? "none" : "block";
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
    location.href = "../Login/login.html";
}
