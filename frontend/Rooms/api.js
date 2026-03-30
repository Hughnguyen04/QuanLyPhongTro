const API_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api/rooms";

class API {

    static async getRooms() {
        const res = await fetch(`${API_BASE}/read.php`);
        return await res.json();
    }

    static async createRoom(data) {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const res = await fetch(`${API_BASE}/create.php`, {
            method: "POST",
            body: formData
        });

        return await res.json();
    }

    static async updateRoom(data) {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const res = await fetch(`${API_BASE}/update.php`, {
            method: "POST",
            body: formData
        });

        return await res.json();
    }

    // ✅ FIX DELETE
    static async deleteRoom(id) {
        const res = await fetch(`${API_BASE}/delete.php`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ RoomID: id })
        });

        return await res.json();
    }
}