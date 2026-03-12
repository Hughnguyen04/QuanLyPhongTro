/* ================== AUTH ================== */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");
const userBuildings = JSON.parse(localStorage.getItem("buildings") || "[]");

if (!role) location.href = "../Login/login.html";

/* ================== USER ================== */
document.getElementById("username").innerText = username || "";

/* ================== MENU ================== */
renderMenu(role);

/* =========================================================
   =============== DATA (LẤY TỪ data.js) ====================
   ========================================================= */

// rooms lấy từ data.js (không khai báo lại)
let listRooms = [...rooms];

/* =========================================================
   =============== RENDER ===================
   ========================================================= */

function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const st = document.getElementById("status").value;
    const tbody = document.getElementById("tbody");

    let list = listRooms;

    /* ⭐ NHÂN VIÊN CHỈ THẤY TÒA CỦA MÌNH */
    if (role === "nhanvien" && userBuildings.length) {
        list = listRooms.filter(r => userBuildings.includes(r.building));
    }

    let total = 0, thue = 0, trong = 0, sua = 0;
    tbody.innerHTML = "";

    list
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
                    <td>${r.building}</td>
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

/* ================== ACTION ================== */

function editRoom(id) {
    alert("Sửa phòng " + id);
}

function deleteRoom(id) {
    if (confirm("Xóa phòng " + id + "?")) {
        listRooms = listRooms.filter(r => r.id !== id);

        // cập nhật lại data.js runtime
        rooms = rooms.filter(r => r.id !== id);

        render();
    }
}

render();