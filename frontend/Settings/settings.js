const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";
if (role !== "chutro") location.href = "../Dashboard/dashboard.html";

document.addEventListener("DOMContentLoaded", () => {
document.addEventListener("DOMContentLoaded", () => {

    /* ===== LẤY DANH SÁCH ACCOUNTS ===== */

    let accList = [];

    if (window.DATA && window.DATA.accounts) {
        accList = window.DATA.accounts;
    } else if (typeof accounts !== "undefined") {
        accList = accounts;
    }

    /* ===== TÌM TÊN HIỂN THỊ ===== */

    let displayName = "Chủ trọ";

    if (username && accList.length) {
        const acc = accList.find(a => a.username === username);

        if (acc && acc.name) {
            displayName = acc.name;   // 👉 Đỗ Duy Tiến
        } else {
            displayName = username;
        }
    }

    /* ===== GÁN LÊN UI ===== */

    document.getElementById("username").innerText = displayName;

    // Avatar chữ cái
    const avatar = document.querySelector(".avatar-text");
    if (avatar) {
        avatar.textContent = displayName.charAt(0).toUpperCase();
    }

});
    renderMenu(role);

    if (!window.DATA.settings) {
        window.DATA.settings = {
            electricPrice: 3500,
            waterPrice: 15000,
            servicePrice: 100000,

            contractMonths: 12,
            depositMonths: 1,
            payDay: 1,
            dueDays: 5,
            lateFee: 1,

            meterDay: 30,
            billDay: 1,
            remindDays: 3,

            ownerName: "",
            ownerPhone: "",
            ownerEmail: "",
            boardingName: ""
        };
    }

    loadSettings();
});

function loadSettings(){
    const s = window.DATA.settings;

    electric.value = s.electricPrice;
    water.value = s.waterPrice;
    service.value = s.servicePrice;

    contractMonths.value = s.contractMonths;
    depositMonths.value = s.depositMonths;
    payDay.value = s.payDay;
    dueDays.value = s.dueDays;
    lateFee.value = s.lateFee;

    meterDay.value = s.meterDay;
    billDay.value = s.billDay;
    remindDays.value = s.remindDays;

    ownerName.value = s.ownerName;
    ownerPhone.value = s.ownerPhone;
    ownerEmail.value = s.ownerEmail;
    boardingName.value = s.boardingName;
}

function saveSettings(){
    const s = window.DATA.settings;

    s.electricPrice = Number(electric.value)||0;
    s.waterPrice = Number(water.value)||0;
    s.servicePrice = Number(service.value)||0;

    s.contractMonths = Number(contractMonths.value)||0;
    s.depositMonths = Number(depositMonths.value)||0;
    s.payDay = Number(payDay.value)||0;
    s.dueDays = Number(dueDays.value)||0;
    s.lateFee = Number(lateFee.value)||0;

    s.meterDay = Number(meterDay.value)||0;
    s.billDay = Number(billDay.value)||0;
    s.remindDays = Number(remindDays.value)||0;

    s.ownerName = ownerName.value;
    s.ownerPhone = ownerPhone.value;
    s.ownerEmail = ownerEmail.value;
    s.boardingName = boardingName.value;

    localStorage.setItem("settings", JSON.stringify(s));

    msg.style.color="green";
    msg.innerText="✔ Đã lưu toàn bộ cài đặt";
}