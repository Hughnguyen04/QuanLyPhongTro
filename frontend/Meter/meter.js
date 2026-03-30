/* ===== AUTH ===== */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");
const userBuildings = JSON.parse(localStorage.getItem("buildings") || "[]");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";
renderMenu(role);

/* ===== DATA ===== */
let listMeter = typeof meters !== "undefined" ? meters : [];
if (!Array.isArray(listMeter)) listMeter = [];

/* ===== LẤY PHÒNG ===== */
function getActiveRooms() {
    let list = tenants.filter(t => t.status === "Đang thuê");

    if (role === "nhanvien" && userBuildings.length) {
        list = list.filter(t => userBuildings.includes(t.building));
    }

    const map = {};
    list.forEach(t => {
        map[t.room + "_" + t.building] = {
            room: t.room,
            building: t.building
        };
    });

    return Object.values(map);
}

/* ===== INIT FILTER ===== */
function initFilter() {
    const buildingSelect = document.getElementById("buildingFilter");

    const rooms = getActiveRooms();
    const buildings = [...new Set(rooms.map(r => r.building))];

    buildingSelect.innerHTML = `<option value="">Tất cả tòa</option>`;
    buildings.forEach(b => {
        buildingSelect.innerHTML += `<option value="${b}">${b}</option>`;
    });
}

/* ===== INIT MONTH ===== */
function initMonth() {
    const mSelect = document.getElementById("monthFilter");

    const now = new Date();
    const currentMonth = now.toISOString().slice(0,7);

    mSelect.innerHTML = "";
    for(let i=0;i<12;i++){
        let d = new Date();
        d.setMonth(d.getMonth() - i);
        let m = d.toISOString().slice(0,7);
        mSelect.innerHTML += `<option value="${m}">${m}</option>`;
    }

    mSelect.value = currentMonth;
}

/* ===== GET LAST ===== */
function getLastMeter(room, building, month) {
    return listMeter
        .filter(m => m.room === room && m.building === building && m.month < month)
        .sort((a, b) => b.month.localeCompare(a.month))[0];
}

/* ===== UPDATE USE ===== */
function updateUse(room, building, eOld, wOld) {
    const eNew = +document.getElementById(`eNew_${room}_${building}`).value || 0;
    const wNew = +document.getElementById(`wNew_${room}_${building}`).value || 0;

    document.getElementById(`eUse_${room}_${building}`).innerText = Math.max(0, eNew - eOld);
    document.getElementById(`wUse_${room}_${building}`).innerText = Math.max(0, wNew - wOld);
}

/* ===== RENDER ===== */
function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const month = document.getElementById("monthFilter").value;
    const buildingFilter = document.getElementById("buildingFilter").value;
    const tbody = document.getElementById("tbody");

    const rooms = getActiveRooms();

    tbody.innerHTML = "";

    let total = 0, sumElectric = 0, sumWater = 0;

    rooms
    .filter(r =>
        r.room.toLowerCase().includes(key) &&
        (buildingFilter === "" || r.building === buildingFilter)
    )
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

        const keyId = `${r.room}_${r.building}`;

        tbody.innerHTML += `
        <tr>
            <td>${r.room}</td>
            <td>${r.building}</td>
            <td>${month}</td>

            <td>${eOld}</td>
            <td><input id="eNew_${keyId}" type="number" value="${eNew}"
                oninput="updateUse('${r.room}','${r.building}',${eOld},${wOld})"></td>
            <td id="eUse_${keyId}">${eUse}</td>

            <td>${wOld}</td>
            <td><input id="wNew_${keyId}" type="number" value="${wNew}"
                oninput="updateUse('${r.room}','${r.building}',${eOld},${wOld})"></td>
            <td id="wUse_${keyId}">${wUse}</td>

            <td>
                <button onclick="saveMeter('${r.room}','${r.building}',${eOld},${wOld})">💾</button>
            </td>
        </tr>`;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("sumElectric").innerText = sumElectric;
    document.getElementById("sumWater").innerText = sumWater;
}

/* ===== SAVE ===== */
function saveMeter(room, building, eOld, wOld) {
    const month = document.getElementById("monthFilter").value;

    const keyId = `${room}_${building}`;

    const eNew = +document.getElementById(`eNew_${keyId}`).value || 0;
    const wNew = +document.getElementById(`wNew_${keyId}`).value || 0;

    let m = listMeter.find(x =>
        x.room === room &&
        x.building === building &&
        x.month === month
    );

    if (!m) {
        m = { id: "M" + Date.now(), room, building, month };
        listMeter.push(m);
    }

    m.electricOld = eOld;
    m.electricNew = eNew;
    m.waterOld = wOld;
    m.waterNew = wNew;

    render();
}

/* ===== INIT ===== */
initFilter();
initMonth();
render();