const API_BASE = "http://localhost:8000/api";

class MyBillAPI {

    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
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

    /* ================= USERS ================= */
    static async getUsers() {
        const res = await fetch(`${API_BASE}/users/read.php`, {
            headers: this.getHeaders()
        });
        return res.json();
    }
}

window.MyBillAPI = MyBillAPI;