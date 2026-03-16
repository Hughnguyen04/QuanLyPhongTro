const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role) location.href = "../Login/login.html";

document.getElementById("username").innerText = username || "";

renderMenu(role);

let editingId=null;


/* BUILDING FILTER */

function initBuildings(){

const select=document.getElementById("buildingFilter");

const buildings=[...new Set(listContracts.map(c=>c.BuildingName))];

select.innerHTML=`<option value="">Tất cả tòa</option>`;

buildings.forEach(b=>{
select.innerHTML+=`<option value="${b}">${b}</option>`;
});

}


/* STATUS */

function getStatus(c){

const today=new Date();
const end=new Date(c.EndDate);

return end>=today?"Đang hiệu lực":"Hết hạn";

}


/* RENDER */

function render(){

const key=document.getElementById("key").value.toLowerCase();
const building=document.getElementById("buildingFilter").value;

const tbody=document.getElementById("tbody");

tbody.innerHTML="";

let total=0,active=0,expired=0;

listContracts
.filter(c=>
c.TenantName.toLowerCase().includes(key) &&
(building===""||c.BuildingName===building)
)
.forEach(c=>{

const status=getStatus(c);

total++;

if(status==="Đang hiệu lực") active++;
else expired++;

tbody.innerHTML+=`
<tr>
<td>${c.ContractID}</td>
<td>${c.TenantName}</td>
<td>${c.RoomName}</td>
<td>${c.BuildingName}</td>
<td>${c.StartDate}</td>
<td>${c.EndDate}</td>
<td>${Number(c.Rent).toLocaleString()} đ</td>
<td>${Number(c.Deposit).toLocaleString()} đ</td>
<td>${status}</td>
<td>
<button onclick="openEdit('${c.ContractID}')">✏️</button>
${role==="chutro"?`<button onclick="deleteContract('${c.ContractID}')">🗑</button>`:""}
</td>
</tr>
`;
});

document.getElementById("total").innerText=total;
document.getElementById("active").innerText=active;
document.getElementById("expired").innerText=expired;

}


/* CARDS */

function renderCards(){

let total=listContracts.length;
let active=0;
let expired=0;

listContracts.forEach(c=>{

if(getStatus(c)==="Đang hiệu lực") active++;
else expired++;

});

document.getElementById("total").innerText=total;
document.getElementById("active").innerText=active;
document.getElementById("expired").innerText=expired;

}


/* MODAL */

function openAdd(){

editingId=null;

modalTitle.innerText="Thêm hợp đồng";

mTenant.value="";
mRoom.value="";
mBuilding.value="";
mStart.value="";
mEnd.value="";
mRent.value="";
mDeposit.value="";

modal.style.display="flex";

}


function openEdit(id){

const c=listContracts.find(x=>x.ContractID===id);
if(!c)return;

editingId=id;

modalTitle.innerText="Sửa hợp đồng";

mTenant.value=c.TenantName;
mRoom.value=c.RoomName;
mBuilding.value=c.BuildingName;
mStart.value=c.StartDate;
mEnd.value=c.EndDate;
mRent.value=c.Rent;
mDeposit.value=c.Deposit;

modal.style.display="flex";

}


function closeModal(){
modal.style.display="none";
}