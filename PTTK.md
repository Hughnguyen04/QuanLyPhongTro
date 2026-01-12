# Buổi 1

# QUẢN LÝ PHÒNG TRỌ

**Quản lý Phòng và người thuê**

## **1. Mục tiêu chức năng**

Chức năng Quản lý phòng & người thuê nhằm hỗ trợ Chủ trọ và Nhân viên quản lý trong việc theo dõi, cập nhật và quản lý đầy đủ thông tin nghiệp vụ liên quan đến phòng trọ và người thuê, bao gồm  đặc điểm phòng, tình trạng sử dụng, lịch sử thuê và tình trạng hợp đồng .

Bên cạnh đó, chức năng này cũng hỗ trợ Người thuê phòng trong việc  tra cứu thông tin liên quan đến phòng đang thuê, hợp đồng thuê và tình trạng thanh toán .

Trong đó, Chủ trọ có quyền giám sát toàn bộ hệ thống phòng trọ, bao gồm cả những phòng và dãy trọ do  Nhân viên quản lý phụ trách , nhằm đảm bảo việc quản lý được thống nhất và minh bạch.

## **2. Phạm vi chức năng**

Chức năng Quản lý phòng & người thuê bao gồm:

* Quản lý thông tin chi tiết phòng trọ
* Quản lý thông tin người thuê và lịch sử thuê phòng
* Theo dõi tình trạng sử dụng phòng và số người ở
* Phân công nhân viên quản lý dãy trọ
* Cho phép  Chủ trọ xem toàn bộ phòng trọ , không phụ thuộc phạm vi quản lý của nhân viên
* Theo dõi tình trạng vi phạm hợp đồng thuê (nếu có)
* Cho phép Người thuê tra cứu thông tin cá nhân liên quan đến việc thuê phòng

## 3. Các đối tượng nghiệp vụ

### **3.1. Chủ trọ**

* Là người sở hữu một hoặc nhiều dãy trọ
* Có quyền xem, giám sát toàn bộ:
  * Dãy trọ
  * Phòng trọ
  * Người thuê
  * Lịch sử thuê phòng
* Có quyền phân công nhân viên quản lý dãy trọ

### **3.2. Nhân viên quản lý**

* Được phân công quản lý một hoặc nhiều dãy trọ
* Có quyền:
  * Cập nhật thông tin phòng
  * Cập nhật thông tin người thuê
  * Theo dõi tình trạng phòng và số người ở
* Chỉ thao tác trong phạm vi dãy trọ được phân công

### **3.3. Người thuê**

* Là đối tượng thuê phòng trọ
* Được cấp tài khoản để truy cập hệ thống
* Có quyền:
  * Xem thông tin phòng đang thuê
  * Xem thông tin hợp đồng thuê
  * Xem tình trạng thanh toán và hóa đơn (nếu có)
  * Nhận thông báo từ hệ thống
* Không có quyền thực hiện các thao tác quản lý dữ liệu

### **3.4. Dãy trọ**

* Thuộc quyền sở hữu của Chủ trọ
* Gồm nhiều phòng trọ
* Có thể được phân công cho một hoặc nhiều nhân viên quản lý

### **3.5. Phòng trọ**

* Thuộc về một dãy trọ
* Có các thông tin nghiệp vụ:
  * Loại phòng
  * Diện tích
  * Giá thuê
  * Số người ở tối đa
  * Trạng thái phòng

**Trạng thái phòng:**

* Trống
* Đang thuê

## **4. Nội dung quản lý**

### **4.1. Quản lý thông tin phòng**

**Thông tin phòng bao gồm:**

* Mã phòng
* Loại phòng
* Diện tích
* Giá thuê
* Số người ở tối đa
* Trạng thái phòng *(Trống / Đang thuê)*
* Nhân viên quản lý phụ trách

**Nghiệp vụ quản lý phòng:**

* Thêm mới phòng
* Cập nhật thông tin phòng
* Theo dõi trạng thái sử dụng phòng
* Theo dõi số người đang ở trong phòng
* Gán phòng vào dãy trọ
* Phân công nhân viên quản lý dãy trọ

### **4.2. Quản lý thông tin người thuê**

**Thông tin người thuê bao gồm:**

* Họ tên
* Căn cước công dân (CCCD)
* Số điện thoại
* Phòng đang thuê
* Trạng thái thuê *(đang thuê / đã trả phòng)*

**Nghiệp vụ quản lý người thuê:**

* Thêm mới người thuê
* Cập nhật thông tin người thuê
* Gán người thuê vào phòng thông qua hợp đồng
* Theo dõi lịch sử thuê phòng của người thuê

### **4.3. Theo dõi lịch sử thuê và vi phạm hợp đồng**

* Lưu lại lịch sử các lần thuê phòng của người thuê
* Theo dõi tình trạng:
  * Vi phạm hợp đồng (nếu có)
  * Quá hạn hợp đồng
* Hỗ trợ Chủ trọ và Nhân viên quản lý trong việc kiểm soát rủi ro

## **5. Quan hệ nghiệp vụ**

* Một Chủ trọ sở hữu nhiều Dãy trọ
* Một Dãy trọ gồm nhiều Phòng trọ
* Một Dãy trọ có thể được quản lý bởi một hoặc nhiều Nhân viên
* Một Phòng trọ có thể có nhiều Người thuê
* Một Người thuê có thể có lịch sử thuê nhiều phòng
* Chủ trọ có quyền xem tất cả phòng , kể cả phòng do nhân viên quản lý
* Người thuê chỉ được xem thông tin liên quan đến phòng và hợp đồng của chính mình

## **6. Quy trình nghiệp vụ trọng tâm**

### **Chủ trọ xem phòng do Nhân viên quản lý phụ trách**

1. Chủ trọ chọn chức năng Quản lý phòng & người thuê
2. Hệ thống hiển thị danh sách các dãy trọ
3. Chủ trọ chọn một dãy trọ
4. Hệ thống hiển thị:
   * Danh sách phòng
   * Loại phòng, diện tích, giá thuê
   * Trạng thái phòng
   * Số người đang ở
   * Nhân viên quản lý phụ trách
5. Chủ trọ chọn phòng để xem:
   * Danh sách người thuê
   * Lịch sử thuê phòng
   * Tình trạng hợp đồng (nếu có)

## **7. Quy tắc nghiệp vụ**

* Phòng chỉ được cho thuê khi trạng thái là Trống
* Số người ở không được vượt quá số người tối đa của phòng
* Người thuê bắt buộc gắn với phòng thông qua hợp đồng
* Một phòng có thể có nhiều người thuê
* Nhân viên quản lý chỉ thao tác trên dãy trọ được phân công
* Chủ trọ luôn có quyền xem các phòng do nhân viên quản lý
* Người thuê có tài khoản nhưng chỉ được phép tra cứu thông tin, không được thao tác quản lý

# Buổi 2 : Xác định biểu đồ class

# 1. Xác định các lớp nghiệp vụ chính

Từ mô tả bài toán, hệ thống cần các  **nhóm lớp sau** :

## Nhóm người dùng & phân quyền

* **TaiKhoan**
* **VaiTro**

## Nhóm quản lý phòng trọ

* **Phong**
* **DichVu**
* **ChiPhiDichVu**

## Nhóm người thuê & hợp đồng

* **NguoiThue**
* **HopDong**

## Nhóm hóa đơn & chi phí

* **HoaDon**
* **ChiTietHoaDon**

## Nhóm thống kê & thông báo

* **BaoCao**
* **ThongBao**

# 2. Mô tả các lớp

## 2.1. TaiKhoan

**Thuộc tính**

* maTaiKhoan
* tenDangNhap
* matKhau
* trangThai

**Phương thức**

* dangNhap()
* dangXuat()

## 2.2. VaiTro

**Thuộc tính**

* maVaiTro
* tenVaiTro *(Chủ trọ / Nhân viên / Người thuê)*

## 2.3. Phong

**Thuộc tính**

* maPhong
* tenPhong
* dienTich
* giaThue
* trangThai *(Trống / Đang thuê)*

**Phương thức**

* capNhatThongTin()
* capNhatTrangThai()

## 2.4. DichVu

**Thuộc tính**

* maDichVu
* tenDichVu
* donGia

## 2.5. ChiPhiDichVu

**Thuộc tính**

* soLuong
* thanhTien

## 2.6. NguoiThue

**Thuộc tính**

* maNguoiThue
* hoTen
* soDienThoai
* cccd

## 2.7. HopDong

**Thuộc tính**

* maHopDong
* ngayBatDau
* ngayKetThuc
* tienCoc
* giaThueApDung
* trangThai *(Còn hiệu lực / Hết hạn / Đã kết thúc)*

**Phương thức**

* kiemTraHieuLuc()

## 2.8. HoaDon

**Thuộc tính**

* maHoaDon
* thang
* tongTien
* trangThaiThanhToan

**Phương thức**

* tinhTongTien()

## 2.9. ChiTietHoaDon

**Thuộc tính**

* loaiChiPhi *(điện / nước / dịch vụ)*
* chiSoCu
* chiSoMoi
* donGia
* thanhTien

## 2.10. BaoCao

**Thuộc tính**

* thang
* tongDoanhThu
* soPhongDangThue
* soPhongTrong

**Phương thức**

* thongKeDoanhThu()
* thongKePhong()

## 2.11. ThongBao

**Thuộc tính**

* maThongBao
* noiDung
* ngayGui

**Phương thức**

* guiThongBao()

# Biểu đồ class

<p align="center">
  <img src="class.jpg" alt="Biểu đồ class" width="500">
</p>
