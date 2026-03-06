const role = localStorage.getItem("role");

const dataTenant = [
    { type: "bill", title: "Hóa đơn tháng 3", time: "Hôm nay" },
    { type: "system", title: "Thông báo từ chủ trọ", time: "Hôm qua" },
    { type: "bill", title: "Nhắc đóng tiền phòng", time: "2 ngày trước" }
];

const dataStaff = [
    { type: "task", title: "Sửa điện phòng 203", time: "Hôm nay" },
    { type: "task", title: "Dọn phòng khách mới", time: "Hôm nay" },
    { type: "system", title: "Chủ trọ gửi thông báo", time: "Hôm qua" }
];

const list = document.getElementById("notiList");
const roleTitle = document.getElementById("roleTitle");

let currentData = [];
if (role === "nguoithue") {
    roleTitle.innerText = "Thông báo của bạn";
    currentData = dataTenant;
} else {
    roleTitle.innerText = "Thông báo nhân viên";
    currentData = dataStaff;
}

render(currentData);

function render(arr) {
    list.innerHTML = "";

    arr.forEach(n => {
        list.innerHTML += `
        <div class="noti unread" data-type="${n.type}">
            <div>
                <div class="noti-title">${n.title}</div>
                <div class="noti-time">${n.time}</div>
            </div>
        </div>
        `;
    });
}
