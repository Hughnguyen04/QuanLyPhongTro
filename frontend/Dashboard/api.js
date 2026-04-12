const API_BASE = "http://localhost:8000/api";

class API {

    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        };
    }

    static async getRooms() {
        const res = await fetch(`${API_BASE}/rooms/read.php`, {
            headers: this.getHeaders()
        });
        const data = await res.json();
        console.log("rooms raw:", data);
        return data.data || data || [];
    }

    static async getTenants() {
        const res = await fetch(`${API_BASE}/tenants/read.php`, {
            headers: this.getHeaders()
        });
        const data = await res.json();
        console.log("tenants raw:", data);
        return data.data || data || [];
    }

    static async getBills() {
        const res = await fetch(`${API_BASE}/bills/read.php`, {
            headers: this.getHeaders()
        });
        const data = await res.json();
        console.log("bills raw:", data);
        return data.data || data || [];
    }

}