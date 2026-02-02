function login() {
    const u = username.value;
    const p = password.value;
    const r = document.getElementById("result");

    localStorage.clear();

    if (u === "chutro" && p === "123") {
        localStorage.setItem("role", "chutro");
        window.location.href = "dashboard.html";
    }
    else if (u === "nhanvien" && p === "123") {
        localStorage.setItem("role", "nhanvien");
        window.location.href = "dashboard.html";
    }
    else if (u === "nguoithue" && p === "123") {
        localStorage.setItem("role", "nguoithue");
        window.location.href = "dashboard.html";
    }
    else {
        r.style.color = "red";
        r.innerHTML = "Sai thông tin đăng nhập";
    }
}

function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}
