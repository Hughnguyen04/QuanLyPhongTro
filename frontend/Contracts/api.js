const CONTRACTS_GET_API =
"http://172.20.10.3/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/contracts/read.php"
const CONTRACTS_CREATE_API =
"http://172.20.10.3/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/contracts/create.php";

const CONTRACTS_UPDATE_API =
"http://192.168.1.53/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/contracts/update.php";

const CONTRACTS_DELETE_API =
"http://192.168.1.53/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/contracts/delete.php";

let listContracts=[];


/* LOAD */

async function loadContracts(){

try{

const res=await fetch(CONTRACTS_GET_API);
const data=await res.json();

listContracts=data;

initBuildings();
render();
renderCards();

}catch(err){

console.error(err);
alert("Không tải được hợp đồng");

}

}


/* SAVE */

async function saveContract(){

const data={
TenantName:mTenant.value,
RoomName:mRoom.value,
BuildingName:mBuilding.value,
StartDate:mStart.value,
EndDate:mEnd.value,
Rent:mRent.value,
Deposit:mDeposit.value
};

try{

if(editingId){

data.ContractID=editingId;

await fetch(CONTRACTS_UPDATE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(data)
});

}else{

await fetch(CONTRACTS_CREATE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(data)
});

}

closeModal();
loadContracts();

}catch(err){

console.error(err);
alert("Lỗi lưu hợp đồng");

}

}


/* DELETE */

async function deleteContract(id){

if(!confirm("Xóa hợp đồng "+id+"?"))return;

try{

await fetch(CONTRACTS_DELETE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({ContractID:id})
});

loadContracts();

}catch(err){

console.error(err);
alert("Không xóa được");

}

}


document.addEventListener("DOMContentLoaded",loadContracts);