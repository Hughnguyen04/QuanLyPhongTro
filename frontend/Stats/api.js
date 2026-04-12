const API_BASE = "http://localhost:8000/api";

class API {

    static getHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Authorization": token ? `Bearer ${token}` : ""
        };
    }

    /* ================= ROOMS ================= */
    static async getRooms() {
        try {
            const res = await fetch(`${API_BASE}/rooms/read.php`, {
                headers: this.getHeaders()
            });
            const data = await res.json();
            console.log("Rooms API:", data);
            
            if (data && data.data && Array.isArray(data.data)) {
                return data.data;
            }
            if (Array.isArray(data)) {
                return data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching rooms:", error);
            return [];
        }
    }

    /* ================= CONTRACTS ================= */
    static async getContracts() {
        try {
            const res = await fetch(`${API_BASE}/contracts/read.php`, {
                headers: this.getHeaders()
            });
            const data = await res.json();
            console.log("Contracts API:", data);
            
            if (data && data.data && Array.isArray(data.data)) {
                return data.data;
            }
            if (Array.isArray(data)) {
                return data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching contracts:", error);
            return [];
        }
    }

    /* ================= UTILITIES ================= */
    static async getUtilities() {
        try {
            const res = await fetch(`${API_BASE}/utilities/read.php`, {
                headers: this.getHeaders()
            });
            const data = await res.json();
            console.log("Utilities API:", data);
            
            if (data && data.data && Array.isArray(data.data)) {
                return data.data;
            }
            if (Array.isArray(data)) {
                return data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching utilities:", error);
            return [];
        }
    }

    /* ================= BILLS ================= */
    static async getBills() {
        try {
            const res = await fetch(`${API_BASE}/bills/read.php`, {
                headers: this.getHeaders()
            });
            const data = await res.json();
            console.log("Bills API:", data);
            
            if (data && data.data && Array.isArray(data.data)) {
                return data.data;
            }
            if (Array.isArray(data)) {
                return data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching bills:", error);
            return [];
        }
    }
}

window.API = API;