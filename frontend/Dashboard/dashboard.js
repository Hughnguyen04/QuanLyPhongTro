/* ================== AUTH ================== */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) {
    location.href = "../Login/login.html";
}

/* ================== TITLE ================== */
const title = document.getElementById("title");
if (title) {
    title.innerText =
        role === "chutro" ? "Dashboard Chủ trọ" :
        role === "nhanvien" ? "Dashboard Nhân viên" :
        "Dashboard Người thuê";
}

/* ================== USER ================== */
const userEl = document.getElementById("username");
if (userEl) userEl.innerText = username || "";

/* ================== SHOW ROLE CONTENT ================== */
const roleBox = document.getElementById(role);
if (roleBox) roleBox.style.display = "block";
