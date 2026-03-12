/* ================= LOGIN SYSTEM ================= */

function login() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const result = document.getElementById("result");

    if (!usernameInput || !passwordInput || !result) return;

    const u = usernameInput.value.trim();
    const p = passwordInput.value.trim();

    localStorage.clear();

    if (!u || !p) {
        showError("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    /* ===== KIỂM TRA DATA ===== */
    if (!window.DATA || !window.DATA.accounts) {
        showError("Không tải được dữ liệu hệ thống");
        console.error("DATA not loaded");
        return;
    }

    /* ===== TÌM ACCOUNT ===== */
    const acc = window.DATA.accounts.find(
        a => a.username === u && a.password === p
    );

    if (!acc) {
        showError("Sai thông tin đăng nhập");
        return;
    }

    /* ===== LƯU SESSION ===== */
    localStorage.setItem("role", acc.role);
    localStorage.setItem("username", acc.username);
    localStorage.setItem("name", acc.name);

    if (acc.role === "nhanvien") {
        localStorage.setItem(
            "buildings",
            JSON.stringify(acc.buildings || [])
        );
    }

    if (acc.role === "nguoithue") {
        localStorage.setItem("building", acc.building || "");
        localStorage.setItem("room", acc.room || "");
        localStorage.setItem("tenantId", acc.tenantId || "");
    }

    /* ===== CHUYỂN TRANG ===== */
    window.location.href = "../Dashboard/dashboard.html";
}


/* ================= HELPERS ================= */

function showError(msg) {
    const r = document.getElementById("result");
    if (!r) return;
    r.style.color = "red";
    r.innerHTML = msg;
}


/* ================= MODAL (FORGOT) ================= */

function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = "flex";
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = "none";
}