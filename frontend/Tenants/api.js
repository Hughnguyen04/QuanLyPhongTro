const TENANTS_GET_API =
"http://172.20.10.3/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/tenants/read.php";

const TENANTS_CREATE_API =
"http://172.20.10.3/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/tenants/create.php";

const TENANTS_UPDATE_API =
"http://192.168.1.53/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/tenants/update.php";

const TENANTS_DELETE_API =
"http://192.168.1.53/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/tenants/delete.php";


let listTenants = [];


/* LOAD */

async function loadTenants(){

try{

const res = await fetch(TENANTS_GET_API);
const data = await res.json();

listTenants = data;

render();

}catch(err){

console.error("Lỗi load tenants:",err);
alert("Không tải được danh sách người thuê");

}

}


/* SAVE */

async function saveTenant(){

const data = {

FullName: mName.value,
CCCD: mCCCD.value,
Phone: mPhone.value,
Address: mAddress.value,
RoomID: mRoom.value,
Status: mStatus.value

};

try{

if(editingId){

data.TenantID = editingId;

await fetch(TENANTS_UPDATE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(data)
});

}else{

await fetch(TENANTS_CREATE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(data)
});

}

closeModal();
loadTenants();

}catch(err){

console.error(err);
alert("Không lưu được");

}

}


/* DELETE */

async function deleteTenant(id){

if(!confirm("Xóa người thuê "+id+"?")) return;

try{

await fetch(TENANTS_DELETE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({TenantID:id})
});

loadTenants();

}catch(err){

console.error(err);
alert("Không xóa được");

}

}


document.addEventListener("DOMContentLoaded",loadTenants);