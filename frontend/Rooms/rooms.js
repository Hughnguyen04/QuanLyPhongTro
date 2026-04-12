let listRooms = [];
let editingId = null;
let currentImages = [];
let currentIndex = 0;
let currentRoomImages = [];

const modal = document.getElementById("modal");
const roomDetailModal = document.getElementById("roomDetailModal");

// DOM elements
const totalRooms = document.getElementById("totalRooms");
const emptyRooms = document.getElementById("emptyRooms");
const rentedRooms = document.getElementById("rentedRooms");
const repairRooms = document.getElementById("repairRooms");

// Get form elements
const mRoomName = document.getElementById("mRoomName");
const mAddress = document.getElementById("mAddress");
const mFloors = document.getElementById("mFloors");
const mRoomFloor = document.getElementById("mRoomFloor");
const mArea = document.getElementById("mArea");
const mPrice = document.getElementById("mPrice");
const mBuilding = document.getElementById("mBuilding");
const mStatus = document.getElementById("mStatus");
const mNote = document.getElementById("mNote");
const mImages = document.getElementById("mImages");
const previewImages = document.getElementById("previewImages");

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

/* ===== IMAGE PREVIEW ===== */
if (mImages) {
    mImages.addEventListener("change", function() {
        if (previewImages) {
            previewImages.innerHTML = "";
            const files = Array.from(this.files);
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.style.cssText = "width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd; margin: 5px;";
                    previewImages.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
    });
}

/* ===== LOAD DATA ===== */
async function loadRooms() {
    try {
        const response = await API.getRooms();
        console.log("API Response:", response);
        
        let roomsData = [];
        
        if (response && response.data && Array.isArray(response.data)) {
            roomsData = response.data;
        } else if (Array.isArray(response)) {
            roomsData = response;
        }
        
        listRooms = roomsData;
        console.log(`Loaded ${listRooms.length} rooms`);
        
        render();
        renderStats();
        
        if (listRooms.length > 0) {
            showToast(`Đã tải ${listRooms.length} phòng`, "success");
        }
    } catch (err) {
        console.error("Error loading rooms:", err);
        showToast("Lỗi tải dữ liệu", "error");
        listRooms = [];
        render();
        renderStats();
    }
}

/* ===== RENDER TABLE ===== */
function render() {
    const key = document.getElementById("key")?.value.toLowerCase() || "";
    const building = document.getElementById("buildingFilter")?.value || "";
    const status = document.getElementById("status")?.value || "";

    const tbody = document.getElementById("tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";

    if (!listRooms || listRooms.length === 0) {
        const row = tbody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 8;
        cell.textContent = "📭 Không có dữ liệu phòng";
        cell.style.textAlign = "center";
        cell.style.padding = "40px";
        cell.style.color = "#999";
        return;
    }

    const filteredRooms = listRooms.filter(r => {
        const matchKey = !key || (r.RoomName && r.RoomName.toLowerCase().includes(key));
        const matchBuilding = !building || r.BuildingName === building;
        const matchStatus = !status || mapStatus(r.Status) === status;
        return matchKey && matchBuilding && matchStatus;
    });

    filteredRooms.forEach((r) => {
        const row = tbody.insertRow();
        
        row.insertCell(0).textContent = r.RoomID || "";
        
        const nameCell = row.insertCell(1);
        nameCell.textContent = r.RoomName || "";
        nameCell.className = "room-name";
        nameCell.onclick = () => showRoomDetail(r);
        
        row.insertCell(2).textContent = r.BuildingName || "";
        row.insertCell(3).textContent = r.BuildingAddress || "";
        row.insertCell(4).textContent = r.Area ? r.Area + " m²" : "";
        row.insertCell(5).textContent = (r.BasePrice ? Number(r.BasePrice).toLocaleString() : "0") + " đ";
        
        const statusCell = row.insertCell(6);
        const statusText = mapStatus(r.Status);
        statusCell.innerHTML = `<span class="status-badge ${getStatusClass(r.Status)}">${statusText}</span>`;
        
        const actionCell = row.insertCell(7);
        actionCell.className = "action-buttons";
        
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️ Sửa";
        editBtn.className = "btn-edit";
        editBtn.onclick = (e) => {
            e.stopPropagation();
            openEditRoom(r.RoomID);
        };
        
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑 Xóa";
        deleteBtn.className = "btn-delete";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteRoom(r.RoomID);
        };
        
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
    });
}

function getStatusClass(status) {
    if (status === "TRONG") return "status-empty";
    if (status === "DANG_THUE") return "status-rented";
    if (status === "DANG_SUA") return "status-repair";
    return "";
}

/* ===== STATS ===== */
function renderStats() {
    if (!totalRooms || !emptyRooms || !rentedRooms || !repairRooms) return;
    
    let total = listRooms.length;
    let empty = 0, rented = 0, repair = 0;

    listRooms.forEach(r => {
        if (r.Status === "TRONG") empty++;
        else if (r.Status === "DANG_THUE") rented++;
        else if (r.Status === "DANG_SUA") repair++;
    });

    totalRooms.innerText = total;
    emptyRooms.innerText = empty;
    rentedRooms.innerText = rented;
    repairRooms.innerText = repair;
}

/* ===== STATUS MAPPER ===== */
function mapStatus(s) {
    if (s === "TRONG") return "Trống";
    if (s === "DANG_THUE") return "Đang thuê";
    if (s === "DANG_SUA") return "Đang sửa";
    return s || "Chưa xác định";
}

/* ===== VALIDATE FORM ===== */
function validateForm() {
    if (!mRoomName.value.trim()) {
        showToast("Vui lòng nhập tên phòng", "error");
        return false;
    }
    if (!mAddress.value.trim()) {
        showToast("Vui lòng nhập địa chỉ", "error");
        return false;
    }
    if (!mFloors.value.trim() || parseInt(mFloors.value) <= 0) {
        showToast("Tổng số tầng phải là số dương", "error");
        return false;
    }
    if (!mRoomFloor.value.trim() || parseInt(mRoomFloor.value) < 0) {
        showToast("Tầng phòng phải là số không âm", "error");
        return false;
    }
    if (!mArea.value.trim() || parseFloat(mArea.value) <= 0) {
        showToast("Diện tích phải là số dương", "error");
        return false;
    }
    if (!mPrice.value.trim() || parseFloat(mPrice.value) <= 0) {
        showToast("Giá phải là số dương", "error");
        return false;
    }
    return true;
}

/* ===== SAVE ===== */
async function saveRoom() {
    if (!validateForm()) return;
    
    const isEdit = !!editingId;
    if (!confirm(isEdit ? "Xác nhận cập nhật phòng?" : "Xác nhận thêm phòng mới?")) return;

    try {
        const formData = new FormData();
        
        formData.append("RoomName", mRoomName.value.trim());
        formData.append("BuildingName", mBuilding.value);
        formData.append("BuildingAddress", mAddress.value.trim());
        formData.append("BuildingTotalFloors", mFloors.value.trim());
        formData.append("RoomFloor", mRoomFloor.value.trim());
        formData.append("Area", mArea.value.trim());
        formData.append("BasePrice", mPrice.value.trim());
        formData.append("Status", mStatus.value);
        
        if (mNote.value.trim()) {
            formData.append("Note", mNote.value.trim());
        }
        
        if (isEdit) {
            formData.append("RoomID", editingId);
        }
        
        const files = mImages.files;
        if (files.length > 0) {
            formData.append("image", files[0]);
        }
        
        let res;
        if (isEdit) {
            res = await API.updateRoom(formData);
        } else {
            res = await API.createRoom(formData);
        }
        
        console.log("Save response:", res);
        
        // Kiểm tra thành công dựa vào message (vì backend không trả status)
        let isSuccess = false;
        
        if (res) {
            // Nếu có message và chứa "được tạo" hoặc "thành công"
            if (res.message) {
                if (res.message.includes("được tạo") || 
                    res.message.includes("thành công") || 
                    res.message.includes("cập nhật")) {
                    isSuccess = true;
                }
            }
            // Nếu có status (cho các trường hợp khác)
            else if (res.status === true || res.status === "success") {
                isSuccess = true;
            }
        }
        
        if (isSuccess) {
            showToast(isEdit ? "Cập nhật thành công!" : "Thêm phòng thành công!", "success");
            closeModal();
            resetForm();
            editingId = null;
            // Load lại danh sách sau 500ms
            setTimeout(() => loadRooms(), 500);
        } else {
            showToast(res?.message || "Thao tác thất bại", "error");
        }
    } catch (err) {
        console.error("Save error:", err);
        showToast("Lỗi kết nối server: " + err.message, "error");
    }
}

/* ===== DELETE ===== */
async function deleteRoom(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;

    try {
        const res = await API.deleteRoom(id);
        console.log("Delete response:", res);
        
        let isSuccess = false;
        
        if (res) {
            if (res.message && res.message.includes("xóa")) {
                isSuccess = true;
            } else if (res.status === true || res.status === "success") {
                isSuccess = true;
            }
        }
        
        if (isSuccess) {
            showToast("Xóa phòng thành công!", "success");
            setTimeout(() => loadRooms(), 500);
        } else {
            showToast(res?.message || "Xóa thất bại", "error");
        }
    } catch (err) {
        console.error("Delete error:", err);
        showToast("Lỗi kết nối server: " + err.message, "error");
    }
}

/* ===== EDIT ===== */
function openEditRoom(id) {
    const room = listRooms.find(x => x.RoomID == id);
    if (!room) {
        showToast("Không tìm thấy phòng", "error");
        return;
    }
    
    editingId = id;
    mRoomName.value = room.RoomName || "";
    mAddress.value = room.BuildingAddress || "";
    mFloors.value = room.BuildingTotalFloors || "";
    mRoomFloor.value = room.RoomFloor || "";
    mArea.value = room.Area || "";
    mPrice.value = room.BasePrice || "";
    mStatus.value = room.Status || "TRONG";
    mNote.value = room.Note || "";
    mBuilding.value = room.BuildingName || "Tòa A";
    
    if (previewImages) previewImages.innerHTML = "";
    if (mImages) mImages.value = "";
    
    modal.style.display = "flex";
}

/* ===== ADD ===== */
function openAddRoom() {
    editingId = null;
    resetForm();
    modal.style.display = "flex";
}

/* ===== CLOSE MODAL ===== */
function closeModal() {
    modal.style.display = "none";
    resetForm();
    editingId = null;
}

/* ===== RESET FORM ===== */
function resetForm() {
    mRoomName.value = "";
    mAddress.value = "";
    mFloors.value = "";
    mRoomFloor.value = "";
    mArea.value = "";
    mPrice.value = "";
    mNote.value = "";
    mBuilding.value = "Tòa A";
    mStatus.value = "TRONG";
    mImages.value = "";
    previewImages.innerHTML = "";
}

/* ===== SHOW ROOM DETAIL ===== */
function showRoomDetail(room) {
    if (!room) return;
    
    let imageUrls = [];
    const baseUrl = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/";
    
    if (room.Image && room.Image.trim() !== "") {
        if (room.Image.startsWith("http")) {
            imageUrls = [room.Image];
        } else {
            imageUrls = [baseUrl + room.Image];
        }
    }
    
    if (imageUrls.length === 0) {
        imageUrls = ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E📸 Chưa có ảnh%3C/text%3E%3C/svg%3E"];
    }
    
    currentRoomImages = imageUrls;
    currentIndex = 0;
    
    document.getElementById("dName").textContent = room.RoomName || "";
    document.getElementById("dBuilding").textContent = room.BuildingName || "";
    document.getElementById("dAddress").textContent = room.BuildingAddress || "";
    document.getElementById("dRoomFloor").textContent = room.RoomFloor || "";
    document.getElementById("dFloors").textContent = room.BuildingTotalFloors || "";
    document.getElementById("dArea").textContent = room.Area ? room.Area + " m²" : "";
    document.getElementById("dPrice").textContent = (room.BasePrice ? Number(room.BasePrice).toLocaleString() : "0") + " đ";
    document.getElementById("dNote").textContent = room.Note || "";
    document.getElementById("dStatus").innerHTML = `<span class="status-badge ${getStatusClass(room.Status)}">${mapStatus(room.Status)}</span>`;
    
    const mainImage = document.getElementById("mainImage");
    if (mainImage && currentRoomImages.length > 0) {
        mainImage.src = currentRoomImages[0];
        mainImage.onerror = function() {
            this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E❌ Lỗi tải ảnh%3C/text%3E%3C/svg%3E";
        };
    }
    
    roomDetailModal.style.display = "flex";
}

/* ===== CLOSE ROOM DETAIL ===== */
function closeRoomDetail() {
    roomDetailModal.style.display = "none";
}

/* ===== IMAGE SLIDER ===== */
function prevImage() {
    if (currentRoomImages.length === 0) return;
    currentIndex = (currentIndex - 1 + currentRoomImages.length) % currentRoomImages.length;
    document.getElementById("mainImage").src = currentRoomImages[currentIndex];
}

function nextImage() {
    if (currentRoomImages.length === 0) return;
    currentIndex = (currentIndex + 1) % currentRoomImages.length;
    document.getElementById("mainImage").src = currentRoomImages[currentIndex];
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing...");
    loadRooms();
    
    window.onclick = function(event) {
        if (event.target === modal) closeModal();
        if (event.target === roomDetailModal) closeRoomDetail();
    };
});

// Make functions global
window.saveRoom = saveRoom;
window.closeModal = closeModal;
window.openAddRoom = openAddRoom;
window.deleteRoom = deleteRoom;
window.showRoomDetail = showRoomDetail;
window.closeRoomDetail = closeRoomDetail;
window.prevImage = prevImage;
window.nextImage = nextImage;
window.render = render;
window.loadRooms = loadRooms;