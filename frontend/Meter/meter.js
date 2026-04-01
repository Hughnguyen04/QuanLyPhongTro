let listUtilities = [];
let listRooms = [];
let currentMonth = null;
let currentYear = null;
let editingRoomId = null;

const tbody = document.getElementById("tbody");

function formatNumber(num) {
    return (num || 0).toLocaleString("vi-VN");
}

// ==================== LOAD DATA ====================
async function loadData() {
    try {
        tbody.innerHTML = `<tr><td colspan="13" style="text-align:center">🔄 Đang tải dữ liệu...</td></tr>`;
        
        // Load rooms
        const roomsRes = await API.getRooms();
        if (!roomsRes.success) {
            throw new Error("Không thể tải danh sách phòng: " + roomsRes.message);
        }
        listRooms = roomsRes.data || [];
        console.log(`✅ Loaded ${listRooms.length} rooms`);
        
        // Load utilities
        const utilsRes = await API.getUtilities();
        if (!utilsRes.success) {
            throw new Error("Không thể tải chỉ số: " + utilsRes.message);
        }
        
        let utilsData = utilsRes.data || [];
        console.log(`✅ Loaded ${utilsData.length} utilities`);
        
        listUtilities = utilsData.map(u => ({
            UtilityID: u.UtilityID,
            RoomID: parseInt(u.RoomID || findRoomIdByName(u.RoomName)),
            RoomName: u.RoomName,
            Month: parseInt(u.Month),
            Year: parseInt(u.Year),
            ElectricOld: parseFloat(u.ElectricOld) || 0,
            ElectricNew: parseFloat(u.ElectricNew) || 0,
            WaterOld: parseFloat(u.WaterOld) || 0,
            WaterNew: parseFloat(u.WaterNew) || 0
        }));
        
        initFilters();
        render();
        
    } catch (err) {
        console.error("❌ Lỗi loadData:", err);
        tbody.innerHTML = `<tr><td colspan="13" style="text-align:center;color:red;padding:40px;">
            ❌ ${err.message}<br><br>
            <button onclick="testConnection()" style="padding:10px 20px;margin-top:10px;cursor:pointer;">🔌 Kiểm tra kết nối</button>
            <button onclick="loadData()" style="padding:10px 20px;margin-top:10px;margin-left:10px;cursor:pointer;">🔄 Thử lại</button>
        </td></tr>`;
    }
}

function findRoomIdByName(name) {
    const room = listRooms.find(r => r.RoomName === name);
    return room ? room.RoomID : null;
}

function initFilters() {
    const now = new Date();
    const monthSel = document.getElementById("monthFilter");
    const yearSel = document.getElementById("yearFilter");
    const buildingSel = document.getElementById("buildingFilter");

    monthSel.innerHTML = `<option value="">Tất cả tháng</option>`;
    for (let i = 1; i <= 12; i++) {
        monthSel.innerHTML += `<option value="${i}" ${i === now.getMonth()+1 ? 'selected' : ''}>Tháng ${i}</option>`;
    }

    yearSel.innerHTML = `<option value="">Tất cả năm</option>`;
    for (let i = now.getFullYear(); i >= now.getFullYear() - 3; i--) {
        yearSel.innerHTML += `<option value="${i}" ${i === now.getFullYear() ? 'selected' : ''}>${i}</option>`;
    }

    const buildings = [...new Set(listRooms.map(r => r.BuildingName).filter(Boolean))];
    buildingSel.innerHTML = `<option value="">Tất cả tòa</option>`;
    buildings.forEach(b => buildingSel.innerHTML += `<option value="${b}">${b}</option>`);

    currentMonth = now.getMonth() + 1;
    currentYear = now.getFullYear();
}

// ==================== RENDER TABLE ====================
function render() {
    if (!listRooms.length) {
        tbody.innerHTML = `<tr><td colspan="13" style="text-align:center">📭 Không có dữ liệu phòng</td></tr>`;
        return;
    }
    
    const search = document.getElementById("key").value.toLowerCase().trim();
    const building = document.getElementById("buildingFilter").value;
    const month = document.getElementById("monthFilter").value ? parseInt(document.getElementById("monthFilter").value) : null;
    const year = document.getElementById("yearFilter").value ? parseInt(document.getElementById("yearFilter").value) : null;

    let html = "";
    let stt = 1;
    let tRooms = 0, tElectric = 0, tWater = 0, tCost = 0;

    listRooms
        .filter(r => !building || r.BuildingName === building)
        .filter(r => !search || r.RoomName.toLowerCase().includes(search))
        .forEach(room => {
            const roomId = parseInt(room.RoomID);
            const util = listUtilities.find(u => u.RoomID === roomId && 
                (!month || u.Month === month) && 
                (!year || u.Year === year));

            const prev = getPrevUtility(roomId, month || currentMonth, year || currentYear);

            let eOld = util ? util.ElectricOld : (prev ? prev.ElectricNew : 0);
            let eNew = util ? util.ElectricNew : 0;
            let wOld = util ? util.WaterOld : (prev ? prev.WaterNew : 0);
            let wNew = util ? util.WaterNew : 0;

            const eUse = Math.max(0, eNew - eOld);
            const wUse = Math.max(0, wNew - wOld);
            const cost = eUse * 3500 + wUse * 15000;

            tRooms++;
            tElectric += eUse * 3500;
            tWater += wUse * 15000;
            tCost += cost;

            html += `
                <tr>
                    <td>${stt++}</td>
                    <td><span class="room-name" onclick="showDetail(${roomId}); event.stopPropagation()">${room.RoomName}</span></td>
                    <td>${room.BuildingName || ""}</td>
                    <td>${month || currentMonth}/${year || currentYear}</td>
                    <td>${eOld}</td>
                    <td>${eNew}</td>
                    <td>${eUse}</td>
                    <td>${wOld}</td>
                    <td>${wNew}</td>
                    <td>${wUse}</td>
                    <td>${formatNumber(cost)} đ</td>
                    <td><span class="status-badge ${util ? 'status-rented' : 'status-empty'}">${util ? 'Đã nhập' : 'Chưa nhập'}</span></td>
                    <td class="action-buttons" onclick="event.stopPropagation()">
                        <button class="btn-edit" onclick="editUtility(${roomId})">✏️ Sửa</button>
                        <button class="btn-delete" onclick="deleteUtility(${roomId})">🗑 Xóa</button>
                    </td>
                </tr>
            `;
        });

    tbody.innerHTML = html || `<tr><td colspan="13" style="text-align:center;padding:40px;color:#999">🔍 Không tìm thấy dữ liệu</td></tr>`;

    document.getElementById("totalRooms").textContent = tRooms;
    document.getElementById("totalElectric").textContent = formatNumber(tElectric);
    document.getElementById("totalWater").textContent = formatNumber(tWater);
    document.getElementById("totalCost").textContent = formatNumber(tCost);
}

function getPrevUtility(roomId, month, year) {
    let prev = null, max = 0;
    const cur = year * 12 + month;

    listUtilities.forEach(u => {
        if (u.RoomID === roomId) {
            const d = u.Year * 12 + u.Month;
            if (d < cur && d > max) {
                max = d;
                prev = u;
            }
        }
    });
    return prev;
}

// ==================== DETAIL ====================
function showDetail(roomId) {
    const room = listRooms.find(r => parseInt(r.RoomID) === roomId);
    document.getElementById("detailTitle").innerHTML = `Lịch sử chỉ số - <b>${room ? room.RoomName : ''}</b>`;

    const history = listUtilities
        .filter(u => u.RoomID === roomId)
        .sort((a,b) => (b.Year*12 + b.Month) - (a.Year*12 + a.Month));

    let html = `<table width="100%" border="1" style="border-collapse:collapse; margin-top:10px;">
        <tr><th>Tháng/Năm</th><th>Điện cũ</th><th>Điện mới</th><th>Tiêu thụ</th><th>Nước cũ</th><th>Nước mới</th><th>Tiêu thụ</th></tr>`;

    if (history.length === 0) {
        html += `<tr><td colspan="7" style="text-align:center">Chưa có dữ liệu</td></tr>`;
    } else {
        history.forEach(h => {
            html += `
                <tr>
                    <td>${h.Month}/${h.Year}</td>
                    <td>${h.ElectricOld}</td>
                    <td>${h.ElectricNew}</td>
                    <td>${h.ElectricNew - h.ElectricOld}</td>
                    <td>${h.WaterOld}</td>
                    <td>${h.WaterNew}</td>
                    <td>${h.WaterNew - h.WaterOld}</td>
                </tr>
            `;
        });
    }
    html += `</table>`;

    document.getElementById("detailBody").innerHTML = html;
    document.getElementById("detailModal").style.display = "flex";
}

function closeDetailModal() {
    document.getElementById("detailModal").style.display = "none";
}

// ==================== EDIT ====================
function editUtility(roomId) {
    event.stopPropagation();
    editingRoomId = roomId;

    const room = listRooms.find(r => parseInt(r.RoomID) === roomId);
    const util = listUtilities.find(u => u.RoomID === roomId && u.Month === currentMonth && u.Year === currentYear);

    document.getElementById("editRoomName").value = room ? room.RoomName : "";

    const mSel = document.getElementById("editMonth");
    const ySel = document.getElementById("editYear");
    mSel.innerHTML = ""; ySel.innerHTML = "";
    for(let i=1; i<=12; i++) mSel.innerHTML += `<option value="${i}" ${i===currentMonth?'selected':''}>Tháng ${i}</option>`;
    for(let i=2023; i<=2027; i++) ySel.innerHTML += `<option value="${i}" ${i===currentYear?'selected':''}>${i}</option>`;

    if (util) {
        document.getElementById("editElectricOld").value = util.ElectricOld;
        document.getElementById("editElectricNew").value = util.ElectricNew;
        document.getElementById("editWaterOld").value = util.WaterOld;
        document.getElementById("editWaterNew").value = util.WaterNew;
    } else {
        document.getElementById("editElectricOld").value = "";
        document.getElementById("editElectricNew").value = "";
        document.getElementById("editWaterOld").value = "";
        document.getElementById("editWaterNew").value = "";
    }

    document.getElementById("editModal").style.display = "flex";
}

// ==================== SAVE UTILITY ====================
async function saveUtility() {
    if (!editingRoomId) {
        showToast("❌ Không tìm thấy phòng", "error");
        return;
    }

    const month = parseInt(document.getElementById("editMonth").value);
    const year = parseInt(document.getElementById("editYear").value);

    const payload = {
        UtilityID: null,
        RoomID: editingRoomId,
        Month: month,
        Year: year,
        ElectricOld: parseFloat(document.getElementById("editElectricOld").value) || 0,
        ElectricNew: parseFloat(document.getElementById("editElectricNew").value) || 0,
        WaterOld: parseFloat(document.getElementById("editWaterOld").value) || 0,
        WaterNew: parseFloat(document.getElementById("editWaterNew").value) || 0,
        ElectricPrice: 3500,
        WaterPrice: 15000
    };

    try {
        const existing = listUtilities.find(u => 
            u.RoomID === editingRoomId && u.Month === month && u.Year === year
        );

        let res;
        if (existing && existing.UtilityID) {
            payload.UtilityID = existing.UtilityID;
            console.log("→ UPDATE Payload:", payload);
            res = await API.updateUtility(payload);
        } else {
            console.log("→ CREATE Payload:", payload);
            res = await API.createUtility(payload);
        }

        console.log("← Server Response:", res);

        if (res && (res.message?.includes("thành công") || res.success === true)) {
            showToast("✅ Lưu chỉ số thành công!", "success");
            closeEditModal();
            await loadData();
        } else {
            showToast("❌ " + (res?.message || "Lưu thất bại"), "error");
        }
    } catch (err) {
        console.error("SaveUtility Error:", err);
        showToast("❌ Lỗi: " + err.message, "error");
    }
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// ==================== DELETE ====================
async function deleteUtility(roomId) {
    event.stopPropagation();
    if (!confirm("Xóa chỉ số điện nước của phòng này?")) return;

    const util = listUtilities.find(u => u.RoomID === roomId && u.Month === currentMonth && u.Year === currentYear);
    if (!util || !util.UtilityID) {
        showToast("Không tìm thấy dữ liệu để xóa", "error");
        return;
    }

    try {
        const res = await API.deleteUtility(util.UtilityID);
        if (res && (res.success || res.message?.includes("thành công"))) {
            showToast("✅ Xóa thành công!", "success");
            loadData();
        } else {
            showToast(res?.message || "Xóa thất bại", "error");
        }
    } catch (err) {
        console.error("Delete error:", err);
        showToast("❌ Lỗi khi xóa: " + err.message, "error");
    }
}

function showToast(msg, type = "success") {
    const toast = document.createElement("div");
    toast.style.cssText = `position:fixed; bottom:20px; right:20px; padding:14px 24px; border-radius:10px; color:white; z-index:9999; font-weight:500; animation: slideIn 0.3s ease; z-index:10000;`;
    toast.style.background = type === "success" ? "#4caf50" : "#f44336";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Add animation style if not exists
if (!document.querySelector('#toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-rented {
            background: #e8f5e9;
            color: #2e7d32;
        }
        .status-empty {
            background: #ffebee;
            color: #c62828;
        }
    `;
    document.head.appendChild(style);
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("username").innerText = localStorage.getItem("username") || "Admin";
    loadData();
});

// Global functions
window.render = render;
window.showDetail = showDetail;
window.closeDetailModal = closeDetailModal;
window.editUtility = editUtility;
window.saveUtility = saveUtility;
window.closeEditModal = closeEditModal;
window.deleteUtility = deleteUtility;
window.loadData = loadData;
window.testConnection = testConnection;