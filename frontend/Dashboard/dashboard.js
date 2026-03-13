document.addEventListener("DOMContentLoaded", () => {

const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role || !username) {
    location.href = "../Login/login.html";
    return;
}

if (!window.DATA) {
    console.error("DATA chưa load");
    return;
}

const { accounts, rooms, tenants, bills } = window.DATA;
const acc = accounts.find(a => a.username === username);

/* ===== TITLE + WELCOME ===== */
setText("title",
    role === "chutro" ? "Dashboard Chủ trọ" :
    role === "nhanvien" ? "Dashboard Nhân viên" :
    "Dashboard Người thuê"
);

setText("welcomeName"," Chào mừng " + (acc?.name || username));

renderDate();

/* ================= CHỦ TRỌ ================= */
if (role === "chutro") {

    setText("tongPhong", rooms.length);
    setText("phongThue", rooms.filter(r=>r.status==="Đang thuê").length);
    setText("phongTrong", rooms.filter(r=>r.status==="Trống").length);
    setText("soNguoi", tenants.filter(t=>t.status==="Đang thuê").length);
    setText("hoaDonNo", bills.filter(b=>b.status==="Chưa thanh toán").length);

    loadPhongTrong(rooms);
    loadNo(bills);
    loadTodoChuTro();
    loadActivity(tenants,bills);
}

/* ================= NHÂN VIÊN ================= */
if (role === "nhanvien") {

    const myBuildings = acc?.buildings || [];

    const myRooms = rooms.filter(r=>myBuildings.includes(r.building));
    const myTenants = tenants.filter(t=>myBuildings.includes(t.building));
    const myBills = bills.filter(b=>myBuildings.includes(b.building));

    setText("tongPhong", myRooms.length);
    setText("phongThue", myRooms.filter(r=>r.status==="Đang thuê").length);
    setText("phongTrong", myRooms.filter(r=>r.status==="Trống").length);
    setText("soNguoi", myTenants.length);
    setText("hoaDonNo", myBills.filter(b=>b.status==="Chưa thanh toán").length);

    loadPhongTrong(myRooms);
    loadNo(myBills);
    loadTodoNhanVien(myBills);
    loadActivity(myTenants,myBills);
}

/* ================= NGƯỜI THUÊ ================= */
if (role === "nguoithue") {

    const myRoom = rooms.find(r=>r.name===acc?.room);
    const myBill = bills.find(b=>b.room===acc?.room && b.status==="Chưa thanh toán");

    setText("tongPhong", acc?.room);
    setText("phongThue", acc?.building);
    setText("phongTrong", myRoom?.price?.toLocaleString("vi-VN")+"đ");
    setText("soNguoi", myBill?.total?.toLocaleString("vi-VN")+"đ");
    setText("hoaDonNo", myBill ? "Chưa thanh toán":"Đã thanh toán");

    const phongTrongPanel = document.getElementById("phongTrongPanel");
    const noPanel = document.getElementById("noPanel");

    if (phongTrongPanel) phongTrongPanel.style.display = "none";
    if (noPanel) noPanel.style.display = "none";

    loadTodoNguoiThue(myBill);
    loadActivity([],[]);
}

});

/* ===== TABLE PHÒNG TRỐNG ===== */
function loadPhongTrong(list){
const empty=list.filter(r=>r.status==="Trống");
setHTML("phongTrongTable",
empty.length
? empty.map(r=>`
<tr>
<td>${r.name}</td>
<td>${r.building}</td>
<td>${r.price.toLocaleString("vi-VN")}đ</td>
</tr>`).join("")
:"<tr><td colspan='3'>Không có</td></tr>");
}

/* ===== TABLE NỢ ===== */
function loadNo(list){
const no=list.filter(b=>b.status==="Chưa thanh toán");
setHTML("noTable",
no.length
? no.map(b=>`
<tr>
<td>${b.room}</td>
<td>${b.building}</td>
<td>${b.total.toLocaleString("vi-VN")}đ</td>
</tr>`).join("")
:"<tr><td colspan='3'>Không có</td></tr>");
}

/* ===== TODO ===== */
function loadTodoChuTro(){
setHTML("todoList",`
<li>Kiểm tra phòng trống</li>
<li>Thu tiền thuê tháng</li>
<li>Xem báo cáo doanh thu</li>`);
}

function loadTodoNhanVien(bills){
const no=bills.filter(b=>b.status==="Chưa thanh toán").length;
setHTML("todoList",`
<li>Thu ${no} hóa đơn</li>
<li>Kiểm tra phòng phụ trách</li>`);
}

function loadTodoNguoiThue(bill){
setHTML("todoList",
bill
? "<li>Thanh toán tiền phòng</li>"
: "<li>Không có</li>");
}

/* ===== ACTIVITY ===== */
function loadActivity(tList,bList){
const act=[];
tList.slice(-3).forEach(t=>act.push(`Người thuê ${t.name} vào ${t.room}`));
bList.slice(-3).forEach(b=>act.push(`Tạo hóa đơn ${b.room}`));
setHTML("activity",
act.length
? act.map(a=>`<li>${a}</li>`).join("")
:"<li>Chưa có</li>");
}

/* ===== UTIL ===== */
function setText(id,v){
const el=document.getElementById(id);
if(el) el.innerText=v??"";
}

function setHTML(id,v){
const el=document.getElementById(id);
if(el) el.innerHTML=v??"";
}

function renderDate(){
const d=new Date();
const days=["Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy"];
setText("today",
days[d.getDay()]+", "+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
);
}