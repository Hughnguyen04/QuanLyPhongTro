// api.js - Quản lý tất cả các API calls
const API_BASE_URL = 'http://localhost/ChuyenDe/QuanLyPhongTro/backend/backend-php/api';

class API {
    static async request(endpoint, method = 'GET', data = null) {
        // Remove the extra slash handling
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/${endpoint}`;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            console.log(`📡 API Call: ${method} ${url}`);
            if (data) console.log('📦 Data:', data);
            
            const response = await fetch(url, options);
            console.log(`📥 Response Status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log(`✅ API Success:`, result);
            
            // Return the result as-is, don't wrap it
            return result;
            
        } catch (error) {
            console.error('❌ API Error:', error);
            return { 
                success: false, 
                message: error.message,
                data: null 
            };
        }
    }
    
    // Bills APIs
    static async getBills() {
        console.log('🔍 Getting bills...');
        const result = await this.request('bills/read.php');
        console.log('📋 Bills result:', result);
        return result;
    }
    
    static async getBill(id) {
        const result = await this.request(`bills/read_one.php?BillID=${id}`);
        return result;
    }
    
    static async createBill(billData) {
        const result = await this.request('bills/create.php', 'POST', billData);
        return result;
    }
    
    static async updateBill(billData) {
        const result = await this.request('bills/update.php', 'PUT', billData);
        return result;
    }
    
    static async deleteBill(id) {
        const result = await this.request('bills/delete.php', 'DELETE', { BillID: id });
        return result;
    }
    
    static async updateBillStatus(id, status) {
        const result = await this.request('bills/update.php', 'PUT', { 
            BillID: id, 
            Status: status 
        });
        return result;
    }
    
    static async updateBillPayment(id, paidAmount, paymentDate) {
        const result = await this.request('bills/update.php', 'PUT', { 
            BillID: id, 
            PaidAmount: paidAmount,
            PaymentDate: paymentDate
        });
        return result;
    }
    
    // Contracts APIs
    static async getContracts() {
        const result = await this.request('contracts/read.php');
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

// Export cho browser
if (typeof window !== 'undefined') {
    window.API = API;
}