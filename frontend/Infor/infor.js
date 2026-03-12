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

    const acc = window.DATA.accounts.find(a => a.username === username);
    if (!acc) return;

    /* ===== USER BOX (AVATAR + TÊN) ===== */
    document.getElementById("username").innerText = acc.name || acc.username;

    /* ===== HEADER ===== */
    document.getElementById("welcomeName").innerText =
        "👋 Chào mừng " + (acc.name || acc.username);

    document.getElementById("fullName").innerText = acc.name || "";
    document.getElementById("role").innerText = roleText(acc.role);

    renderDate();
    loadInfo(acc);
});


/* ROLE TEXT */
function roleText(r){
    if(r==="chutro") return "Chủ trọ";
    if(r==="nhanvien") return "Nhân viên";
    if(r==="nguoithue") return "Người thuê";
    return r;
}

/* DATE */
function renderDate(){
    const d=new Date();
    const days=["Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy"];
    const el=document.getElementById("today");
    if(el){
        el.innerText =
            days[d.getDay()] + ", " +
            d.getDate() + "/" +
            (d.getMonth()+1) + "/" +
            d.getFullYear();
    }
}

/* LOAD INFO */
function loadInfo(acc){

    const grid=document.getElementById("infoGrid");
    if(!grid) return;

    grid.innerHTML="";

    addCard("Thông tin tài khoản",[
        ["Tên đăng nhập",acc.username],
        ["Họ tên",acc.name],
        ["Vai trò",roleText(acc.role)],
        ["SĐT",acc.phone||""],
        ["Email",acc.email||""]
    ]);

    if(acc.role==="chutro"){
        addCard("Quản lý hệ thống",[
            ["Số khu",window.DATA.buildings?.length||0],
            ["Tổng phòng",window.DATA.rooms?.length||0],
            ["Nhân viên",
                window.DATA.accounts.filter(a=>a.role==="nhanvien").length]
        ]);
    }

    if(acc.role==="nhanvien"){
        addCard("Phụ trách",[
            ["Khu",(acc.buildings||[]).join(", ")],
            ["Chức vụ","Nhân viên quản lý"],
            ["Ngày vào làm",acc.startDate||""]
        ]);
    }

    if(acc.role==="nguoithue"){
        addCard("Thông tin thuê",[
            ["Khu",acc.building||""],
            ["Phòng",acc.room||""],
            ["Mã người thuê",acc.tenantId||""],
            ["Ngày vào",acc.startDate||""]
        ]);
    }
}

/* CARD */
function addCard(title,rows){

    const grid=document.getElementById("infoGrid");

    const card=document.createElement("div");
    card.className="info-card";

    let html="<h4>"+title+"</h4>";

    rows.forEach(r=>{
        html+=`
        <div class="info-row">
            <div class="label">${r[0]}</div>
            <div>${r[1]}</div>
        </div>`;
    });

    card.innerHTML=html;
    grid.appendChild(card);
}