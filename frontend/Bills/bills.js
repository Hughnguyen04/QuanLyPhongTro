const role = localStorage.getItem("role");
const username = localStorage.getItem("username");
if(!role) location.href="../Login/login.html";
document.getElementById("username").innerText = username || "";
if(typeof renderMenu === 'function') renderMenu(role);

let listBills = [];
let listContracts = [];

// Format trạng thái
function formatStatus(status) {
    const map = { 
        'CHUA_DEN_KY': 'Chưa đến kỳ', 
        'CHUA_THANH_TOAN': 'Chưa thanh toán', 
        'DA_THANH_TOAN': 'Đã thanh toán', 
        'QUA_HAN': 'Quá hạn' 
    };
    return map[status] || status;
}

// Load contracts for dropdown
async function loadContracts() {
    try {
        const result = await API.getContracts();
        console.log("📋 Contracts result:", result);
        
        if (result.success && result.data && result.data.length > 0) {
            listContracts = result.data;
        } else if (Array.isArray(result)) {
            listContracts = result;
        } else if (result.contracts && Array.isArray(result.contracts)) {
            listContracts = result.contracts;
        } else {
            listContracts = [];
        }
        
        // Populate contract dropdown
        const contractSelect = document.getElementById("mContractId");
        if (contractSelect) {
            contractSelect.innerHTML = '<option value="">Chọn hợp đồng</option>' + 
                listContracts.map(contract => 
                    `<option value="${contract.ContractID || contract.id}">
                        ${contract.RoomName || contract.room_name || 'Phòng ' + (contract.RoomID)} - 
                        ${contract.FullName || contract.tenant_name || 'Chưa có người thuê'}
                    </option>`
                ).join('');
        }
        
    } catch (error) {
        console.error('💥 Lỗi tải hợp đồng:', error);
    }
}

// Load dữ liệu từ API
async function loadData() {
    try {
        console.log("🚀 Đang tải dữ liệu từ API...");
        const result = await API.getBills();
        console.log("📋 Kết quả từ API:", result);
        
        // Handle different response structures
        if (result.success && result.data) {
            listBills = Array.isArray(result.data) ? result.data : [];
        } else if (Array.isArray(result)) {
            listBills = result;
        } else if (result.bills && Array.isArray(result.bills)) {
            listBills = result.bills;
        } else {
            console.warn("⚠️ Không xác định được cấu trúc dữ liệu:", result);
            listBills = [];
        }
        
        if (listBills.length > 0) {
            console.log(`✅ Đã tải ${listBills.length} hóa đơn`);
            console.log("📄 Mẫu hóa đơn đầu tiên:", listBills[0]);
        } else {
            console.warn("⚠️ Không có dữ liệu hóa đơn!");
        }
        
        initFilters();
        render();
        
    } catch (error) {
        console.error('💥 Lỗi:', error);
        document.getElementById("tbody").innerHTML = ` 
            <tr><td colspan="11" style="text-align:center; color:red; padding:40px;">
            ❌ Lỗi tải dữ liệu: ${error.message}
            </td></tr>
        `;
    }
}

// Khởi tạo bộ lọc
function initFilters() {
    if (!listBills || listBills.length === 0) return;
    
    // Lấy danh sách tòa nhà từ RoomName
    const buildings = [...new Set(listBills.map(b => {
        const roomName = b.RoomName || b.room_name || "";
        return roomName.charAt(0) + "00";
    }))];
    
    // Lấy danh sách tháng
    const months = [...new Set(listBills.map(b => b.Month || b.month))].filter(m => m);
    
    const bSelect = document.getElementById("buildingFilter");
    if (bSelect) {
        bSelect.innerHTML = '<option value="">Tất cả tòa</option>' + 
            buildings.filter(b => b !== "00").map(b => `<option value="${b}">Tòa ${b}</option>`).join('');
    }
    
    const mSelect = document.getElementById("monthFilter");
    if (mSelect) {
        mSelect.innerHTML = '<option value="">Tất cả tháng</option>' + 
            months.sort((a,b)=>a-b).map(m => `<option value="${m}">Tháng ${m}</option>`).join('');
    }
}

// Lọc và hiển thị
function render() {
    const key = document.getElementById("key").value.toLowerCase();
    const building = document.getElementById("buildingFilter").value;
    const month = parseInt(document.getElementById("monthFilter").value);
    const status = document.getElementById("statusFilter").value;
    const tbody = document.getElementById("tbody");
    
    if (!listBills || listBills.length === 0) {
        tbody.innerHTML = ` 
            <tr><td colspan="11" style="text-align:center; padding:40px;">
            📭 Không có dữ liệu hóa đơn
            </td></tr>
        `;
        updateCards(0, 0, 0, 0);
        return;
    }
    
    // Lọc dữ liệu
    let filtered = listBills.filter(bill => {
        const roomName = (bill.RoomName || bill.room_name || "").toLowerCase();
        const buildingName = roomName ? roomName.charAt(0) + "00" : "";
        
        return roomName.includes(key) &&
            (building === "" || buildingName === building) &&
            (isNaN(month) || (bill.Month || bill.month) === month) &&
            (status === "" || (bill.Status || bill.status) === status);
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = ` 
            <tr><td colspan="11" style="text-align:center; padding:40px;">
            🔍 Không tìm thấy hóa đơn nào
            </td></tr>
        `;
        updateCards(0, 0, 0, 0);
        return;
    }
    
    let total = 0, unpaid = 0, paid = 0, sum = 0;
    
    tbody.innerHTML = filtered.map(bill => {
        const amount = parseFloat(bill.TotalAmount || bill.total_amount || 0);
        const billStatus = bill.Status || bill.status;
        total++;
        sum += amount;
        
        if(billStatus === "CHUA_THANH_TOAN" || billStatus === "QUA_HAN") unpaid++;
        if(billStatus === "DA_THANH_TOAN") paid++;
        
        const statusText = formatStatus(billStatus);
        let statusColor = '#dc3545';
        if(billStatus === "DA_THANH_TOAN") statusColor = '#28a745';
        if(billStatus === "QUA_HAN") statusColor = '#fd7e14';
        if(billStatus === "CHUA_DEN_KY") statusColor = '#6c757d';
        
        return `
            <tr onclick="showDetail(${bill.BillID || bill.bill_id})">
                <td>${bill.BillID || bill.bill_id || 'N/A'}</td>
                <td>${bill.RoomName || bill.room_name || "N/A"}</td>
                <td>${bill.FullName || bill.full_name || "N/A"}</td>
                <td>${(bill.Month || bill.month)}/${(bill.Year || bill.year)}</td>
                <td>${parseFloat(bill.RoomPrice || bill.room_price || 0).toLocaleString()} đ</td>
                <td>${parseFloat(bill.ElectricCost || bill.electric_cost || 0).toLocaleString()} đ</td>
                <td>${parseFloat(bill.WaterCost || bill.water_cost || 0).toLocaleString()} đ</td>
                <td>${parseFloat(bill.LateFee || bill.late_fee || 0).toLocaleString()} đ</td>
                <td><strong>${amount.toLocaleString()} đ</strong></td>
                <td style="color:${statusColor}; font-weight:500;">${statusText}</td>
                <td onclick="event.stopPropagation()">
                    <button onclick="editBill(${bill.BillID || bill.bill_id})" title="Sửa">✏️</button>
                    ${role === 'chutro' ? `<button onclick="deleteBill(${bill.BillID || bill.bill_id})" title="Xóa">🗑</button>` : ''}
                    ${billStatus !== "DA_THANH_TOAN" ? `<button onclick="openPayment(${bill.BillID || bill.bill_id})" title="Thanh toán">💰</button>` : ''}
                </td>
            </tr>
        `;
    }).join('');
    
    updateCards(total, unpaid, paid, sum);
}

function updateCards(total, unpaid, paid, sum) {
    document.getElementById("total").innerText = total;
    document.getElementById("unpaid").innerText = unpaid;
    document.getElementById("paid").innerText = paid;
    document.getElementById("sum").innerText = sum.toLocaleString();
}

// Thêm sự kiện filter
document.getElementById("key").addEventListener("input", render);
document.getElementById("buildingFilter").addEventListener("change", render);
document.getElementById("monthFilter").addEventListener("change", render);
document.getElementById("statusFilter").addEventListener("change", render);

// CRUD Operations
let editingId = null;

async function openAdd() {
    editingId = null;
    document.getElementById("modalTitle").innerText = "Thêm hóa đơn";
    
    // Load contracts if not loaded
    if (listContracts.length === 0) {
        await loadContracts();
    }
    
    const currentDate = new Date();
    document.getElementById("mMonth").value = currentDate.getMonth() + 1;
    document.getElementById("mYear").value = currentDate.getFullYear();
    document.getElementById("mElectricCost").value = "0";
    document.getElementById("mWaterCost").value = "0";
    document.getElementById("mLateFee").value = "0";
    document.getElementById("modal").style.display = "flex";
}

function editBill(id) {
    const bill = listBills.find(b => (b.BillID || b.bill_id) === id);
    if(!bill) return;
    editingId = id;
    document.getElementById("modalTitle").innerText = "Sửa hóa đơn";
    
    // Populate contract dropdown with current contract
    const contractSelect = document.getElementById("mContractId");
    contractSelect.innerHTML = `<option value="${bill.ContractID || bill.contract_id}">${bill.RoomName || bill.room_name}</option>`;
    
    document.getElementById("mMonth").value = bill.Month || bill.month;
    document.getElementById("mYear").value = bill.Year || bill.year;
    document.getElementById("mElectricCost").value = bill.ElectricCost || bill.electric_cost || 0;
    document.getElementById("mWaterCost").value = bill.WaterCost || bill.water_cost || 0;
    document.getElementById("mLateFee").value = bill.LateFee || bill.late_fee || 0;
    document.getElementById("modal").style.display = "flex";
}

async function saveBill() {
    const contractId = document.getElementById("mContractId").value;
    if(!contractId) {
        alert("Vui lòng chọn hợp đồng!");
        return;
    }
    
    const month = parseInt(document.getElementById("mMonth").value);
    const year = parseInt(document.getElementById("mYear").value);
    if(!month || !year || month < 1 || month > 12) {
        alert("Vui lòng nhập tháng (1-12) và năm hợp lệ!");
        return;
    }
    
    const electricCost = parseFloat(document.getElementById("mElectricCost").value) || 0;
    const waterCost = parseFloat(document.getElementById("mWaterCost").value) || 0;
    const lateFee = parseFloat(document.getElementById("mLateFee").value) || 0;
    
    // Get room price from contract
    const contract = listContracts.find(c => (c.ContractID || c.id) === parseInt(contractId));
    const roomPrice = contract?.RoomPrice || contract?.room_price || 500000;
    
    const totalAmount = roomPrice + electricCost + waterCost + lateFee;
    const dueDate = new Date(year, month-1, 10);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    
    const billData = {
        ContractID: parseInt(contractId),
        Month: month,
        Year: year,
        RoomPrice: roomPrice,
        ElectricCost: electricCost,
        WaterCost: waterCost,
        LateFee: lateFee,
        TotalAmount: totalAmount,
        PaidAmount: 0,
        DueDate: dueDateStr,
        PaymentDate: null,
        Status: "CHUA_DEN_KY"
    };
    
    let result;
    if(editingId) {
        billData.BillID = editingId;
        result = await API.updateBill(billData);
    } else {
        result = await API.createBill(billData);
    }
    
    if(result.success) {
        alert(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!");
        await loadData();
        closeModal();
    } else {
        alert("Lỗi: " + (result.message || "Không thể lưu hóa đơn"));
    }
}

async function deleteBill(id) {
    if(role !== "chutro") return;
    if(confirm("Xóa hóa đơn này?")) {
        const result = await API.deleteBill(id);
        if(result.success) {
            alert("Xóa thành công!");
            await loadData();
        } else {
            alert("Lỗi: " + (result.message || result.error || "Không thể xóa"));
        }
    }
}

// Payment
let currentPaymentBill = null;

function openPayment(id) {
    const bill = listBills.find(b => (b.BillID || b.bill_id) === id);
    if(!bill) return;
    currentPaymentBill = bill;
    
    const totalAmount = parseFloat(bill.TotalAmount || bill.total_amount || 0);
    const paid = parseFloat(bill.PaidAmount || bill.paid_amount || 0);
    const remaining = totalAmount - paid;
    
    document.getElementById("paymentInfo").innerHTML = `
        <p><strong>Mã hóa đơn:</strong> ${bill.BillID || bill.bill_id}</p>
        <p><strong>Phòng:</strong> ${bill.RoomName || bill.room_name}</p>
        <p><strong>Tổng tiền:</strong> ${totalAmount.toLocaleString()} đ</p>
        <p><strong>Đã thanh toán:</strong> ${paid.toLocaleString()} đ</p>
        <p><strong>Còn lại:</strong> ${remaining.toLocaleString()} đ</p>
    `;
    document.getElementById("paidAmount").value = remaining;
    document.getElementById("paymentModal").style.display = "flex";
}

async function confirmPayment() {
    if(!currentPaymentBill) return;
    
    const amount = parseFloat(document.getElementById("paidAmount").value);
    if(isNaN(amount) || amount <= 0) {
        alert("Vui lòng nhập số tiền hợp lệ!");
        return;
    }
    
    const totalAmount = parseFloat(currentPaymentBill.TotalAmount || currentPaymentBill.total_amount || 0);
    const currentPaid = parseFloat(currentPaymentBill.PaidAmount || currentPaymentBill.paid_amount || 0);
    const newPaidAmount = currentPaid + amount;
    const newStatus = newPaidAmount >= totalAmount ? "DA_THANH_TOAN" : "CHUA_THANH_TOAN";
    const paymentDate = newStatus === "DA_THANH_TOAN" ? new Date().toISOString().split('T')[0] : null;
    
    const updateData = {
        BillID: currentPaymentBill.BillID || currentPaymentBill.bill_id,
        PaidAmount: newPaidAmount,
        Status: newStatus
    };
    
    if(paymentDate) {
        updateData.PaymentDate = paymentDate;
    }
    
    const result = await API.updateBill(updateData);
    
    if(result.success) {
        alert("Thanh toán thành công!");
        await loadData();
        closePaymentModal();
    } else {
        alert("Lỗi: " + (result.message || "Không thể thanh toán"));
    }
}

function closePaymentModal() {
    document.getElementById("paymentModal").style.display = "none";
    currentPaymentBill = null;
    document.getElementById("paidAmount").value = "";
}

// Detail
let currentDetail = null;

function showDetail(id) {
    const bill = listBills.find(b => (b.BillID || b.bill_id) === id);
    if(!bill) return;
    currentDetail = bill;
    
    const billStatus = bill.Status || bill.status;
    const statusText = formatStatus(billStatus);
    let statusColor = '#dc3545';
    if(billStatus === "DA_THANH_TOAN") statusColor = '#28a745';
    if(billStatus === "QUA_HAN") statusColor = '#fd7e14';
    if(billStatus === "CHUA_DEN_KY") statusColor = '#6c757d';
    
    const paymentDate = bill.PaymentDate || bill.payment_date ? 
        new Date(bill.PaymentDate || bill.payment_date).toLocaleDateString('vi-VN') : "Chưa thanh toán";
    const dueDate = new Date(bill.DueDate || bill.due_date).toLocaleDateString('vi-VN');
    
    document.getElementById("detailBody").innerHTML = `
        <table style="width:100%">
            <tr><td style="width:40%"><strong>Mã hóa đơn</strong></td><td>${bill.BillID || bill.bill_id}</td></tr>
            <tr><td><strong>Phòng</strong></td><td>${bill.RoomName || bill.room_name}</td></tr>
            <tr><td><strong>Người thuê</strong></td><td>${bill.FullName || bill.full_name}</td></tr>
            <tr><td><strong>Tháng/Năm</strong></td><td>${(bill.Month || bill.month)}/${(bill.Year || bill.year)}</td></tr>
            <tr><td><strong>Hạn thanh toán</strong></td><td>${dueDate}</td></tr>
            <tr><td><strong>Tiền phòng</strong></td><td>${parseFloat(bill.RoomPrice || bill.room_price || 0).toLocaleString()} đ</td></tr>
            <tr><td><strong>Tiền điện</strong></td><td>${parseFloat(bill.ElectricCost || bill.electric_cost || 0).toLocaleString()} đ</td></tr>
            <tr><td><strong>Tiền nước</strong></td><td>${parseFloat(bill.WaterCost || bill.water_cost || 0).toLocaleString()} đ</td></tr>
            <tr><td><strong>Phí trễ hạn</strong></td><td>${parseFloat(bill.LateFee || bill.late_fee || 0).toLocaleString()} đ</td></tr>
            <tr><td><strong>Tổng tiền</strong></td><td><strong>${parseFloat(bill.TotalAmount || bill.total_amount || 0).toLocaleString()} đ</strong></td></tr>
            <tr><td><strong>Đã thanh toán</strong></td><td>${parseFloat(bill.PaidAmount || bill.paid_amount || 0).toLocaleString()} đ</td></tr>
            <tr><td><strong>Trạng thái</strong></td><td style="color:${statusColor}">${statusText}</td></tr>
            <tr><td><strong>Ngày thanh toán</strong></td><td>${paymentDate}</td></tr>
        </table>
    `;
    document.getElementById("detailModal").style.display = "flex";
}

function closeDetail() {
    document.getElementById("detailModal").style.display = "none";
    currentDetail = null;
}

// Export PDF
function exportDetail() {
    if(!currentDetail) return;
    
    const bill = currentDetail;
    const dueDate = new Date(bill.DueDate || bill.due_date).toLocaleDateString('vi-VN');
    const paymentDate = bill.PaymentDate || bill.payment_date ? 
        new Date(bill.PaymentDate || bill.payment_date).toLocaleDateString('vi-VN') : "Chưa thanh toán";
    
    document.getElementById("invDate").innerText = new Date().toLocaleDateString('vi-VN');
    document.getElementById("invId").innerText = bill.BillID || bill.bill_id;
    document.getElementById("invRoom").innerText = bill.RoomName || bill.room_name;
    document.getElementById("invFullName").innerText = bill.FullName || bill.full_name;
    document.getElementById("invMonthYear").innerText = `${bill.Month || bill.month}/${bill.Year || bill.year}`;
    document.getElementById("invDueDate").innerText = dueDate;
    document.getElementById("invRoomPrice").innerText = parseFloat(bill.RoomPrice || bill.room_price || 0).toLocaleString() + " đ";
    document.getElementById("invElectricCost").innerText = parseFloat(bill.ElectricCost || bill.electric_cost || 0).toLocaleString() + " đ";
    document.getElementById("invWaterCost").innerText = parseFloat(bill.WaterCost || bill.water_cost || 0).toLocaleString() + " đ";
    document.getElementById("invLateFee").innerText = parseFloat(bill.LateFee || bill.late_fee || 0).toLocaleString() + " đ";
    document.getElementById("invTotal").innerText = parseFloat(bill.TotalAmount || bill.total_amount || 0).toLocaleString() + " đ";
    document.getElementById("invPaidAmount").innerText = parseFloat(bill.PaidAmount || bill.paid_amount || 0).toLocaleString() + " đ";
    document.getElementById("invStatus").innerText = formatStatus(bill.Status || bill.status);
    document.getElementById("invPaymentDate").innerText = paymentDate;
    
    html2canvas(document.getElementById("invoiceTemplate"), { scale: 2 }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        doc.save(`HoaDon_${bill.BillID || bill.bill_id}.pdf`);
    });
}

// Close modals
function closeModal() { document.getElementById("modal").style.display = "none"; }

document.getElementById("detailModal").addEventListener("click", e => { 
    if(e.target === document.getElementById("detailModal")) closeDetail(); 
});
document.getElementById("modal").addEventListener("click", e => { 
    if(e.target === document.getElementById("modal")) closeModal(); 
});
document.getElementById("paymentModal").addEventListener("click", e => { 
    if(e.target === document.getElementById("paymentModal")) closePaymentModal(); 
});

// Start
loadData();
loadContracts();