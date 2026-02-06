/* ================== AUTH ================== */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

/* ================== USER ================== */
document.getElementById("username").innerText = username || "";

/* ================== MENU (TỪ Common/menu.js) ================== */
renderMenu(role);

/* =========================================================
   =============== NỘI DUNG QUẢN LÝ PHÒNG ===================
   ========================================================= */

let rooms = [
    { id: "P101", name: "Phòng 101", price: 2500000, status: "Đang thuê" },
    { id: "P102", name: "Phòng 102", price: 2300000, status: "Trống" },
    { id: "P103", name: "Phòng 103", price: 2800000, status: "Đang sửa" },
    { id: "P104", name: "Phòng 104", price: 2000000, status: "Trống" }
];

function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const st = document.getElementById("status").value;
    const tbody = document.getElementById("tbody");

    let total = 0, thue = 0, trong = 0, sua = 0;
    tbody.innerHTML = "";

    rooms
        .filter(r =>
            r.name.toLowerCase().includes(key) &&
            (st === "" || r.status === st)
        )
        .forEach(r => {
            total++;
            if (r.status === "Đang thuê") thue++;
            if (r.status === "Trống") trong++;
            if (r.status === "Đang sửa") sua++;

            tbody.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>${r.name}</td>
                    <td>${r.price.toLocaleString()} đ</td>
                    <td>${r.status}</td>
                    <td>
                        <button onclick="editRoom('${r.id}')">✏️</button>
                        <button onclick="deleteRoom('${r.id}')">🗑</button>
                    </td>
                </tr>
            `;
        });

    document.getElementById("total").innerText = total;
    document.getElementById("thue").innerText = thue;
    document.getElementById("trong").innerText = trong;
    document.getElementById("sua").innerText = sua;
}

function editRoom(id) {
    alert("Sửa phòng " + id);
}

function deleteRoom(id) {
    if (confirm("Xóa phòng " + id + "?")) {
        rooms = rooms.filter(r => r.id !== id);
        render();
    }
}

render();
