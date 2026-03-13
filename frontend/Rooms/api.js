const ROOMS_GET_API =
"http://172.20.10.3/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/rooms/read.php";

const ROOMS_CREATE_API =
"http://172.20.10.3/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/rooms/create.php";

const ROOMS_UPDATE_API =
"http://192.168.1.53/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/rooms/update.php";

const ROOMS_DELETE_API =
"http://192.168.1.53/chuyên%20đề/QuanLyPhongTro/backend/backend-php/api/rooms/delete.php";

let listRooms=[];


/* LOAD */

async function loadRooms(){

try{

const res=await fetch(ROOMS_GET_API);
const data=await res.json();

listRooms=data;

render();
renderCards();

}catch(err){

console.error("Lỗi load phòng:",err);
alert("Không tải được phòng");

}

}


/* SAVE */

async function saveRoom(){

const data={
RoomName:mRoomName.value,
BasePrice:mPrice.value,
Status:mStatus.value
};

try{

if(editingId){

data.RoomID=editingId;

await fetch(ROOMS_UPDATE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(data)
});

}else{

await fetch(ROOMS_CREATE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(data)
});

}

closeModal();
loadRooms();

}catch(err){

console.error(err);
alert("Lỗi lưu phòng");

}

}


/* DELETE */

async function deleteRoom(id){

if(!confirm("Xóa phòng "+id+"?")) return;

try{

await fetch(ROOMS_DELETE_API,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({RoomID:id})
});

loadRooms();

}catch(err){

console.error(err);
alert("Không xóa được");

}

}


document.addEventListener("DOMContentLoaded",loadRooms);