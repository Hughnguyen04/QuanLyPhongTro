const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";
renderMenu(role);

let listContracts = [];
let listRooms = [];
let listTenants = [];
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
const mRentPrice = document.getElementById("mRentPrice");
const mNote = document.getElementById("mNote");
const mHasActualEnd = document.getElementById("mHasActualEnd");
const mActualEndDate = document.getElementById("mActualEndDate");

const detailModal = document.getElementById("detailModal");
const contractBody = document.getElementById("contractBody");
const contractCode = document.getElementById("contractCode");

/* ===== TOAST NOTIFICATION ===== */
function showToast(message, type = "success") {
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✓" : "✗";
    toast.innerHTML = `<span>${icon}</span> ${message}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Xử lý checkbox hiển thị input ngày kết thúc thực
if (mHasActualEnd) {
    mHasActualEnd.addEventListener("change", function() {
        if (this.checked) {
            mActualEndDate.style.display = "block";
            if (!mActualEndDate.value) {
                mActualEndDate.value = new Date().toISOString().split('T')[0];
            }
        } else {
            mActualEndDate.style.display = "none";
            mActualEndDate.value = "";
        }
    });
}

// Xử lý khi chọn phòng để cập nhật giá thuê
if (mRoomId) {
    mRoomId.addEventListener("change", function() {
        const selectedOption = this.options[this.selectedIndex];
        const price = selectedOption.getAttribute("data-price") || 0;
        if (mRentPrice) {
            mRentPrice.value = price;
        }
    });
}

async function loadData() {
    try {
        console.log("🚀 Đang tải dữ liệu...");
        
        const contractsResult = await API.getContracts();
        if (contractsResult.success && contractsResult.data) {
            // 🔥 FIX: Xóa ActualEndDate nếu không hợp lệ
            listContracts = contractsResult.data.map(contract => {
                // Nếu ActualEndDate là null, rỗng, hoặc '0000-00-00' thì xóa
                if (!contract.ActualEndDate || 
                    contract.ActualEndDate === '0000-00-00' || 
                    contract.ActualEndDate === 'null' ||
                    contract.ActualEndDate === '') {
                    contract.ActualEndDate = null;
                }
                
                // Nếu không có ActualEndDate nhưng status là HET_HAN và EndDate >= hôm nay
                if (!contract.ActualEndDate && contract.Status === 'HET_HAN') {
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const endDate = new Date(contract.EndDate);
                    endDate.setHours(0,0,0,0);
                    
                    if (endDate >= today) {
                        contract.Status = 'HIEU_LUC';
                        console.log(`✅ Đã sửa contract ${contract.ContractID}: HET_HAN -> HIEU_LUC`);
                    }
                }
                
                return contract;
            });
            
            console.log(`✅ Đã tải và fix ${listContracts.length} hợp đồng`);
        } else {
            listContracts = [];
        }
        const roomsResult = await API.getRooms();
        if (roomsResult && roomsResult.data) {
            listRooms = roomsResult.data;
        } else if (Array.isArray(roomsResult)) {
            listRooms = roomsResult;
        } else {
            listRooms = [];
        }
        console.log(`✅ Đã tải ${listRooms.length} phòng`);
        
        const tenantsResult = await API.getTenants();
        if (tenantsResult.success && tenantsResult.data) {
            listTenants = tenantsResult.data;
            console.log(`✅ Đã tải ${listTenants.length} người thuê`);
            loadTenantsToSelect();
        } else {
            listTenants = [];
        }
        
        loadRoomsToSelect();
        initFilters();
        render();
        
    } catch (error) {
        console.error('💥 Lỗi load data:', error);
        showToast("Lỗi tải dữ liệu: " + error.message, "error");
    }
}

function loadTenantsToSelect() {
    if (!mTenantId) return;
    mTenantId.innerHTML = '<option value="">Chọn người thuê</option>';
    listTenants.forEach(tenant => {
        mTenantId.innerHTML += `<option value="${tenant.TenantID}">${tenant.FullName || "N/A"} - ${tenant.Phone || "N/A"}</option>`;
    });
}

function loadRoomsToSelect() {
    if (!mRoomId) return;
    mRoomId.innerHTML = '<option value="">Chọn phòng</option>';
    listRooms.forEach(room => {
        mRoomId.innerHTML += `<option value="${room.RoomID}" data-price="${room.BasePrice || 0}">${room.RoomName || "N/A"} - ${room.BuildingName || "N/A"} (${Number(room.BasePrice || 0).toLocaleString()}đ)</option>`;
    });
}

function getStatus(contract) {
    if (!contract) return "N/A";
    
    // Ưu tiên kiểm tra ActualEndDate trước
    if (contract.ActualEndDate && contract.ActualEndDate !== null && contract.ActualEndDate !== "") {
        return "Đã kết thúc";
    }
    
    // Nếu không có ActualEndDate, kiểm tra EndDate so với ngày hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(contract.EndDate);
    endDate.setHours(0, 0, 0, 0);
    
    if (endDate < today) {
        return "Hết hạn";
    }
    return "Đang hiệu lực";
}

function initFilters() {
    const select = document.getElementById("buildingFilter");
    if (!select) return;
    
    const buildings = [...new Set(listContracts.map(c => c.BuildingName).filter(b => b && b !== "N/A" && b !== null && b !== ""))];
    
    select.innerHTML = '<option value="">Tất cả tòa</option>';
    buildings.forEach(b => {
        select.innerHTML += `<option value="${b}">${b}</option>`;
    });
}

function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const building = document.getElementById("buildingFilter").value;
    const tbody = document.getElementById("tbody");
    
    if (!tbody) return;
    
    if (listContracts.length === 0) {
        tbody.innerHTML = ` 
            <tr><td colspan="11" style="text-align:center; padding:40px;">📭 Không có dữ liệu hợp đồng</td></tr>
        `;
        document.getElementById("total").innerText = "0";
        document.getElementById("active").innerText = "0";
        document.getElementById("expired").innerText = "0";
        return;
    }
    
    let filtered = listContracts.filter(contract => {
        const tenantName = (contract.FullName || "").toLowerCase();
        const buildingName = contract.BuildingName || "";
        const matchKey = tenantName.includes(key);
        const matchBuilding = building === "" || buildingName === building;
        return matchKey && matchBuilding;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = ` 
            <tr><td colspan="11" style="text-align:center; padding:40px;">🔍 Không tìm thấy hợp đồng nào</td></tr>
        `;
        document.getElementById("total").innerText = "0";
        document.getElementById("active").innerText = "0";
        document.getElementById("expired").innerText = "0";
        return;
    }
    
    let total = 0, active = 0, expired = 0;
    
    tbody.innerHTML = filtered.map(contract => {
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
            <tr onclick="showDetail(${contract.ContractID})" style="cursor:pointer;">
                <td>${contract.ContractID}</td>
                <td><strong>${contract.FullName || "N/A"}</strong></td>
                <td>${contract.RoomName || "N/A"}</td>
                <td>${contract.BuildingName || "N/A"}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>${actualEndDate}</td>
                <td>${Number(contract.RentPrice || 0).toLocaleString()} đ</td>
                <td>${Number(contract.Deposit || 0).toLocaleString()} đ</td>
                <td style="color:${statusColor}; font-weight:500;">${statusIcon} ${status}</td>
                <td class="action-buttons" onclick="event.stopPropagation()">
                    <button class="btn-edit" onclick="openEdit(${contract.ContractID})">✏️ Sửa</button>
                    ${role === 'chutro' ? `<button class="btn-delete" onclick="deleteContract(${contract.ContractID})">🗑 Xóa</button>` : ""}
                    ${status === "Đang hiệu lực" ? `<button class="btn-end" onclick="endContract(${contract.ContractID})">🏁 Kết thúc</button>` : ""}
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
    if (mRentPrice) mRentPrice.value = "";
    if (mNote) mNote.value = "";
    
    if (mHasActualEnd) mHasActualEnd.checked = false;
    if (mActualEndDate) {
        mActualEndDate.style.display = "none";
        mActualEndDate.value = "";
    }
    
    modal.style.display = "flex";
}

function openEdit(id) {
    const contract = listContracts.find(c => c.ContractID == id);
    if (!contract) {
        showToast("Không tìm thấy hợp đồng!", "error");
        return;
    }
    
    console.log("Editing contract:", contract);
    
    editingId = id;
    modalTitle.innerText = "Sửa hợp đồng";
    
    mTenantId.value = contract.TenantID;
    mRoomId.value = contract.RoomID;
    mStartDate.value = contract.StartDate;
    mEndDate.value = contract.EndDate;
    mDeposit.value = contract.Deposit;
    mRentPrice.value = contract.RentPrice || 0;
    if (mNote) mNote.value = contract.Note || "";
    
    const selectedOption = mRoomId.querySelector(`option[value="${contract.RoomID}"]`);
    if (selectedOption && (!mRentPrice.value || mRentPrice.value == 0)) {
        const price = selectedOption.getAttribute("data-price") || 0;
        mRentPrice.value = price;
    }
    
    if (contract.ActualEndDate && contract.ActualEndDate !== "" && contract.ActualEndDate !== null) {
        if (mHasActualEnd) mHasActualEnd.checked = true;
        if (mActualEndDate) {
            mActualEndDate.style.display = "block";
            mActualEndDate.value = contract.ActualEndDate;
        }
    } else {
        if (mHasActualEnd) mHasActualEnd.checked = false;
        if (mActualEndDate) {
            mActualEndDate.style.display = "none";
            mActualEndDate.value = "";
        }
    }
    
    modal.style.display = "flex";
}

async function endContract(id) {
    if (!confirm("Xác nhận kết thúc hợp đồng này?")) return;
    const today = new Date().toISOString().split('T')[0];
    const contract = listContracts.find(c => c.ContractID == id);
    
    const contractData = { 
        ContractID: id, 
        ActualEndDate: today,
        RoomID: contract.RoomID,
        TenantID: contract.TenantID,
        StartDate: contract.StartDate,
        EndDate: contract.EndDate,
        Deposit: contract.Deposit,
        RentPrice: contract.RentPrice,
        Note: contract.Note
    };
    
    const result = await API.updateContract(contractData);
    
    let isSuccess = false;
    if (Array.isArray(result) && result[1] && (result[1].includes("da duoc cap nhat") || result[1].includes("thành công"))) {
        isSuccess = true;
    } else if (result.success === true) {
        isSuccess = true;
    }
    
    if (isSuccess) {
        showToast("Đã kết thúc hợp đồng!", "success");
        await loadData();
    } else {
        showToast("Lỗi: " + (result.message || (result[1] || "Không thể kết thúc hợp đồng")), "error");
    }
}

async function saveContract() {
    const tenantId = mTenantId.value;
    const roomId = mRoomId.value;
    const startDate = mStartDate.value;
    const endDate = mEndDate.value;
    const deposit = parseFloat(mDeposit.value) || 0;
    const rentPrice = parseFloat(mRentPrice.value) || 0;
    const note = mNote ? mNote.value : "";

    // VALIDATE
    if (!tenantId) return showToast("Vui lòng chọn người thuê!", "error");
    if (!roomId) return showToast("Vui lòng chọn phòng!", "error");
    if (!startDate) return showToast("Vui lòng chọn ngày bắt đầu!", "error");
    if (!endDate) return showToast("Vui lòng chọn ngày kết thúc!", "error");
    if (rentPrice <= 0) return showToast("Giá thuê không hợp lệ!", "error");
    if (deposit < 0) return showToast("Tiền cọc không hợp lệ!", "error");
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (endDateObj <= startDateObj) {
        return showToast("Ngày kết thúc phải sau ngày bắt đầu!", "error");
    }

    let status = "HIEU_LUC";
    
    // 🔥 QUAN TRỌNG: LUÔN GỬI ActualEndDate (gửi chuỗi rỗng nếu không có)
    let actualEndDate = "";  // Gửi chuỗi rỗng thay vì không gửi
    
    if (mHasActualEnd && mHasActualEnd.checked) {
        if (!mActualEndDate.value) {
            showToast("Vui lòng chọn ngày kết thúc thực!", "error");
            return;
        }
        actualEndDate = mActualEndDate.value;
        status = "HET_HAN";
    } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (endDateObj < today) {
            status = "HET_HAN";
        }
    }

    const contractData = {
        TenantID: parseInt(tenantId),
        RoomID: parseInt(roomId),
        StartDate: startDate,
        EndDate: endDate,
        ActualEndDate: actualEndDate,  // 🔥 LUÔN GỬI FIELD NÀY
        Deposit: deposit,
        RentPrice: rentPrice,
        Status: status,
        Note: note,
        ReturnedDeposit: 0
    };
    
    console.log("========== DEBUG ==========");
    console.log("Data gửi lên:", JSON.stringify(contractData, null, 2));
    console.log("===========================");
    
    let result;
    try {
        if (editingId) {
            contractData.ContractID = parseInt(editingId);
            result = await API.updateContract(contractData);
        } else {
            result = await API.createContract(contractData);
        }
    } catch (error) {
        console.error("API ERROR:", error);
        showToast("Lỗi kết nối server!", "error");
        return;
    }
    
    console.log("Response:", result);
    
    // KIỂM TRA THÀNH CÔNG
    let isSuccess = false;
    const responseString = JSON.stringify(result).toLowerCase();
    
    if (responseString.includes("da duoc tao") || 
        responseString.includes("thành công") ||
        responseString.includes("success")) {
        isSuccess = true;
    }
    
    if (isSuccess) {
        showToast(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!", "success");
        await loadData();
        closeModal();
    } else {
        showToast("Lỗi: " + (result?.message || result?.[1] || "Không thể lưu"), "error");
    }
}
window.deleteContract = async function(id) {
    if (role !== "chutro" && role !== "admin") {
        return showToast("Bạn không có quyền xóa!", "error");
    }
    
    if (!confirm("⚠️ Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác!")) return;
    
    try {
        showToast("🔄 Đang xóa...");
        
        const result = await API.deleteContract(id);
        console.log("Delete result:", result);
        
        let isSuccess = false;
        
        if (result) {
            const text = JSON.stringify(result).toLowerCase();
            
            if (
                result.status === true ||
                result.success === true ||
                text.includes("thành công") ||
                text.includes("success") ||
                text.includes("deleted")
            ) {
                isSuccess = true;
            }
            
            if (Array.isArray(result) && result[1]) {
                if (result[1].includes("da duoc xoa") || result[1].includes("thành công")) {
                    isSuccess = true;
                }
            }
        }
        
        if (isSuccess) {
            showToast("✅ Xóa hợp đồng thành công!", "success");
            await loadData();
        } else {
            showToast("❌ " + (result?.message || result?.[1] || "Xóa thất bại!"), "error");
        }
        
    } catch (error) {
        console.error("Delete error:", error);
        showToast("❌ Lỗi: " + error.message, "error");
    }
};

async function showDetail(id) {
    const contract = listContracts.find(c => c.ContractID == id);
    if (!contract) return;
    currentDetail = contract;
    
    let tenant = null;
    let room = null;
    
    try {
        const tenantsRes = await API.getTenants();
        let tenantsList = [];
        if (tenantsRes.success && tenantsRes.data) {
            tenantsList = tenantsRes.data;
        } else if (Array.isArray(tenantsRes)) {
            tenantsList = tenantsRes;
        }
        
        if (contract.FullName) {
            tenant = tenantsList.find(t => t.FullName === contract.FullName);
        }
        if (!tenant && contract.TenantID) {
            tenant = tenantsList.find(t => t.TenantID == contract.TenantID);
        }
        
    } catch (e) {
        console.error("Lỗi lấy tenant:", e);
    }
    
    try {
        const roomsRes = await API.getRooms();
        let roomsList = [];
        if (roomsRes && roomsRes.data) {
            roomsList = roomsRes.data;
        } else if (Array.isArray(roomsRes)) {
            roomsList = roomsRes;
        }
        
        if (contract.RoomName) {
            room = roomsList.find(r => r.RoomName === contract.RoomName);
        }
        if (!room && contract.RoomID) {
            room = roomsList.find(r => r.RoomID == contract.RoomID);
        }
        
    } catch (e) {
        console.error("Lỗi lấy room:", e);
    }
    
    const status = getStatus(contract);
    
    let statusClass = 'status-expired';
    if (status === "Đang hiệu lực") statusClass = 'status-active';
    else if (status === "Hết hạn") statusClass = 'status-expired';
    else statusClass = 'status-ended';
    
    contractCode.innerHTML = `Số: ${contract.ContractID} | Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`;
    
    const fullName = contract.FullName || "N/A";
    const cccd = tenant?.CCCD || "N/A";
    const birthDate = tenant?.BirthDate ? new Date(tenant.BirthDate).toLocaleDateString('vi-VN') : "N/A";
    const gender = tenant?.Gender === "NAM" ? "Nam" : (tenant?.Gender === "NU" ? "Nữ" : "N/A");
    const phone = tenant?.Phone || "N/A";
    const email = tenant?.Email || "N/A";
    const address = tenant?.Address || "N/A";
    
    const roomName = contract.RoomName || "N/A";
    const buildingName = contract.BuildingName || "N/A";
    const roomAddress = room?.BuildingAddress || "N/A";
    const area = room?.Area ? room.Area + " m²" : "N/A";
    const rentPrice = Number(contract.RentPrice || 0);
    const deposit = Number(contract.Deposit || 0);
    
    contractBody.innerHTML = `
        <div class="info-section">
            <div class="section-title">👤 THÔNG TIN NGƯỜI THUÊ</div>
            <div class="info-grid">
                <div class="info-item"><span class="info-label">Họ và tên:</span><span class="info-value"><strong>${fullName}</strong></span></div>
                <div class="info-item"><span class="info-label">CCCD/CMND:</span><span class="info-value">${cccd}</span></div>
                <div class="info-item"><span class="info-label">Ngày sinh:</span><span class="info-value">${birthDate}</span></div>
                <div class="info-item"><span class="info-label">Giới tính:</span><span class="info-value">${gender}</span></div>
                <div class="info-item"><span class="info-label">Số điện thoại:</span><span class="info-value">${phone}</span></div>
                <div class="info-item"><span class="info-label">Email:</span><span class="info-value">${email}</span></div>
                <div class="info-item"><span class="info-label">Địa chỉ:</span><span class="info-value">${address}</span></div>
            </div>
        </div>
        <div class="info-section">
            <div class="section-title">🏠 THÔNG TIN PHÒNG THUÊ</div>
            <div class="info-grid">
                <div class="info-item"><span class="info-label">Phòng số:</span><span class="info-value"><strong>${roomName}</strong></span></div>
                <div class="info-item"><span class="info-label">Tòa nhà:</span><span class="info-value">${buildingName}</span></div>
                <div class="info-item"><span class="info-label">Địa chỉ:</span><span class="info-value">${roomAddress}</span></div>
                <div class="info-item"><span class="info-label">Diện tích:</span><span class="info-value">${area}</span></div>
                <div class="info-item"><span class="info-label">Giá thuê:</span><span class="info-value"><span class="amount-highlight">${rentPrice.toLocaleString()} đ</span>/tháng</span></div>
                <div class="info-item"><span class="info-label">Tiền cọc:</span><span class="info-value"><span class="amount-highlight">${deposit.toLocaleString()} đ</span></span></div>
            </div>
        </div>
        <div class="info-section">
            <div class="section-title">📅 THỜI HẠN HỢP ĐỒNG</div>
            <div class="info-grid">
                <div class="info-item"><span class="info-label">Ngày bắt đầu:</span><span class="info-value">${contract.StartDate ? new Date(contract.StartDate).toLocaleDateString('vi-VN') : "N/A"}</span></div>
                <div class="info-item"><span class="info-label">Ngày kết thúc:</span><span class="info-value">${contract.EndDate ? new Date(contract.EndDate).toLocaleDateString('vi-VN') : "N/A"}</span></div>
                <div class="info-item"><span class="info-label">Ngày kết thúc thực:</span><span class="info-value">${contract.ActualEndDate ? new Date(contract.ActualEndDate).toLocaleDateString('vi-VN') : "Chưa kết thúc"}</span></div>
                <div class="info-item"><span class="info-label">Trạng thái:</span><span class="info-value"><span class="status-badge ${statusClass}">${status}</span></span></div>
            </div>
        </div>
        ${contract.Note ? `
        <div class="info-section">
            <div class="section-title">📝 GHI CHÚ</div>
            <div class="terms-box">
                <p>${contract.Note}</p>
            </div>
        </div>
        ` : ''}
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
    
    let tenant = null;
    let room = null;
    
    if (contract.FullName) {
        tenant = listTenants.find(t => t.FullName === contract.FullName);
    }
    if (!tenant && contract.TenantID) {
        tenant = listTenants.find(t => t.TenantID == contract.TenantID);
    }
    
    if (contract.RoomName) {
        room = listRooms.find(r => r.RoomName === contract.RoomName);
    }
    if (!room && contract.RoomID) {
        room = listRooms.find(r => r.RoomID == contract.RoomID);
    }
    
    const rentPrice = Number(contract.RentPrice || 0);
    const deposit = Number(contract.Deposit || 0);
    
    let representative = "";
    const buildingName = contract.BuildingName || "";
    
    if (buildingName.includes("Tòa A")) {
        representative = "Nguyễn Như Thành Danh";
    } else if (buildingName.includes("Tòa B")) {
        representative = "Nguyễn Quang Huy";
    } else if (buildingName.includes("Tòa C")) {
        representative = "Trịnh Đắc Vụ";
    } else {
        representative = "Nguyễn Văn A";
    }
    
    document.getElementById("contractNumberPDF").innerText = contract.ContractID;
    document.getElementById("signDate").innerText = new Date().toLocaleDateString('vi-VN');
    document.getElementById("tenantNamePDF").innerText = contract.FullName || "N/A";
    document.getElementById("cccdPDF").innerText = tenant?.CCCD || "N/A";
    document.getElementById("issuePlacePDF").innerText = "Công an cấp";
    document.getElementById("issueDatePDF").innerText = tenant?.BirthDate ? new Date(tenant.BirthDate).toLocaleDateString('vi-VN') : "N/A";
    document.getElementById("addressPDF").innerText = tenant?.Address || "N/A";
    document.getElementById("phonePDF").innerText = tenant?.Phone || "N/A";
    document.getElementById("roomNamePDF").innerText = contract.RoomName || "N/A";
    document.getElementById("buildingNamePDF").innerText = contract.BuildingName || "N/A";
    document.getElementById("startDatePDF").innerText = contract.StartDate ? new Date(contract.StartDate).toLocaleDateString('vi-VN') : "N/A";
    document.getElementById("endDatePDF").innerText = contract.EndDate ? new Date(contract.EndDate).toLocaleDateString('vi-VN') : "N/A";
    document.getElementById("rentPricePDF").innerText = rentPrice.toLocaleString();
    document.getElementById("rentPriceTextPDF").innerText = numberToWords(rentPrice) + " đồng";
    document.getElementById("depositPDF").innerText = deposit.toLocaleString();
    document.getElementById("depositTextPDF").innerText = numberToWords(deposit) + " đồng";
    document.getElementById("tenantSignPDF").innerText = contract.FullName || "N/A";
    document.getElementById("representativePDF").innerText = representative;
    document.getElementById("representativePDF2").innerText = representative;
    document.getElementById("representativePDF3").innerText = representative;
    
    const template = document.getElementById("contractTemplate");
    if (!template) {
        showToast("Không tìm thấy template hợp đồng", "error");
        return;
    }
    
    html2canvas(template, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        doc.save(`HopDong_${contract.ContractID}.pdf`);
    }).catch(error => {
        console.error("PDF export error:", error);
        showToast("Lỗi xuất PDF: " + error.message, "error");
    });
}

function closeModal() { 
    modal.style.display = "none"; 
}

modal.addEventListener("click", e => { 
    if (e.target === modal) closeModal(); 
});

detailModal.addEventListener("click", e => { 
    if (e.target === detailModal) closeDetail(); 
});

loadData();