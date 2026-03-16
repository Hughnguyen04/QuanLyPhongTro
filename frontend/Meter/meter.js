/* ================== AUTH ================== */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");
const userBuildings = JSON.parse(localStorage.getItem("buildings") || "[]");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";
renderMenu(role);

/* ================== DATA ================== */
let listMeter = typeof meters !== "undefined" ? meters : [];
if (!Array.isArray(listMeter)) listMeter = [];

/* ================== LẤY PHÒNG ĐANG THUÊ (UNIQUE) ================== */
function getActiveRooms() {
    let list = tenants.filter(t => t.status === "Đang thuê");

    if (role === "nhanvien" && userBuildings.length) {
        list = list.filter(t => userBuildings.includes(t.building));
    }

    // unique theo phòng + tòa
    const map = {};
    list.forEach(t => {
        map[t.room + "_" + t.building] = {
            room: t.room,
            building: t.building
        };
    });

    return Object.values(map);
}

/* ================== LẤY CHỈ SỐ THÁNG TRƯỚC ================== */
function getLastMeter(room, building, month) {
    return listMeter
        .filter(m => m.room === room && m.building === building && m.month < month)
        .sort((a, b) => b.month.localeCompare(a.month))[0];
}

/* ================== INIT MONTH ================== */
function initMonth() {
    const mSelect = document.getElementById("monthFilter");

    const months = [
        "2025-01","2025-02","2025-03","2025-04",
        "2025-05","2025-06","2025-07","2025-08",
        "2025-09","2025-10","2025-11","2025-12"
    ];

    mSelect.innerHTML = `<option value="">Chọn tháng</option>`;
    months.forEach(m => mSelect.innerHTML += `<option>${m}</option>`);

    mSelect.value = "2025-02"; // auto chọn tháng
}

/* ================== UPDATE REALTIME ================== */
function updateUse(room, eOld, wOld) {
    const eNew = +document.getElementById(`eNew_${room}`).value || 0;
    const wNew = +document.getElementById(`wNew_${room}`).value || 0;

    const eUse = eNew - eOld;
    const wUse = wNew - wOld;

    document.getElementById(`eUse_${room}`).innerText = eUse > 0 ? eUse : 0;
    document.getElementById(`wUse_${room}`).innerText = wUse > 0 ? wUse : 0;
}

/* ================== RENDER ================== */
function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const month = document.getElementById("monthFilter").value;
    const tbody = document.getElementById("tbody");

    const rooms = getActiveRooms();

    tbody.innerHTML = "";

    let total = 0, sumElectric = 0, sumWater = 0;

    rooms
    .filter(r => r.room.toLowerCase().includes(key))
    .forEach(r => {

        let m = listMeter.find(x =>
            x.room === r.room &&
            x.building === r.building &&
            x.month === month
        );

        const last = getLastMeter(r.room, r.building, month);

        const eOld = m?.electricOld ?? last?.electricNew ?? 0;
        const wOld = m?.waterOld ?? last?.waterNew ?? 0;
        const eNew = m?.electricNew ?? "";
        const wNew = m?.waterNew ?? "";

        const eUse = eNew ? eNew - eOld : 0;
        const wUse = wNew ? wNew - wOld : 0;

        total++;
        sumElectric += eUse;
        sumWater += wUse;

        tbody.innerHTML += `
        <tr>
            <td>${r.room}</td>
            <td>${r.building}</td>
            <td>${month}</td>

            <td>${eOld}</td>
            <td>
                <input id="eNew_${r.room}" value="${eNew}" 
                oninput="updateUse('${r.room}',${eOld},${wOld})"
                style="width:70px">
            </td>
            <td id="eUse_${r.room}">${eUse}</td>

            <td>${wOld}</td>
            <td>
                <input id="wNew_${r.room}" value="${wNew}" 
                oninput="updateUse('${r.room}',${eOld},${wOld})"
                style="width:70px">
            </td>
            <td id="wUse_${r.room}">${wUse}</td>

            <td>
                <button onclick="saveMeter('${r.room}','${r.building}',${eOld},${wOld})">💾</button>
            </td>
        </tr>`;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("sumElectric").innerText = sumElectric;
    document.getElementById("sumWater").innerText = sumWater;
}

/* ================== SAVE ================== */
function saveMeter(room, building, eOld, wOld) {
    const month = document.getElementById("monthFilter").value;

    const eNew = +document.getElementById(`eNew_${room}`).value || 0;
    const wNew = +document.getElementById(`wNew_${room}`).value || 0;

    let m = listMeter.find(x =>
        x.room === room &&
        x.building === building &&
        x.month === month
    );

    if (!m) {
        m = {
            id: "M" + Date.now(),
            room,
            building,
            month
        };
        listMeter.push(m);
    }

    m.electricOld = eOld;
    m.electricNew = eNew;
    m.waterOld = wOld;
    m.waterNew = wNew;

    render();
}

/* ================== INIT ================== */
initMonth();
render();