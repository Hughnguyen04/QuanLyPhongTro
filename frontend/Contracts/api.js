// CHÚ Ý: Đường dẫn KHÔNG được có dấu cách %20
// Sửa lại thành:
const API_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api/rooms";
const API_CONTRACTS_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api/contracts";
const API_TENANTS_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api/tenants";
const API_BUILDINGS_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api/buildings";

class API {

    /* ===== ROOMS ===== */
    static async getRooms() {
        const res = await fetch(`${API_BASE}/read.php`);
        return res.json();
    }

    static async createRoom(formData) {
        const res = await fetch(`${API_BASE}/create.php`, {
            method: "POST",
            body: formData
        });
        return res.json();
    }

    static async updateRoom(formData) {
        const res = await fetch(`${API_BASE}/update.php`, {
            method: "POST",
            body: formData
        });
        return res.json();
    }

    static async deleteRoom(id) {
        const formData = new FormData();
        formData.append("RoomID", id);

        const res = await fetch(`${API_BASE}/delete.php`, {
            method: "POST",
            body: formData
        });
        return res.json();
    }

    /* ===== CONTRACTS ===== */
    static async getContracts() {
        try {
            const res = await fetch(`${API_CONTRACTS_BASE}/read.php`);
            const data = await res.json();
            console.log("Contracts response:", data);
            
            if (data && data.data && Array.isArray(data.data)) {
                return { success: true, data: data.data };
            }
            if (Array.isArray(data)) {
                return { success: true, data: data };
            }
            return { success: false, data: [], message: "Invalid response" };
        } catch (error) {
            console.error("Get contracts error:", error);
            return { success: false, data: [], message: error.message };
        }
    }

    static async createContract(data) {
    try {
        console.log("Sending create contract data:", data);
        const res = await fetch(`${API_CONTRACTS_BASE}/create.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const text = await res.text();
        console.log("Raw response:", text);
        
        // Thử parse JSON
        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error("JSON parse error:", e);
            // Nếu không parse được, trả về text
            return { success: false, message: "Server error: " + text.substring(0, 100) };
        }
        
        console.log("Create contract response:", result);
        
        // 🔥 TRẢ VỀ ĐÚNG CẤU TRÚC ĐỂ FRONTEND XỬ LÝ
        // Nếu result là mảng ['message', 'nội dung']
        if (Array.isArray(result)) {
            if (result[1] && (result[1].includes("da duoc tao") || result[1].includes("thành công"))) {
                return { success: true, message: result[1], raw: result };
            }
            return { success: false, message: result[1] || "Không thể tạo hợp đồng", raw: result };
        }
        
        // Nếu result là object
        return result;
        
    } catch (error) {
        console.error("Create contract error:", error);
        return { success: false, message: error.message };
    }
}

    static async updateContract(data) {
        try {
            console.log("Sending update contract data:", data);
            const res = await fetch(`${API_CONTRACTS_BASE}/update.php`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const text = await res.text();
            console.log("Raw response:", text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("JSON parse error:", e);
                return { success: false, message: "Server error: " + text.substring(0, 100) };
            }
            
            console.log("Update contract response:", result);
            
            if (Array.isArray(result)) {
                if (result[1] && (result[1].includes("da duoc cap nhat") || result[1].includes("thành công"))) {
                    return { success: true, message: result[1] };
                }
                return { success: false, message: result[1] || "Không thể cập nhật hợp đồng" };
            }
            
            if (result && result.status === true) {
                return { success: true, message: result.message };
            }
            
            return { success: false, message: result?.message || "Không thể cập nhật hợp đồng" };
        } catch (error) {
            console.error("Update contract error:", error);
            return { success: false, message: error.message };
        }
    }

    static async deleteContract(id) {
        try {
            const res = await fetch(`${API_CONTRACTS_BASE}/delete.php`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ContractID: id })
            });
            
            const text = await res.text();
            console.log("Raw response:", text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("JSON parse error:", e);
                return { success: false, message: "Server error" };
            }
            
            console.log("Delete contract response:", result);
            
            if (Array.isArray(result)) {
                if (result[1] && result[1].includes("da duoc xoa")) {
                    return { success: true, message: result[1] };
                }
                return { success: false, message: result[1] || "Không thể xóa hợp đồng" };
            }
            
            return { success: false, message: result?.message || "Không thể xóa hợp đồng" };
        } catch (error) {
            console.error("Delete contract error:", error);
            return { success: false, message: error.message };
        }
    }

    /* ===== TENANTS ===== */
    static async getTenants() {
        try {
            const res = await fetch(`${API_TENANTS_BASE}/read.php`);
            const data = await res.json();
            console.log("Tenants response:", data);
            
            if (data && data.data && Array.isArray(data.data)) {
                return { success: true, data: data.data };
            }
            if (Array.isArray(data)) {
                return { success: true, data: data };
            }
            return { success: false, data: [], message: "Invalid response" };
        } catch (error) {
            console.error("Get tenants error:", error);
            return { success: false, data: [], message: error.message };
        }
    }

    /* ===== BUILDINGS ===== */
    static async getBuildings() {
        try {
            const res = await fetch(`${API_BUILDINGS_BASE}/read.php`);
            const data = await res.json();
            console.log("Buildings response:", data);
            
            if (data && data.data && Array.isArray(data.data)) {
                return { success: true, data: data.data };
            }
            if (Array.isArray(data)) {
                return { success: true, data: data };
            }
            return { success: false, data: [], message: "Invalid response" };
        } catch (error) {
            console.error("Get buildings error:", error);
            return { success: false, data: [], message: error.message };
        }
    }
}

if (typeof window !== 'undefined') {
    window.API = API;
}