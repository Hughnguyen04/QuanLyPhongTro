let listBills = [];
let listContracts = [];
let listRooms = [];
let listUtilities = [];
let editingBillId = null;
let currentBillDetail = null;

const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";
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
        'DA_THANH_TOAN': '✅ Đã thanh toán',
        'CHUA_THANH_TOAN': '⏳ Chưa thanh toán',
        'CHUA_DEN_KY': '📅 Chưa đến kỳ',
        'QUA_HAN': '⚠️ Quá hạn'
    };
    return map[status] || 'Chưa thanh toán';
}

// Get status class
function getStatusClass(status) {
    if (status === 'DA_THANH_TOAN') return 'status-da_thanh_toan';
    if (status === 'CHUA_THANH_TOAN') return 'status-chua_thanh_toan';
    if (status === 'QUA_HAN') return 'status-qua_han';
    return 'status-chua_den_ky';
}

// Show toast
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== TÍNH PHÍ TRỄ HẠN =====
// Quy tắc: sau hạn 5 ngày mà chưa thanh toán, tính mỗi ngày 100k
function calculateLateFee(dueDate, paymentDate, totalAmount) {
    // Nếu đã thanh toán, không tính phí trễ
    if (paymentDate) return 0;
    
    const today = new Date();
    const due = new Date(dueDate);
    
    // Reset giờ về 0 để so sánh chính xác số ngày
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    // Tính số ngày trễ
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Sau 5 ngày mới tính phí
    if (diffDays <= 5) return 0;
    
    // Tính phí: (số ngày trễ - 5) * 100,000
    const lateDays = diffDays - 5;
    const lateFee = lateDays * 100000;
    
    // Giới hạn phí trễ không quá 50% tổng tiền hóa đơn
    const maxLateFee = totalAmount * 0.5;
    return Math.min(lateFee, maxLateFee);
}

// ĐẾM SỐ HỢP ĐỒNG ĐANG HIỆU LỰC CỦA PHÒNG
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

// Lấy giá phòng từ rooms
function getRoomPrice(roomName) {
    const room = listRooms.find(r => (r.RoomName || r.room_name) === roomName);
    return Number(room?.BasePrice || room?.base_price || 0);
}

// Load all data
async function loadAllData() {
    try {
        const contractsResult = await API.getContracts();
        if (contractsResult && contractsResult.data && Array.isArray(contractsResult.data)) {
            listContracts = contractsResult.data;
        } else if (Array.isArray(contractsResult)) {
            listContracts = contractsResult;
        } else {
            listContracts = [];
        }
        console.log("📋 Contracts loaded:", listContracts.length);
        
        const roomsResult = await API.getRooms();
        if (roomsResult && roomsResult.data && Array.isArray(roomsResult.data)) {
            listRooms = roomsResult.data;
        } else if (Array.isArray(roomsResult)) {
            listRooms = roomsResult;
        } else {
            listRooms = [];
        }
        console.log("🏠 Rooms loaded:", listRooms.length);
        
        const utilsResult = await API.getUtilities();
        if (utilsResult && utilsResult.data && Array.isArray(utilsResult.data)) {
            listUtilities = utilsResult.data;
        } else if (Array.isArray(utilsResult)) {
            listUtilities = utilsResult;
        } else {
            listUtilities = [];
        }
        
        await loadBills();
        
    } catch (error) {
        console.error("Error loading data:", error);
        showToast("Lỗi tải dữ liệu", "error");
    }
}

// Load bills
async function loadBills() {
    try {
        const result = await API.getBills();
        
        if (result && result.data && Array.isArray(result.data)) {
            listBills = result.data;
        } else if (Array.isArray(result)) {
            listBills = result;
        } else {
            listBills = [];
        }
        
        // Tính lại tổng tiền cho mỗi bill
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
            let electricPrice = 3500; // Giá điện mặc định 3.500đ/kWh
            const waterPrice = 15000; // Giá nước cố định 15.000đ/m³
            
            if (utility) {
                electricUsage = (Number(utility.ElectricNew) || 0) - (Number(utility.ElectricOld) || 0);
                waterUsage = (Number(utility.WaterNew) || 0) - (Number(utility.WaterOld) || 0);
                electricPrice = Number(utility.ElectricPrice) || 3500;
                electricCost = electricUsage * electricPrice;
                waterCost = waterUsage * waterPrice; // Giá nước cố định 15.000đ/m³
            }
            
            const roomPrice = getRoomPrice(roomName);
            const baseTotal = roomPrice + serviceFee + electricCost + waterCost;
            
            // TÍNH PHÍ TRỄ HẠN
            let lateFee = 0;
            let currentStatus = bill.Status;
            
            // Chỉ tính phí trễ nếu hóa đơn chưa thanh toán
            if (bill.Status !== 'DA_THANH_TOAN' && bill.DueDate) {
                lateFee = calculateLateFee(bill.DueDate, bill.PaymentDate, baseTotal);
                
                // Cập nhật trạng thái nếu quá hạn
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
                Status: currentStatus
            };
        });
        
        // Cập nhật UI
        updateSummary();
        initFilters();
        render();
        populateContractDropdown();
        
    } catch (error) {
        console.error("Error loading bills:", error);
        listBills = [];
        updateSummary();
        render();
    }
}

// Cập nhật phần tổng quan
function updateSummary() {
    let totalBills = 0;
    let unpaidBills = 0;
    let paidBills = 0;
    let overdueBills = 0;
    let totalAmount = 0;
    let totalUnpaidAmount = 0;
    
    listBills.forEach(bill => {
        totalBills++;
        const amount = Number(bill.TotalAmount) || 0;
        totalAmount += amount;
        
        if (bill.Status === 'DA_THANH_TOAN') {
            paidBills++;
        } else {
            unpaidBills++;
            totalUnpaidAmount += amount;
            if (bill.Status === 'QUA_HAN') {
                overdueBills++;
            }
        }
    });
    
    const totalBillsEl = document.getElementById("totalBills");
    const unpaidBillsEl = document.getElementById("unpaidBills");
    const paidBillsEl = document.getElementById("paidBills");
    const totalAmountEl = document.getElementById("totalAmount");
    
    if (totalBillsEl) totalBillsEl.innerText = totalBills;
    if (unpaidBillsEl) unpaidBillsEl.innerText = unpaidBills;
    if (paidBillsEl) paidBillsEl.innerText = paidBills;
    if (totalAmountEl) totalAmountEl.innerText = formatCurrency(totalAmount);
    
    // Thêm card tổng tiền chưa thu nếu chưa có
    let unpaidTotalCard = document.getElementById("unpaidTotal");
    if (!unpaidTotalCard) {
        const cardsContainer = document.querySelector(".cards");
        if (cardsContainer && cardsContainer.children.length === 4) {
            const newCard = document.createElement("div");
            newCard.className = "card";
            newCard.id = "unpaidTotal";
            newCard.innerHTML = `<h4>💰 Chưa thu</h4><p id="unpaidAmount">${formatCurrency(totalUnpaidAmount)}</p>`;
            cardsContainer.appendChild(newCard);
        }
    } else {
        const unpaidAmountEl = document.getElementById("unpaidAmount");
        if (unpaidAmountEl) unpaidAmountEl.innerText = formatCurrency(totalUnpaidAmount);
    }
    
    console.log("✅ Summary updated:", { totalBills, unpaidBills, paidBills, overdueBills, totalAmount, totalUnpaidAmount });
}

// Populate contract dropdown
function populateContractDropdown() {
    const contractSelect = document.getElementById("mContractID");
    if (!contractSelect) return;
    
    contractSelect.innerHTML = '<option value="">-- Chọn hợp đồng --</option>' +
        listContracts.map(c => {
            const roomName = c.RoomName || c.room_name || 'Phòng unknown';
            const tenantName = c.FullName || c.full_name || 'Không tên';
            return `<option value="${c.ContractID}">${roomName} - ${tenantName}</option>`;
        }).join('');
}

// Load thông tin khi chọn hợp đồng
async function loadContractInfo() {
    const contractId = document.getElementById("mContractID").value;
    const month = parseInt(document.getElementById("mMonth").value);
    const year = parseInt(document.getElementById("mYear").value);
    const dueDate = document.getElementById("mDueDate").value;
    const selectedStatus = document.getElementById("mStatus").value;
    
    if (!contractId || !month || !year) {
        document.getElementById("contractInfo").style.display = "none";
        document.getElementById("utilityInfo").style.display = "none";
        return;
    }
    
    const contract = listContracts.find(c => Number(c.ContractID) === Number(contractId));
    if (!contract) return;
    
    const roomName = contract.RoomName || contract.room_name;
    if (!roomName) {
        showToast("Hợp đồng không có thông tin phòng", "error");
        return;
    }
    
    const numberOfContracts = countActiveContracts(roomName, month, year);
    const serviceFee = numberOfContracts * 100000;
    const tenants = getTenantsInRoom(roomName, month, year);
    const tenantNames = tenants.join(', ') || contract.FullName || 'Không tên';
    
    const utility = listUtilities.find(u => {
        const utilRoomName = u.RoomName || u.room_name;
        return utilRoomName === roomName && 
               Number(u.Month) === month && 
               Number(u.Year) === year;
    });
    
    let electricCost = 0, waterCost = 0;
    let electricUsage = 0, waterUsage = 0;
    let electricPrice = 3500;
    const waterPrice = 15000; // Giá nước cố định 15.000đ/m³
    
    if (utility) {
        electricUsage = (Number(utility.ElectricNew) || 0) - (Number(utility.ElectricOld) || 0);
        waterUsage = (Number(utility.WaterNew) || 0) - (Number(utility.WaterOld) || 0);
        electricPrice = Number(utility.ElectricPrice) || 3500;
        electricCost = electricUsage * electricPrice;
        waterCost = waterUsage * waterPrice;
    }
    
    const roomPrice = getRoomPrice(roomName);
    const baseTotal = roomPrice + serviceFee + electricCost + waterCost;
    
    // Tính phí trễ dự kiến nếu chưa thanh toán
    let estimatedLateFee = 0;
    let estimatedTotal = baseTotal;
    
    if (selectedStatus !== 'DA_THANH_TOAN' && dueDate) {
        estimatedLateFee = calculateLateFee(dueDate, null, baseTotal);
        estimatedTotal = baseTotal + estimatedLateFee;
    }
    
    document.getElementById("contractInfo").style.display = "block";
    document.getElementById("infoRoomName").innerHTML = `<strong>${roomName}</strong>`;
    document.getElementById("infoFullName").innerHTML = tenantNames;
    document.getElementById("infoNumberOfPeople").innerHTML = `<strong style="color:#6c63ff; font-size:20px;">${numberOfContracts}</strong> hợp đồng<br><small>(${numberOfContracts} người)</small>`;
    document.getElementById("infoRoomPrice").innerHTML = formatCurrency(roomPrice);
    
    document.getElementById("utilityInfo").style.display = "block";
    document.getElementById("infoElectricOld").innerHTML = utility?.ElectricOld || 0;
    document.getElementById("infoElectricNew").innerHTML = utility?.ElectricNew || 0;
    document.getElementById("infoElectricUsage").innerHTML = electricUsage;
    document.getElementById("infoElectricPrice").innerHTML = formatCurrency(electricPrice);
    document.getElementById("infoWaterOld").innerHTML = utility?.WaterOld || 0;
    document.getElementById("infoWaterNew").innerHTML = utility?.WaterNew || 0;
    document.getElementById("infoWaterUsage").innerHTML = waterUsage;
    document.getElementById("infoWaterPrice").innerHTML = formatCurrency(waterPrice);
    
    document.getElementById("calcRoomPrice").innerHTML = formatCurrency(roomPrice);
    document.getElementById("calcServiceFee").innerHTML = `${formatCurrency(serviceFee)} <small>(${numberOfContracts} hợp đồng × 100k)</small>`;
    document.getElementById("calcElectricCost").innerHTML = formatCurrency(electricCost);
    document.getElementById("calcWaterCost").innerHTML = formatCurrency(waterCost);
    
    // Hiển thị phí trễ nếu có
    const calcLateFeeRow = document.getElementById("calcLateFee");
    const calcTotalAfterLateRow = document.getElementById("calcTotalAfterLate");
    
    if (estimatedLateFee > 0) {
        if (!calcLateFeeRow) {
            const calcBox = document.querySelector(".calc-box");
            const totalRow = document.querySelector(".calc-box .total");
            
            const lateFeeRow = document.createElement("div");
            lateFeeRow.className = "info-row";
            lateFeeRow.id = "calcLateFee";
            lateFeeRow.innerHTML = `
                <span class="info-label" style="color:#f44336;">⚠️ Phí trễ hạn:</span>
                <span id="calcLateFeeAmount" style="color:#f44336; font-weight:600;">${formatCurrency(estimatedLateFee)}</span>
            `;
            calcBox.insertBefore(lateFeeRow, totalRow);
            
            const totalAfterLateRow = document.createElement("div");
            totalAfterLateRow.className = "info-row total";
            totalAfterLateRow.id = "calcTotalAfterLate";
            totalAfterLateRow.innerHTML = `
                <span class="info-label"><strong>TỔNG TIỀN (bao gồm phí trễ):</strong></span>
                <span id="calcTotalWithLate"><strong>${formatCurrency(estimatedTotal)}</strong></span>
            `;
            calcBox.insertBefore(totalAfterLateRow, totalRow.nextSibling);
            totalRow.style.display = "none";
        } else {
            document.getElementById("calcLateFeeAmount").innerHTML = formatCurrency(estimatedLateFee);
            document.getElementById("calcTotalWithLate").innerHTML = `<strong>${formatCurrency(estimatedTotal)}</strong>`;
        }
    } else {
        if (calcLateFeeRow) calcLateFeeRow.remove();
        if (calcTotalAfterLateRow) calcTotalAfterLateRow.remove();
        const totalRow = document.querySelector(".calc-box .total");
        if (totalRow) totalRow.style.display = "flex";
    }
    
    document.getElementById("calcTotalAmount").innerHTML = formatCurrency(baseTotal);
    
    window.currentBillData = {
        contractId: Number(contractId),
        roomName: roomName,
        roomPrice: roomPrice,
        serviceFee: serviceFee,
        numberOfContracts: numberOfContracts,
        electricCost: electricCost,
        waterCost: waterCost,
        electricUsage: electricUsage,
        waterUsage: waterUsage,
        electricPrice: electricPrice,
        waterPrice: waterPrice,
        baseTotal: baseTotal,
        totalAmount: estimatedTotal
    };
}

// Initialize filters
function initFilters() {
    if (!listBills || listBills.length === 0) return;
    
    const buildings = [...new Set(listBills.map(b => {
        const roomName = b.RoomName || '';
        if (roomName.startsWith('A')) return 'Tòa A';
        if (roomName.startsWith('B')) return 'Tòa B';
        if (roomName.startsWith('C')) return 'Tòa C';
        return '';
    }))].filter(b => b);
    
    const buildingSelect = document.getElementById("buildingFilter");
    if (buildingSelect) {
        buildingSelect.innerHTML = '<option value="">Tất cả tòa</option>' +
            buildings.map(b => `<option value="${b}">${b}</option>`).join('');
    }
    
    const months = [...new Set(listBills.map(b => b.Month))].filter(m => m);
    const monthSelect = document.getElementById("monthFilter");
    if (monthSelect) {
        monthSelect.innerHTML = '<option value="">Tất cả tháng</option>' +
            months.sort((a,b) => a-b).map(m => `<option value="${m}">Tháng ${m}</option>`).join('');
    }
    
    const years = [...new Set(listBills.map(b => b.Year))].filter(y => y);
    const yearSelect = document.getElementById("yearFilter");
    if (yearSelect) {
        yearSelect.innerHTML = '<option value="">Tất cả năm</option>' +
            years.sort((a,b) => b-a).map(y => `<option value="${y}">${y}</option>`).join('');
    }
}

// Render table
function render() {
    const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const building = document.getElementById("buildingFilter")?.value || "";
    const month = document.getElementById("monthFilter")?.value;
    const year = document.getElementById("yearFilter")?.value;
    const status = document.getElementById("statusFilter")?.value || "";
    
    let filtered = listBills.filter(bill => {
        const roomName = (bill.RoomName || '').toLowerCase();
        const buildingName = roomName.startsWith('a') ? 'Tòa A' : 
                             roomName.startsWith('b') ? 'Tòa B' : 
                             roomName.startsWith('c') ? 'Tòa C' : '';
        
        const matchSearch = !search || roomName.includes(search);
        const matchBuilding = !building || buildingName === building;
        const matchMonth = !month || bill.Month == month;
        const matchYear = !year || bill.Year == year;
        const matchStatus = !status || bill.Status === status;
        
        return matchSearch && matchBuilding && matchMonth && matchYear && matchStatus;
    });
    
    const tbody = document.getElementById("tbody");
    if (!tbody) return;
    
    if (filtered.length === 0) {
        tbody.innerHTML = ` 
            全天<td colspan="12" style="text-align:center;padding:40px;">📭 Không có dữ liệu hóa đơn</td>
            </tr>
        `;
    } else {
        tbody.innerHTML = filtered.map(bill => {
            const tenantDisplay = bill.TenantNames || bill.FullName || 'N/A';
            const serviceDisplay = `${formatCurrency(bill.ServiceFee || 0)}<br><small style="font-size:11px;">(${bill.NumberOfContracts || 1} hợp đồng)</small>`;
            const lateFeeClass = bill.LateFee > 0 ? 'late-fee' : '';
            
            return `
                <tr onclick="showDetail(${bill.BillID})">
                    <td>${bill.BillID}</td>
                    <td><strong>${bill.RoomName || 'N/A'}</strong></td>
                    <td title="${tenantDisplay}">${tenantDisplay.length > 25 ? tenantDisplay.substring(0, 25) + '...' : tenantDisplay}</td>
                    <td>${bill.Month}/${bill.Year}</td>
                    <td>${formatCurrency(bill.RoomPrice)}</td>
                    <td>${serviceDisplay}</td>
                    <td>${formatCurrency(bill.ElectricCost || 0)}</td>
                    <td>${formatCurrency(bill.WaterCost || 0)}</td>
                    <td class="${lateFeeClass}">${formatCurrency(bill.LateFee || 0)}</td>
                    <td><strong>${formatCurrency(Number(bill.TotalAmount) || 0)}</strong></td>
                    <td><span class="status-badge ${getStatusClass(bill.Status)}">${formatStatus(bill.Status)}</span></td>
                    <td onclick="event.stopPropagation()">
                        <button class="btn-edit" onclick="editBill(${bill.BillID})">✏️ Sửa</button>
                        ${role === 'chutro' ? `<button class="btn-delete" onclick="deleteBill(${bill.BillID})">🗑 Xóa</button>` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Open add bill modal
async function openAddBill() {
    editingBillId = null;
    document.getElementById("modalTitle").innerText = "Thêm hóa đơn mới";
    
    if (listContracts.length === 0) await loadAllData();
    
    const now = new Date();
    document.getElementById("mMonth").value = now.getMonth() + 1;
    document.getElementById("mYear").value = now.getFullYear();
    document.getElementById("mDueDate").value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-10`;
    document.getElementById("mStatus").value = "CHUA_THANH_TOAN";
    
    document.getElementById("mContractID").value = "";
    document.getElementById("contractInfo").style.display = "none";
    document.getElementById("utilityInfo").style.display = "none";
    
    // Xóa dòng phí trễ nếu có
    const calcLateFeeRow = document.getElementById("calcLateFee");
    const calcTotalAfterLateRow = document.getElementById("calcTotalAfterLate");
    if (calcLateFeeRow) calcLateFeeRow.remove();
    if (calcTotalAfterLateRow) calcTotalAfterLateRow.remove();
    const totalRow = document.querySelector(".calc-box .total");
    if (totalRow) totalRow.style.display = "flex";
    
    populateContractDropdown();
    
    document.getElementById("billModal").style.display = "flex";
}

// Edit bill
function editBill(id) {
    const bill = listBills.find(b => b.BillID === id);
    if (!bill) return;
    
    editingBillId = id;
    document.getElementById("modalTitle").innerText = "Sửa hóa đơn";
    document.getElementById("mContractID").value = bill.ContractID;
    document.getElementById("mMonth").value = bill.Month;
    document.getElementById("mYear").value = bill.Year;
    document.getElementById("mDueDate").value = bill.DueDate || '';
    document.getElementById("mStatus").value = bill.Status === 'QUA_HAN' ? 'CHUA_THANH_TOAN' : (bill.Status || 'CHUA_THANH_TOAN');
    
    // Đợi loadContractInfo hoàn tất
    setTimeout(() => {
        loadContractInfo();
    }, 100);
    
    document.getElementById("billModal").style.display = "flex";
}

// Save bill
async function saveBill() {
    const contractId = document.getElementById("mContractID")?.value;
    const month = parseInt(document.getElementById("mMonth")?.value);
    const year = parseInt(document.getElementById("mYear")?.value);
    const dueDate = document.getElementById("mDueDate")?.value;
    const status = document.getElementById("mStatus")?.value;
    
    if (!contractId) {
        showToast("Vui lòng chọn hợp đồng", "error");
        return;
    }
    if (!month || month < 1 || month > 12) {
        showToast("Vui lòng chọn tháng hợp lệ", "error");
        return;
    }
    if (!year || year < 2000 || year > 2100) {
        showToast("Vui lòng nhập năm hợp lệ", "error");
        return;
    }
    if (!dueDate) {
        showToast("Vui lòng chọn hạn thanh toán", "error");
        return;
    }
    
    if (!window.currentBillData || window.currentBillData.contractId != contractId) {
        await loadContractInfo();
    }
    
    const baseTotal = window.currentBillData?.baseTotal || 0;
    
    // Tính phí trễ nếu chưa thanh toán
    let lateFee = 0;
    let finalStatus = status;
    
    if (status !== 'DA_THANH_TOAN') {
        lateFee = calculateLateFee(dueDate, null, baseTotal);
        if (lateFee > 0) {
            finalStatus = 'QUA_HAN';
        }
    }
    
    const totalAmount = baseTotal + lateFee;
    const paymentDate = status === 'DA_THANH_TOAN' ? new Date().toISOString().split('T')[0] : null;
    
    const data = {
        ContractID: Number(contractId),
        Month: month,
        Year: year,
        RoomPrice: window.currentBillData?.roomPrice || 0,
        ElectricCost: window.currentBillData?.electricCost || 0,
        WaterCost: window.currentBillData?.waterCost || 0,
        TotalAmount: totalAmount,
        DueDate: dueDate,
        LateFee: lateFee,
        PaidAmount: status === 'DA_THANH_TOAN' ? totalAmount : 0,
        Status: finalStatus,
        PaymentDate: paymentDate
    };
    
    if (editingBillId) data.BillID = editingBillId;
    
    try {
        let result;
        if (editingBillId) {
            result = await API.updateBill(data);
        } else {
            result = await API.createBill(data);
        }
        
        if (result.message && (result.message.includes("thành công") || result.message.includes("tạo"))) {
            showToast(editingBillId ? "Cập nhật thành công!" : "Thêm hóa đơn thành công!", "success");
            closeModal();
            
            // Load lại toàn bộ dữ liệu
            await loadAllData();
            
        } else {
            showToast(result.message || "Lưu thất bại", "error");
        }
    } catch (error) {
        console.error("Save error:", error);
        showToast("Lỗi: " + error.message, "error");
    }
}

// Delete bill
async function deleteBill(id) {
    if (!confirm("Bạn có chắc muốn xóa hóa đơn này?")) return;
    
    try {
        const result = await API.deleteBill(id);
        if (result.message && result.message.includes("thành công")) {
            showToast("Xóa hóa đơn thành công!", "success");
            await loadAllData();
        } else {
            showToast(result.message || "Xóa thất bại", "error");
        }
    } catch (error) {
        console.error("Delete error:", error);
        showToast("Lỗi: " + error.message, "error");
    }
}

// Show detail
function showDetail(id) {
    const bill = listBills.find(b => b.BillID === id);
    if (!bill) return;
    
    currentBillDetail = bill;
    
    const dueDate = bill.DueDate ? new Date(bill.DueDate).toLocaleDateString('vi-VN') : "Chưa có";
    const paymentDate = bill.PaymentDate ? new Date(bill.PaymentDate).toLocaleDateString('vi-VN') : "Chưa thanh toán";
    
    let tenantsHtml = '';
    if (bill.Tenants && bill.Tenants.length > 0) {
        tenantsHtml = '<div class="detail-row"><div class="detail-label">Danh sách người thuê:</div><div class="detail-value">';
        bill.Tenants.forEach(t => {
            tenantsHtml += `<div>• ${t}</div>`;
        });
        tenantsHtml += '</div></div>';
    }
    
    // Tính số ngày trễ
    let lateDaysInfo = '';
    if (bill.Status !== 'DA_THANH_TOAN' && bill.DueDate) {
        const due = new Date(bill.DueDate);
        const today = new Date();
        due.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        const diffDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        if (diffDays > 5) {
            const lateDays = diffDays - 5;
            lateDaysInfo = `<div class="detail-row" style="background:#fff3e0; margin-top:10px; padding:10px; border-radius:8px;">
                <div class="detail-label">⚠️ Thông tin trễ hạn:</div>
                <div class="detail-value">Quá hạn ${lateDays} ngày (sau 5 ngày, phí 100.000đ/ngày)</div>
            </div>`;
        }
    }
    
    document.getElementById("detailBody").innerHTML = `
        <div class="detail-row"><div class="detail-label">Mã hóa đơn:</div><div class="detail-value">${bill.BillID}</div></div>
        <div class="detail-row"><div class="detail-label">Phòng:</div><div class="detail-value">${bill.RoomName || 'N/A'}</div></div>
        ${tenantsHtml}
        <div class="detail-row"><div class="detail-label">Số hợp đồng:</div><div class="detail-value"><strong style="color:#6c63ff;">${bill.NumberOfContracts || 1}</strong> hợp đồng</div></div>
        <div class="detail-row"><div class="detail-label">Tháng/Năm:</div><div class="detail-value">${bill.Month}/${bill.Year}</div></div>
        <div class="detail-row"><div class="detail-label">Hạn thanh toán:</div><div class="detail-value">${dueDate}</div></div>
        <div class="detail-row"><div class="detail-label">Tiền phòng:</div><div class="detail-value">${formatCurrency(bill.RoomPrice)}</div></div>
        <div class="detail-row"><div class="detail-label">Tiền dịch vụ:</div><div class="detail-value">${formatCurrency(bill.ServiceFee || 0)} <small>(${bill.NumberOfContracts || 1} hợp đồng × 100k)</small></div></div>
        <div class="detail-row"><div class="detail-label">Tiền điện:</div><div class="detail-value">${formatCurrency(bill.ElectricCost)}</div></div>
        <div class="detail-row"><div class="detail-label">Tiền nước (15.000đ/m³):</div><div class="detail-value">${formatCurrency(bill.WaterCost)}</div></div>
        <div class="detail-row"><div class="detail-label">Phí trễ hạn:</div><div class="detail-value"><span class="${bill.LateFee > 0 ? 'late-fee' : ''}">${formatCurrency(bill.LateFee)}</span></div></div>
        <div class="detail-row" style="border-top: 2px solid #ddd; margin-top: 5px; padding-top: 10px;">
            <div class="detail-label"><strong>Tổng tiền:</strong></div><div class="detail-value"><strong>${formatCurrency(bill.TotalAmount)}</strong></div>
        </div>
        <div class="detail-row"><div class="detail-label">Trạng thái:</div><div class="detail-value"><span class="status-badge ${getStatusClass(bill.Status)}">${formatStatus(bill.Status)}</span></div></div>
        <div class="detail-row"><div class="detail-label">Ngày thanh toán:</div><div class="detail-value">${paymentDate}</div></div>
        ${lateDaysInfo}
    `;
    
    document.getElementById("detailModal").style.display = "flex";
}

// Export PDF
async function exportPDF() {
    if (!currentBillDetail) return;
    
    const bill = currentBillDetail;
    const dueDate = bill.DueDate ? new Date(bill.DueDate).toLocaleDateString('vi-VN') : "Chưa có";
    const paymentDate = bill.PaymentDate ? new Date(bill.PaymentDate).toLocaleDateString('vi-VN') : "Chưa thanh toán";
    
    let tenantsList = '';
    if (bill.Tenants && bill.Tenants.length > 0) {
        tenantsList = '<p><strong>Danh sách người thuê:</strong><br>';
        bill.Tenants.forEach(t => {
            tenantsList += `• ${t}<br>`;
        });
        tenantsList += '</p>';
    }
    
    const today = new Date();
    const formattedDate = today.toLocaleDateString('vi-VN');
    
    const pdfContent = document.getElementById("pdfContent");
    pdfContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #6c63ff; margin: 0;">HÓA ĐƠN THANH TOÁN</h1>
            <p style="margin: 5px 0;">Số: HD-${bill.BillID}</p>
            <p style="margin: 5px 0;">Ngày xuất: ${formattedDate}</p>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0;">🏠 THÔNG TIN KHÁCH HÀNG</h3>
            <p><strong>Phòng:</strong> ${bill.RoomName || 'N/A'}</p>
            ${tenantsList}
            <p><strong>Số hợp đồng:</strong> ${bill.NumberOfContracts || 1} hợp đồng</p>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0;">📅 THÔNG TIN HÓA ĐƠN</h3>
            <p><strong>Kỳ thanh toán:</strong> Tháng ${bill.Month}/${bill.Year}</p>
            <p><strong>Hạn thanh toán:</strong> ${dueDate}</p>
            <p><strong>Ngày thanh toán:</strong> ${paymentDate}</p>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0;">💰 CHI TIẾT THANH TOÁN</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px 0;"><strong>Tiền phòng:</strong></td>
                    <td style="text-align: right; padding: 8px 0;">${formatCurrency(bill.RoomPrice)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px 0;"><strong>Tiền dịch vụ:</strong></td>
                    <td style="text-align: right; padding: 8px 0;">${formatCurrency(bill.ServiceFee || 0)} <small>(${bill.NumberOfContracts || 1} hợp đồng × 100k)</small></td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px 0;"><strong>Tiền điện:</strong></td>
                    <td style="text-align: right; padding: 8px 0;">${formatCurrency(bill.ElectricCost)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px 0;"><strong>Tiền nước (15.000đ/m³):</strong></td>
                    <td style="text-align: right; padding: 8px 0;">${formatCurrency(bill.WaterCost)}</td>
                </tr>
                ${bill.LateFee && bill.LateFee > 0 ? `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px 0;"><strong>Phí trễ hạn:</strong></td>
                    <td style="text-align: right; padding: 8px 0; color: #f44336;">${formatCurrency(bill.LateFee)}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid #333; font-weight: bold;">
                    <td style="padding: 10px 0;"><strong>TỔNG CỘNG:</strong></td>
                    <td style="text-align: right; padding: 10px 0; font-size: 18px; color: #6c63ff;"><strong>${formatCurrency(bill.TotalAmount)}</strong></td>
                </tr>
            </table>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0;">⚡ CHI TIẾT ĐIỆN NƯỚC</h3>
            <p><strong>Điện:</strong> ${bill.ElectricUsage || 0} kWh × ${formatCurrency(bill.ElectricPrice || 3500)} = ${formatCurrency(bill.ElectricCost)}</p>
            <p><strong>Nước:</strong> ${bill.WaterUsage || 0} m³ × 15.000đ = ${formatCurrency(bill.WaterCost)}</p>
        </div>
        
        <div style="border: 1px solid #ddd; padding: 15px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0;">📌 TRẠNG THÁI</h3>
            <p><strong>Trạng thái thanh toán:</strong> <span style="color: ${bill.Status === 'DA_THANH_TOAN' ? 'green' : (bill.Status === 'QUA_HAN' ? 'orange' : 'red')}; font-weight: bold;">${formatStatus(bill.Status)}</span></p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px;">
            <div style="text-align: center; width: 40%;">
                <div style="border-top: 1px solid #000; padding-top: 10px;">Người thuê (Ký tên)</div>
            </div>
            <div style="text-align: center; width: 40%;">
                <div style="border-top: 1px solid #000; padding-top: 10px;">Chủ trọ (Ký tên)</div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
            <p>Mọi thắc mắc xin liên hệ: 0123 456 789</p>
        </div>
    `;
    
    const element = document.getElementById("invoiceTemplate");
    try {
        const canvas = await html2canvas(element, { 
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190;
        const pageHeight = 277;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;
        
        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        doc.save(`HoaDon_${bill.BillID}_Thang${bill.Month}_${bill.Year}.pdf`);
        showToast("Xuất PDF thành công!", "success");
    } catch (error) {
        console.error("PDF export error:", error);
        showToast("Lỗi xuất PDF", "error");
    }
}

// Close modals
function closeModal() {
    document.getElementById("billModal").style.display = "none";
    editingBillId = null;
    window.currentBillData = null;
    
    // Xóa dòng phí trễ nếu có
    const calcLateFeeRow = document.getElementById("calcLateFee");
    const calcTotalAfterLateRow = document.getElementById("calcTotalAfterLate");
    if (calcLateFeeRow) calcLateFeeRow.remove();
    if (calcTotalAfterLateRow) calcTotalAfterLateRow.remove();
    const totalRow = document.querySelector(".calc-box .total");
    if (totalRow) totalRow.style.display = "flex";
}

function closeDetailModal() {
    document.getElementById("detailModal").style.display = "none";
    currentBillDetail = null;
}

// Event listeners
document.getElementById("mContractID")?.addEventListener("change", loadContractInfo);
document.getElementById("mMonth")?.addEventListener("change", loadContractInfo);
document.getElementById("mYear")?.addEventListener("change", loadContractInfo);
document.getElementById("mDueDate")?.addEventListener("change", loadContractInfo);
document.getElementById("mStatus")?.addEventListener("change", loadContractInfo);

// Close when click outside
window.onclick = function(event) {
    if (event.target === document.getElementById("billModal")) closeModal();
    if (event.target === document.getElementById("detailModal")) closeDetailModal();
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadAllData();
});

// Make global
window.render = render;
window.openAddBill = openAddBill;
window.editBill = editBill;
window.saveBill = saveBill;
window.deleteBill = deleteBill;
window.showDetail = showDetail;
window.exportPDF = exportPDF;
window.closeModal = closeModal;
window.closeDetailModal = closeDetailModal;
window.loadContractInfo = loadContractInfo;