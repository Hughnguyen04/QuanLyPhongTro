const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";
renderMenu(role);

/* ================= DOM ================= */

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");

const mRoomName = document.getElementById("mRoomName");
const mPrice = document.getElementById("mPrice");
const mStatus = document.getElementById("mStatus");
const mBuilding = document.getElementById("mBuilding");

/* ================= DATA ================= */

let listRooms = [];
let editingId = null;

/* ================= LOAD ================= */

async function loadRooms() {
    try {
        const res = await API.getRooms();
        listRooms = res.data || [];
        render();
    } catch (err) {
        console.error(err);
        alert("Lỗi load rooms");
    }
}

/* ================= STATUS ================= */

function mapStatus(status) {
    if (status === "TRONG") return "Trống";
    if (status === "DANG_THUE") return "Đang thuê";
    if (status === "DANG_SUA") return "Đang sửa";
    return status;
}

/* ================= IMAGE ================= */

function getImageUrl(path) {
    if (!path) return "https://via.placeholder.com/400x200?text=No+Image";

    return "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/" + path;
}

/* ================= RENDER ================= */

function render() {

    const key = document.getElementById("key").value.toLowerCase();
    const st = document.getElementById("status").value;
    const building = document.getElementById("buildingFilter").value;

    const tbody = document.getElementById("tbody");

    let total = 0, thue = 0, trong = 0, sua = 0;

    tbody.innerHTML = "";

    listRooms
        .filter(r =>
            (r.RoomName || "").toLowerCase().includes(key)
            && (st === "" || mapStatus(r.Status) === st)
            && (building === "" || r.BuildingName === building)
        )
        .forEach(r => {

            const statusText = mapStatus(r.Status);

            total++;

            if (statusText === "Đang thuê") thue++;
            if (statusText === "Trống") trong++;
            if (statusText === "Đang sửa") sua++;

            tbody.innerHTML += `
<tr>
<td>${r.RoomID}</td>

<td onclick="openRoomDetail(${r.RoomID})" style="cursor:pointer;color:#6c63ff">
${r.RoomName}
</td>

<td>${r.BuildingName}</td>

<td>${Number(r.BasePrice).toLocaleString()} đ</td>

<td>${statusText}</td>

<td>
<button onclick="openEditRoom(${r.RoomID})">✏️</button>
<button onclick="deleteRoom(${r.RoomID})">🗑</button>
</td>

</tr>
`;
        });

    document.getElementById("total").innerText = total;
    document.getElementById("thue").innerText = thue;
    document.getElementById("trong").innerText = trong;
    document.getElementById("sua").innerText = sua;
}

/* ================= DETAIL ================= */

function openRoomDetail(id) {

    const r = listRooms.find(x => x.RoomID == id);
    if (!r) return;

    document.getElementById("dName").innerText = r.RoomName;
    document.getElementById("dBuilding").innerText = r.BuildingName;
    document.getElementById("dPrice").innerText = Number(r.BasePrice).toLocaleString();
    document.getElementById("dStatus").innerText = mapStatus(r.Status);
    document.getElementById("dArea").innerText = r.Area || "Chưa có";

    // ✅ FIX ẢNH
    document.getElementById("mainImage").src = getImageUrl(r.Image);

    document.getElementById("dTienNghi").innerHTML = `
        <li>📍 Địa chỉ: ${r.BuildingAddress || "Chưa có"}</li>
        <li>🏢 Số tầng: ${r.BuildingTotalFloors || "Chưa có"}</li>
        <li>📝 Ghi chú: ${r.Note || "Không có"}</li>
    `;

    document.getElementById("roomDetailModal").style.display = "flex";
}

function closeRoomDetail() {
    document.getElementById("roomDetailModal").style.display = "none";
}

/* ================= MODAL ================= */

function openAddRoom() {
    editingId = null;

    modalTitle.innerText = "Thêm phòng";

    mRoomName.value = "";
    mPrice.value = "";
    mStatus.value = "TRONG";
    // mBuilding.value = "B1"; 

    modal.style.display = "flex";
}

function openEditRoom(id) {

    const r = listRooms.find(x => x.RoomID == id);

    editingId = id;

    modalTitle.innerText = "Sửa phòng";

    mRoomName.value = r.RoomName;
    mPrice.value = r.BasePrice;
    mStatus.value = r.Status;
    mBuilding.value = r.BuildingName; // ✅ FIX

    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

/* ================= SAVE ================= */

async function saveRoom() {

    if (!mRoomName.value || !mPrice.value) {
        alert("Nhập thiếu dữ liệu!");
        return;
    }

    const data = {
        RoomID: editingId,
        RoomName: mRoomName.value,
        BuildingName: mBuilding.value,

        BuildingAddress: "Hà Nội",
        BuildingTotalFloors: 5,

        BasePrice: mPrice.value,
        Status: mStatus.value,
        Note: ""
    };

    let res;

    try {
        if (editingId) {
            res = await API.updateRoom(data);
        } else {
            res = await API.createRoom(data);
        }

        if (res.status) {
            alert("Thành công!");
            closeModal();
            await loadRooms();
        } else {
            alert(res.message || "Lỗi");
        }

    } catch (err) {
        console.error(err);
        alert("Lỗi server");
    }
}

/* ================= DELETE ================= */

async function deleteRoom(id) {
    if (!confirm("Xóa phòng?")) return;

    try {
        const res = await API.deleteRoom(id);

        if (res) {
            alert("Đã xóa!");
            await loadRooms();
        } else {
            alert("Xóa thất bại");
        }

    } catch (err) {
        console.error(err);
        alert("Lỗi khi xóa");
    }
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    loadRooms();
});