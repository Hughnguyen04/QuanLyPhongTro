const API_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api";

class API {

    static async getRooms() {
        const res = await fetch(`${API_BASE}/rooms/read.php`);
        const data = await res.json();
        console.log("rooms raw:", data);
        return data.data || data || [];
    }

    static async getTenants() {
        const res = await fetch(`${API_BASE}/tenants/read.php`);
        const data = await res.json();
        console.log("tenants raw:", data);
        return data.data || data || [];
    }

    static async getBills() {
        const res = await fetch(`${API_BASE}/bills/read.php`);
        const data = await res.json();
        console.log("bills raw:", data);
        return data.data || data || [];
    }

}