const role = localStorage.getItem("role");
const username = localStorage.getItem("username");
if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";

const menus = {
    chutro: [
        { text: "🏠 Dashboard", link: "../Dashboard/dashboard.html" },
        { text: "📄 Hợp đồng (người thuê)", link: "contracts-tenant.html" },
        { text: "📄 Hợp đồng (nhân viên)", link: "contracts-staff.html" }
    ],
    nhanvien: [
        { text: "🏠 Dashboard", link: "../Dashboard/dashboard.html" },
        { text: "📄 Hợp đồng (người thuê)", link: "contracts-tenant.html" }
    ]
};

const sidebar = document.getElementById("sidebar");
menus[role].forEach(m => {
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

const data = [
    { id: "HD01", name: "Nguyễn Văn B", room: "P101", date: "01/01/2025" }
];

const tbody = document.getElementById("tbody");
function render() {
    tbody.innerHTML = "";
    data.forEach(d => {
        tbody.innerHTML += `
        <tr>
            <td>${d.id}</td>
            <td>${d.name}</td>
            <td>${d.room}</td>
            <td>${d.date}</td>
            <td>Xem | Sửa</td>
        </tr>`;
    });
}
render();
