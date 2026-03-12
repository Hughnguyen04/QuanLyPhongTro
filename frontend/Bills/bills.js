/* ================== AUTH ================== */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");
const userBuildings = JSON.parse(localStorage.getItem("buildings") || "[]");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";
renderMenu(role);

/* ================== DATA ================== */
let listBills = [...bills]; // từ data.js

/* ================== INIT FILTER ================== */
function initFilters() {
    const bSelect = document.getElementById("buildingFilter");
    const mSelect = document.getElementById("monthFilter");

    let list = listBills;

    if (role === "nhanvien" && userBuildings.length) {
        list = listBills.filter(b => userBuildings.includes(b.building));
    }

    const buildings = [...new Set(list.map(b => b.building))];
    const months = [...new Set(list.map(b => b.month))];

    bSelect.innerHTML = `<option value="">Tất cả tòa</option>`;
    buildings.forEach(b => bSelect.innerHTML += `<option value="${b}">${b}</option>`);

    mSelect.innerHTML = `<option value="">Tất cả tháng</option>`;
    months.forEach(m => mSelect.innerHTML += `<option value="${m}">${m}</option>`);
}

/* ================== RENDER ================== */
function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const building = document.getElementById("buildingFilter").value;
    const month = document.getElementById("monthFilter").value;
    const status = document.getElementById("statusFilter").value;
    const tbody = document.getElementById("tbody");

    let list = listBills;

    if (role === "nhanvien" && userBuildings.length) {
        list = listBills.filter(b => userBuildings.includes(b.building));
    }

    tbody.innerHTML = "";

    let total = 0, unpaid = 0, paid = 0, sum = 0;

    list
        .filter(b =>
            b.room.toLowerCase().includes(key) &&
            (building === "" || b.building === building) &&
            (month === "" || b.month === month) &&
            (status === "" || b.status === status)
        )
        .forEach(b => {
            total++;
            sum += b.total;

            if (b.status === "Chưa thanh toán") unpaid++;
            if (b.status === "Đã thanh toán") paid++;

            tbody.innerHTML += `
                <tr>
                    <td>${b.id}</td>
                    <td>${b.room}</td>
                    <td>${b.building}</td>
                    <td>${b.month}</td>
                    <td>${b.electric}</td>
                    <td>${b.water}</td>
                    <td>${b.total.toLocaleString()}</td>
                    <td>${b.status}</td>
                    <td>
                        <button onclick="editBill('${b.id}')">✏️</button>
                        ${role==="chutro" ? `<button onclick="deleteBill('${b.id}')">🗑</button>` : ""}
                    </td>
                </tr>
            `;
        });

    document.getElementById("total").innerText = total;
    document.getElementById("unpaid").innerText = unpaid;
    document.getElementById("paid").innerText = paid;
    document.getElementById("sum").innerText = sum.toLocaleString();
}

/* ================== ACTION ================== */
function editBill(id) {
    alert("Sửa hóa đơn " + id);
}

function deleteBill(id) {
    if (role !== "chutro") return;

    if (confirm("Xóa hóa đơn " + id + "?")) {
        bills = bills.filter(b => b.id !== id);
        listBills = [...bills];
        initFilters();
        render();
    }
}

/* ================== INIT ================== */
initFilters();
render();