document.addEventListener("DOMContentLoaded", () => {

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName") || username;

    if (!username || !token) {
        location.href = "../Login/login.html";
        return;
    }

    // Hiển thị tên
    document.getElementById("username").innerText = fullName;
    document.querySelector(".avatar-text").textContent = fullName.charAt(0).toUpperCase();
    document.getElementById("welcomeName").innerHTML = `Chào ${fullName}!`;

    // ========== RENDER MENU SIDEBAR ==========
    if (typeof renderMenu === 'function') {
        renderMenu("guest");
    }

    // Ngày tháng
    const d = new Date();
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    document.getElementById("today").innerText = `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

    // Lấy dữ liệu
    (async () => {
        try {
            const [roomsRaw, tenantsRaw, billsRaw] = await Promise.all([
                API.getRooms(),
                API.getTenants(),
                API.getBills()
            ]);

            // Xử lý phòng
            let rooms = [];
            if (roomsRaw) {
                if (Array.isArray(roomsRaw)) rooms = roomsRaw;
                else if (roomsRaw.data) rooms = roomsRaw.data;
            }
            const mappedRooms = rooms.map(r => ({
                name: r.RoomName || r.room_name,
                price: Number(r.BasePrice || r.base_price || 0)
            }));

            // Xử lý người thuê - tìm phòng của mình
            let tenants = [];
            if (tenantsRaw) {
                if (Array.isArray(tenantsRaw)) tenants = tenantsRaw;
                else if (tenantsRaw.data) tenants = tenantsRaw.data;
            }
            
            const myTenant = tenants.find(t => (t.FullName || t.full_name) === username);
            const myRoom = mappedRooms.find(r => r.name === (myTenant?.RoomName || myTenant?.room_name));

            // Xử lý hóa đơn
            let bills = [];
            if (billsRaw) {
                if (Array.isArray(billsRaw)) bills = billsRaw;
                else if (billsRaw.data) bills = billsRaw.data;
            }
            
            const myBills = bills.filter(b => (b.RoomName || b.room_name) === myTenant?.RoomName)
                                  .sort((a, b) => {
                                      const ay = a.Year || a.year, am = a.Month || a.month;
                                      const by = b.Year || b.year, bm = b.Month || b.month;
                                      if (ay !== by) return by - ay;
                                      return bm - am;
                                  });
            const latestBill = myBills[0];

            // Hiển thị thông tin phòng
            document.getElementById("myRoom").innerText = myTenant?.RoomName || myTenant?.room_name || "Chưa có";
            document.getElementById("myBuilding").innerText = myTenant?.BuildingName || myTenant?.building_name || "Chưa có";
            document.getElementById("myPrice").innerText = myRoom ? (myRoom.price).toLocaleString() + " đ" : "0đ";

            // Hiển thị hóa đơn
            if (latestBill) {
                const total = Number(latestBill.TotalAmount) || 
                             (Number(latestBill.RoomPrice) + Number(latestBill.ElectricCost) + 
                              Number(latestBill.WaterCost) + Number(latestBill.ServiceFee) + Number(latestBill.LateFee));
                const status = (latestBill.Status || "").toUpperCase();
                let statusText = "⏳ Chưa thanh toán";
                if (status.includes("DA")) statusText = "✅ Đã thanh toán";
                else if (status.includes("QUA")) statusText = "⚠️ Quá hạn";
                
                document.getElementById("myBill").innerText = total.toLocaleString() + " đ";
                document.getElementById("myBillStatus").innerText = statusText;

                // Chi tiết hóa đơn
                document.getElementById("billDetail").innerHTML = `
                    <div class="info-row"><span>🏠 Tiền phòng:</span><span>${(Number(latestBill.RoomPrice) || 0).toLocaleString()} đ</span></div>
                    <div class="info-row"><span>⚡ Tiền điện:</span><span>${(Number(latestBill.ElectricCost) || 0).toLocaleString()} đ</span></div>
                    <div class="info-row"><span>💧 Tiền nước:</span><span>${(Number(latestBill.WaterCost) || 0).toLocaleString()} đ</span></div>
                    <div class="info-row"><span>🛎️ Phí dịch vụ:</span><span>${(Number(latestBill.ServiceFee) || 0).toLocaleString()} đ</span></div>
                    ${latestBill.LateFee > 0 ? `<div class="info-row"><span>⚠️ Phí trễ hạn:</span><span class="late-fee">${(Number(latestBill.LateFee) || 0).toLocaleString()} đ</span></div>` : ''}
                    <div class="info-row total"><span><strong>Tổng tiền:</strong></span><span><strong>${total.toLocaleString()} đ</strong></span></div>
                `;
            } else {
                document.getElementById("myBill").innerText = "0đ";
                document.getElementById("myBillStatus").innerText = "Chưa có hóa đơn";
                document.getElementById("billDetail").innerHTML = '<div class="info-row">Chưa có hóa đơn nào</div>';
            }

            // Việc cần làm
            if (latestBill && latestBill.Status !== "DA_THANH_TOAN") {
                const dueDate = latestBill.DueDate ? new Date(latestBill.DueDate).toLocaleDateString('vi-VN') : "chưa có";
                document.getElementById("todoList").innerHTML = `
                    <li>💰 Thanh toán tiền phòng tháng ${latestBill.Month || latestBill.month}/${latestBill.Year || latestBill.year}</li>
                    <li>⏰ Hạn thanh toán: ${dueDate}</li>
                    <li>📝 Số tiền: ${(Number(latestBill.TotalAmount) || 0).toLocaleString()} đ</li>
                `;
            } else {
                document.getElementById("todoList").innerHTML = "<li>📋 Không có việc cần làm</li>";
            }

            // Thông tin hợp đồng
            document.getElementById("contractInfo").innerHTML = `
                <div class="info-row"><span>📄 Hợp đồng:</span><span>${myTenant?.ContractID || "Chưa có"}</span></div>
                <div class="info-row"><span>📅 Ngày bắt đầu:</span><span>${myTenant?.StartDate ? new Date(myTenant.StartDate).toLocaleDateString('vi-VN') : "Chưa có"}</span></div>
                <div class="info-row"><span>📅 Ngày kết thúc:</span><span>${myTenant?.EndDate ? new Date(myTenant.EndDate).toLocaleDateString('vi-VN') : "Chưa có"}</span></div>
            `;

        } catch (err) {
            console.error(err);
            alert("Lỗi tải dữ liệu");
        }
    })();

    // Fix click avatar
    const userBox = document.querySelector(".user-box");
    const userMenu = document.getElementById("userMenu");
    if (userBox && userMenu) {
        userBox.addEventListener("click", (e) => {
            e.stopPropagation();
            userMenu.classList.toggle("show");
        });
        document.addEventListener("click", () => userMenu.classList.remove("show"));
    }
});

function logout() {
    localStorage.clear();
    location.href = "../Login/login.html";
}