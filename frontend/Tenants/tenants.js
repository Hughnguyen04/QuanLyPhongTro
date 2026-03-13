const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";

renderMenu(role);

let editingId = null;


/* ================= LOAD FILTER ================= */

function loadBuildingFilter(){

const select=document.getElementById("buildingFilter");

select.innerHTML=`<option value="">Tất cả tòa</option>`;

buildings.forEach(b=>{
select.innerHTML+=`<option value="${b.BuildingID}">${b.BuildingName}</option>`;
});

}


function loadRoomFilter(){

const building=document.getElementById("buildingFilter").value;
const select=document.getElementById("roomFilter");

select.innerHTML=`<option value="">Tất cả phòng</option>`;

rooms
.filter(r => !building || r.BuildingID===building)
.forEach(r=>{

select.innerHTML+=`<option value="${r.RoomID}">${r.RoomName}</option>`;

});

}


function loadRoomModal(){

const select=document.getElementById("mRoom");

select.innerHTML=`<option value="">Chọn phòng</option>`;

rooms.forEach(r=>{

select.innerHTML+=`<option value="${r.RoomID}">
${r.RoomName}
</option>`;

});

}


/* ================= RENDER ================= */

function render(){

const key=document.getElementById("key").value.toLowerCase();
const building=document.getElementById("buildingFilter").value;
const room=document.getElementById("roomFilter").value;
const status=document.getElementById("statusFilter").value;

const tbody=document.getElementById("tbody");

tbody.innerHTML="";

let total=0,dang=0,roi=0;

listTenants
.filter(t =>

t.FullName.toLowerCase().includes(key) &&

(!building || t.BuildingID===building) &&

(!room || t.RoomID===room) &&

(!status || t.Status===status)

)

.forEach(t=>{

total++;

const statusText = t.Status==="DA_ROI" ? "Đã rời" : "Đang thuê";

if(statusText==="Đang thuê") dang++;
else roi++;

tbody.innerHTML+=`
<tr>
<td>${t.TenantID}</td>
<td>${t.FullName}</td>
<td>${t.CCCD||""}</td>
<td>${t.Address||""}</td>
<td>${t.RoomName||"-"}</td>
<td>${t.BuildingName||"-"}</td>
<td>${t.Phone||""}</td>
<td>${statusText}</td>
<td>
<button onclick="openEditTenant('${t.TenantID}')">✏️</button>
${role==="chutro" ? `<button onclick="deleteTenant('${t.TenantID}')">🗑</button>` : ""}
</td>
</tr>
`;

});

document.getElementById("total").innerText=total;
document.getElementById("dang").innerText=dang;
document.getElementById("roi").innerText=roi;

}


/* ================= MODAL ================= */

function openAddTenant(){

editingId=null;

modalTitle.innerText="Thêm người thuê";

mName.value="";
mCCCD.value="";
mPhone.value="";
mAddress.value="";
mRoom.value="";
mStatus.value="DANG_O";

modal.style.display="flex";

}


function openEditTenant(id){

const t=listTenants.find(x=>x.TenantID===id);

editingId=id;

modalTitle.innerText="Sửa người thuê";

mName.value=t.FullName;
mCCCD.value=t.CCCD||"";
mPhone.value=t.Phone||"";
mAddress.value=t.Address||"";
mRoom.value=t.RoomID||"";
mStatus.value=t.Status||"DANG_O";

modal.style.display="flex";

}


function closeModal(){

modal.style.display="none";

}


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded",()=>{

loadBuildingFilter();
loadRoomFilter();
loadRoomModal();

render();

});