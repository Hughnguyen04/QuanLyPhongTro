/* ================= BUILDINGS ================= */
const buildings = [
  { id: "B1", name: "Tòa 1", address: "Bắc Từ Liêm" },
  { id: "B2", name: "Tòa 2", address: "Bắc Từ Liêm" },
  { id: "B3", name: "Tòa 3", address: "Cầu Giấy" },
  { id: "B4", name: "Tòa 4", address: "Nam Từ Liêm" },
  { id: "B5", name: "Tòa 5", address: "Nam Từ Liêm" }
]; 



/* ================= ROOMS ================= */
const rooms = [
  { id: "R101", name: "Phòng 101", building: "Tòa 1", price: 3000000, status: "Đang thuê" },
  { id: "R102", name: "Phòng 102", building: "Tòa 1", price: 3200000, status: "Đang thuê" },
  { id: "R103", name: "Phòng 103", building: "Tòa 1", price: 2800000, status: "Trống" },
  { id: "R104", name: "Phòng 104", building: "Tòa 1", price: 3000000, status: "Đang thuê" },

  { id: "R201", name: "Phòng 201", building: "Tòa 2", price: 3500000, status: "Đang thuê" },
  { id: "R202", name: "Phòng 202", building: "Tòa 2", price: 3300000, status: "Trống" },
  { id: "R203", name: "Phòng 203", building: "Tòa 2", price: 3400000, status: "Đang thuê" },
  { id: "R204", name: "Phòng 204", building: "Tòa 2", price: 3600000, status: "Đang thuê" },

  { id: "R301", name: "Phòng 301", building: "Tòa 3", price: 3000000, status: "Đang thuê" },
  { id: "R302", name: "Phòng 302", building: "Tòa 3", price: 3100000, status: "Trống" },
  { id: "R303", name: "Phòng 303", building: "Tòa 3", price: 3200000, status: "Đang thuê" },
  { id: "R304", name: "Phòng 304", building: "Tòa 3", price: 3300000, status: "Đang thuê" },

  { id: "R401", name: "Phòng 401", building: "Tòa 4", price: 2800000, status: "Trống" },
  { id: "R402", name: "Phòng 402", building: "Tòa 4", price: 2900000, status: "Đang thuê" },
  { id: "R403", name: "Phòng 403", building: "Tòa 4", price: 3000000, status: "Đang thuê" },
  { id: "R404", name: "Phòng 404", building: "Tòa 4", price: 3100000, status: "Đang thuê" },

  { id: "R501", name: "Phòng 501", building: "Tòa 5", price: 2700000, status: "Đang thuê" },
  { id: "R502", name: "Phòng 502", building: "Tòa 5", price: 2600000, status: "Trống" },
  { id: "R503", name: "Phòng 503", building: "Tòa 5", price: 2800000, status: "Đang thuê" },
  { id: "R504", name: "Phòng 504", building: "Tòa 5", price: 2900000, status: "Đang thuê" }
];


/* ================= TENANTS (30 NGƯỜI) ================= */
const tenants = [
  {id:"T001",name:"Nguyễn Văn A",cccd:"001111111111",address:"Bắc Từ Liêm, Hà Nội",room:"Phòng 101",building:"Tòa 1",phone:"0901111111",status:"Đang thuê"},
  {id:"T002",name:"Trần Thị B",cccd:"001111111112",address:"Cầu Giấy, Hà Nội",room:"Phòng 102",building:"Tòa 1",phone:"0902222222",status:"Đang thuê"},
  {id:"T003",name:"Lê Văn C",cccd:"001111111113",address:"Nam Từ Liêm, Hà Nội",room:"Phòng 103",building:"Tòa 1",phone:"0903333333",status:"Đã rời"},
  {id:"T004",name:"Phạm Thị D",cccd:"001111111114",address:"Đông Anh, Hà Nội",room:"Phòng 104",building:"Tòa 1",phone:"0904444444",status:"Đang thuê"},
  {id:"T005",name:"Hoàng Văn E",cccd:"001111111115",address:"Bắc Từ Liêm, Hà Nội",room:"Phòng 201",building:"Tòa 2",phone:"0905555555",status:"Đang thuê"},
  {id:"T006",name:"Đặng Thị F",cccd:"001111111116",address:"Hà Đông, Hà Nội",room:"Phòng 202",building:"Tòa 2",phone:"0906666666",status:"Đã rời"},
  {id:"T007",name:"Bùi Văn G",cccd:"001111111117",address:"Thanh Xuân, Hà Nội",room:"Phòng 203",building:"Tòa 2",phone:"0907777777",status:"Đang thuê"},
  {id:"T008",name:"Đỗ Thị H",cccd:"001111111118",address:"Hoài Đức, Hà Nội",room:"Phòng 204",building:"Tòa 2",phone:"0908888888",status:"Đang thuê"},
  {id:"T009",name:"Võ Văn I",cccd:"001111111119",address:"Cầu Giấy, Hà Nội",room:"Phòng 301",building:"Tòa 3",phone:"0909999999",status:"Đang thuê"},
  {id:"T010",name:"Lý Thị K",cccd:"001111111120",address:"Bắc Giang",room:"Phòng 302",building:"Tòa 3",phone:"0911111111",status:"Đã rời"},

  {id:"T011",name:"Phan Văn L",cccd:"001111111121",address:"Nam Định",room:"Phòng 303",building:"Tòa 3",phone:"0912222222",status:"Đang thuê"},
  {id:"T012",name:"Huỳnh Thị M",cccd:"001111111122",address:"Thái Bình",room:"Phòng 304",building:"Tòa 3",phone:"0913333333",status:"Đang thuê"},
  {id:"T013",name:"Trịnh Văn N",cccd:"001111111123",address:"Hải Dương",room:"Phòng 401",building:"Tòa 4",phone:"0914444444",status:"Đã rời"},
  {id:"T014",name:"Cao Thị O",cccd:"001111111124",address:"Hưng Yên",room:"Phòng 402",building:"Tòa 4",phone:"0915555555",status:"Đang thuê"},
  {id:"T015",name:"Mai Văn P",cccd:"001111111125",address:"Bắc Ninh",room:"Phòng 403",building:"Tòa 4",phone:"0916666666",status:"Đang thuê"},
  {id:"T016",name:"Tạ Thị Q",cccd:"001111111126",address:"Vĩnh Phúc",room:"Phòng 404",building:"Tòa 4",phone:"0917777777",status:"Đang thuê"},
  {id:"T017",name:"Hồ Văn R",cccd:"001111111127",address:"Thanh Hóa",room:"Phòng 501",building:"Tòa 5",phone:"0918888888",status:"Đang thuê"},
  {id:"T018",name:"Châu Thị S",cccd:"001111111128",address:"Nghệ An",room:"Phòng 502",building:"Tòa 5",phone:"0919999999",status:"Đã rời"},
  {id:"T019",name:"Quách Văn T",cccd:"001111111129",address:"Hà Tĩnh",room:"Phòng 503",building:"Tòa 5",phone:"0921111111",status:"Đang thuê"},
  {id:"T020",name:"La Thị U",cccd:"001111111130",address:"Quảng Bình",room:"Phòng 504",building:"Tòa 5",phone:"0922222222",status:"Đang thuê"},

  {id:"T021",name:"Ngô Văn V",cccd:"001111111131",address:"Bắc Từ Liêm, Hà Nội",room:"Phòng 101",building:"Tòa 1",phone:"0923333333",status:"Đang thuê"},
  {id:"T022",name:"Kiều Thị W",cccd:"001111111132",address:"Cầu Giấy, Hà Nội",room:"Phòng 102",building:"Tòa 1",phone:"0924444444",status:"Đang thuê"},
  {id:"T023",name:"Tôn Văn X",cccd:"001111111133",address:"Nam Từ Liêm, Hà Nội",room:"Phòng 201",building:"Tòa 2",phone:"0925555555",status:"Đang thuê"},
  {id:"T024",name:"Đoàn Thị Y",cccd:"001111111134",address:"Đông Anh, Hà Nội",room:"Phòng 203",building:"Tòa 2",phone:"0926666666",status:"Đang thuê"},
  {id:"T025",name:"Lâm Văn Z",cccd:"001111111135",address:"Gia Lâm, Hà Nội",room:"Phòng 204",building:"Tòa 2",phone:"0927777777",status:"Đang thuê"},
  {id:"T026",name:"Thái Thị AA",cccd:"001111111136",address:"Hà Đông, Hà Nội",room:"Phòng 303",building:"Tòa 3",phone:"0928888888",status:"Đang thuê"},
  {id:"T027",name:"Hà Văn AB",cccd:"001111111137",address:"Thanh Xuân, Hà Nội",room:"Phòng 304",building:"Tòa 3",phone:"0929999999",status:"Đang thuê"},
  {id:"T028",name:"Chung Thị AC",cccd:"001111111138",address:"Hoài Đức, Hà Nội",room:"Phòng 402",building:"Tòa 4",phone:"0931111111",status:"Đang thuê"},
  {id:"T029",name:"Vương Văn AD",cccd:"001111111139",address:"Bắc Ninh",room:"Phòng 403",building:"Tòa 4",phone:"0932222222",status:"Đang thuê"},
  {id:"T030",name:"Trương Thị AE",cccd:"001111111140",address:"Hải Dương",room:"Phòng 503",building:"Tòa 5",phone:"0933333333",status:"Đang thuê"}
];
/* ================= CONTRACTS ================= */
const contracts = tenants
  .filter(t => t.status === "Đang thuê")
  .map((t,i)=>({
    id:"C"+(i+1).toString().padStart(3,"0"),
    tenantId:t.id,
    tenantName:t.name,
    room:t.room,
    building:t.building,
    start:"2025-01-01",
    end:"2025-12-31",
    deposit:2000000
  }));


/* ================= METERS (THEO PHÒNG) ================= */
const activeRooms = rooms.filter(r => r.status === "Đang thuê");

const meters = activeRooms.map((r,i)=>({
  id:"M"+(i+1).toString().padStart(3,"0"),
  room:r.name,
  building:r.building,
  month:"2025-01",
  electricOld:0,
  electricNew:0,
  waterOld:0,
  waterNew:0
}));


/* ================= BILLS ================= */
const ELECTRIC_PRICE = 3500;
const WATER_PRICE = 15000;
const SERVICE_PER_PERSON = 100000;

const bills = rooms
  .filter(r=>r.status==="Đang thuê")
  .map((r,i)=>{

    const people = tenants.filter(t=>t.room===r.name && t.status==="Đang thuê").length;

    const m = meters.find(x=>x.room===r.name && x.building===r.building);

    const electric = m ? (m.electricNew-m.electricOld)*ELECTRIC_PRICE : 0;
    const water = m ? (m.waterNew-m.waterOld)*WATER_PRICE : 0;
    const service = people * SERVICE_PER_PERSON;

    return {
      id:"B"+(i+1).toString().padStart(3,"0"),
      room:r.name,
      building:r.building,
      month:"2025-01",
      people,
      rent:r.price,
      electric,
      water,
      service,
      total:r.price+electric+water+service,
      status:"Chưa thanh toán"
    };
});


/* ================= ACCOUNTS ================= */
const accounts = [
  {id:"A001",username:"chutro",password:"123",role:"chutro",name:"Đỗ Duy Tiến"},

  {id:"A002",username:"nv1",password:"123",role:"nhanvien",name:"Trịnh Đắc Vụ",buildings:["Tòa 1","Tòa 2"]},
  {id:"A003",username:"nv2",password:"123",role:"nhanvien",name:"Nguyễn Như Thành Danh",buildings:["Tòa 3"]},
  {id:"A004",username:"nv3",password:"123",role:"nhanvien",name:"Nguyễn Quang Huy",buildings:["Tòa 5","Tòa 4"]},
  {id:"AT001",username:"t1",password:"123",role:"nguoithue",name:"Nguyễn Văn A",room:"Phòng 101",building:"Tòa 1",tenantId:"T001"},
  {id:"AT002",username:"t2",password:"123",role:"nguoithue",name:"Võ Văn I",room:"Phòng 301",building:"Tòa 3",tenantId:"T009"},
  {id:"AT003",username:"t3",password:"123",role:"nguoithue",name:"Châu Thị S",room:"Phòng 502",building:"Tòa 5",tenantId:"T018"}
];
window.DATA = {
  buildings,
  rooms,
  tenants,
  contracts,
  meters,
  bills,
  accounts
};
