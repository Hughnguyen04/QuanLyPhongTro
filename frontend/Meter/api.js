// Use absolute path to backend on port 80 (XAMPP)
// Change this to match your XAMPP setup
const API_BASE = "http://localhost:8000/api";

class API {

    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Authorization": token ? `Bearer ${token}` : ""
        };
    }

    static getJSONHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        };
    }

    /* ================= ROOMS ================= */
    static async getRooms() {
        try {
            const res = await fetch(`${API_BASE}/rooms/read.php`, {
                headers: this.getHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return { success: true, data: data.data || data || [] };
        } catch (err) {
            console.error("getRooms error:", err);
            return { success: false, data: [], message: err.message };
        }
    }

    static async createRoom(formData) {
        try {
            const res = await fetch(`${API_BASE}/rooms/create.php`, {
                method: "POST",
                body: formData,
                headers: this.getHeaders()
            });
            return await res.json();
        } catch (err) {
            console.error("createRoom error:", err);
            return { success: false, message: err.message };
        }
    }

    static async updateRoom(formData) {
        try {
            const res = await fetch(`${API_BASE}/rooms/update.php`, {
                method: "POST",
                body: formData,
                headers: this.getHeaders()
            });
            return await res.json();
        } catch (err) {
            console.error("updateRoom error:", err);
            return { success: false, message: err.message };
        }
    }

    static async deleteRoom(id) {
        try {
            const formData = new FormData();
            formData.append("RoomID", id);
            const res = await fetch(`${API_BASE}/rooms/delete.php`, {
                method: "POST",
                body: formData,
                headers: this.getHeaders()
            });
            return await res.json();
        } catch (err) {
            console.error("deleteRoom error:", err);
            return { success: false, message: err.message };
        }
    }

    /* ================= CONTRACTS ================= */
    static async getContracts() {
        try {
            const res = await fetch(`${API_BASE}/contracts/read.php`, {
                headers: this.getHeaders()
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return { success: true, data: data.data || data || [] };
        } catch (err) {
            console.error("getContracts error:", err);
            return { success: false, data: [], message: err.message };
        }
    }

    static async createContract(data) {
        try {
            const res = await fetch(`${API_BASE}/contracts/create.php`, {
                method: "POST",
                headers: this.getJSONHeaders(),
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (err) {
            console.error("createContract error:", err);
            return { success: false, message: err.message };
        }
    }

    static async updateContract(data) {
        try {
            const res = await fetch(`${API_BASE}/contracts/update.php`, {
                method: "PUT",
                headers: this.getJSONHeaders(),
                body: JSON.stringify(data)
            });
            return await res.json();
        } catch (err) {
            console.error("updateContract error:", err);
            return { success: false, message: err.message };
        }
    }

    static async deleteContract(id) {
        try {
            const res = await fetch(`${API_BASE}/contracts/delete.php`, {
                method: "DELETE",
                headers: this.getJSONHeaders(),
                body: JSON.stringify({ ContractID: id })
            });
            return await res.json();
        } catch (err) {
            console.error("deleteContract error:", err);
            return { success: false, message: err.message };
        }
    }

    /* ================= UTILITIES ================= */
    static async getUtilities() {
        try {
            console.log("📡 Fetching utilities from:", `${API_BASE}/utilities/read.php`);
            
            const res = await fetch(`${API_BASE}/utilities/read.php`, {
                headers: { 
                    "Accept": "application/json",
                    ...this.getHeaders()
                }
            });
            
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            
            const text = await res.text();
            
            // Try to parse JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Invalid JSON. Raw response:", text.substring(0, 500));
                throw new Error("Server returned invalid JSON");
            }
            
            // Handle different response formats
            if (Array.isArray(data)) {
                return { success: true, data: data };
            } else if (data && data.data && Array.isArray(data.data)) {
                return { success: true, data: data.data };
            } else if (data && data.success === false) {
                return data;
            } else {
                return { success: true, data: [] };
            }
            
        } catch (err) {
            console.error("❌ getUtilities error:", err.message);
            return { 
                success: false, 
                data: [], 
                message: err.message,
                details: `Backend URL: ${API_BASE}/utilities/read.php`
            };
        }
    }

    static async createUtility(data) {
        try {
            console.log("📤 CREATE Utility:", data);
            
            const res = await fetch(`${API_BASE}/utilities/create.php`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    ...this.getHeaders()
                },
                body: JSON.stringify(data)
            });
            
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            
            const text = await res.text();
            console.log("📥 CREATE response:", text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("Invalid JSON:", text);
                throw new Error("Server returned invalid JSON");
            }
            
            return result;
            
        } catch (err) {
            console.error("❌ createUtility error:", err);
            return { success: false, message: err.message };
        }
    }

    static async updateUtility(data) {
        try {
            console.log("📤 UPDATE Utility:", data);
            
            const res = await fetch(`${API_BASE}/utilities/update.php`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    ...this.getHeaders()
                },
                body: JSON.stringify(data)
            });
            
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            
            const text = await res.text();
            console.log("📥 UPDATE response:", text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("Invalid JSON:", text);
                throw new Error("Server returned invalid JSON");
            }
            
            return result;
            
        } catch (err) {
            console.error("❌ updateUtility error:", err);
            return { success: false, message: err.message };
        }
    }

    static async deleteUtility(id) {
        try {
            console.log("📤 DELETE Utility ID:", id);
            
            const res = await fetch(`${API_BASE}/utilities/delete.php`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    ...this.getHeaders()
                },
                body: JSON.stringify({ UtilityID: id })
            });
            
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            
            const text = await res.text();
            console.log("📥 DELETE response:", text);
            
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                console.error("Invalid JSON:", text);
                throw new Error("Server returned invalid JSON");
            }
            
            return result;
            
        } catch (err) {
            console.error("❌ deleteUtility error:", err);
            return { success: false, message: err.message };
        }
    }
}

window.API = API;

// Test function with detailed diagnostics
async function testConnection() {
    console.clear();
    console.log("🧪 Testing backend connection...");
    console.log("📡 API_BASE:", API_BASE);
    console.log("🌐 Current page URL:", window.location.href);
    console.log("💡 Make sure XAMPP is running on port 80\n");
    
    // Test if we can reach localhost
    try {
        const localhostTest = await fetch("http://localhost");
        console.log("✅ localhost is reachable (XAMPP running)");
    } catch (err) {
        console.error("❌ localhost is NOT reachable. XAMPP might not be running!");
        alert("⚠️ XAMPP/Apache không chạy!\n\nVui lòng khởi động XAMPP và bật Apache.");
        return false;
    }
    
    const endpoints = [
        { name: "Utilities", url: `${API_BASE}/utilities/read.php` },
        { name: "Rooms", url: `${API_BASE}/rooms/read.php` },
        { name: "Contracts", url: `${API_BASE}/contracts/read.php` }
    ];
    
    let successCount = 0;
    
    for (const endpoint of endpoints) {
        console.log(`\n🔍 Testing ${endpoint.name}: ${endpoint.url}`);
        try {
            const res = await fetch(endpoint.url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            console.log(`   Status: ${res.status} ${res.statusText}`);
            
            if (res.ok) {
                const text = await res.text();
                const isValidJson = text.trim().startsWith('{') || text.trim().startsWith('[');
                console.log(`   Valid JSON: ${isValidJson ? '✅' : '❌'}`);
                if (isValidJson) {
                    console.log(`   ✅ ${endpoint.name} OK`);
                    successCount++;
                } else {
                    console.log(`   ⚠️ ${endpoint.name} returned non-JSON response`);
                    console.log(`   Preview: ${text.substring(0, 150)}`);
                }
            } else {
                console.log(`   ❌ ${endpoint.name} failed: ${res.status}`);
            }
        } catch (err) {
            console.log(`   ❌ ${endpoint.name} error: ${err.message}`);
        }
    }
    
    console.log(`\n📊 Summary: ${successCount}/${endpoints.length} endpoints accessible`);
    
    if (successCount === 0) {
        console.error(`
❌ KHÔNG THỂ KẾT NỐI ĐẾN BACKEND!

Vui lòng kiểm tra:
1. ✅ XAMPP đang chạy (Apache)
2. ✅ Đường dẫn backend đúng: ${API_BASE}
3. ✅ File backend tồn tại trong thư mục
4. ✅ Không dùng Live Server (port 5500) - dùng trực tiếp http://localhost/...
        `);
        
        alert(`⚠️ Không thể kết nối đến backend!\n\nĐường dẫn: ${API_BASE}\n\nCách khắc phục:\n1. Khởi động XAMPP (Apache)\n2. KHÔNG dùng Live Server (port 5500)\n3. Mở trực tiếp: http://localhost/ChuyenDe/QuanLyPhongTro/frontend/...\n4. Hoặc dùng file:// protocol nếu đã cấu hình`);
    } else {
        console.log("✅ Backend connection successful!");
    }
    
    return successCount;
}

window.testConnection = testConnection;
console.log("🎯 API Debug: Call testConnection() to check backend connection");