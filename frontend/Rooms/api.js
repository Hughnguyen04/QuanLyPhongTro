const API_BASE = "http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api/rooms";

class API {

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

    const data = await res.json();
    console.log("Delete response:", data);
    return data;
}
}