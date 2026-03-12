const username = localStorage.getItem("username");
document.getElementById("username").innerText = username || "";

/* MOCK DATA — sau nối data.js */
const bills = [
    {month:"03/2026", room:"A203", total:3500000, paid:false},
    {month:"02/2026", room:"A203", total:3450000, paid:true},
    {month:"01/2026", room:"A203", total:3400000, paid:true}
];

const list = document.getElementById("billList");

renderBills();

function renderBills(){
    list.innerHTML = "";
    bills.forEach(b=>{
        list.innerHTML += `
        <div class="bill">
            <div class="bill-left">
                <div class="bill-month">Hóa đơn ${b.month}</div>
                <div class="bill-room">Phòng ${b.room}</div>
                <div class="bill-status ${b.paid ? "paid":"unpaid"}">
                    ${b.paid ? "Đã thanh toán":"Chưa thanh toán"}
                </div>
            </div>

            <div class="bill-total">
                ${formatMoney(b.total)}đ
            </div>
        </div>
        `;
    });
}

function formatMoney(n){
    return n.toLocaleString("vi-VN");
}