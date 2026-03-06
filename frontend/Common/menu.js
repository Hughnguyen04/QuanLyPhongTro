/* ================== MENU CONFIG ================== */
const menus = {
    chutro: [
        { text: "🏠 Dashboard", link: "../Dashboard/dashboard.html" },
        { text: "🏘 Quản lý phòng", link: "../Rooms/rooms.html" },
        { text: "👤 Quản lý người thuê", link: "../Accounts/tenants.html" },
        { text: "🧑‍💼 Quản lý nhân viên", link: "../Accounts/staff.html" },

        { text: "📄 Hợp đồng (người thuê)", link: "../Contracts/contracts-tenant.html" },
        { text: "📄 Hợp đồng (nhân viên)", link: "../Contracts/contracts-staff.html" },

        { text: "💵 Hóa đơn", link: "../Bills/bills.html" },
        { text: "⚡ Điện nước", link: "../Meters/meters.html" },
        { text: "📊 Thống kê", link: "../Reports/reports.html" },

        { text: "⚙ Cài đặt hệ thống", link: "../Settings/settings.html" }
    ],

    nhanvien: [
        { text: "🏠 Dashboard", link: "../Dashboard/dashboard.html" },
        { text: "🏘 Quản lý phòng", link: "../Rooms/rooms.html" },
        { text: "👤 Quản lý người thuê", link: "../Accounts/tenants.html" },

        { text: "📄 Hợp đồng (người thuê)", link: "../Contracts/contracts-tenant.html" },

        { text: "💵 Hóa đơn", link: "../Bills/bills.html" },
        { text: "⚡ Điện nước", link: "../Meters/meters.html" },
        { text: "📊 Thống kê", link: "../Reports/reports.html" },

        { text: "🔔 Thông báo", link: "../Notifications/notifications.html" }
    ],

    nguoithue: [
        { text: "🏠 Dashboard", link: "../Dashboard/dashboard.html" },
        { text: "🧾 Hóa đơn của tôi", link: "../Bills/my-bills.html" },
        { text: "🔔 Thông báo", link: "../Notifications/notifications.html" }
    ]
};

/* ================== RENDER MENU ================== */
function renderMenu(role) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || !menus[role]) return;

    sidebar.innerHTML = "";

    const currentPage = location.pathname.split("/").pop();

    menus[role].forEach(m => {
        const btn = document.createElement("button");
        btn.innerText = m.text;

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
