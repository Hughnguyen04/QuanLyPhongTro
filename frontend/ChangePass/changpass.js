function changePassword() {
    const oldPass = document.getElementById("oldPass").value.trim();
    const newPass = document.getElementById("newPass").value.trim();
    const rePass = document.getElementById("rePass").value.trim();
    const msg = document.getElementById("msg");

    const username = localStorage.getItem("username");
    const acc = window.DATA.accounts.find(a => a.username === username);

    if (!oldPass || !newPass || !rePass) {
        msg.style.color = "red";
        msg.innerText = "Vui lòng nhập đầy đủ thông tin";
        return;
    }

    if (oldPass !== acc.password) {
        msg.style.color = "red";
        msg.innerText = "Mật khẩu hiện tại không đúng";
        return;
    }

    if (newPass.length < 4) {
        msg.style.color = "red";
        msg.innerText = "Mật khẩu mới tối thiểu 4 ký tự";
        return;
    }

    if (newPass !== rePass) {
        msg.style.color = "red";
        msg.innerText = "Nhập lại mật khẩu không khớp";
        return;
    }

    acc.password = newPass;

    msg.style.color = "green";
    msg.innerText = "Đổi mật khẩu thành công";
}