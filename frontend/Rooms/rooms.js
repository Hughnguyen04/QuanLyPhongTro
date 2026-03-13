const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";

renderMenu(role);

let editingId = null;


/* ================= RENDER ================= */

function render(){

const key = document.getElementById("key").value.toLowerCase();
const st = document.getElementById("status").value;
const building = document.getElementById("buildingFilter").value;

const tbody = document.getElementById("tbody");

let total=0,thue=0,trong=0,sua=0;

tbody.innerHTML="";

listRooms
.filter(r =>

r.RoomName.toLowerCase().includes(key)

&& (st==="" || mapStatus(r.Status)===st)

&& (building==="" || r.BuildingID===building)

)

.forEach(r=>{

const statusText = mapStatus(r.Status);

total++;

if(statusText==="Đang thuê") thue++;
if(statusText==="Trống") trong++;
if(statusText==="Đang sửa") sua++;

tbody.innerHTML += `
<tr>
<td>${r.RoomID}</td>
<td>${r.RoomName}</td>
<td>${r.BuildingID}</td>
<td>${Number(r.BasePrice).toLocaleString()} đ</td>
<td>${statusText}</td>
<td>
<button onclick="openEditRoom('${r.RoomID}')">✏️</button>
<button onclick="deleteRoom('${r.RoomID}')">🗑</button>
</td>
</tr>
`;

});

document.getElementById("total").innerText = total;
document.getElementById("thue").innerText = thue;
document.getElementById("trong").innerText = trong;
document.getElementById("sua").innerText = sua;

}


/* ================= CARD ================= */

function renderCards(){

let total=listRooms.length;
let thue=0,trong=0,sua=0;

listRooms.forEach(r=>{

if(r.Status==="DANG_THUE") thue++;
if(r.Status==="TRONG") trong++;
if(r.Status==="DANG_SUA") sua++;

});

document.getElementById("total").innerText=total;
document.getElementById("thue").innerText=thue;
document.getElementById("trong").innerText=trong;
document.getElementById("sua").innerText=sua;

}


/* ================= STATUS ================= */

function mapStatus(status){

if(status==="TRONG") return "Trống";
if(status==="DANG_THUE") return "Đang thuê";
if(status==="DANG_SUA") return "Đang sửa";

return status;

}


/* ================= MODAL ================= */

function openAddRoom(){

editingId=null;

modalTitle.innerText="Thêm phòng";

mRoomName.value="";
mPrice.value="";
mStatus.value="TRONG";
mBuilding.value="B1";

modal.style.display="flex";

}


function openEditRoom(id){

const r=listRooms.find(x=>x.RoomID===id);

editingId=id;

modalTitle.innerText="Sửa phòng";

mRoomName.value=r.RoomName;
mPrice.value=r.BasePrice;
mStatus.value=r.Status;
mBuilding.value=r.BuildingID;

modal.style.display="flex";

}


function closeModal(){
modal.style.display="none";
}