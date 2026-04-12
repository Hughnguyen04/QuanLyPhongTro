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
        const res = await fetch(`${API_BASE}/rooms/read.php`, {
            headers: this.getHeaders()
        });
        return res.json();
    }

    static async createRoom(formData) {
        const res = await fetch(`${API_BASE}/rooms/create.php`, {
            method: "POST",
            body: formData,
            headers: this.getHeaders()
        });
        return res.json();
    }

    static async updateRoom(formData) {
        const res = await fetch(`${API_BASE}/rooms/update.php`, {
            method: "POST",
            body: formData,
            headers: this.getHeaders()
        });
        return res.json();
    }

    static async deleteRoom(id) {
        const formData = new FormData();
        formData.append("RoomID", id);
        const res = await fetch(`${API_BASE}/rooms/delete.php`, {
            method: "POST",
            body: formData,
            headers: this.getHeaders()
        });
        return res.json();
    }

    /* ================= CONTRACTS ================= */
    static async getContracts() {
        const res = await fetch(`${API_BASE}/contracts/read.php`, {
            headers: this.getHeaders()
        });
        return res.json();
    }

    /* ================= UTILITIES ================= */
    static async getUtilities() {
        const res = await fetch(`${API_BASE}/utilities/read.php`, {
            headers: this.getHeaders()
        });
        return res.json();
    }

    /* ================= BILLS ================= */
    static async getBills() {
        const res = await fetch(`${API_BASE}/bills/read.php`, {
            headers: this.getHeaders()
        });
        return res.json();
    }

    static async createBill(data) {
        const res = await fetch(`${API_BASE}/bills/create.php`, {
            method: "POST",
            headers: this.getJSONHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }

    static async updateBill(data) {
        const res = await fetch(`${API_BASE}/bills/update.php`, {
            method: "PUT",
            headers: this.getJSONHeaders(),
            body: JSON.stringify(data)
        });
        return res.json();
    }

    static async deleteBill(id) {
        const res = await fetch(`${API_BASE}/bills/delete.php`, {
            method: "DELETE",
            headers: this.getJSONHeaders(),
            body: JSON.stringify({ BillID: id })
        });
        return res.json();
    }
}

window.API = API;