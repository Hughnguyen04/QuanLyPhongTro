## CHỨC NĂNG: QUẢN LÝ TÀI KHOẢN & THÔNG BÁO HỆ THỐNG

### 1. Mục tiêu chức năng

Chức năng **Quản lý tài khoản & thông báo hệ thống** nhằm:

* Quản lý các **tài khoản đăng nhập** vào hệ thống quản lý phòng trọ
* Phân quyền sử dụng hệ thống theo **vai trò**
* Cung cấp các **thông báo nội bộ** để người dùng nắm bắt kịp thời các sự kiện quan trọng liên quan đến hóa đơn

### 2. Phạm vi chức năng

#### 2.1. Đối tượng quản lý tài khoản

Hệ thống chỉ quản lý **tài khoản đăng nhập** , bao gồm:

| Loại tài khoản     | Mô tả                                                            |
| --------------------- | ------------------------------------------------------------------ |
| **Chủ trọ**   | Người quản lý toàn bộ hệ thống phòng trọ                 |
| **Nhân viên** | Người được chủ trọ tạo tài khoản để hỗ trợ quản lý |

### 3. Quản lý tài khoản

#### 3.1. Các chức năng quản lý tài khoản

* Đăng nhập hệ thống
* Xem danh sách tài khoản (chỉ chủ trọ)
* Thêm mới tài khoản nhân viên
* Cập nhật thông tin tài khoản (tên đăng nhập, mật khẩu)
* Khóa / mở khóa tài khoản

### 4. Phân quyền người dùng

#### 4.1. Phân loại vai trò

Mỗi tài khoản  **chỉ có một vai trò duy nhất** .

| Vai trò              | Quyền hạn                               |
| --------------------- | ----------------------------------------- |
| **Chủ trọ**   | Toàn quyền trên hệ thống             |
| **Nhân viên** | Chỉ được xem và cập nhật dữ liệu |

#### 4.2. Quyền chi tiết

**Chủ trọ**

* Quản lý toàn bộ dữ liệu
* Quản lý tài khoản nhân viên
* Xem và xử lý tất cả thông báo hệ thống

**Nhân viên**

* Đăng nhập hệ thống
* Xem dữ liệu phòng, hóa đơn
* Cập nhật dữ liệu theo quyền cho phép
* Xem thông báo hệ thống.

### 5. Thông báo trong hệ thống

#### 5.1. Mục đích

Thông báo giúp người dùng:

* Nhận biết các sự kiện quan trọng liên quan đến **hóa đơn**
* Theo dõi tình trạng thanh toán kịp thời

#### 5.2. Loại thông báo

Hệ thống chỉ hỗ trợ 2 loại thông báo nội bộ:

| Loại thông báo            | Mô tả                                                    |
| ---------------------------- | ---------------------------------------------------------- |
| Có hóa đơn mới          | Khi hệ thống tạo hóa đơn mới                        |
| Hóa đơn chưa thanh toán | Khi hóa đơn đến hạn nhưng chưa được thanh toán |

#### 5.3. Hình thức hiển thị

* Thông báo chỉ hiển thị trong hệ thống
* Hiển thị tại:
  * Biểu tượng chuông 🔔
  * Danh sách thông báo trong giao diện
* Không gửi email
* Không có cài đặt bật/tắt thông báo

### 6. Kết luận

Chức năng Quản lý tài khoản & thông báo hệ thống đóng vai trò hỗ trợ vận hành hệ thống quản lý phòng trọ, đảm bảo:

* Quản lý chặt chẽ quyền truy cập
* Đơn giản, dễ sử dụng
* Phù hợp với quy mô nhỏ và vừa của mô hình phòng trọ
