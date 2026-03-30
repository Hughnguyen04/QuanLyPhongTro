const API_BASE_URL = 'http://192.168.100.124/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/contracts/read.php';
class API {
    static async request(endpoint, method = 'GET', data = null) {
        const url = `${API_BASE_URL}/${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            console.log(`📡 Gọi API: ${method} ${url}`);
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(`✅ Kết quả:`, result);
            
            // Xử lý cấu trúc trả về
            if (result && typeof result === 'object') {
                // Trường hợp có data field
                if (result.data !== undefined) {
                    return { success: true, data: result.data };
                }
                // Trường hợp là mảng trực tiếp
                if (Array.isArray(result)) {
                    return { success: true, data: result };
                }
                // Trường hợp có success field
                if (result.success === false) {
                    return { success: false, message: result.message, data: null };
                }
                // Trường hợp khác
                return { success: true, data: result };
            }
            
            return { success: false, data: null, message: 'Invalid response' };
        } catch (error) {
            console.error('❌ Lỗi API:', error);
            return { success: false, message: error.message, data: null };
        }
    }
    
    // Bills APIs
    static async getBills() {
        const result = await this.request('bills/read.php');
        return result;
    }
    
    static async createBill(data) {
        const result = await this.request('bills/create.php', 'POST', data);
        return result;
    }
    
    static async updateBill(data) {
        const result = await this.request('bills/update.php', 'PUT', data);
        return result;
    }
    
    static async deleteBill(id) {
        const result = await this.request('bills/delete.php', 'DELETE', { BillID: id });
        return result;
    }
    
    // Contracts APIs
    static async getContracts() {
        const result = await this.request('contracts/read.php');
        return result;
    }
    
    static async createContract(data) {
        const result = await this.request('contracts/create.php', 'POST', data);
        return result;
    }
    
    static async updateContract(data) {
        const result = await this.request('contracts/update.php', 'PUT', data);
        return result;
    }
    
    static async deleteContract(id) {
        const result = await this.request('contracts/delete.php', 'DELETE', { ContractID: id });
        return result;
    }
    
    // Rooms APIs
    static async getRooms() {
        const result = await this.request('rooms/read.php');
        return result;
    }
    
    // Tenants APIs
    static async getTenants() {
        const result = await this.request('tenants/read.php');
        return result;
    }
    
    // Buildings APIs
    static async getBuildings() {
        const result = await this.request('buildings/read.php');
        return result;
    }
}

if (typeof window !== 'undefined') {
    window.API = API;
}