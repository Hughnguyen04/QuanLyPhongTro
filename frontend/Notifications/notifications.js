const role = localStorage.getItem("role"); // nguoithue | nhanvien

const dataTenant = [
    {type:"bill", icon:"💰", title:"Hóa đơn tháng 3", time:"Hôm nay"},
    {type:"system", icon:"📢", title:"Thông báo từ chủ trọ", time:"Hôm qua"},
    {type:"bill", icon:"⚠️", title:"Nhắc đóng tiền phòng", time:"2 ngày trước"}
];

const dataStaff = [
    {type:"task", icon:"🛠️", title:"Sửa điện phòng 203", time:"Hôm nay"},
    {type:"task", icon:"🧹", title:"Dọn phòng khách mới", time:"Hôm nay"},
    {type:"system", icon:"📢", title:"Chủ trọ gửi thông báo", time:"Hôm qua"}
];

const list = document.getElementById("notiList");
const roleTitle = document.getElementById("roleTitle");

let currentData = [];

if(role === "nguoithue"){
    roleTitle.innerText = "Thông báo của bạn";
    currentData = dataTenant;
}
else{
    roleTitle.innerText = "Thông báo nhân viên";
    currentData = dataStaff;
}

render(currentData);

function render(arr){
    list.innerHTML = "";
    arr.forEach(n=>{
        list.innerHTML += `
        <div class="noti unread" data-type="${n.type}">
            <div class="noti-icon">${n.icon}</div>
            <div>
                <div class="noti-title">${n.title}</div>
                <div class="noti-time">${n.time}</div>
            </div>
        </div>
        `;
    });
}

function filterNoti(type){
    document.querySelectorAll(".filter button").forEach(b=>b.classList.remove("active"));
    event.target.classList.add("active");

    if(type==="all") render(currentData);
    else render(currentData.filter(n=>n.type===type));
}