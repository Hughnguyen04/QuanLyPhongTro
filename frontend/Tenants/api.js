const API_BASE = "http://localhost:8000/api/rooms";
const TENANT_API = "http://localhost:8000/api/tenants";

class API {

    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        };
    }

    /* ===== ROOMS ===== */
    static async getRooms() {
        const res = await fetch(`${API_BASE}/read.php`, {
            headers: this.getHeaders()
        });
        return res.json();
    }

    static async createRoom(data) {
        const res = await fetch(`${API_BASE}/create.php`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }

    static async updateRoom(data) {
        const res = await fetch(`${API_BASE}/update.php`, {
            method: "PUT",
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }

    static async deleteRoom(id) {
        const res = await fetch(`${API_BASE}/delete.php`, {
            method: "DELETE",
            headers: this.getHeaders(),
            body: JSON.stringify({ RoomID: id })
        });
        return res.json();
    }

    /* ===== TENANTS ===== */
    static async getTenants() {
        const res = await fetch(`${TENANT_API}/read.php`, {
            headers: this.getHeaders()
        });
        return res.json();
    }
static async createTenant(data) {
    const res = await fetch(`${TENANT_API}/create.php`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data)
    });

    return res.json();
}

    static async updateTenant(data) {
        const res = await fetch(`${TENANT_API}/update.php`, {
            method: "PUT",
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }

    static async deleteTenant(id) {
        const res = await fetch(`${TENANT_API}/delete.php`, {
            method: "DELETE",
            headers: this.getHeaders(),
            body: JSON.stringify({ TenantID: id })
        });
        return res.json();
    }
}