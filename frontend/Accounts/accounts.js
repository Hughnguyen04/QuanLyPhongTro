const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";

/* ===== DATA ===== */
let listStaff = accounts.filter(a => a.role === "nhanvien");

let listTenants = tenants.map(t => ({
    id: t.id,
    name: t.name,
    role: "nguoithue",
    building: t.building,
    room: t.room,
    phone: t.phone
}));

let listAll = [...listStaff, ...listTenants];

/* ===== FILTER ROLE ===== */
function getRoleFiltered(list){
    if(role === "chutro") return list;

    const acc = accounts.find(a => a.username === username);
    const myBuildings = acc?.buildings || [];

    return list.filter(a => myBuildings.includes(a.building));
} 

/* ===== INIT BUILDING ===== */
function initBuildings(){
    const select = document.getElementById("buildingFilter");

    const data = getRoleFiltered(listAll);
    const buildings = [...new Set(data.map(a => a.building).filter(Boolean))];

    select.innerHTML = `<option value="">Tất cả tòa</option>`;
    buildings.forEach(b=>{
        select.innerHTML += `<option value="${b}">${b}</option>`;
    });
}

/* ===== RENDER ===== */
function render(){
    const key = document.getElementById("key").value.toLowerCase();
    const roleFilter = document.getElementById("roleFilter").value;
    const building = document.getElementById("buildingFilter").value;
    const tbody = document.getElementById("tbody");

    tbody.innerHTML = "";

    let total=0, staff=0, tenant=0;

    getRoleFiltered(listAll)
        .filter(a =>
            a.name.toLowerCase().includes(key) &&
            (!roleFilter || a.role === roleFilter) &&
            (!building || a.building === building)
        )
        .forEach(a=>{
            total++;
            if(a.role==="nhanvien") staff++;
            if(a.role==="nguoithue") tenant++;

            tbody.innerHTML += `
                <tr>
                    <td>${a.id}</td>
                    <td>${a.name}</td>
                    <td>${a.role==="nhanvien"?"Nhân viên":"Người thuê"}</td>
                    <td>${a.building||""}</td>
                    <td>${a.room||""}</td>
                    <td>${a.phone||""}</td>
                    <td>
                        <button onclick="editAcc('${a.id}')">✏️</button>
                        ${role==="chutro" ? `<button onclick="deleteAcc('${a.id}')">🗑</button>` : ""}
                    </td>
                </tr>
            `;
        });

    document.getElementById("total").innerText = total;
    document.getElementById("staff").innerText = staff;
    document.getElementById("tenant").innerText = tenant;
}

/* ===== ACTION ===== */
function editAcc(id){
    alert("Sửa tài khoản "+id);
}

function deleteAcc(id){
    if(role!=="chutro") return;

    if(confirm("Xóa tài khoản "+id+" ?")){
        accounts = accounts.filter(a=>a.id!==id);
        tenants = tenants.filter(t=>t.id!==id);

        listStaff = accounts.filter(a=>a.role==="nhanvien");
        listTenants = tenants.map(t=>({
            id:t.id,
            name:t.name,
            role:"nguoithue",
            building:t.building,
            room:t.room,
            phone:t.phone
        }));

        listAll = [...listStaff,...listTenants];

        initBuildings();
        render();
    }
}

/* ===== INIT ===== */
initBuildings();
render();