# QUẢN LÝ PHÒNG TRỌ


## 1. Mục tiêu chức năng

Chức năng Quản lý phòng & người thuê nhằm hỗ trợ Chủ trọ và Nhân viên quản lý trong việc theo dõi, cập nhật và quản lý thông tin phòng trọ và người thuê  ở mức nghiệp vụ .

Trong đó,  Chủ trọ có quyền giám sát toàn bộ các phòng trọ , bao gồm cả những phòng do Nhân viên quản lý phụ trách.

## 2. Phạm vi chức năng

* Quản lý thông tin phòng trọ
* Quản lý thông tin người thuê
* Phân công nhân viên quản lý dãy trọ
* Cho phép Chủ trọ xem toàn bộ phòng trọ , không phụ thuộc vào phạm vi quản lý của nhân viên
* Không quản lý tài khoản đăng nhập

## 3. Các đối tượng nghiệp vụ

### 3.1. Chủ trọ

* Là người sở hữu các dãy trọ
* Có quyền xem toàn bộ phòng và người thuê

### 3.2. Nhân viên quản lý

* Được phân công quản lý một hoặc nhiều dãy trọ
* Cập nhật thông tin phòng và người thuê trong phạm vi được giao

### 3.3. Dãy trọ

* Thuộc quyền sở hữu của Chủ trọ
* Gồm nhiều phòng trọ

### 3.4. Phòng trọ

* Thuộc về một dãy trọ
* Có trạng thái: Trống / Đang thuê

### 3.5. Người thuê

* Là đối tượng nghiệp vụ
* Gắn với phòng thông qua hợp đồng thuê

## 4. Nội dung quản lý

### 4.1. Quản lý thông tin phòng

Thông tin phòng bao gồm:

* Mã phòng
* Giá thuê
* Trạng thái phòng (Trống / Đang thuê)

Nghiệp vụ:

* Thêm, cập nhật phòng
* Theo dõi trạng thái phòng
* Gán phòng vào dãy trọ
* Phân công nhân viên quản lý dãy trọ

### 4.2. Quản lý thông tin người thuê

Thông tin người thuê:

* Họ tên
* CCCD
* Số điện thoại

Nghiệp vụ:

* Thêm, cập nhật người thuê
* Gán người thuê vào phòng thông qua hợp đồng

## 5. Quan hệ nghiệp vụ

* Một Chủ trọ sở hữu nhiều dãy trọ
* Một dãy trọ gồm nhiều phòng
* Một dãy trọ có thể được một hoặc nhiều nhân viên quản lý
* Một phòng có thể có nhiều người thuê
* Chủ trọ có quyền  xem tất cả phòng , kể cả phòng do nhân viên quản lý

## 6. Quy trình nghiệp vụ trọng tâm

### Chủ trọ xem phòng do Nhân viên quản lý phụ trách

1. Chủ trọ chọn chức năng Quản lý phòng
2. Hệ thống hiển thị danh sách dãy trọ
3. Chủ trọ chọn một dãy trọ
4. Hệ thống hiển thị:
   * Danh sách phòng
   * Trạng thái từng phòng
   * Nhân viên quản lý phụ trách
5. Chủ trọ xem chi tiết phòng và người thuê (nếu cần)

## 7. Quy tắc nghiệp vụ

* Phòng chỉ được cho thuê khi trạng thái là Trống
* Một phòng có thể có nhiều người thuê
* Người thuê bắt buộc gắn với phòng thông qua hợp đồng
* Nhân viên quản lý chỉ thao tác trên dãy trọ được phân công
* Chủ trọ luôn có quyền xem các phòng do nhân viên quản lý
* Không tồn tại khái niệm tài khoản người thuê
