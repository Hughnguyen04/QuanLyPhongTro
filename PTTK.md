# PHÂN TÍCH THIẾT KẾ HỆ THỐNG QUẢN LÝ PHÒNG TRỌ

## PHẦN 1. PHÂN TÍCH NGHIỆP VỤ CHI TIẾT

### 1. Xác định tác nhân hệ thống (Actors)

Hệ thống được thiết kế cho hai nhóm người dùng nội bộ với quyền hạn được phân định rõ ràng:

**a. Chủ trọ (Admin - Quản trị viên)**

* Là người sở hữu hệ thống.
* Quyền hạn: Quản lý toàn bộ danh sách dãy trọ, phòng trọ, nhân viên. Xem báo cáo doanh thu tổng hợp toàn hệ thống. Thiết lập đơn giá điện, nước chung.

**b. Quản lý dãy trọ (Staff - Nhân viên)**

* Là người được thuê để vận hành.
* Quyền hạn: Chỉ được thao tác trên dữ liệu của khu vực được phân công. Thực hiện các nghiệp vụ: Lập hợp đồng, ghi chỉ số điện nước, thu tiền.
* Hạn chế: Không được xóa dữ liệu lịch sử quan trọng, không được xem doanh thu của các chi nhánh khác.

### 2. Phân tích nghiệp vụ Quản lý Hợp đồng

Đây là chức năng xương sống của hệ thống, đảm bảo tính pháp lý và quy định chặt chẽ về việc cư trú.

**a. Quy trình vòng đời Hợp đồng (Contract Lifecycle)**
Một hợp đồng sẽ trải qua 4 giai đoạn trạng thái:

* **Giai đoạn 1: Khởi tạo (New/Creation)**
  * Nhân viên chọn phòng có trạng thái Trống.
  * Nhập thông tin người thuê và các điều khoản (giá thuê, ngày bắt đầu, thời hạn, tiền cọc).
  * Hệ thống kiểm tra ràng buộc logic: Phòng phải đang trống mới được tạo hợp đồng.
  * Kết quả: Trạng thái hợp đồng là DANG_HIEU_LUC, trạng thái phòng chuyển sang DANG_THUE.
* **Giai đoạn 2: Duy trì (Active/Maintenance)**
  * Trong suốt quá trình khách ở, hợp đồng là căn cứ để truy xuất giá phòng khi lập hóa đơn.
  * Ràng buộc: Giá thuê phòng được giữ cố định theo hợp đồng đã ký, không thay đổi theo biến động giá thị trường trừ khi có phụ lục điều chỉnh.
* **Giai đoạn 3: Gia hạn (Extension)**
  * Khi hợp đồng sắp hết hạn, nếu khách tiếp tục thuê, nhân viên thực hiện chức năng Gia hạn.
  * Hệ thống cập nhật ngày kết thúc mới. Tại bước này, hệ thống cho phép cập nhật lại giá thuê mới (nếu có thỏa thuận tăng/giảm giá).
* **Giai đoạn 4: Thanh lý (Liquidation/Termination)**
  * Xảy ra khi hết hạn hoặc khách chuyển đi.
  * Hệ thống hỗ trợ tính toán các khoản nợ tồn đọng.
  * Kết quả: Trạng thái hợp đồng chuyển thành DA_KET_THUC, trạng thái phòng được trả về TRONG.

**b. Các quy tắc nghiệp vụ quan trọng**

* **Quy tắc Tiền cọc (Deposit):** Tiền cọc được ghi nhận trong hợp đồng nhưng không tính vào doanh thu tháng. Tiền cọc chỉ được xử lý khi thanh lý: Hoàn trả 100% nếu đúng hạn và không hư hại, hoặc bị khấu trừ nếu vi phạm.
* **Quy tắc Chấm dứt trước hạn:** Nếu khách trả phòng trước ngày kết thúc đã ký, hệ thống cảnh báo vi phạm hợp đồng. Nhân viên có quyền xác nhận "Phạt cọc" (không hoàn lại tiền) hoặc "Hoàn cọc" tùy theo thỏa thuận thực tế.

### 3. Phân tích nghiệp vụ Quản lý Hóa đơn

**a. Quy trình lập hóa đơn hàng tháng**

* **Bước 1 - Chốt số:** Vào ngày quy định, nhân viên nhập chỉ số điện, nước mới cho từng phòng.
* **Bước 2 - Tính toán:** Hệ thống tự động tính tiền dựa trên công thức:
  * Tiền điện = (Số mới tru Số cũ) nhan Đơn giá.
  * Tiền nước = (Số mới tru Số cũ) nhan Đơn giá.
  * Tổng tiền = Tiền điện cong Tiền nước cong Tiền phòng (từ hợp đồng) cong Dịch vụ khác.
* **Bước 3 - Phát hành:** Hóa đơn được tạo với trạng thái CHUA_THU.

**b. Ràng buộc dữ liệu**

* Mỗi hợp đồng chỉ phát sinh tối đa 01 hóa đơn tiền phòng trong một tháng kế toán.
* Chỉ số mới của tháng này phải lớn hơn hoặc bằng chỉ số cũ (là chỉ số mới của tháng trước).

## PHẦN 2. THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE DESIGN)

Dựa trên phân tích nghiệp vụ, cơ sở dữ liệu được thiết kế gồm các bảng (Table) chính sau đây:

### 1. Bảng USERS (Người dùng)

Lưu trữ thông tin đăng nhập và phân quyền.

* **UserID** (Khoa chinh): Mã định danh người dùng.
* **Username** : Tên tài khoản.
* **Password** : Mật khẩu đã mã hóa.
* **Role** : Vai trò (ADMIN hoặc STAFF).
* **IsActive** : Trạng thái hoạt động.

### 2. Bảng ROOMS (Phòng trọ)

Lưu trữ thông tin vật lý của phòng.

* **RoomID** (Khoa chinh): Mã phòng.
* **RoomName** : Số phòng/Tên phòng.
* **BasePrice** : Giá niêm yết hiện tại.
* **Status** : Trạng thái (TRONG, DANG_THUE, BAO_TRI).
* **CurrentElectric** : Chỉ số điện chốt gần nhất.
* **CurrentWater** : Chỉ số nước chốt gần nhất.

### 3. Bảng TENANTS (Người thuê)

Lưu trữ hồ sơ khách hàng.

* **TenantID** (Khoa chinh): Mã khách thuê.
* **FullName** : Họ và tên.
* **CitizenID** : Số Căn cước công dân (Duy nhất).
* **Phone** : Số điện thoại liên lạc.
* **Address** : Địa chỉ thường trú.

### 4. Bảng CONTRACTS (Hợp đồng)

Bảng trung tâm liên kết Người thuê và Phòng, lưu trữ các điều khoản pháp lý.

* **ContractID** (Khoa chinh): Mã hợp đồng.
* **RoomID** (Khoa ngoai): Liên kết đến bảng ROOMS.
* **TenantID** (Khoa ngoai): Liên kết đến bảng TENANTS.
* **StartDate** : Ngày bắt đầu hợp đồng.
* **EndDate** : Ngày kết thúc hợp đồng.
* **RentPrice** : Giá thuê chốt trong hợp đồng (quan trọng để bảo lưu giá cũ).
* **DepositAmount** : Số tiền đặt cọc.
* **Status** : Trạng thái (DANG_HIEU_LUC, DA_KET_THUC, DA_HUY).

### 5. Bảng INVOICES (Hóa đơn)

Lưu trữ công nợ và lịch sử thanh toán.

* **InvoiceID** (Khoa chinh): Mã hóa đơn.
* **ContractID** (Khoa ngoai): Liên kết đến bảng CONTRACTS.
* **BillingMonth** : Tháng thanh toán (Ví dụ: 01/2026).
* **ElectricNew** : Chỉ số điện mới.
* **ElectricOld** : Chỉ số điện cũ.
* **WaterNew** : Chỉ số nước mới.
* **WaterOld** : Chỉ số nước cũ.
* **TotalAmount** : Tổng số tiền thanh toán.
* **PaymentStatus** : Trạng thái (CHUA_THU, DA_THU).
* **PaymentDate** : Ngày thực thu.

### 6. Mô tả mối quan hệ (Relationships)

* **ROOMS - CONTRACTS (1-n):** Một phòng có nhiều hợp đồng (lịch sử), nhưng chỉ có 1 hợp đồng Active tại một thời điểm.
* **TENANTS - CONTRACTS (1-n):** Một người có thể ký nhiều hợp đồng khác nhau.
* **CONTRACTS - INVOICES (1-n):** Một hợp đồng sinh ra nhiều hóa đơn hàng tháng.

## PHẦN 3. KẾT LUẬN

Báo cáo đã trình bày chi tiết quy trình phân tích và thiết kế hệ thống quản lý phòng trọ. Giải pháp thiết kế cơ sở dữ liệu tập trung vào việc xử lý các nghiệp vụ phức tạp như quản lý vòng đời hợp đồng và tính toán hóa đơn tự động.

Mô hình này đảm bảo tính toàn vẹn dữ liệu, phân quyền rõ ràng giữa chủ trọ và nhân viên, đồng thời có khả năng mở rộng để quản lý số lượng phòng lớn trong tương lai. Đây là cơ sở vững chắc để tiến hành giai đoạn lập trình và triển khai ứng dụng thực tế.

# Buổi 2 : Xác Định và Vẽ Cơ Sở Dữ Liệu

## 3. CƠ SỞ DỮ LIỆU

### I. XÁC ĐỊNH CÁC THỰC THỂ (ENTITIES)

Hệ thống bao gồm 7 thực thể chính và 1 thực thể trung gian:

1. **TaiKhoan (Tài Khoản):**
   * **Vai trò:** Quản lý thông tin đăng nhập và phân quyền hệ thống.
   * **Dữ liệu chính:** Tên đăng nhập, mật khẩu, họ tên, vai trò (Chủ trọ, Nhân viên, Người thuê).
2. **PhongTro (Phòng Trọ):**
   * **Vai trò:** Thực thể trung tâm, lưu trữ thông tin về sản phẩm kinh doanh.
   * **Dữ liệu chính:** Tên phòng, giá thuê cơ bản, diện tích, trạng thái hiện tại.
3. **DichVu (Dịch Vụ):**
   * **Vai trò:** Danh mục các dịch vụ cộng thêm (ngoài tiền phòng).
   * **Dữ liệu chính:** Tên dịch vụ (Wifi, Rác...), đơn giá, đơn vị tính.
4. **NguoiThue (Người Thuê):**
   * **Vai trò:** Khách hàng sử dụng dịch vụ.
   * **Dữ liệu chính:** Họ tên, CCCD, quê quán, số điện thoại.
5. **HopDong (Hợp Đồng):**
   * **Vai trò:** Văn bản pháp lý liên kết giữa Phòng trọ và Người thuê.
   * **Dữ liệu chính:** Ngày bắt đầu, ngày kết thúc, tiền cọc, giá thuê chốt tại thời điểm ký.
6. **HoaDon (Hóa Đơn):**
   * **Vai trò:** Chứng từ thanh toán hàng tháng được sinh ra từ Hợp đồng.
   * **Dữ liệu chính:** Chỉ số điện/nước cũ mới, thành tiền từng hạng mục, tổng tiền, trạng thái thanh toán.
7. **ThongBao (Thông Báo):**
   * **Vai trò:** Kênh giao tiếp từ hệ thống đến người dùng.
   * **Dữ liệu chính:** Nội dung thông báo, trạng thái đã xem.
8. **ChiTietDichVu (Chi Tiết Dịch Vụ - Bảng trung gian):**
   * **Vai trò:** Cấu hình dịch vụ cụ thể cho từng phòng (Vì mỗi phòng có thể dùng các dịch vụ khác nhau).

---

### II. XÁC ĐỊNH MỐI QUAN HỆ GIỮA CÁC BẢNG (RELATIONSHIPS)

Dưới đây là phân tích chi tiết các liên kết khóa ngoại (Foreign Key) và bản số (Cardinality):

#### 1. Quan hệ: TaiKhoan - NguoiThue

* **Loại quan hệ:** 1 - 1 (Một - Một) hoặc 1 - 0..1 (Một - Không hoặc Một)
* **Liên kết:** `TaiKhoan.MaTaiKhoan` ↔ `NguoiThue.MaTaiKhoan`
* **Ý nghĩa nghiệp vụ:**
  * Một người thuê *có thể* được cấp 1 tài khoản để đăng nhập vào hệ thống xem hóa đơn.
  * Tuy nhiên, không bắt buộc người thuê nào cũng phải có tài khoản (Quản lý có thể nhập tay thông tin người thuê mà không cần tạo nick).

#### 2. Quan hệ: PhongTro - DichVu (Thông qua bảng trung gian ChiTietDichVu)

* **Loại quan hệ:** N - N (Nhiều - Nhiều)
* **Liên kết:**
  * `PhongTro.MaPhong` ↔ `ChiTietDichVu.MaPhong` (1 - N)
  * `DichVu.MaDichVu` ↔ `ChiTietDichVu.MaDichVu` (1 - N)
* **Ý nghĩa nghiệp vụ:**
  * Một phòng trọ có thể sử dụng nhiều dịch vụ (Ví dụ: Phòng 101 dùng Wifi và Rác).
  * Một dịch vụ có thể áp dụng cho nhiều phòng (Ví dụ: Dịch vụ Wifi áp dụng cho cả dãy trọ).

#### 3. Quan hệ: PhongTro - HopDong

* **Loại quan hệ:** 1 - N (Một - Nhiều)
* **Liên kết:** `PhongTro.MaPhong` ↔ `HopDong.MaPhong`
* **Ý nghĩa nghiệp vụ:**
  * Một phòng trọ theo thời gian sẽ có nhiều hợp đồng (Lịch sử thuê: Năm 2023 ông A thuê, năm 2024 ông B thuê).
  * Tại một thời điểm cụ thể, một phòng chỉ có 1 hợp đồng đang ở trạng thái `HieuLuc`.

#### 4. Quan hệ: NguoiThue - HopDong

* **Loại quan hệ:** 1 - N (Một - Nhiều)
* **Liên kết:** `NguoiThue.MaNguoiThue` ↔ `HopDong.MaNguoiThue`
* **Ý nghĩa nghiệp vụ:**
  * Một khách hàng có thể ký nhiều hợp đồng (Ví dụ: Thuê phòng A, sau đó chuyển sang phòng B ký hợp đồng mới, hoặc gia hạn hợp đồng cũ).
  * Một hợp đồng chỉ thuộc về một người đại diện đứng tên thuê.

#### 5. Quan hệ: HopDong - HoaDon

* **Loại quan hệ:** 1 - N (Một - Nhiều)
* **Liên kết:** `HopDong.MaHopDong` ↔ `HoaDon.MaHopDong`
* **Ý nghĩa nghiệp vụ:**
  * Một hợp đồng thuê dài hạn (ví dụ 12 tháng) sẽ sinh ra 12 hóa đơn thanh toán tiền nhà hàng tháng.
  * Hóa đơn bắt buộc phải gắn với hợp đồng để biết được giá phòng và giá dịch vụ đã thỏa thuận là bao nhiêu.

#### 6. Quan hệ: TaiKhoan - ThongBao

* **Loại quan hệ:** 1 - N (Một - Nhiều)
* **Liên kết:** `TaiKhoan.MaTaiKhoan` ↔ `ThongBao.MaTaiKhoan`
* **Ý nghĩa nghiệp vụ:**
  * Một tài khoản người dùng (Chủ trọ, nhân viên, khách thuê) có thể nhận được nhiều thông báo từ hệ thống.

### III. TỔNG HỢP SƠ ĐỒ LIÊN KẾT (TÓM TẮT)

Để dễ hình dung trong báo cáo, bạn có thể tóm tắt luồng dữ liệu như sau:

> **TaiKhoan** (1) ---- (0..1) **NguoiThue** (1) ---- (N) **HopDong** (1) ---- (N) **HoaDon**
>
> **PhongTro** (1) ---- (N) **HopDong**
>
> **PhongTro** (1) ---- (N) **ChiTietDichVu** (N) ---- (1) **DichVu**

## 3. CƠ SỞ DỮ LIỆU

<p align="center">
  <img src="img/CSDL.jpg" alt="Sơ đồ CSDL" width="700">
</p>
