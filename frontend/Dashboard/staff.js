document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName") || username;
    const buildingManaged = localStorage.getItem("buildingManaged") || "";

    if (!username || !token) {
        location.href = "../Login/login.html";
        return;
    }

    // Hiển thị tên
    document.getElementById("username").innerText = fullName;
    const avatar = document.querySelector(".avatar-text");
    if (avatar) avatar.textContent = fullName.charAt(0).toUpperCase();
    document.getElementById("welcomeName").innerHTML = `Chào ${fullName}!<br><small style="font-size:12px">Quản lý: ${buildingManaged || "Tất cả"}</small>`;

    // Render menu
    if (typeof renderMenu === 'function') {
        renderMenu("staff");
    }

    // Ngày tháng
    const d = new Date();
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    document.getElementById("today").innerText = `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

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

            let mappedRooms = rooms.map(r => ({
                name: r.RoomName || r.room_name,
                building: r.BuildingName || r.building_name || (r.RoomName ? r.RoomName.charAt(0) : ''),
                price: Number(r.BasePrice || r.base_price || 0),
                status: (r.Status || r.status || "TRONG").toUpperCase()
            }));

            if (buildingManaged) {
                mappedRooms = mappedRooms.filter(r => r.building === buildingManaged);
            }

            // Xử lý người thuê
            let tenants = [];
            if (tenantsRaw) {
                if (Array.isArray(tenantsRaw)) tenants = tenantsRaw;
                else if (tenantsRaw.data) tenants = tenantsRaw.data;
            }
            let mappedTenants = tenants.map(t => ({
                name: t.FullName || t.full_name,
                room: t.RoomName || t.room_name,
                building: t.BuildingName || t.building_name
            }));
            if (buildingManaged) {
                mappedTenants = mappedTenants.filter(t => t.building === buildingManaged);
            }

            // Xử lý hóa đơn
            let bills = [];
            if (billsRaw) {
                if (Array.isArray(billsRaw)) bills = billsRaw;
                else if (billsRaw.data) bills = billsRaw.data;
            }
            let mappedBills = bills.map(b => {
                let total = Number(b.TotalAmount) ||
                           (Number(b.RoomPrice) + Number(b.ElectricCost) + Number(b.WaterCost) + Number(b.ServiceFee) + Number(b.LateFee));
                let status = "CHUA_THANH_TOAN";
                const rawStatus = (b.Status || "").toUpperCase();
                if (rawStatus.includes("DA")) status = "DA_THANH_TOAN";
                else if (rawStatus.includes("QUA")) status = "QUA_HAN";
                return {
                    room: b.RoomName || b.room_name,
                    building: b.BuildingName || "",
                    total: total,
                    status: status,
                    tenantName: b.FullName || ""
                };
            });
            if (buildingManaged) {
                mappedBills = mappedBills.filter(b => b.building === buildingManaged);
            }

            // Thống kê
            const totalRooms = mappedRooms.length;
            const rentedRooms = mappedRooms.filter(r => r.status === "DANG_THUE" || r.status === "ACTIVE").length;
            const emptyRooms = mappedRooms.filter(r => r.status === "TRONG" || r.status === "EMPTY").length;
            const totalTenants = mappedTenants.length;
            const unpaidBills = mappedBills.filter(b => b.status === "CHUA_THANH_TOAN" || b.status === "QUA_HAN");

            document.getElementById("tongPhong").innerText = totalRooms;
            document.getElementById("phongThue").innerText = rentedRooms;
            document.getElementById("phongTrong").innerText = emptyRooms;
            document.getElementById("soNguoi").innerText = totalTenants;
            document.getElementById("hoaDonNo").innerText = unpaidBills.length;

            // Phòng trống
            const emptyList = mappedRooms.filter(r => r.status === "TRONG" || r.status === "EMPTY");
            const phongTrongTable = document.getElementById("phongTrongTable");
            if (emptyList.length === 0) {
                phongTrongTable.innerHTML = '<tr><td colspan="2">✅ Không có phòng trống</td></tr>';
            } else {
                phongTrongTable.innerHTML = emptyList.map(r => `
                    <tr><td><b>${r.name}</b></td><td>${r.price.toLocaleString()} đ</td></tr>
                `).join("");
            }

            // Hóa đơn chưa thu
            const grouped = {};
            unpaidBills.forEach(b => {
                if (!grouped[b.room]) grouped[b.room] = { room: b.room, total: 0, tenants: [] };
                grouped[b.room].total += b.total;
                if (b.tenantName && !grouped[b.room].tenants.includes(b.tenantName)) grouped[b.room].tenants.push(b.tenantName);
            });
            const noTable = document.getElementById("noTable");
            const result = Object.values(grouped);
            if (result.length === 0) {
                noTable.innerHTML = '<tr><td colspan="3">✅ Không có hóa đơn chưa thu</td></tr>';
            } else {
                noTable.innerHTML = result.map(r => `
                    <tr><td><b>${r.room}</b></td><td>${r.tenants.join(", ") || "Chưa có"}</td><td style="color:#c62828">${r.total.toLocaleString()} đ</td></tr>
                `).join("");
            }

            // Việc cần làm
            document.getElementById("todoList").innerHTML = `
                <li>💰 Thu ${unpaidBills.length} hóa đơn chưa thanh toán</li>
                <li>🏠 Có ${emptyRooms} phòng trống cần cho thuê</li>
                <li>👥 Quản lý ${totalTenants} người thuê</li>
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