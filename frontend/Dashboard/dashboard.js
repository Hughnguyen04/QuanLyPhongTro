const role = localStorage.getItem("role");
if (!role) location.href = "../Login/login.html";

/* TITLE */
document.getElementById("title").innerText =
    role === "chutro" ? "Dashboard Chủ trọ" :
    role === "nhanvien" ? "Dashboard Nhân viên quản lý" :
    "Dashboard Người thuê";

/* HIỆN ĐÚNG KHỐI */
document.getElementById(role).style.display = "block";

/* PHÂN QUYỀN MENU */
if (role === "chutro") {
    document.querySelectorAll(".tenant").forEach(e => e.style.display = "none");
}

if (role === "nhanvien") {
    document.querySelectorAll(".tenant").forEach(e => e.style.display = "none");
    document.querySelectorAll(".owner").forEach(e => e.style.display = "none");
}

if (role === "nguoithue") {
    document.querySelectorAll(".staff,.owner").forEach(e => e.style.display = "none");
}

/* ACTIVE MENU */
const page = location.pathname.split("/").pop();
document.querySelectorAll(".sidebar button").forEach(b => {
    if (b.dataset?.page === page) b.classList.add("active");
});

/* NAV */
function go(p) {
    location.href = p;
}

/* LOGOUT */
function logout() {
    localStorage.clear();
    location.href = "../Login/login.html";
}
