let listBills = [];
let listContracts = [];
let listRooms = [];
let listUtilities = [];
let currentBillDetail = null;

const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

// Kiểm tra quyền - chỉ người thuê mới vào được
if (role !== "nguoithue") {
    alert("Trang này chỉ dành cho người thuê!");
    location.href = "../Login/login.html";
}

if (!username) {
    location.href = "../Login/login.html";
}

document.getElementById("username").innerText = username || "";
if (typeof renderMenu === 'function') renderMenu(role);

// Format currency
function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString("vi-VN") + " ₫";
}

// Format status
function formatStatus(status) {
    const map = {
        'DA_THANH_TOAN': 'Đã thanh toán',
        'CHUA_THANH_TOAN': 'Chưa thanh toán',
        'CHUA_DEN_KY': 'Chưa đến kỳ',
        'QUA_HAN': 'Quá hạn'
    };
    return map[status] || 'Chưa thanh toán';
}

// Get status class
function getStatusClass(status) {
    if (status === 'DA_THANH_TOAN') return 'paid';
    if (status === 'CHUA_THANH_TOAN') return 'unpaid';
    if (status === 'QUA_HAN') return 'overdue';
    return '';
}

// Show toast
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Tính phí trễ hạn
function calculateLateFee(dueDate, paymentDate, totalAmount) {
    if (paymentDate) return 0;
    
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    if (diffDays <= 5) return 0;
    
    const lateDays = diffDays - 5;
    const lateFee = lateDays * 100000;
    const maxLateFee = totalAmount * 0.5;
    return Math.min(lateFee, maxLateFee);
}

// Đếm số hợp đồng đang hiệu lực của phòng
function countActiveContracts(roomName, month, year) {
    const billDate = new Date(year, month - 1, 15);
    
    const roomContracts = listContracts.filter(c => {
        const contractRoomName = c.RoomName || c.room_name;
        return contractRoomName === roomName;
    });
    
    const activeContracts = roomContracts.filter(contract => {
        const isActive = contract.Status === 'HIEU_LUC' || contract.Status === 'ACTIVE' || !contract.Status;
        if (!isActive) return false;
        
        const startDate = new Date(contract.StartDate);
        const endDate = new Date(contract.EndDate || '2099-12-31');
        return billDate >= startDate && billDate <= endDate;
    });
    
    return activeContracts.length;
}

// Lấy danh sách người thuê trong phòng
function getTenantsInRoom(roomName, month, year) {
    const billDate = new Date(year, month - 1, 15);
    
    const roomContracts = listContracts.filter(c => {
        const contractRoomName = c.RoomName || c.room_name;
        return contractRoomName === roomName;
    });
    
    const activeContracts = roomContracts.filter(contract => {
        const isActive = contract.Status === 'HIEU_LUC' || contract.Status === 'ACTIVE' || !contract.Status;
        if (!isActive) return false;
        
        const startDate = new Date(contract.StartDate);
        const endDate = new Date(contract.EndDate || '2099-12-31');
        return billDate >= startDate && billDate <= endDate;
    });
    
    return activeContracts.map(c => c.FullName || c.full_name || 'Không tên');
}

// Lấy giá phòng
function getRoomPrice(roomName) {
    const room = listRooms.find(r => (r.RoomName || r.room_name) === roomName);
    return Number(room?.BasePrice || room?.base_price || 0);
}

// Lấy tên tòa nhà
function getBuildingName(roomName) {
    if (!roomName) return '';
    const firstChar = roomName.charAt(0).toUpperCase();
    if (firstChar === 'A') return 'Tòa A';
    if (firstChar === 'B') return 'Tòa B';
    if (firstChar === 'C') return 'Tòa C';
    return '';
}

// Load all data
async function loadAllData() {
    try {
        // Hiển thị loading
        const billList = document.getElementById("billList");
        if (billList) {
            billList.innerHTML = `
                <div class="empty-state">
                    <div class="icon">⏳</div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            `;
        }
        
        // Gọi API song song
        const [contractsResult, roomsResult, utilsResult, billsResult] = await Promise.all([
            MyBillAPI.getContracts(),
            MyBillAPI.getRooms(),
            MyBillAPI.getUtilities(),
            MyBillAPI.getBills()
        ]);
        
        console.log("Contracts:", contractsResult);
        console.log("Rooms:", roomsResult);
        console.log("Utilities:", utilsResult);
        console.log("Bills:", billsResult);
        
        // Xử lý contracts
        if (contractsResult && contractsResult.data && Array.isArray(contractsResult.data)) {
            listContracts = contractsResult.data;
        } else if (Array.isArray(contractsResult)) {
            listContracts = contractsResult;
        } else {
            listContracts = [];
        }
        
        // Xử lý rooms
        if (roomsResult && roomsResult.data && Array.isArray(roomsResult.data)) {
            listRooms = roomsResult.data;
        } else if (Array.isArray(roomsResult)) {
            listRooms = roomsResult;
        } else {
            listRooms = [];
        }
        
        // Xử lý utilities
        if (utilsResult && utilsResult.data && Array.isArray(utilsResult.data)) {
            listUtilities = utilsResult.data;
        } else if (Array.isArray(utilsResult)) {
            listUtilities = utilsResult;
        } else {
            listUtilities = [];
        }
        
        // Xử lý bills
        if (billsResult && billsResult.data && Array.isArray(billsResult.data)) {
            listBills = billsResult.data;
        } else if (Array.isArray(billsResult)) {
            listBills = billsResult;
        } else {
            listBills = [];
        }
        
        console.log("Raw bills count:", listBills.length);
        
        // Tìm phòng của người thuê hiện tại
        const userRoom = findUserRoom();
        console.log("User room:", userRoom);
        
        if (!userRoom) {
            console.log("Không tìm thấy phòng của người dùng:", username);
            renderEmpty("Không tìm thấy phòng của bạn. Vui lòng liên hệ chủ trọ.");
            return;
        }
        
        // Lọc hóa đơn theo phòng của người thuê
        listBills = listBills.filter(bill => {
            const billRoomName = bill.RoomName || bill.room_name;
            return billRoomName === userRoom;
        });
        
        console.log("Filtered bills count:", listBills.length);
        
        if (listBills.length === 0) {
            renderEmpty("Không có hóa đơn nào cho phòng của bạn.");
            return;
        }
        
        // Tính toán lại bills
        processBills();
        
        // Render danh sách
        render();
        
    } catch (error) {
        console.error("Error loading data:", error);
        showToast("Lỗi tải dữ liệu: " + error.message, "error");
        renderEmpty("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    }
}

// Tìm phòng của người thuê hiện tại
function findUserRoom() {
    // Tìm trong contracts
    const userContract = listContracts.find(c => {
        const tenantName = c.FullName || c.full_name;
        return tenantName === username;
    });
    
    if (userContract) {
        const roomName = userContract.RoomName || userContract.room_name;
        console.log("Found room from contract:", roomName);
        return roomName;
    }
    
    // Nếu không tìm thấy trong contracts, thử tìm trong bills
    const userBill = listBills.find(b => {
        const tenantName = b.FullName || b.tenant_name;
        return tenantName === username;
    });
    
    if (userBill) {
        const roomName = userBill.RoomName || userBill.room_name;
        console.log("Found room from bill:", roomName);
        return roomName;
    }
    
    return null;
}

// Xử lý và tính toán bills
function processBills() {
    listBills = listBills.map(bill => {
        const roomName = bill.RoomName || bill.room_name;
        if (!roomName) return bill;
        
        const numberOfContracts = countActiveContracts(roomName, bill.Month, bill.Year);
        const serviceFee = numberOfContracts * 100000;
        const tenants = getTenantsInRoom(roomName, bill.Month, bill.Year);
        const tenantNames = tenants.join(', ');
        
        const utility = listUtilities.find(u => {
            const utilRoomName = u.RoomName || u.room_name;
            return utilRoomName === roomName && 
                   Number(u.Month) === Number(bill.Month) && 
                   Number(u.Year) === Number(bill.Year);
        });
        
        let electricCost = 0, waterCost = 0;
        let electricUsage = 0, waterUsage = 0;
        let electricPrice = 3500;
        const waterPrice = 15000;
        
        if (utility) {
            electricUsage = (Number(utility.ElectricNew) || 0) - (Number(utility.ElectricOld) || 0);
            waterUsage = (Number(utility.WaterNew) || 0) - (Number(utility.WaterOld) || 0);
            electricPrice = Number(utility.ElectricPrice) || 3500;
            electricCost = electricUsage * electricPrice;
            waterCost = waterUsage * waterPrice;
        }
        
        const roomPrice = getRoomPrice(roomName);
        const baseTotal = roomPrice + serviceFee + electricCost + waterCost;
        
        let lateFee = 0;
        let currentStatus = bill.Status;
        
        if (bill.Status !== 'DA_THANH_TOAN' && bill.DueDate) {
            lateFee = calculateLateFee(bill.DueDate, bill.PaymentDate, baseTotal);
            if (lateFee > 0 && bill.Status !== 'DA_THANH_TOAN') {
                currentStatus = 'QUA_HAN';
            }
        }
        
        const totalAmount = baseTotal + lateFee;
        
        return {
            ...bill,
            RoomPrice: roomPrice,
            ServiceFee: serviceFee,
            NumberOfContracts: numberOfContracts,
            Tenants: tenants,
            TenantNames: tenantNames,
            ElectricCost: electricCost,
            WaterCost: waterCost,
            ElectricUsage: electricUsage,
            WaterUsage: waterUsage,
            ElectricPrice: electricPrice,
            WaterPrice: waterPrice,
            LateFee: lateFee,
            TotalAmount: totalAmount,
            Status: currentStatus,
            BuildingName: getBuildingName(roomName)
        };
    });
    
    // Sắp xếp theo tháng/năm giảm dần (mới nhất lên đầu)
    listBills.sort((a, b) => {
        if (a.Year !== b.Year) return b.Year - a.Year;
        return b.Month - a.Month;
    });
    
    console.log("Processed bills:", listBills.length);
}

// Render danh sách hóa đơn
function render() {
    const billList = document.getElementById("billList");
    if (!billList) return;
    
    if (listBills.length === 0) {
        renderEmpty("Không có hóa đơn nào.");
        return;
    }
    
    billList.innerHTML = listBills.map(bill => {
        const statusClass = getStatusClass(bill.Status);
        const statusText = formatStatus(bill.Status);
        const buildingName = bill.BuildingName;
        
        return `
            <div class="bill" onclick="showDetail(${bill.BillID})">
                <div class="bill-left">
                    <div class="bill-month">
                        📄 Hóa đơn tháng ${bill.Month}/${bill.Year}
                    </div>
                    <div class="bill-room">
                        Phòng ${bill.RoomName || 'N/A'}
                        ${buildingName ? `<span class="building">${buildingName}</span>` : ''}
                    </div>
                    <div class="bill-details">
                        <span>🏠 ${formatCurrency(bill.RoomPrice)}</span>
                        <span>⚡ ${formatCurrency(bill.ElectricCost)}</span>
                        <span>💧 ${formatCurrency(bill.WaterCost)}</span>
                        ${bill.LateFee > 0 ? `<span class="late-fee">⚠️ +${formatCurrency(bill.LateFee)}</span>` : ''}
                    </div>
                    <div class="bill-status ${statusClass}">
                        ${statusText}
                    </div>
                </div>
                <div class="bill-total">
                    ${formatCurrency(bill.TotalAmount)}
                </div>
            </div>
        `;
    }).join('');
}

// Render trạng thái rỗng
function renderEmpty(message) {
    const billList = document.getElementById("billList");
    if (billList) {
        billList.innerHTML = `
            <div class="empty-state">
                <div class="icon">📭</div>
                <p>${message}</p>
            </div>
        `;
    }
}

// Hiển thị chi tiết hóa đơn
function showDetail(id) {
    const bill = listBills.find(b => b.BillID === id);
    if (!bill) return;
    
    currentBillDetail = bill;
    
    const dueDate = bill.DueDate ? new Date(bill.DueDate).toLocaleDateString('vi-VN') : "Chưa có";
    const paymentDate = bill.PaymentDate ? new Date(bill.PaymentDate).toLocaleDateString('vi-VN') : "Chưa thanh toán";
    
    let tenantsHtml = '';
    if (bill.Tenants && bill.Tenants.length > 0) {
        tenantsHtml = `
            <div class="detail-row">
                <div class="detail-label">Người thuê:</div>
                <div class="detail-value">${bill.Tenants.join(', ')}</div>
            </div>
        `;
    }
    
    let lateDaysInfo = '';
    if (bill.Status !== 'DA_THANH_TOAN' && bill.DueDate) {
        const due = new Date(bill.DueDate);
        const today = new Date();
        due.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diffDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        if (diffDays > 5) {
            const lateDays = diffDays - 5;
            lateDaysInfo = `
                <div style="background:#fff3e0; padding:12px; border-radius:8px; margin-top:10px;">
                    <div class="detail-row" style="border-bottom:none;">
                        <div class="detail-label">⚠️ Phí trễ hạn:</div>
                        <div class="detail-value">Quá hạn ${lateDays} ngày (sau 5 ngày, 100k/ngày)</div>
                    </div>
                </div>
            `;
        }
    }
    
    const modalHtml = `
        <div class="detail-row">
            <div class="detail-label">Mã hóa đơn:</div>
            <div class="detail-value">${bill.BillID}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Phòng:</div>
            <div class="detail-value">${bill.RoomName || 'N/A'}</div>
        </div>
        ${tenantsHtml}
        <div class="detail-row">
            <div class="detail-label">Kỳ thanh toán:</div>
            <div class="detail-value">Tháng ${bill.Month}/${bill.Year}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Hạn thanh toán:</div>
            <div class="detail-value">${dueDate}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Ngày thanh toán:</div>
            <div class="detail-value">${paymentDate}</div>
        </div>
        
        <div class="utility-info">
            <h4>⚡ Chi tiết điện nước</h4>
            <div class="detail-row">
                <div class="detail-label">Điện:</div>
                <div class="detail-value">${bill.ElectricUsage || 0} kWh × ${formatCurrency(bill.ElectricPrice || 3500)} = ${formatCurrency(bill.ElectricCost)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Nước:</div>
                <div class="detail-value">${bill.WaterUsage || 0} m³ × 15.000đ = ${formatCurrency(bill.WaterCost)}</div>
            </div>
        </div>
        
        <div class="detail-row">
            <div class="detail-label">Tiền phòng:</div>
            <div class="detail-value">${formatCurrency(bill.RoomPrice)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Tiền dịch vụ:</div>
            <div class="detail-value">${formatCurrency(bill.ServiceFee || 0)} <small>(${bill.NumberOfContracts || 1} hợp đồng × 100k)</small></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Tiền điện:</div>
            <div class="detail-value">${formatCurrency(bill.ElectricCost)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Tiền nước:</div>
            <div class="detail-value">${formatCurrency(bill.WaterCost)}</div>
        </div>
        ${bill.LateFee > 0 ? `
        <div class="detail-row">
            <div class="detail-label">Phí trễ hạn:</div>
            <div class="detail-value" style="color:#f44336; font-weight:600;">${formatCurrency(bill.LateFee)}</div>
        </div>
        ` : ''}
        <div class="detail-row" style="border-top: 2px solid #ddd; margin-top: 10px; padding-top: 15px;">
            <div class="detail-label"><strong>Tổng tiền:</strong></div>
            <div class="detail-value" style="font-size:18px; font-weight:700; color:#6c63ff;"><strong>${formatCurrency(bill.TotalAmount)}</strong></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Trạng thái:</div>
            <div class="detail-value">
                <span class="bill-status ${getStatusClass(bill.Status)}" style="display:inline-block;">${formatStatus(bill.Status)}</span>
            </div>
        </div>
        ${lateDaysInfo}
    `;
    
    // Tạo modal nếu chưa có
    let modal = document.getElementById("billDetailModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "billDetailModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="box">
                <h3>📄 Chi tiết hóa đơn</h3>
                <div id="detailBody"></div>
                <div class="modal-actions">
                    <button onclick="closeDetailModal()">❌ Đóng</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const detailBody = document.getElementById("detailBody");
    if (detailBody) detailBody.innerHTML = modalHtml;
    
    modal.style.display = "flex";
}

// Đóng modal chi tiết
function closeDetailModal() {
    const modal = document.getElementById("billDetailModal");
    if (modal) modal.style.display = "none";
    currentBillDetail = null;
}

// Đóng modal khi click outside
window.onclick = function(event) {
    const modal = document.getElementById("billDetailModal");
    if (event.target === modal) closeDetailModal();
};

// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
    loadAllData();
});

// Global functions
window.showDetail = showDetail;
window.closeDetailModal = closeDetailModal;