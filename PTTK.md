# QuanLyPhongTro

# THỐNG KÊ & BÁO CÁO

## 1. Mục tiêu chức năng

Chức năng Thống kê & Báo cáo được xây dựng nhằm hỗ trợ chủ trọ và nhân viên quản lý  theo dõi, tổng hợp và nắm bắt tình hình hoạt động của hệ thống phòng trọ thông qua các chỉ số tổng hợp cơ bản , phục vụ công tác quản lý và ra quyết định trong phạm vi vận hành hàng ngày.

## 2. Đối tượng sử dụng

* **Chủ trọ** : Quản lý toàn bộ các tòa/dãy trọ trong hệ thống.
* **Nhân viên quản lý** : Quản lý các tòa/dãy trọ được phân công.

## 3. Nội dung thống kê

### 3.1 Các chỉ số thống kê

Hệ thống cung cấp các chỉ số thống kê chính bao gồm:

* Tổng doanh thu theo tháng
* Số lượng phòng đang được thuê
* Số lượng phòng còn trống

### 3.2 Danh sách theo dõi

* Danh sách các hóa đơn chưa hoàn thành thanh toán

## 4. Phạm vi dữ liệu và phân quyền truy cập

* **Đối với Chủ trọ** :
* Xem và theo dõi số liệu thống kê của toàn bộ các tòa/dãy trọ
* Theo dõi danh sách hóa đơn chưa thanh toán trên toàn hệ thống
* **Đối với Nhân viên quản lý** :
* Xem và theo dõi số liệu thống kê trong phạm vi các tòa/dãy trọ được phân công
* Theo dõi danh sách hóa đơn chưa thanh toán thuộc phạm vi quản lý

## 5. Quy trình nghiệp vụ

1. Người dùng đăng nhập vào hệ thống
2. Hệ thống xác định vai trò và phạm vi quản lý của người dùng
3. Người dùng truy cập chức năng Thống kê & Báo cáo
4. Hệ thống tổng hợp dữ liệu từ các phân hệ liên quan
5. Dữ liệu được xử lý và hiển thị phù hợp với quyền truy cập

## 6. Quy tắc nghiệp vụ

* Dữ liệu thống kê được tổng hợp từ các thông tin về phòng và hóa đơn trong hệ thống
* Các chỉ số được tổng hợp theo từng tháng
* Thông tin hiển thị đảm bảo tính chính xác và nhất quán
* Dữ liệu hiển thị phù hợp với vai trò và phạm vi quản lý của người dùng

## 7. Use Case: Xem thống kê & báo cáo

**Tác nhân:**

Chủ trọ, Nhân viên quản lý

**Mô tả:**

Người dùng truy cập hệ thống để xem các số liệu thống kê và danh sách theo dõi phục vụ công tác quản lý.

**Luồng chính:**

1. Người dùng đăng nhập hệ thống
2. Chọn chức năng Thống kê & Báo cáo
3. Hệ thống hiển thị thông tin thống kê phù hợp với quyền truy cập

**Kết quả:**

Người dùng nắm bắt được tình hình hoạt động của hệ thống phòng trọ.

**Luồng ngoại lệ:**

* Không có dữ liệu → hiển thị thông báo phù hợp
* Dữ liệu chưa đầy đủ → cảnh báo độ chính xác
