const API_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api";

class API {

    /* ================= ROOMS ================= */
    static async getRooms() {
        const res = await fetch(`${API_BASE}/rooms/read.php`);
        return res.json();
    }

    static async createRoom(formData) {
        const res = await fetch(`${API_BASE}/rooms/create.php`, {
            method: "POST",
            body: formData
        });
        return res.json();
    }

    static async updateRoom(formData) {
        const res = await fetch(`${API_BASE}/rooms/update.php`, {
            method: "POST",
            body: formData
        });
        return res.json();
    }

    static async deleteRoom(id) {
        const formData = new FormData();
        formData.append("RoomID", id);
        const res = await fetch(`${API_BASE}/rooms/delete.php`, {
            method: "POST",
            body: formData
        });
        return res.json();
    }

    /* ================= CONTRACTS ================= */
    static async getContracts() {
        const res = await fetch(`${API_BASE}/contracts/read.php`);
        return res.json();
    }

    /* ================= UTILITIES ================= */
    static async getUtilities() {
        const res = await fetch(`${API_BASE}/utilities/read.php`);
        return res.json();
    }

    /* ================= BILLS ================= */
    static async getBills() {
        const res = await fetch(`${API_BASE}/bills/read.php`);
        return res.json();
    }

    static async createBill(data) {
        const res = await fetch(`${API_BASE}/bills/create.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.json();
    }

    static async updateBill(data) {
        const res = await fetch(`${API_BASE}/bills/update.php`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.json();
    }

    static async deleteBill(id) {
        const res = await fetch(`${API_BASE}/bills/delete.php`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ BillID: id })
        });
        return res.json();
    }
}

window.API = API;