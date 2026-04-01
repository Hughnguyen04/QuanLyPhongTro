/* AUTH */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role || (role !== "chutro" && role !== "admin")) location.href="../Login/login.html";

document.getElementById("username").innerText = username;
renderMenu(role);

/* MODAL VAR */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");

const mName = document.getElementById("mName");
const mUsername = document.getElementById("mUsername");
const mBuildings = document.getElementById("mBuildings");

let editingId = null;

/* DATA */
let listStaff = accounts.filter(a => a.role === "nhanvien");

/* INIT BUILDING */
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

/* RENDER */
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

/* ADD */
function addStaff(){
    editingId=null;

    modalTitle.innerText="Thêm nhân viên";

    mName.value="";
    mUsername.value="";
    mBuildings.value="";

    modal.style.display="flex";
}

/* EDIT */
function editStaff(id){
    const nv = listStaff.find(s=>s.id===id);

    editingId=id;

    modalTitle.innerText="Sửa nhân viên";

    mName.value=nv.name;
    mUsername.value=nv.username;
    mBuildings.value=(nv.buildings||[]).join(",");

    modal.style.display="flex";
}

/* CLOSE */
function closeModal(){
    modal.style.display="none";
}

/* SAVE */
function saveStaff(){

    if(!mName.value || !mUsername.value){
        alert("Nhập đủ thông tin");
        return;
    }

    const data={
        id: editingId || "A"+Date.now(),
        name: mName.value,
        username: mUsername.value,
        password:"123",
        role:"nhanvien",
        buildings: mBuildings.value.split(",").map(s=>s.trim()).filter(Boolean)
    };

    if(editingId){
        accounts = accounts.map(a => a.id===editingId ? {...a,...data} : a);
    }else{
        accounts.push(data);
    }

    listStaff = accounts.filter(a=>a.role==="nhanvien");

    initBuildings();
    render();
    closeModal();
}

/* DELETE */
function deleteStaff(id){
    if(!confirm("Xóa nhân viên?")) return;

    accounts = accounts.filter(a=>a.id!==id);
    listStaff = accounts.filter(a=>a.role==="nhanvien");

    initBuildings();
    render();
}

/* INIT */
initBuildings();
render();