let listRooms = [];
let listContracts = [];
let listBills = [];
let listUtilities = [];
let chart = null;
let structureChart = null;

const role = localStorage.getItem("role");
const username = localStorage.getItem("username");
const buildingManaged = localStorage.getItem("buildingManaged") || "all";

// DOM elements
const monthFilter = document.getElementById("monthFilter");
const buildingFilter = document.getElementById("buildingFilter");
const sumRooms = document.getElementById("sumRooms");
const sumBills = document.getElementById("sumBills");
const sumRevenue = document.getElementById("sumRevenue");
const sumRent = document.getElementById("sumRent");
const sumElectric = document.getElementById("sumElectric");
const sumWater = document.getElementById("sumWater");
const sumService = document.getElementById("sumService");
const chartTitle = document.getElementById("chartTitle");

document.getElementById("username").innerText = username || "";
if (typeof renderMenu === 'function') renderMenu(role);

// Format currency
function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString("vi-VN") + " ₫";
}

// ===== TÍNH PHÍ TRỄ HẠN =====
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

// Lấy danh sách tòa nhà từ dữ liệu
function getAllowedBuildings() {
    if (role === "chutro" || role === "admin") {
        const buildings = [...new Set(listRooms.map(r => {
            const building = r.BuildingName || getBuildingName(r.RoomName);
            return building;
        }))].filter(b => b);
        return buildings.length > 0 ? buildings : ['Tòa A', 'Tòa B', 'Tòa C'];
    } else if (role === "nhanvien") {
        return buildingManaged !== "all" ? [buildingManaged] : [];
    }
    return [];
}

// Render options cho bộ lọc tháng
function renderMonthOptions() {
    if (!monthFilter) return;
    
    // Lấy tất cả các tháng/năm có trong hóa đơn
    const monthsSet = new Set();
    listBills.forEach(bill => {
        if (bill.Month && bill.Year) {
            monthsSet.add(`${bill.Month}/${bill.Year}`);
        }
    });
    
    const sortedMonths = Array.from(monthsSet).sort((a, b) => {
        const [m1, y1] = a.split('/');
        const [m2, y2] = b.split('/');
        if (y1 !== y2) return y2 - y1;
        return m2 - m1;
    });
    
    monthFilter.innerHTML = '<option value="all">Tất cả tháng</option>';
    
    sortedMonths.forEach(monthYear => {
        const option = document.createElement("option");
        option.value = monthYear;
        option.textContent = `Tháng ${monthYear}`;
        monthFilter.appendChild(option);
    });
}

// Render options cho bộ lọc tòa nhà
function renderBuildingOptions() {
    if (!buildingFilter) return;
    
    const buildings = getAllowedBuildings();
    
    buildingFilter.innerHTML = '<option value="all">Tất cả tòa</option>';
    
    buildings.forEach(building => {
        const option = document.createElement("option");
        option.value = building;
        option.textContent = building;
        buildingFilter.appendChild(option);
    });
}

// Xử lý và tính toán dữ liệu hóa đơn
function processBillData() {
    return listBills.map(bill => {
        const roomName = bill.RoomName || bill.room_name;
        if (!roomName) return null;
        
        const numberOfContracts = countActiveContracts(roomName, bill.Month, bill.Year);
        const serviceFee = numberOfContracts * 100000;
        const tenants = getTenantsInRoom(roomName, bill.Month, bill.Year);
        
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
        if (bill.Status !== 'DA_THANH_TOAN' && bill.DueDate) {
            lateFee = calculateLateFee(bill.DueDate, bill.PaymentDate, baseTotal);
        }
        
        const totalAmount = baseTotal + lateFee;
        
        return {
            ...bill,
            room: roomName,
            building: getBuildingName(roomName),
            roomPrice: roomPrice,
            electricCost: electricCost,
            waterCost: waterCost,
            serviceFee: serviceFee,
            lateFee: lateFee,
            totalAmount: totalAmount,
            numberOfContracts: numberOfContracts,
            tenants: tenants,
            electricUsage: electricUsage,
            waterUsage: waterUsage,
            electricPrice: electricPrice,
            waterPrice: waterPrice
        };
    }).filter(b => b !== null);
}

// Lọc dữ liệu theo tháng và tòa nhà
function getFilteredBills(processedBills) {
    let filtered = [...processedBills];
    
    // Lọc theo tháng
    const monthValue = monthFilter.value;
    if (monthValue !== "all") {
        const [month, year] = monthValue.split('/');
        filtered = filtered.filter(b => b.Month == month && b.Year == year);
    }
    
    // Lọc theo tòa nhà
    const buildingValue = buildingFilter.value;
    if (buildingValue !== "all") {
        filtered = filtered.filter(b => b.building === buildingValue);
    }
    
    // Lọc theo quyền nhân viên
    if (role === "nhanvien" && buildingManaged !== "all") {
        filtered = filtered.filter(b => b.building === buildingManaged);
    }
    
    return filtered;
}

// Cập nhật thống kê tổng quan
function renderSummary(filteredBills) {
    const rent = filteredBills.reduce((s, b) => s + (b.roomPrice || 0), 0);
    const electric = filteredBills.reduce((s, b) => s + (b.electricCost || 0), 0);
    const water = filteredBills.reduce((s, b) => s + (b.waterCost || 0), 0);
    const service = filteredBills.reduce((s, b) => s + (b.serviceFee || 0), 0);
    const revenue = filteredBills.reduce((s, b) => s + (b.totalAmount || 0), 0);
    
    // Số phòng đang thuê (có hợp đồng hiệu lực)
    const activeRooms = new Set();
    listContracts.forEach(contract => {
        if (contract.Status === 'HIEU_LUC' || contract.Status === 'ACTIVE') {
            const roomName = contract.RoomName || contract.room_name;
            if (roomName) activeRooms.add(roomName);
        }
    });
    
    sumRooms.textContent = activeRooms.size;
    sumBills.textContent = filteredBills.length;
    sumRent.textContent = formatCurrency(rent);
    sumElectric.textContent = formatCurrency(electric);
    sumWater.textContent = formatCurrency(water);
    sumService.textContent = formatCurrency(service);
    sumRevenue.textContent = formatCurrency(revenue);
}

// Vẽ biểu đồ doanh thu
function renderChart(filteredBills) {
    let labels = [];
    let data = [];
    let isBuilding = false;
    
    if (filteredBills.length === 0) {
        if (chart) chart.destroy();
        chartTitle.textContent = "📊 Không có dữ liệu";
        return;
    }
    
    if ((role === "chutro" || role === "admin") && buildingFilter.value === "all") {
        // Nhóm theo tòa nhà
        const map = {};
        filteredBills.forEach(b => {
            map[b.building] = (map[b.building] || 0) + b.totalAmount;
        });
        labels = Object.keys(map);
        data = Object.values(map);
        chartTitle.textContent = "📊 Doanh thu theo tòa nhà";
        isBuilding = true;
    } else {
        // Nhóm theo phòng
        const map = {};
        filteredBills.forEach(b => {
            map[b.room] = (map[b.room] || 0) + b.totalAmount;
        });
        labels = Object.keys(map);
        data = Object.values(map);
        chartTitle.textContent = "📊 Doanh thu theo phòng";
    }
    
    if (chart) chart.destroy();
    
    const ctx = document.getElementById("roomChart").getContext("2d");
    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: "#6c63ff",
                borderRadius: 8,
                barPercentage: 0.7,
                categoryPercentage: 0.8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => formatCurrency(ctx.raw)
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: (value) => formatCurrency(value)
                    }
                }
            },
            onClick: (e, els) => {
                if (!els.length) return;
                if (isBuilding) {
                    const building = labels[els[0].index];
                    buildingFilter.value = building;
                    renderStats();
                }
            }
        }
    });
}

// Vẽ biểu đồ cơ cấu doanh thu
function renderStructure(filteredBills) {
    if (filteredBills.length === 0) {
        if (structureChart) structureChart.destroy();
        return;
    }
    
    const rent = filteredBills.reduce((s, b) => s + (b.roomPrice || 0), 0);
    const electric = filteredBills.reduce((s, b) => s + (b.electricCost || 0), 0);
    const water = filteredBills.reduce((s, b) => s + (b.waterCost || 0), 0);
    const service = filteredBills.reduce((s, b) => s + (b.serviceFee || 0), 0);
    const lateFee = filteredBills.reduce((s, b) => s + (b.lateFee || 0), 0);
    
    const values = [rent, electric, water, service];
    const labels = ["Tiền phòng", "Tiền điện", "Tiền nước", "Phí dịch vụ"];
    const colors = ["#6c63ff", "#00b894", "#0984e3", "#fdcb6e"];
    
    if (lateFee > 0) {
        values.push(lateFee);
        labels.push("Phí trễ hạn");
        colors.push("#e84393");
    }
    
    if (structureChart) structureChart.destroy();
    
    const ctx = document.getElementById("structureChart").getContext("2d");
    structureChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: "bottom", labels: { font: { size: 12 } } },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const value = ctx.raw;
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${ctx.label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: "60%"
        }
    });
}

// Hiển thị thông báo
function showToast(message, type = "success") {
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 10px;
        color: white;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Load tất cả dữ liệu từ API
async function loadAllData() {
    try {
        // Hiển thị loading
        const main = document.querySelector(".main");
        if (main) main.style.opacity = "0.5";
        
        showToast("Đang tải dữ liệu...", "info");
        
        // Gọi API song song
        const [roomsResult, contractsResult, utilsResult, billsResult] = await Promise.all([
            API.getRooms(),
            API.getContracts(),
            API.getUtilities(),
            API.getBills()
        ]);
        
        console.log("Rooms API response:", roomsResult);
        console.log("Contracts API response:", contractsResult);
        console.log("Utilities API response:", utilsResult);
        console.log("Bills API response:", billsResult);
        
        // Xử lý rooms
        if (roomsResult && roomsResult.data && Array.isArray(roomsResult.data)) {
            listRooms = roomsResult.data;
        } else if (Array.isArray(roomsResult)) {
            listRooms = roomsResult;
        } else {
            listRooms = [];
        }
        
        // Xử lý contracts
        if (contractsResult && contractsResult.data && Array.isArray(contractsResult.data)) {
            listContracts = contractsResult.data;
        } else if (Array.isArray(contractsResult)) {
            listContracts = contractsResult;
        } else {
            listContracts = [];
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
        
        console.log("📊 Stats data loaded:", {
            rooms: listRooms.length,
            contracts: listContracts.length,
            utilities: listUtilities.length,
            bills: listBills.length
        });
        
        if (listBills.length === 0) {
            showToast("Không có dữ liệu hóa đơn để thống kê", "warning");
            if (main) main.style.opacity = "1";
            return;
        }
        
        // Xử lý và render
        const processedBills = processBillData();
        
        renderMonthOptions();
        renderBuildingOptions();
        
        window.processedBills = processedBills;
        
        renderStats();
        
        if (main) main.style.opacity = "1";
        showToast("Đã tải dữ liệu thành công!", "success");
        
    } catch (error) {
        console.error("Error loading stats data:", error);
        showToast("Lỗi tải dữ liệu thống kê: " + error.message, "error");
        const main = document.querySelector(".main");
        if (main) main.style.opacity = "1";
    }
}

// Render toàn bộ thống kê
function renderStats() {
    if (!window.processedBills) return;
    
    const filteredBills = getFilteredBills(window.processedBills);
    
    renderSummary(filteredBills);
    renderChart(filteredBills);
    renderStructure(filteredBills);
}

// Thêm CSS cho toast nếu chưa có
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .toast {
        animation: slideIn 0.3s ease;
    }
    .toast.info {
        background: linear-gradient(135deg, #2196f3, #1976d2);
    }
    .toast.warning {
        background: linear-gradient(135deg, #ff9800, #f57c00);
    }
`;
document.head.appendChild(style);

// Event listeners
if (monthFilter) monthFilter.addEventListener("change", renderStats);
if (buildingFilter) buildingFilter.addEventListener("change", renderStats);

// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
    loadAllData();
});

// Global functions
window.renderStats = renderStats;