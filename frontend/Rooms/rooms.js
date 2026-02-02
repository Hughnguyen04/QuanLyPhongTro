const role = localStorage.getItem("role");
if (!role) location.href = "../Login/login.html";

/* ẨN THEO ROLE */
if (role === "nguoithue") {
    location.href = "../Dashboard/dashboard.html";
}

if (role === "nhanvien") {
    document.querySelectorAll(".owner").forEach(e => e.style.display = "none");
}

/* DATA */
let data = [
    {id:"P101",name:"Phòng 101",price:2500000,tenant:"A",phone:"0901",contract:"HD01",status:"Đang thuê"},
    {id:"P102",name:"Phòng 102",price:2300000,status:"Trống"},
    {id:"P201",name:"Phòng 201",price:2800000,status:"Đang sửa"}
];

let edit = -1;

/* STATS */
function updateStats(list){
    total.innerText = list.length;
    trong.innerText = list.filter(r=>r.status==="Trống").length;
    thue.innerText = list.filter(r=>r.status==="Đang thuê").length;
    sua.innerText = list.filter(r=>r.status==="Đang sửa").length;
}

/* RENDER */
function render(){
    tbody.innerHTML = "";
    const k = key.value.toLowerCase();
    const s = status.value;

    const list = data.filter(r =>
        (!k || r.name.toLowerCase().includes(k)) &&
        (!s || r.status === s)
    );

    updateStats(list);

    list.forEach((r,i)=>{
        tbody.innerHTML += `
        <tr>
            <td>${r.id}</td>
            <td>${r.name}</td>
            <td>${r.price?.toLocaleString() || "-"}đ</td>
            <td>${r.tenant||"-"}</td>
            <td>${r.phone||"-"}</td>
            <td>${r.contract||"-"}</td>
            <td>${r.status}</td>
            <td>
                <button onclick="editRoom(${i})">✏️</button>
                ${role==="chutro" ? `<button onclick="del(${i})">🗑</button>` : ""}
            </td>
        </tr>`;
    });
}
render();

/* MODAL */
function openModal(){
    modal.style.display="flex";
    edit=-1;
    id.value=name.value=price.value="";
    st.value="Trống";

    if(role==="nhanvien"){
        id.disabled = true;
        name.disabled = true;
        price.disabled = true;
    }
}

function closeModal(){
    modal.style.display="none";
}

function save(){
    if(role==="nhanvien"){
        data[edit].status = st.value;
    } else {
        const r = {
            id:id.value,
            name:name.value,
            price:+price.value,
            status:st.value
        };
        if(edit===-1) data.push(r);
        else data[edit]={...data[edit],...r};
    }
    closeModal();
    render();
}

function editRoom(i){
    edit=i;
    openModal();
    const r=data[i];
    id.value=r.id;
    name.value=r.name;
    price.value=r.price;
    st.value=r.status;
}

function del(i){
    if(confirm("Xóa phòng?")){
        data.splice(i,1);
        render();
    }
}

function go(p){location.href=p}
function logout(){
    localStorage.clear();
    location.href="../Login/login.html";
}
