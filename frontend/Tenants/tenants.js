let listTenants = [];
let editingId = null;

const modal = document.getElementById("modal");
const detailModal = document.getElementById("detailModal");
const modalTitle = document.getElementById("modalTitle");

// DOM elements
const totalTenants = document.getElementById("totalTenants");
const maleCount = document.getElementById("maleCount");
const femaleCount = document.getElementById("femaleCount");

// Form elements
const mName = document.getElementById("mName");
const mCCCD = document.getElementById("mCCCD");
const mPhone = document.getElementById("mPhone");
const mEmail = document.getElementById("mEmail");
const mAddress = document.getElementById("mAddress");
const mBirth = document.getElementById("mBirth");
const mGender = document.getElementById("mGender");
const mNote = document.getElementById("mNote");

/* ===== TOAST NOTIFICATION ===== */
function showToast(message, type = "success") {
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '✗'}</span> ${message}`;
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

/* ===== LOAD DATA ===== */
async function loadTenants() {
    try {
        const response = await API.getTenants();
        console.log("Tenants response:", response);
        
        let tenantsData = [];
        
        // Xử lý nhiều định dạng response khác nhau
        if (response && response.data && Array.isArray(response.data)) {
            tenantsData = response.data;
        } else if (Array.isArray(response)) {
            tenantsData = response;
        } else if (response && typeof response === 'object') {
            // Thử tìm array trong object
            for (let key in response) {
                if (Array.isArray(response[key])) {
                    tenantsData = response[key];
                    break;
                }
            }
        }
        
        listTenants = tenantsData;
        console.log(`Loaded ${listTenants.length} tenants`);
        
        render();
        renderStats();
        
        if (listTenants.length > 0) {
            showToast(`Đã tải ${listTenants.length} người thuê`, "success");
        }
    } catch (err) {
        console.error("Error loading tenants:", err);
        showToast("Lỗi tải dữ liệu: " + err.message, "error");
        listTenants = [];
        render();
        renderStats();
    }
}

/* ===== RENDER TABLE ===== */
function render() {
    const key = document.getElementById("key")?.value.toLowerCase() || "";

    const tbody = document.getElementById("tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";

    if (!listTenants || listTenants.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 7;
        cell.textContent = "📭 Không có dữ liệu người thuê";
        cell.style.textAlign = "center";
        cell.style.padding = "40px";
        cell.style.color = "#999";
        return;
    }

    const filteredTenants = listTenants.filter(t => {
        const matchKey = !key || 
            (t.FullName && t.FullName.toLowerCase().includes(key)) ||
            (t.CCCD && t.CCCD.toLowerCase().includes(key)) ||
            (t.Phone && t.Phone.toLowerCase().includes(key));
        return matchKey;
    });

    filteredTenants.forEach((t) => {
        const row = tbody.insertRow();
        
        row.insertCell(0).textContent = t.TenantID || "";
        
        const nameCell = row.insertCell(1);
        nameCell.textContent = t.FullName || "";
        nameCell.className = "tenant-name";
        nameCell.style.cssText = "cursor: pointer; color: #6c63ff; font-weight: 500;";
        nameCell.onclick = () => openDetail(t.TenantID);
        
        row.insertCell(2).textContent = t.CCCD || "";
        row.insertCell(3).textContent = t.Phone || "";
        row.insertCell(4).textContent = t.Email || "";
        row.insertCell(5).textContent = t.Gender === "NAM" ? "Nam" : (t.Gender === "NU" ? "Nữ" : "");
        
        const actionCell = row.insertCell(6);
        actionCell.className = "action-buttons";
        
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️ Sửa";
        editBtn.className = "btn-edit";
        editBtn.style.cssText = "margin-right: 8px; cursor: pointer; padding: 6px 12px; background: #ffc107; border: none; border-radius: 6px; color: #fff;";
        editBtn.onclick = (e) => {
            e.stopPropagation();
            openEditTenant(t.TenantID);
        };
        
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑 Xóa";
        deleteBtn.className = "btn-delete";
        deleteBtn.style.cssText = "cursor: pointer; padding: 6px 12px; background: #dc3545; border: none; border-radius: 6px; color: #fff;";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteTenant(t.TenantID);
        };
        
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
    });
}

/* ===== STATS ===== */
function renderStats() {
    if (!totalTenants) return;
    
    let total = listTenants.length;
    let male = 0, female = 0;
    
    listTenants.forEach(t => {
        if (t.Gender === "NAM") male++;
        else if (t.Gender === "NU") female++;
    });
    
    totalTenants.innerText = total;
    if (maleCount) maleCount.innerText = male;
    if (femaleCount) femaleCount.innerText = female;
}

/* ===== VALIDATE FORM ===== */
function validateForm() {
    if (!mName.value.trim()) {
        showToast("Vui lòng nhập họ tên", "error");
        return false;
    }
    if (!mPhone.value.trim()) {
        showToast("Vui lòng nhập số điện thoại", "error");
        return false;
    }
    return true;
}

/* ===== SAVE ===== */
async function saveTenant() {
    if (!validateForm()) return;
    
    const isEdit = !!editingId;
    if (!confirm(isEdit ? "Xác nhận cập nhật người thuê?" : "Xác nhận thêm người thuê mới?")) return;

    try {
        const data = {
            FullName: mName.value.trim(),
            CCCD: mCCCD.value.trim(),
            Phone: mPhone.value.trim(),
            Email: mEmail.value.trim(),
            Address: mAddress.value.trim(),
            BirthDate: mBirth.value,
            Gender: mGender.value,
            Note: mNote.value.trim()
        };
        
        if (isEdit) {
            data.TenantID = editingId;
        }
        
        console.log("Sending data:", data);
        
        let res;
        if (isEdit) {
            res = await API.updateTenant(data);
        } else {
            res = await API.createTenant(data);
        }
        
        console.log("Save response:", res);
        
        // Xử lý response từ backend
        if (res) {
            // Trường hợp response có status = true
            if (res.status === true || res.status === "success") {
                showToast(isEdit ? "Cập nhật thành công!" : "Thêm thành công!");
                closeModal();
                editingId = null;
                // Reset form
                mName.value = "";
                mCCCD.value = "";
                mPhone.value = "";
                mEmail.value = "";
                mAddress.value = "";
                mBirth.value = "";
                mGender.value = "NAM";
                mNote.value = "";
                // Load lại dữ liệu
                setTimeout(() => loadTenants(), 500);
            }
            // Trường hợp response có message thành công
            else if (res.message && (res.message.includes("thành công") || res.message.includes("success"))) {
                showToast(isEdit ? "Cập nhật thành công!" : "Thêm thành công!");
                closeModal();
                editingId = null;
                setTimeout(() => loadTenants(), 500);
            }
            // Trường hợp lỗi
            else {
                showToast(res.message || "Thao tác thất bại", "error");
            }
        } else {
            showToast("Không nhận được phản hồi từ server", "error");
        }
    } catch (err) {
        console.error("Save error:", err);
        showToast("Lỗi kết nối server: " + err.message, "error");
    }
}

/* ===== DELETE ===== */
async function deleteTenant(id) {
    const tenant = listTenants.find(x => x.TenantID == id);
    if (!confirm(`Bạn có chắc chắn muốn xóa ${tenant?.FullName || 'người thuê này'}?`)) return;

    try {
        const res = await API.deleteTenant(id);
        console.log("Delete response:", res);
        
        if (res) {
            if (res.status === true || res.status === "success") {
                showToast("Xóa thành công!", "success");
                setTimeout(() => loadTenants(), 500);
            } else if (res.message && res.message.includes("thành công")) {
                showToast("Xóa thành công!", "success");
                setTimeout(() => loadTenants(), 500);
            } else {
                showToast(res.message || "Xóa thất bại", "error");
            }
        } else {
            showToast("Xóa thất bại", "error");
        }
    } catch (err) {
        console.error("Delete error:", err);
        showToast("Lỗi kết nối server: " + err.message, "error");
    }
}

/* ===== OPEN DETAIL ===== */
function openDetail(id) {
    const tenant = listTenants.find(x => x.TenantID == id);
    if (!tenant) {
        showToast("Không tìm thấy thông tin", "error");
        return;
    }
    
    document.getElementById("dName").textContent = tenant.FullName || "";
    document.getElementById("dCCCD").textContent = tenant.CCCD || "";
    document.getElementById("dPhone").textContent = tenant.Phone || "";
    document.getElementById("dEmail").textContent = tenant.Email || "";
    document.getElementById("dBirth").textContent = tenant.BirthDate || "";
    document.getElementById("dGender").textContent = tenant.Gender === "NAM" ? "Nam" : (tenant.Gender === "NU" ? "Nữ" : "");
    document.getElementById("dAddress").textContent = tenant.Address || "";
    document.getElementById("dNote").textContent = tenant.Note || "";
    
    detailModal.style.display = "flex";
}

function closeDetail() {
    detailModal.style.display = "none";
}

/* ===== OPEN EDIT ===== */
function openEditTenant(id) {
    const tenant = listTenants.find(x => x.TenantID == id);
    if (!tenant) {
        showToast("Không tìm thấy người thuê", "error");
        return;
    }
    
    editingId = id;
    modalTitle.innerText = "Sửa người thuê";
    
    mName.value = tenant.FullName || "";
    mCCCD.value = tenant.CCCD || "";
    mPhone.value = tenant.Phone || "";
    mEmail.value = tenant.Email || "";
    mAddress.value = tenant.Address || "";
    mBirth.value = tenant.BirthDate || "";
    mGender.value = tenant.Gender || "NAM";
    mNote.value = tenant.Note || "";
    
    modal.style.display = "flex";
}

/* ===== OPEN ADD ===== */
function openAddTenant() {
    editingId = null;
    modalTitle.innerText = "Thêm người thuê";
    
    mName.value = "";
    mCCCD.value = "";
    mPhone.value = "";
    mEmail.value = "";
    mAddress.value = "";
    mBirth.value = "";
    mGender.value = "NAM";
    mNote.value = "";
    
    modal.style.display = "flex";
}

/* ===== CLOSE MODAL ===== */
function closeModal() {
    modal.style.display = "none";
    editingId = null;
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing tenants...");
    loadTenants();
    
    window.onclick = function(event) {
        if (event.target === modal) closeModal();
        if (event.target === detailModal) closeDetail();
    };
});

// Make functions global
window.saveTenant = saveTenant;
window.closeModal = closeModal;
window.openAddTenant = openAddTenant;
window.openEditTenant = openEditTenant;
window.deleteTenant = deleteTenant;
window.openDetail = openDetail;
window.closeDetail = closeDetail;
window.render = render;
window.loadTenants = loadTenants;