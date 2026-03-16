const billsData = window.DATA?.bills || [];

const role = localStorage.getItem("role");

const userBuildings = window.DATA?.staffBuildings || [];


const monthFilter = document.getElementById("monthFilter");
const buildingFilter = document.getElementById("buildingFilter");


const sumRooms = document.getElementById("sumRooms");
const sumBills = document.getElementById("sumBills");
const sumRevenue = document.getElementById("sumRevenue");
const sumRent = document.getElementById("sumRent");
const sumElectric = document.getElementById("sumElectric");
const sumWater = document.getElementById("sumWater");
const sumService = document.getElementById("sumService");

const chartTitle = document.getElementById("chartTitle");


/* MONTH */

const months = [...new Set(billsData.map(b=>b.month))];

months.forEach(m=>{
const opt=document.createElement("option");
opt.value=m;
opt.textContent=m;
monthFilter.appendChild(opt);
});


/* BUILDING */

function getAllowedBuildings(){

if(role==="chutro"){
return [...new Set(billsData.map(b=>b.building))];
}

return userBuildings;

}


function renderBuildingOptions(){

const list=getAllowedBuildings();

buildingFilter.innerHTML=`<option value="all">Tất cả tòa</option>`;

list.forEach(b=>{

const opt=document.createElement("option");

opt.value=b;

opt.textContent=b;   // KHÔNG thêm "Tòa "

buildingFilter.appendChild(opt);

});

}


/* FILTER */

function getFilteredBills(){

let arr=billsData.filter(b=>b.month===monthFilter.value);

if(role==="nhanvien"){
arr=arr.filter(b=>userBuildings.includes(b.building));
}

if(buildingFilter.value!=="all"){
arr=arr.filter(b=>b.building===buildingFilter.value);
}

return arr;

}


/* SUMMARY */

function renderSummary(){

const arr=getFilteredBills();

const rent=arr.reduce((s,b)=>s+b.rent,0);
const electric=arr.reduce((s,b)=>s+b.electric,0);
const water=arr.reduce((s,b)=>s+b.water,0);
const service=arr.reduce((s,b)=>s+b.service,0);
const revenue=arr.reduce((s,b)=>s+b.total,0);

const rooms=new Set(arr.map(b=>b.room)).size;
const bills=arr.length;

sumRooms.textContent=rooms;
sumBills.textContent=bills;

sumRent.textContent=rent.toLocaleString()+" ₫";
sumElectric.textContent=electric.toLocaleString()+" ₫";
sumWater.textContent=water.toLocaleString()+" ₫";
sumService.textContent=service.toLocaleString()+" ₫";

sumRevenue.textContent=revenue.toLocaleString()+" ₫";

}


/* CHART */

let chart;

function renderChart(){

const arr=getFilteredBills();

let labels=[];
let data=[];
let isBuilding=false;

if(role==="chutro" && buildingFilter.value==="all"){

const map={};

arr.forEach(b=>{
map[b.building]=(map[b.building]||0)+b.total;
});

labels=Object.keys(map);
data=Object.values(map);

chartTitle.textContent="Doanh thu theo tòa";

isBuilding=true;

}else{

const map={};

arr.forEach(b=>{
map[b.room]=(map[b.room]||0)+b.total;
});

labels=Object.keys(map);
data=Object.values(map);

chartTitle.textContent="Doanh thu theo phòng";

}


if(chart) chart.destroy();

chart=new Chart(document.getElementById("roomChart"),{

type:"bar",

data:{
labels,
datasets:[{
data,
backgroundColor:"#6c63ff",
borderRadius:6
}]
},

options:{
plugins:{
legend:{display:false},
tooltip:{
callbacks:{
label:(ctx)=>ctx.raw.toLocaleString()+" ₫"
}
}
},

onClick:(e,els)=>{

if(!els.length) return;

if(isBuilding){

const building=labels[els[0].index];

buildingFilter.value=building;

renderStats();

}

}

}

});

}


/* STRUCTURE */

let structureChart;

function renderStructure(){

const arr=getFilteredBills();

const rent=arr.reduce((s,b)=>s+b.rent,0);
const electric=arr.reduce((s,b)=>s+b.electric,0);
const water=arr.reduce((s,b)=>s+b.water,0);
const service=arr.reduce((s,b)=>s+b.service,0);

const values=[rent,electric,water,service];

if(structureChart) structureChart.destroy();

structureChart=new Chart(document.getElementById("structureChart"),{

type:"doughnut",

data:{
labels:["Tiền phòng","Điện","Nước","Dịch vụ"],
datasets:[{
data:values,
backgroundColor:["#6c63ff","#00b894","#0984e3","#fdcb6e"]
}]
},

options:{
plugins:{
legend:{position:"bottom"}
},
cutout:"60%"
}

});

}


/* RENDER */

function renderStats(){

renderSummary();
renderChart();
renderStructure();

}


/* INIT */

renderBuildingOptions();

monthFilter.addEventListener("change",renderStats);
buildingFilter.addEventListener("change",renderStats);

renderStats();