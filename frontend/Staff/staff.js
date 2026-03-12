/* ================= AUTH ================= */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role || role !== "chutro") location.href="../Login/login.html";

document.getElementById("username").innerText = username;
renderMenu(role);

/* ================= DATA ================= */
let listStaff = accounts.filter(a => a.role === "nhanvien");

/* ================= INIT FILTER ================= */
function initBuildings(){
    const select = document.getElementById("buildingFilter");

    const all = new Set();
    listStaff.forEach(s=>{
        (s.buildings||[]).forEach(b=>all.add(b));
    });

    select.innerHTML=`<option value="">Tất cả tòa</option>`;
    [...all].forEach(b=>{
        select.innerHTML+=`<option value="${b}">${b}</option>`;
    });
}

/* ================= RENDER ================= */
function render(){
    const key = document.getElementById("key").value.toLowerCase();
    const building = document.getElementById("buildingFilter").value;
    const tbody = document.getElementById("tbody");

    tbody.innerHTML="";
    let total=0;
    let buildCount=0;

    listStaff
    .filter(s =>
        s.name.toLowerCase().includes(key) &&
        (building==="" || (s.buildings||[]).includes(building))
    )
    .forEach(s=>{
        total++;
        buildCount += (s.buildings||[]).length;

        tbody.innerHTML += `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.username}</td>
            <td>${(s.buildings||[]).join(", ")}</td>
            <td>${(s.buildings||[]).length}</td>
            <td>
                <button onclick="editStaff('${s.id}')">✏️</button>
                <button onclick="deleteStaff('${s.id}')">🗑</button>
            </td>
        </tr>
        `;
    });

    document.getElementById("total").innerText=total;
    document.getElementById("buildCount").innerText=buildCount;
}

/* ================= ACTION ================= */
function addStaff(){
    const name = prompt("Tên nhân viên:");
    if(!name) return;

    const username = prompt("Tài khoản:");
    if(!username) return;

    const buildings = prompt("Tòa quản lý (phẩy):","Tòa 1,Tòa 2");
    const arr = buildings.split(",").map(s=>s.trim());

    const id="A"+Math.floor(Math.random()*1000);

    const nv={
        id,
        username,
        password:"123",
        role:"nhanvien",
        name,
        buildings:arr
    };

    listStaff.push(nv);
    accounts.push(nv);

    initBuildings();
    render();
}

function editStaff(id){
    const nv = listStaff.find(s=>s.id===id);
    if(!nv) return;

    const name = prompt("Tên:",nv.name);
    if(!name) return;

    const buildings = prompt("Tòa:",nv.buildings.join(","));
    nv.name=name;
    nv.buildings=buildings.split(",").map(s=>s.trim());

    render();
}

function deleteStaff(id){
    if(!confirm("Xóa nhân viên?")) return;

    listStaff = listStaff.filter(s=>s.id!==id);
    accounts = accounts.filter(a=>a.id!==id);

    render();
}

initBuildings();
render();