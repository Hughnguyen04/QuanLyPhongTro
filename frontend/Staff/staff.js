/* AUTH */
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!role || (role !== "chutro" && role !== "admin")) location.href="../Login/login.html";

document.getElementById("username").innerText = username;
renderMenu(role);

/* MODAL VAR */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");

const mName = document.getElementById("mName");
const mUsername = document.getElementById("mUsername");
const mBuildings = document.getElementById("mBuildings");

let editingId = null;

/* DATA */
let listStaff = [];

/* FETCH STAFF DATA */
async function fetchStaff() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/quanlyphongtro/api/users/staff", {
            headers: {
                "Authorization": token ? `Bearer ${token}` : "",
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Staff API response:", data);

        // API trả về array hoặc object đơn lẻ
        if (Array.isArray(data)) {
            listStaff = data;
        } else if (data) {
            listStaff = [data];
        } else {
            listStaff = [];
        }

        console.log("Loaded staff:", listStaff.length);
        return listStaff;
    } catch (error) {
        console.error("Error fetching staff:", error);
        alert("Lỗi tải dữ liệu nhân viên: " + error.message);
        listStaff = [];
        return [];
    }
}

/* INIT BUILDING */
function initBuildings(){
    const select = document.getElementById("buildingFilter");

    const all = new Set();
    listStaff.forEach(s=>{
        if (s.manageBuilding) all.add(s.manageBuilding);
    });

    select.innerHTML=`<option value="">Tất cả tòa</option>`;
    [...all].forEach(b=>{
        select.innerHTML+=`<option value="${b}">${b}</option>`;
    });
}

/* RENDER */
function render(){
    const key = document.getElementById("key").value.toLowerCase();
    const building = document.getElementById("buildingFilter").value;
    const tbody = document.getElementById("tbody");

    tbody.innerHTML="";
    let total=0;
    let buildCount=0;

    listStaff
    .filter(s =>
        (s.fullName || "").toLowerCase().includes(key) &&
        (building==="" || s.manageBuilding === building)
    )
    .forEach(s=>{
        total++;
        if (s.manageBuilding) buildCount++;

        tbody.innerHTML += `
        <tr>
            <td>${s.userId}</td>
            <td>${s.fullName || ""}</td>
            <td>${s.username}</td>
            <td>${s.manageBuilding || ""}</td>
            <td>${s.active ? "Hoạt động" : "Không hoạt động"}</td>
            <td>
                <button onclick="editStaff('${s.userId}')">✏️</button>
                <button onclick="deleteStaff('${s.userId}')">🗑</button>
            </td>
        </tr>
        `;
    });

    document.getElementById("total").innerText=total;
    document.getElementById("buildCount").innerText=buildCount;
}

/* ADD */
function addStaff(){
    alert("Chức năng thêm nhân viên chưa được hỗ trợ qua API");
}

/* EDIT */
function editStaff(userId){
    alert("Chức năng sửa nhân viên chưa được hỗ trợ qua API");
}

/* CLOSE */
function closeModal(){
    modal.style.display="none";
}

/* SAVE */
function saveStaff(){
    alert("Chức năng lưu nhân viên chưa được hỗ trợ qua API");
}

/* DELETE */
function deleteStaff(userId){
    alert("Chức năng xóa nhân viên chưa được hỗ trợ qua API");
}

/* INIT */
async function init() {
    await fetchStaff();
    initBuildings();
    render();
}

document.addEventListener("DOMContentLoaded", init);