/* ===== AUTH ===== */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

const userEl = document.getElementById("username");
if (userEl) userEl.innerText = username;

renderMenu(role);

let listContracts = [...contracts];

if (role === "nhanvien") {
    const acc = accounts.find(a => a.username === username);
    if (acc && acc.buildings) {
        listContracts = listContracts.filter(c =>
            acc.buildings.includes(c.building)
        );
    }
}


function initBuildings() {
    const select = document.getElementById("buildingFilter");
    if (!select) return;

    const buildings = [...new Set(listContracts.map(c => c.building))];

    select.innerHTML = `<option value="">Tất cả tòa</option>`;

    buildings.forEach(b => {
        select.innerHTML += `<option value="${b}">${b}</option>`;
    });
}


function getStatus(c) {
    const today = new Date();
    const end = new Date(c.end);
    return end >= today ? "Đang hiệu lực" : "Hết hạn";
}


function render() {
    const key = document.getElementById("key")?.value.toLowerCase() || "";
    const building = document.getElementById("buildingFilter")?.value || "";
    const tbody = document.getElementById("tbody");

    if (!tbody) return;

    let total = 0;
    let active = 0;
    let expired = 0;
    let html = "";

    listContracts
        .filter(c =>
            c.tenantName.toLowerCase().includes(key) &&
            (building === "" || c.building === building)
        )
        .forEach(c => {

            total++;

            const status = getStatus(c);

            if (status === "Đang hiệu lực") active++;
            else expired++;

            html += `
            <tr>
                <td>${c.id}</td>
                <td>${c.tenantName}</td>
                <td>${c.room}</td>
                <td>${c.building}</td>
                <td>${c.start}</td>
                <td>${c.end}</td>
                <td>${c.deposit.toLocaleString("vi-VN")}đ</td>
                <td>${status}</td>
                <td>
                    <button onclick="editContract('${c.id}')">✏️</button>
                    ${role === "chutro" ? `<button onclick="deleteContract('${c.id}')">🗑</button>` : ""}
                </td>
            </tr>
            `;
        });

    tbody.innerHTML = html;

    document.getElementById("total").innerText = total;
    document.getElementById("active").innerText = active;
    document.getElementById("expired").innerText = expired;
}


function addContract() {

    const tenant = prompt("Tên người thuê:");
    if (!tenant) return;

    const room = prompt("Phòng:");
    if (!room) return;

    const building = prompt("Tòa:");
    if (!building) return;

    const start = prompt("Ngày bắt đầu (YYYY-MM-DD):", "2025-01-01");
    const end = prompt("Ngày kết thúc (YYYY-MM-DD):", "2025-12-31");
    const deposit = Number(prompt("Tiền cọc:", "2000000"));

    const id = "C" + Math.floor(Math.random() * 10000);

    const contract = {
        id,
        tenantName: tenant,
        room,
        building,
        start,
        end,
        deposit
    };

    contracts.push(contract);
    listContracts.push(contract);

    initBuildings();
    render();
}


function editContract(id) {

    const c = contracts.find(x => x.id === id);
    if (!c) return;

    c.end = prompt("Ngày kết thúc:", c.end) || c.end;
    c.deposit = Number(prompt("Tiền cọc:", c.deposit)) || c.deposit;

    render();
}


function deleteContract(id) {

    if (role !== "chutro") return;
    if (!confirm("Xóa hợp đồng?")) return;

    const idx = contracts.findIndex(c => c.id === id);

    if (idx > -1) contracts.splice(idx, 1);

    listContracts = listContracts.filter(c => c.id !== id);

    render();
}

document.getElementById("key")?.addEventListener("input", render);
document.getElementById("buildingFilter")?.addEventListener("change", render);

initBuildings();
render();