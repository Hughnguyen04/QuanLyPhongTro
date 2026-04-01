const API_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api";

class MyBillAPI {

    /* ================= ROOMS ================= */
    static async getRooms() {
        const res = await fetch(`${API_BASE}/rooms/read.php`);
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

    /* ================= USERS ================= */
    static async getUsers() {
        const res = await fetch(`${API_BASE}/users/read.php`);
        return res.json();
    }
}

window.MyBillAPI = MyBillAPI;