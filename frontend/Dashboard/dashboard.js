
const role = localStorage.getItem("role");
if (!role) location.href = "login.html";

document.getElementById("title").innerText =
    role === "chutro" ? "Dashboard Chủ trọ" :
        role === "nhanvien" ? "Dashboard Nhân viên quản lý" :
            "Dashboard Người thuê";

document.getElementById(role).style.display = "block";
if (role === "chutro") {
    document.querySelectorAll(".tenant").forEach(e => e.style.display = "none");
}

if (role === "nhanvien") {
    document.querySelectorAll(".tenant").forEach(e => e.style.display = "none");
    document.querySelectorAll("[data-page='settings.html']").forEach(e => e.style.display = "none");
}

if (role === "nguoithue") {
    document.querySelectorAll(".staff,.owner").forEach(e => e.style.display = "none");
}

const page = location.pathname.split("/").pop();
document.querySelectorAll(".sidebar button").forEach(b => {
    if (b.dataset.page === page) b.classList.add("active");
});

function go(p) {
    if (p === 'tenants.html') location.href = '../Tenant/tenants.html';
    else if (p === 'bills.html') location.href = '../Bill/bills.html';
    else if (p === 'dashboard.html') location.href = 'dashboard.html';
    else location.href = p;
}

// Đăng xuất
function logout() {
    localStorage.clear();
    location.href = "login.html";
}
