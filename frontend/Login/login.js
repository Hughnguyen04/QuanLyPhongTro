function login() {
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();
    const r = document.getElementById("result");

    localStorage.clear();

    if (!u || !p) {
        r.style.color = "red";
        r.innerHTML = "Vui lòng nhập đầy đủ thông tin";
        return;
    }

    if (u === "chutro" && p === "123") {
        saveLogin("chutro", u);
    }
    else if (u === "nhanvien" && p === "123") {
        saveLogin("nhanvien", u);
    }
    else if (u === "nguoithue" && p === "123") {
        saveLogin("nguoithue", u);
    }
    else {
        r.style.color = "red";
        r.innerHTML = "Sai thông tin đăng nhập";
    }
}

function saveLogin(role, username) {
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);

    window.location.href = "../Dashboard/dashboard.html";
}

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}
