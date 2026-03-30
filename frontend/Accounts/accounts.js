const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";
renderMenu(role);

/* ===== DATA ===== */
let listStaff = accounts
    .filter(a => a.role === "nhanvien")
    .map(a => ({
        ...a,
        cccd: a.cccd || "099999999999",
        time: a.startDate || "01/01/2023",
        avatar: "https://i.pravatar.cc/150?u=" + a.id
    }));

let listTenants = tenants.map(t => ({
    id: t.id,
    name: t.name,
    role: "nguoithue",
    building: t.building,
    room: t.room,
    phone: t.phone,
    cccd: t.cccd || "012345678901",
    time: t.startDate || "01/01/2024",
    endDate: t.endDate || "Chưa có",
    avatar: "https://i.pravatar.cc/150?u=" + t.id
}));

let listAll = [...listStaff, ...listTenants];
let editingId = null;

/* ===== FILTER ===== */
function getRoleFiltered(list) {
    if (role === "chutro") return list;

    const acc = accounts.find(a => a.username === username);
    const myBuildings = acc?.buildings || [];

    return list.filter(a => myBuildings.includes(a.building));
}

/* ===== INIT BUILDING ===== */
function initBuildings() {
    const select = document.getElementById("buildingFilter");

    const data = getRoleFiltered(listAll);
    const buildings = [...new Set(data.map(a => a.building).filter(Boolean))];

    select.innerHTML = <option value="">Tất cả tòa</option>;
    buildings.forEach(b => {
        select.innerHTML += <option value="${b}">${b}</option>;
    });
}

/* ===== RENDER ===== */
function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const roleFilter = document.getElementById("roleFilter").value;
    const building = document.getElementById("buildingFilter").value;
    const tbody = document.getElementById("tbody");

    tbody.innerHTML = "";

    let total = 0, staff = 0, tenant = 0;

    getRoleFiltered(listAll)
        .filter(a =>
            a.name.toLowerCase().includes(key) &&
            (!roleFilter || a.role === roleFilter) &&
            (!building || a.building === building)
        )
        .forEach(a => {
            total++;
            if (a.role === "nhanvien") staff++;
            if (a.role === "nguoithue") tenant++;

            tbody.innerHTML += `
                <tr onclick="openDetail('${a.id}')">
                    <td>${a.id}</td>
                    <td>${a.name}</td>
                    <td>${a.role === "nhanvien" ? "Nhân viên" : "Người thuê"}</td>
                    <td>${a.building || ""}</td>
                    <td>${a.room || ""}</td>
                    <td>${a.phone || ""}</td>
                    <td>
                        <button onclick="event.stopPropagation(); editAcc('${a.id}')">✏️</button>
                        ${role === "chutro" ? <button onclick="event.stopPropagation(); deleteAcc('${a.id}')">🗑</button> : ""}
                    </td>
                </tr>
            `;
        });

    document.getElementById("total").innerText = total;
    document.getElementById("staff").innerText = staff;
    document.getElementById("tenant").innerText = tenant;
}

/* ===== DETAIL (SỬA CHÍNH Ở ĐÂY) ===== */
function openDetail(id) {

    const u = listAll.find(x => x.id == id);
    if (!u) return;

    document.getElementById("dAvatar").src = u.avatar;
    document.getElementById("dName").innerText = u.name;

    document.getElementById("dRole").innerText =
        u.role === "nhanvien" ? "Nhân viên" : "Người thuê";

    document.getElementById("dBuilding").innerText = u.building || "";
    document.getElementById("dRoom").innerText = u.room || "";
    document.getElementById("dPhone").innerText = u.phone || "";
    document.getElementById("dCCCD").innerText = u.cccd || "";

    // ===== HIỂN THỊ NGÀY =====
    if (u.role === "nhanvien") {

        document.getElementById("timeLabel").innerHTML =
            "<b>Ngày vào làm:</b> <span id='dTime'></span>";

        document.getElementById("dTime").innerText = u.time || "";

    } else {

        document.getElementById("timeLabel").innerHTML = `
            <b>Ngày bắt đầu thuê:</b> <span id="dTime"></span><br>
            <b>Ngày kết thúc:</b> <span id="dEnd"></span>
        `;

        document.getElementById("dTime").innerText = u.time || "";
        document.getElementById("dEnd").innerText = u.endDate || "Chưa có";
    }

    document.getElementById("detailModal").style.display = "flex";
}

function closeDetail() {
    document.getElementById("detailModal").style.display = "none";
}

/* ===== FORM ===== */
function openAdd() {
    editingId = null;
    document.getElementById("formTitle").innerText = "Thêm tài khoản";

    clearForm();
    document.getElementById("formModal").style.display = "flex";
}

function editAcc(id) {
    const u = listAll.find(x => x.id == id);
    if (!u) return;

    editingId = id;
    document.getElementById("formTitle").innerText = "Sửa tài khoản";

    document.getElementById("fName").value = u.name;
    document.getElementById("fRole").value = u.role;
    document.getElementById("fBuilding").value = u.building || "";
    document.getElementById("fRoom").value = u.room || "";
    document.getElementById("fPhone").value = u.phone || "";
    document.getElementById("fStart").value = u.time || "";
    document.getElementById("fEnd").value = u.endDate || "";

    document.getElementById("formModal").style.display = "flex";
}

function closeForm() {
    document.getElementById("formModal").style.display = "none";
}

function clearForm() {
    document.getElementById("fName").value = "";
    document.getElementById("fBuilding").value = "";
    document.getElementById("fRoom").value = "";
    document.getElementById("fPhone").value = "";
    document.getElementById("fStart").value = "";
    document.getElementById("fEnd").value = "";
}

/* ===== SAVE ===== */
function saveAcc() {
    const name = document.getElementById("fName").value;
    const roleVal = document.getElementById("fRole").value;
    const building = document.getElementById("fBuilding").value;
    const room = document.getElementById("fRoom").value;
    const phone = document.getElementById("fPhone").value;
    const start = document.getElementById("fStart").value;
    const end = document.getElementById("fEnd").value;

    if (!name) return alert("Nhập tên!");

    if (editingId) {
        let u = listAll.find(x => x.id == editingId);
        if (!u) return;

        u.name = name;
        u.role = roleVal;
        u.building = building;
        u.room = room;
        u.phone = phone;
        u.time = start;
        u.endDate = end;

    } else {
        const newId = "ID" + Date.now();

        const newAcc = {
            id: newId,
            name,
            role: roleVal,
            building,
            room,
            phone,
            cccd: "000000000000",
            time: start,
            endDate: roleVal === "nguoithue" ? end : "",
            avatar: "https://i.pravatar.cc/150?u=" + newId
        };

        listAll.push(newAcc);
    }

    closeForm();
    initBuildings();
    render();
}

/* ===== DELETE ===== */
function deleteAcc(id) {
    if (role !== "chutro") return;

    if (confirm("Xóa tài khoản " + id + " ?")) {
        listAll = listAll.filter(a => a.id !== id);
        initBuildings();
        render();
    }
}

/* ===== INIT ===== */
initBuildings();
render();
i.pravatar.cc