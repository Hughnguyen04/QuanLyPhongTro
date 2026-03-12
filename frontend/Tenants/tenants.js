/* ================== AUTH ================== */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");
const userBuildings = JSON.parse(localStorage.getItem("buildings") || "[]");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";
renderMenu(role);

/* ================== DATA ================== */
let listTenants = [...tenants]; // từ data.js

/* ================== INIT FILTER PHÒNG ================== */
function initRooms() {
    const select = document.getElementById("roomFilter");

    let list = listTenants;

    // nhân viên chỉ thấy tòa mình
    if (role === "nhanvien" && userBuildings.length) {
        list = listTenants.filter(t => userBuildings.includes(t.building));
    }

    const rooms = [...new Set(list.map(t => t.room))];

    select.innerHTML = `<option value="">Tất cả phòng</option>`;
    rooms.forEach(r => {
        select.innerHTML += `<option value="${r}">${r}</option>`;
    });
}

/* ================== RENDER ================== */
function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const room = document.getElementById("roomFilter").value;
    const status = document.getElementById("statusFilter").value;
    const tbody = document.getElementById("tbody");

    let list = listTenants;

    // nhân viên chỉ thấy tòa mình
    if (role === "nhanvien" && userBuildings.length) {
        list = listTenants.filter(t => userBuildings.includes(t.building));
    }

    tbody.innerHTML = "";

    let total = 0, dang = 0, roi = 0;

    list
        .filter(t =>
            t.name.toLowerCase().includes(key) &&
            (room === "" || t.room === room) &&
            (status === "" || t.status === status)
        )
        .forEach(t => {
            total++;
            if (t.status === "Đang thuê") dang++;
            if (t.status === "Đã rời") roi++;

            tbody.innerHTML += `
                <tr>
                    <td>${t.id}</td>
                    <td>${t.name}</td>
                    <td>${t.room}</td>
                    <td>${t.building}</td>
                    <td>${t.phone}</td>
                    <td>${t.status}</td>
                    <td>
                        <button onclick="editTenant('${t.id}')">✏️</button>
                        ${role==="chutro" ? `<button onclick="deleteTenant('${t.id}')">🗑</button>` : ""}
                    </td>
                </tr>
            `;
        });

    document.getElementById("total").innerText = total;
    document.getElementById("dang").innerText = dang;
    document.getElementById("roi").innerText = roi;
}

/* ================== ACTION ================== */
function editTenant(id) {
    alert("Sửa người thuê " + id);
}

function deleteTenant(id) {
    if (role !== "chutro") return;

    if (confirm("Xóa người thuê " + id + "?")) {
        listTenants = listTenants.filter(t => t.id !== id);

        // cập nhật data gốc
        tenants = tenants.filter(t => t.id !== id);

        initRooms();
        render();
    }
}

/* ================== INIT ================== */
initRooms();
render();