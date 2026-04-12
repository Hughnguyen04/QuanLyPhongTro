const API_BASE = "http://localhost:8000/api/rooms";

class API {

    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Authorization": token ? `Bearer ${token}` : ""
        };
    }

    static async getRooms() {
        const res = await fetch(`${API_BASE}/read.php`, {
            headers: this.getHeaders()
        });
        return res.json();
    }

    static async createRoom(formData) {
        const res = await fetch(`${API_BASE}/create.php`, {
            method: "POST",
            body: formData,
            headers: this.getHeaders()
        });
        return res.json();
    }

    static async updateRoom(formData) {
        const res = await fetch(`${API_BASE}/update.php`, {
            method: "POST",
            body: formData,
            headers: this.getHeaders()
        });
        return res.json();
    }

    static async deleteRoom(id) {
        const formData = new FormData();
        formData.append("RoomID", id);

        const res = await fetch(`${API_BASE}/delete.php`, {
            method: "POST",
            body: formData,
            headers: this.getHeaders()
        });

        const data = await res.json();
        console.log("Delete response:", data);
        return data;
    }
}