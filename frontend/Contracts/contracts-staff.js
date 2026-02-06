const role = localStorage.getItem("role");
if (role !== "chutro") {
    alert("Không có quyền");
    location.href = "../Dashboard/dashboard.html";
}

const username = localStorage.getItem("username");
document.getElementById("username").innerText = username || "";

const sidebar = document.getElementById("sidebar");
[
    { text: "🏠 Dashboard", link: "../Dashboard/dashboard.html" },
    { text: "📄 Hợp đồng (nhân viên)", link: "contracts-staff.html" }
].forEach(m => {
    const b = document.createElement("button");
    b.innerText = m.text;
    b.onclick = () => location.href = m.link;
    sidebar.appendChild(b);
});

function toggleMenu() { sidebar.classList.toggle("show"); }
function toggleUserMenu() {
    const m = document.getElementById("userMenu");
    m.style.display = m.style.display === "block" ? "none" : "block";
}
function logout() {
    localStorage.clear();
    location.href = "../Login/login.html";
}
