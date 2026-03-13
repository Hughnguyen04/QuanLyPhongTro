/* ===== DATA ===== */
const billsData = window.DATA?.bills || [];
const role = localStorage.getItem("role");
const userBuildings = window.DATA?.staffBuildings || [];

/* ===== DOM ===== */
const monthFilter = document.getElementById("monthFilter");
const buildingFilter = document.getElementById("buildingFilter");
const chartTitle = document.getElementById("chartTitle");

/* ===== MONTH ===== */
const months = [...new Set(billsData.map(b => b.month))];
months.forEach(m=>{
  const opt=document.createElement("option");
  opt.value=m;
  opt.textContent=m;
  monthFilter.appendChild(opt);
});

/* ===== BUILDING ===== */
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
    opt.textContent="Tòa "+b;
    buildingFilter.appendChild(opt);
  });
}

/* ===== FILTER ===== */
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

/* ===== SUMMARY ===== */
function renderSummary(){
  const arr=getFilteredBills();

  const rent=arr.reduce((s,b)=>s+b.rent,0);
  const electric=arr.reduce((s,b)=>s+b.electric,0);
  const water=arr.reduce((s,b)=>s+b.water,0);
  const service=arr.reduce((s,b)=>s+b.service,0);
  const revenue=arr.reduce((s,b)=>s+b.total,0);
  const rooms=new Set(arr.map(b=>b.room)).size;

  sumRent.textContent=rent.toLocaleString()+" ₫";
  sumElectric.textContent=electric.toLocaleString()+" ₫";
  sumWater.textContent=water.toLocaleString()+" ₫";
  sumService.textContent=service.toLocaleString()+" ₫";
  sumRevenue.textContent=revenue.toLocaleString()+" ₫";
  sumRooms.textContent=rooms;
}

/* ===== COLORS ===== */
const palette=[
  "#6c63ff","#00b894","#fdcb6e","#e17055",
  "#0984e3","#d63031","#6ab04c","#e84393"
];

/* ===== CHART ===== */
let chart;

function renderChart(){
  const arr=getFilteredBills();

  let labels=[], data=[];
  let isBuilding=false;

  if(role==="chutro" && buildingFilter.value==="all"){
    const map={};
    arr.forEach(b=>{
      map[b.building]=(map[b.building]||0)+b.total;
    });
    labels=Object.keys(map).map(b=>"Tòa "+b);
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
        backgroundColor:labels.map((_,i)=>palette[i%palette.length]),
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
          const index=els[0].index;
          const building=Object.keys(
            arr.reduce((m,b)=>{
              m[b.building]=1;return m;
            },{})
          )[index];
          buildingFilter.value=building;
          renderStats();
        }
      }
    }
  });
}

/* ===== STRUCTURE ===== */
let structureChart;

function renderStructure(){
  const arr=getFilteredBills();

  const rent=arr.reduce((s,b)=>s+b.rent,0);
  const electric=arr.reduce((s,b)=>s+b.electric,0);
  const water=arr.reduce((s,b)=>s+b.water,0);
  const service=arr.reduce((s,b)=>s+b.service,0);

  const values=[rent,electric,water,service];
  const total=values.reduce((a,b)=>a+b,0);

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
        tooltip:{
          callbacks:{
            label:(ctx)=>{
              const val=ctx.raw;
              const pct= total? (val/total*100).toFixed(1):0;
              return `${val.toLocaleString()} ₫ (${pct}%)`;
            }
          }
        },
        legend:{position:"bottom"}
      },
      cutout:"60%"
    }
  });
}

/* ===== ALL ===== */
function renderStats(){
  renderSummary();
  renderChart();
  renderStructure();
}

/* ===== INIT ===== */
renderBuildingOptions();
monthFilter.addEventListener("change",renderStats);
buildingFilter.addEventListener("change",renderStats);
renderStats();