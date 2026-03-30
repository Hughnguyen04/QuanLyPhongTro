const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";
renderMenu(role);

let listContracts = [];
let listRooms = [];
let listTenants = [];
let listBuildings = [];
let editingId = null;
let currentDetail = null;

// DOM elements
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const mTenantId = document.getElementById("mTenantId");
const mRoomId = document.getElementById("mRoomId");
const mStartDate = document.getElementById("mStartDate");
const mEndDate = document.getElementById("mEndDate");
const mDeposit = document.getElementById("mDeposit");

const detailModal = document.getElementById("detailModal");
const contractBody = document.getElementById("contractBody");
const contractCode = document.getElementById("contractCode");

// Load dữ liệu từ API
async function loadData() {
    try {
        console.log("🚀 Đang tải dữ liệu...");
        
        // Load contracts trực tiếp
        const contractsResult = await API.getContracts();
        console.log("📋 Contracts response:", contractsResult);
        
        if (contractsResult.success && contractsResult.data && contractsResult.data.length > 0) {
            listContracts = contractsResult.data;
            console.log(`✅ Đã tải ${listContracts.length} hợp đồng`);
            console.log("📄 Mẫu hợp đồng:", listContracts[0]);
        } else {
            console.warn("⚠️ Không có dữ liệu hợp đồng!");
            listContracts = [];
        }
        
        // Load rooms
        const roomsResult = await API.getRooms();
        console.log("📋 Rooms response:", roomsResult);
        if (roomsResult.success && roomsResult.data) {
            listRooms = roomsResult.data;
            console.log(`✅ Đã tải ${listRooms.length} phòng`);
        }
        
        // Load tenants
        const tenantsResult = await API.getTenants();
        console.log("📋 Tenants response:", tenantsResult);
        if (tenantsResult.success && tenantsResult.data) {
            listTenants = tenantsResult.data;
            console.log(`✅ Đã tải ${listTenants.length} người thuê`);
            loadTenantsToSelect();
        }
        
        // Load buildings
        const buildingsResult = await API.getBuildings();
        console.log("📋 Buildings response:", buildingsResult);
        if (buildingsResult.success && buildingsResult.data) {
            listBuildings = buildingsResult.data;
            console.log(`✅ Đã tải ${listBuildings.length} tòa nhà`);
            loadRoomsToSelect();
        }
        
        initFilters();
        render();
        
    } catch (error) {
        console.error('💥 Lỗi load data:', error);
        document.getElementById("tbody").innerHTML = ` 
            <tr><td colspan="11" style="text-align:center; color:red; padding:40px;">
            ❌ Lỗi: ${error.message}
            </td></tr>
        `;
    }
}

function loadTenantsToSelect() {
    if (!mTenantId) return;
    mTenantId.innerHTML = '<option value="">Chọn người thuê</option>';
    listTenants.forEach(tenant => {
        mTenantId.innerHTML += `<option value="${tenant.TenantID}">${tenant.FullName || "N/A"} - ${tenant.CCCD || "N/A"}</option>`;
    });
}

function loadRoomsToSelect() {
    if (!mRoomId) return;
    mRoomId.innerHTML = '<option value="">Chọn phòng</option>';
    listRooms.forEach(room => {
        const building = listBuildings.find(b => b.BuildingID == room.BuildingID);
        mRoomId.innerHTML += `<option value="${room.RoomID}">${room.RoomName || "N/A"} - ${building?.BuildingName || "N/A"} (${Number(room.Price || 0).toLocaleString()}đ)</option>`;
    });
}

function getRoomInfo(roomId) {
    const room = listRooms.find(r => r.RoomID == roomId);
    if (!room) return { roomName: "N/A", buildingName: "N/A", price: 0 };
    const building = listBuildings.find(b => b.BuildingID == room.BuildingID);
    return {
        roomName: room.RoomName || "N/A",
        buildingName: building?.BuildingName || "N/A",
        price: room.Price || 0
    };
}

function getTenantInfo(tenantId) {
    const tenant = listTenants.find(t => t.TenantID == tenantId);
    return tenant || { FullName: "N/A", CCCD: "N/A", Address: "N/A", Phone: "N/A" };
}

function getStatus(contract) {
    if (contract.ActualEndDate && contract.ActualEndDate !== null && contract.ActualEndDate !== "") {
        return "Đã kết thúc";
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(contract.EndDate);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today ? "Đang hiệu lực" : "Hết hạn";
}

function initFilters() {
    const select = document.getElementById("buildingFilter");
    if (!select) return;
    
    if (listContracts.length === 0) {
        select.innerHTML = '<option value="">Tất cả tòa</option>';
        return;
    }
    
    const buildings = [...new Set(listContracts.map(c => {
        const roomInfo = getRoomInfo(c.RoomID);
        return roomInfo.buildingName;
    }).filter(b => b && b !== "N/A"))];
    
    select.innerHTML = '<option value="">Tất cả tòa</option>';
    buildings.forEach(b => {
        select.innerHTML += `<option value="${b}">${b}</option>`;
    });
}

function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const building = document.getElementById("buildingFilter").value;
    const tbody = document.getElementById("tbody");
    
    console.log("🎨 Đang render, số hợp đồng:", listContracts.length);
    
    if (listContracts.length === 0) {
        tbody.innerHTML = ` 
            <tr>
                <td colspan="11" style="text-align:center; padding:40px;">
                    📭 Không có dữ liệu hợp đồng
                </td>
            </tr>
        `;
        document.getElementById("total").innerText = "0";
        document.getElementById("active").innerText = "0";
        document.getElementById("expired").innerText = "0";
        return;
    }
    
    let filtered = listContracts.filter(contract => {
        const tenant = getTenantInfo(contract.TenantID);
        const tenantName = (tenant.FullName || "").toLowerCase();
        const roomInfo = getRoomInfo(contract.RoomID);
        const buildingName = roomInfo.buildingName;
        return tenantName.includes(key) && (building === "" || buildingName === building);
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = ` 
            <tr>
                <td colspan="11" style="text-align:center; padding:40px;">
                    🔍 Không tìm thấy hợp đồng nào
                </td>
            </tr>
        `;
        document.getElementById("total").innerText = "0";
        document.getElementById("active").innerText = "0";
        document.getElementById("expired").innerText = "0";
        return;
    }
    
    let total = 0, active = 0, expired = 0;
    
    tbody.innerHTML = filtered.map(contract => {
        const tenant = getTenantInfo(contract.TenantID);
        const roomInfo = getRoomInfo(contract.RoomID);
        const status = getStatus(contract);
        
        total++;
        if (status === "Đang hiệu lực") active++;
        else expired++;
        
        let statusColor = '#dc3545';
        let statusIcon = '🔴';
        if (status === "Đang hiệu lực") {
            statusColor = '#28a745';
            statusIcon = '🟢';
        } else if (status === "Hết hạn") {
            statusColor = '#fd7e14';
            statusIcon = '🟠';
        } else if (status === "Đã kết thúc") {
            statusColor = '#6c757d';
            statusIcon = '⚫';
        }
        
        const startDate = contract.StartDate ? new Date(contract.StartDate).toLocaleDateString('vi-VN') : "N/A";
        const endDate = contract.EndDate ? new Date(contract.EndDate).toLocaleDateString('vi-VN') : "N/A";
        const actualEndDate = contract.ActualEndDate ? new Date(contract.ActualEndDate).toLocaleDateString('vi-VN') : "Chưa kết thúc";
        
        return `
            <tr onclick="showDetail(${contract.ContractID})">
                <td>${contract.ContractID}</td>
                <td>${tenant.FullName}</td>
                <td>${roomInfo.roomName}</td>
                <td>${roomInfo.buildingName}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>${actualEndDate}</td>
                <td>${Number(roomInfo.price).toLocaleString()} đ</td>
                <td>${Number(contract.Deposit || 0).toLocaleString()} đ</td>
                <td style="color:${statusColor}; font-weight:500;">${statusIcon} ${status}</td>
                <td onclick="event.stopPropagation()">
                    <button onclick="openEdit(${contract.ContractID})">✏️</button>
                    ${role === 'chutro' ? `<button onclick="deleteContract(${contract.ContractID})">🗑</button>` : ""}
                    ${status === "Đang hiệu lực" ? `<button onclick="endContract(${contract.ContractID})">🏁</button>` : ""}
                </td>
            </tr>
        `;
    }).join('');
    
    document.getElementById("total").innerText = total;
    document.getElementById("active").innerText = active;
    document.getElementById("expired").innerText = expired;
}

document.getElementById("key").addEventListener("input", render);
document.getElementById("buildingFilter").addEventListener("change", render);

function openAdd() {
    editingId = null;
    modalTitle.innerText = "Thêm hợp đồng";
    mTenantId.value = "";
    mRoomId.value = "";
    mStartDate.value = "";
    mEndDate.value = "";
    mDeposit.value = "";
    modal.style.display = "flex";
}

function openEdit(id) {
    const contract = listContracts.find(c => c.ContractID === id);
    if (!contract) return;
    editingId = id;
    modalTitle.innerText = "Sửa hợp đồng";
    mTenantId.value = contract.TenantID;
    mRoomId.value = contract.RoomID;
    mStartDate.value = contract.StartDate;
    mEndDate.value = contract.EndDate;
    mDeposit.value = contract.Deposit;
    modal.style.display = "flex";
}

async function endContract(id) {
    if (!confirm("Xác nhận kết thúc hợp đồng này?")) return;
    const today = new Date().toISOString().split('T')[0];
    const result = await API.updateContract({ ContractID: id, ActualEndDate: today });
    if (result.success) {
        alert("Đã kết thúc hợp đồng!");
        await loadData();
    } else {
        alert("Lỗi: " + (result.message || "Không thể kết thúc hợp đồng"));
    }
}

async function saveContract() {
    const tenantId = mTenantId.value;
    const roomId = mRoomId.value;
    const startDate = mStartDate.value;
    const endDate = mEndDate.value;
    const deposit = parseFloat(mDeposit.value);
    
    if (!tenantId) { alert("Vui lòng chọn người thuê!"); return; }
    if (!roomId) { alert("Vui lòng chọn phòng!"); return; }
    if (!startDate) { alert("Vui lòng chọn ngày bắt đầu!"); return; }
    if (!endDate) { alert("Vui lòng chọn ngày kết thúc!"); return; }
    if (isNaN(deposit) || deposit < 0) { alert("Vui lòng nhập tiền cọc hợp lệ!"); return; }
    
    const contractData = { TenantID: tenantId, RoomID: roomId, StartDate: startDate, EndDate: endDate, Deposit: deposit };
    let result;
    if (editingId) {
        contractData.ContractID = editingId;
        result = await API.updateContract(contractData);
    } else {
        result = await API.createContract(contractData);
    }
    
    if (result.success) {
        alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        await loadData();
        closeModal();
    } else {
        alert("Lỗi: " + (result.message || "Không thể lưu hợp đồng"));
    }
}

async function deleteContract(id) {
    if (role !== "chutro") return;
    if (confirm("Xóa hợp đồng này?")) {
        const result = await API.deleteContract(id);
        if (result.success) {
            alert("Xóa thành công!");
            await loadData();
        } else {
            alert("Lỗi: " + result.message);
        }
    }
}

function showDetail(id) {
    const contract = listContracts.find(c => c.ContractID === id);
    if (!contract) return;
    currentDetail = contract;
    
    const tenant = getTenantInfo(contract.TenantID);
    const roomInfo = getRoomInfo(contract.RoomID);
    const status = getStatus(contract);
    
    let statusClass = 'status-expired';
    if (status === "Đang hiệu lực") statusClass = 'status-active';
    else if (status === "Hết hạn") statusClass = 'status-expired';
    else statusClass = 'status-ended';
    
    contractCode.innerHTML = `Số: ${contract.ContractID} | Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`;
    
    contractBody.innerHTML = `
        <div class="info-section">
            <div class="section-title">🏢 THÔNG TIN BÊN THUÊ</div>
            <div class="info-grid">
                <div class="info-item"><span class="info-label">Họ và tên:</span><span class="info-value"><strong>${tenant.FullName}</strong></span></div>
                <div class="info-item"><span class="info-label">CCCD/CMND:</span><span class="info-value">${tenant.CCCD}</span></div>
                <div class="info-item"><span class="info-label">Địa chỉ:</span><span class="info-value">${tenant.Address}</span></div>
                <div class="info-item"><span class="info-label">Số điện thoại:</span><span class="info-value">${tenant.Phone}</span></div>
            </div>
        </div>
        <div class="info-section">
            <div class="section-title">🏠 THÔNG TIN PHÒNG THUÊ</div>
            <div class="info-grid">
                <div class="info-item"><span class="info-label">Phòng số:</span><span class="info-value"><strong>${roomInfo.roomName}</strong></span></div>
                <div class="info-item"><span class="info-label">Tòa nhà:</span><span class="info-value">${roomInfo.buildingName}</span></div>
                <div class="info-item"><span class="info-label">Giá thuê:</span><span class="info-value"><span class="amount-highlight">${Number(roomInfo.price).toLocaleString()} đ</span>/tháng</span></div>
                <div class="info-item"><span class="info-label">Tiền cọc:</span><span class="info-value"><span class="amount-highlight">${Number(contract.Deposit || 0).toLocaleString()} đ</span></span></div>
            </div>
        </div>
        <div class="info-section">
            <div class="section-title">📅 THỜI HẠN HỢP ĐỒNG</div>
            <div class="info-grid">
                <div class="info-item"><span class="info-label">Ngày bắt đầu:</span><span class="info-value">${contract.StartDate ? new Date(contract.StartDate).toLocaleDateString('vi-VN') : "N/A"}</span></div>
                <div class="info-item"><span class="info-label">Ngày kết thúc:</span><span class="info-value">${contract.EndDate ? new Date(contract.EndDate).toLocaleDateString('vi-VN') : "N/A"}</span></div>
                <div class="info-item"><span class="info-label">Ngày kết thúc thực:</span><span class="info-value">${contract.ActualEndDate ? new Date(contract.ActualEndDate).toLocaleDateString('vi-VN') : "Chưa kết thúc"}</span></div>
                <div class="info-item"><span class="info-label">Trạng thái:</span><span class="info-value"><span class="status-badge-contract ${statusClass}">${status}</span></span></div>
            </div>
        </div>
        <div class="info-section">
            <div class="section-title">📜 ĐIỀU KHOẢN HỢP ĐỒNG</div>
            <div class="terms-box">
                <p>✓ Tiền thuê phòng thanh toán vào ngày 10 hàng tháng.</p>
                <p>✓ Tiền điện: 3.500đ/kWh, tiền nước: 15.000đ/m³.</p>
                <p>✓ Hợp đồng có thể chấm dứt trước với thông báo 30 ngày.</p>
                <p>✓ Tiền cọc hoàn trả khi kết thúc hợp đồng (không hư hỏng).</p>
            </div>
        </div>
        <div class="signature">
            <div class="signature-item"><strong>BÊN CHO THUÊ</strong><div class="sign-line">(Ký, ghi rõ họ tên)</div></div>
            <div class="signature-item"><strong>BÊN THUÊ</strong><div class="sign-line">(Ký, ghi rõ họ tên)</div></div>
        </div>
    `;
    detailModal.style.display = "flex";
}

function closeDetail() {
    detailModal.style.display = "none";
    currentDetail = null;
}

function numberToWords(num) {
    if (num === 0) return "không";
    const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
    const tens = ["", "mười", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
    let str = "";
    let billion = Math.floor(num / 1000000000);
    let million = Math.floor((num % 1000000000) / 1000000);
    let thousand = Math.floor((num % 1000000) / 1000);
    let rest = num % 1000;
    if (billion > 0) str += numberToWords(billion) + " tỷ ";
    if (million > 0) str += numberToWords(million) + " triệu ";
    if (thousand > 0) str += numberToWords(thousand) + " nghìn ";
    if (rest > 0) {
        if (rest < 100 && (billion > 0 || million > 0 || thousand > 0)) str += "lẻ ";
        let hundred = Math.floor(rest / 100);
        let ten = Math.floor((rest % 100) / 10);
        let unit = rest % 10;
        if (hundred > 0) str += units[hundred] + " trăm ";
        if (ten > 1) { str += tens[ten] + " "; if (unit > 0) str += units[unit]; }
        else if (ten === 1) { if (unit === 0) str += "mười"; else if (unit === 5) str += "mười lăm"; else str += "mười " + units[unit]; }
        else if (ten === 0 && hundred > 0 && unit > 0) str += "lẻ " + units[unit];
        else if (unit > 0) str += units[unit];
    }
    return str.trim();
}

function exportContract() {
    if (!currentDetail) return;
    const contract = currentDetail;
    const tenant = getTenantInfo(contract.TenantID);
    const roomInfo = getRoomInfo(contract.RoomID);
    const rentPrice = Number(roomInfo.price || 0);
    const deposit = Number(contract.Deposit || 0);
    
    document.getElementById("contractNumberPDF").innerText = contract.ContractID;
    document.getElementById("signDate").innerText = new Date().toLocaleDateString('vi-VN');
    document.getElementById("tenantNamePDF").innerText = tenant.FullName;
    document.getElementById("cccdPDF").innerText = tenant.CCCD;
    document.getElementById("addressPDF").innerText = tenant.Address;
    document.getElementById("phonePDF").innerText = tenant.Phone;
    document.getElementById("roomNamePDF").innerText = roomInfo.roomName;
    document.getElementById("buildingNamePDF").innerText = roomInfo.buildingName;
    document.getElementById("startDatePDF").innerText = contract.StartDate ? new Date(contract.StartDate).toLocaleDateString('vi-VN') : "N/A";
    document.getElementById("endDatePDF").innerText = contract.EndDate ? new Date(contract.EndDate).toLocaleDateString('vi-VN') : "N/A";
    document.getElementById("rentPricePDF").innerText = rentPrice.toLocaleString();
    document.getElementById("rentPriceTextPDF").innerText = numberToWords(rentPrice) + " đồng";
    document.getElementById("depositPDF").innerText = deposit.toLocaleString();
    document.getElementById("depositTextPDF").innerText = numberToWords(deposit) + " đồng";
    document.getElementById("tenantSignPDF").innerText = tenant.FullName;
    
    html2canvas(document.getElementById("contractTemplate"), { scale: 2 }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 0, 0, 210, canvas.height * 210 / canvas.width);
        doc.save(`HopDong_${contract.ContractID}.pdf`);
    });
}

function closeModal() { modal.style.display = "none"; }

modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
detailModal.addEventListener("click", e => { if (e.target === detailModal) closeDetail(); });

loadData();