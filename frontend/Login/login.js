// API endpoint
const API_URL = "http://localhost:8080/quanlyphongtro/api/auth/login";

async function login() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const result = document.getElementById("result");
    const loginBtn = document.querySelector("button");

    const u = usernameInput.value.trim();
    const p = passwordInput.value.trim();

    result.innerHTML = "";
    if (!u || !p) {
        showError("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner"></span> Đang xử lý...';

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: u, password: p })
        });

        const data = await response.json();
        console.log("🔐 Login response:", data);

        if (!response.ok) {
            showError(data.message || "Đăng nhập thất bại");
            return;
        }

        if (data && data.token) {
            localStorage.clear();
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username || u);
            localStorage.setItem("fullName", data.fullName || data.username || u);
            
            // Xác định role
            let role = "guest";
            const apiRole = (data.role || "").toUpperCase();
            
            if (apiRole === "ADMIN" || apiRole === "CHUTRO" || u === "admin") {
                role = "admin";
            } else if (apiRole === "STAFF" || apiRole === "NHANVIEN") {
                role = "staff";
                localStorage.setItem("buildingManaged", data.buildingManaged || "");
            } else {
                role = "guest";
                localStorage.setItem("room", data.room || "");
                localStorage.setItem("building", data.building || "");
            }
            
            localStorage.setItem("role", role);
            
            let roleText = role === "admin" ? "Chủ trọ" : (role === "staff" ? "Nhân viên" : "Người thuê");
            result.style.color = "green";
            result.innerHTML = `✅ Đăng nhập thành công! Vai trò: ${roleText}`;

            setTimeout(() => {
                if (role === "admin") {
                    window.location.href = "../Dashboard/admin.html";
                } else if (role === "staff") {
                    window.location.href = "../Dashboard/staff.html";
                } else {
                    window.location.href = "../Dashboard/guest.html";
                }
            }, 1000);
        }
    } catch (error) {
        showError("🌐 Không thể kết nối đến server");
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = "Đăng nhập";
    }
}

function showError(msg) {
    const result = document.getElementById("result");
    result.style.color = "red";
    result.innerHTML = msg;
    setTimeout(() => result.innerHTML = "", 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
        passwordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") login();
        });
    }
});

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

async function forgotPassword() {
    const emailInput = document.querySelector("#forgot .input-group input");
    const resultMsg = document.querySelector("#forgot .result");
    
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    if (!email) {
        resultMsg.style.color = "red";
        resultMsg.innerHTML = "❌ Vui lòng nhập email";
        return;
    }
    
    try {
        const response = await fetch("http://192.168.1.20:8080/quanlyphongtro/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        
        if (response.ok) {
            resultMsg.style.color = "green";
            resultMsg.innerHTML = "✅ Đã gửi email khôi phục!";
            setTimeout(() => closeModal('forgot'), 2000);
        } else {
            resultMsg.style.color = "red";
            resultMsg.innerHTML = data.message || "❌ Email không tồn tại";
        }
    } catch (error) {
        resultMsg.style.color = "red";
        resultMsg.innerHTML = "🌐 Lỗi kết nối";
    }
}