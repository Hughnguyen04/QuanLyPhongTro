const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";

renderMenu(role);

let editingId = null;


/* ================= MOCK DATA ================= */

let listRooms = [

    { RoomID: "P101", RoomName: "Phòng 101", BuildingID: "B1", BasePrice: 3000000, Status: "TRONG" },
    { RoomID: "P102", RoomName: "Phòng 102", BuildingID: "B1", BasePrice: 2800000, Status: "DANG_THUE" },
    { RoomID: "P103", RoomName: "Phòng 103", BuildingID: "B2", BasePrice: 2500000, Status: "TRONG" },
    { RoomID: "P201", RoomName: "Phòng 201", BuildingID: "B2", BasePrice: 3200000, Status: "DANG_SUA" },
    { RoomID: "P202", RoomName: "Phòng 202", BuildingID: "B3", BasePrice: 2700000, Status: "TRONG" },
    { RoomID: "P301", RoomName: "Phòng 301", BuildingID: "B4", BasePrice: 3500000, Status: "DANG_THUE" }

];


/* ================= ROOM EXTRA INFO ================= */

const roomExtra = {

    "P101": {
        area: 25,
        tiennghi: ["Máy lạnh", "Giường", "Wifi", "Tủ quần áo"],
        images: [
            "https://bandon.vn/uploads/posts/thiet-ke-nha-tro-dep-2020-bandon-0.jpg",
            "https://kientructrangkim.com/wp-content/uploads/2022/11/thiet-ke-noi-that-phong-tro-19.jpg",
            "https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2020/02/22/bc1ddb25f7b40fea56a5_1582334110.jpg"
        ]
    },

    "P102": {
        area: 30,
        tiennghi: ["Máy lạnh", "Tủ lạnh", "Wifi"],
        image: "https://picsum.photos/400/200?2"
    },

    "P103": {
        area: 20,
        tiennghi: ["Quạt", "Giường", "Wifi"],
        image: "https://picsum.photos/400/200?3"
    }

};



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

            r.RoomName.toLowerCase().includes(key)
            && (st === "" || mapStatus(r.Status) === st)
            && (building === "" || r.BuildingID === building)

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

<td class="room-link" onclick="openRoomDetail('${r.RoomID}')">
${r.RoomName}
</td>

<td>${r.BuildingID}</td>

<td>${Number(r.BasePrice).toLocaleString()} đ</td>

<td>${statusText}</td>

<td>
<button onclick="openEditRoom('${r.RoomID}')">✏️</button>
<button onclick="deleteRoom('${r.RoomID}')">🗑</button>
</td>

</tr>

`;

        });

    document.getElementById("total").innerText = total;
    document.getElementById("thue").innerText = thue;
    document.getElementById("trong").innerText = trong;
    document.getElementById("sua").innerText = sua;

}



/* ================= STATUS ================= */

function mapStatus(status) {

    if (status === "TRONG") return "Trống";
    if (status === "DANG_THUE") return "Đang thuê";
    if (status === "DANG_SUA") return "Đang sửa";

    return status;

}



/* ================= ROOM DETAIL ================= */

function openRoomDetail(id) {

    const room = listRooms.find(r => r.RoomID == id);

    if (!room) return;

    const extra = roomExtra[id] || {};

    document.getElementById("dName").innerText = room.RoomName;
    document.getElementById("dBuilding").innerText = room.BuildingID;
    document.getElementById("dPrice").innerText = Number(room.BasePrice).toLocaleString();
    document.getElementById("dStatus").innerText = mapStatus(room.Status);

    document.getElementById("dArea").innerText = extra.area || "Chưa có";

    const imgBox = document.getElementById("roomImages");

    imgBox.innerHTML = "";

    if (extra.images) {

        extra.images.forEach(src => {

            const img = document.createElement("img");
            img.src = src;

            imgBox.appendChild(img);

        });

    }


    const ul = document.getElementById("dTienNghi");

    ul.innerHTML = "";

    if (extra.tiennghi) {

        extra.tiennghi.forEach(t => {

            const li = document.createElement("li");
            li.innerText = t;
            ul.appendChild(li);

        });

    }

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
    mBuilding.value = "B1";

    modal.style.display = "flex";

}



function openEditRoom(id) {

    const r = listRooms.find(x => x.RoomID === id);

    editingId = id;

    modalTitle.innerText = "Sửa phòng";

    mRoomName.value = r.RoomName;
    mPrice.value = r.BasePrice;
    mStatus.value = r.Status;
    mBuilding.value = r.BuildingID;

    modal.style.display = "flex";

}


function closeModal() {
    modal.style.display = "none";
}



/* ================= DELETE ================= */

function deleteRoom(id) {

    if (confirm("Xóa phòng?")) {

        listRooms = listRooms.filter(r => r.RoomID !== id);

        render();

    }

}



/* ================= LOAD ================= */

document.addEventListener("DOMContentLoaded", function () {

    render();

});
