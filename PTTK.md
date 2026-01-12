## CHỨC NĂNG: QUẢN LÝ TÀI KHOẢN & THÔNG BÁO HỆ THỐNG

## *09/01/2026*

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

## 12/01/2026

### Mô tả bài toán

Trong thực tế, việc quản lý nhà trọ thường được thực hiện thủ công thông qua sổ sách hoặc các file rời rạc như Excel, dẫn đến nhiều khó khăn trong việc theo dõi và cập nhật thông tin. Chủ trọ và nhân viên quản lý phải quản lý đồng thời nhiều loại dữ liệu như thông tin phòng trọ, người thuê, hợp đồng thuê, các khoản chi phí hàng tháng (tiền phòng, tiền điện, tiền nước, dịch vụ), cũng như tình trạng thanh toán và thống kê doanh thu. Việc quản lý thủ công này dễ gây sai sót, trùng lặp dữ liệu, mất nhiều thời gian tổng hợp và khó kiểm soát khi số lượng phòng trọ tăng lên.

Xuất phát từ nhu cầu thực tế đó, nhóm xây dựng website quản lý phòng trọ nhằm hỗ trợ chủ trọ, nhân viên quản lý và người thuê phòng trong việc quản lý, tra cứu và theo dõi thông tin một cách tập trung, chính xác và hiệu quả.

* **Quản lý phòng trọ**
  Hệ thống cho phép quản lý chi tiết thông tin của từng phòng trọ, bao gồm:

  * Mã phòng, tên/số phòng
  * Diện tích phòng
  * Giá thuê cơ bản
  * Trạng thái phòng (trống, đang thuê)
  * Các dịch vụ đi kèm (wifi, giữ xe, vệ sinh, …)
  * Chi phí dịch vụ (nếu có)

  Thông tin phòng được sử dụng làm cơ sở để lập hợp đồng thuê và tính toán hóa đơn hàng tháng.
* **Quản lý người thuê**
  Hệ thống lưu trữ thông tin người thuê phòng, bao gồm:

  * Họ tên
  * Số điện thoại
  * Căn cước công dân (CCCD)
  * Ngày bắt đầu thuê
  * Phòng đang thuê

  Người thuê có thể được gán vào phòng thông qua hợp đồng thuê, đảm bảo việc quản lý mối quan hệ giữa phòng và người thuê được chặt chẽ.
* **Quản lý hợp đồng thuê**
  Hệ thống cho phép lập và quản lý hợp đồng thuê phòng với các thông tin:

  * Phòng thuê
  * Người thuê
  * Ngày bắt đầu và ngày kết thúc hợp đồng
  * Tiền cọc
  * Giá thuê áp dụng
  * Trạng thái hợp đồng (còn hiệu lực, hết hạn, đã kết thúc)

  Hợp đồng là cơ sở để phát sinh hóa đơn và theo dõi tình trạng thuê phòng.
* **Quản lý hóa đơn và chi phí**
  Hệ thống hỗ trợ lập và quản lý hóa đơn hàng tháng cho từng hợp đồng, bao gồm:

  * Tiền thuê phòng
  * Tiền điện (chỉ số điện, đơn giá điện)
  * Tiền nước (chỉ số nước, đơn giá nước)
  * Chi phí dịch vụ khác (nếu có)
  * Tổng số tiền phải thanh toán
  * Trạng thái hóa đơn (đã thanh toán, chưa thanh toán)

  Việc tính toán hóa đơn được thực hiện dựa trên dữ liệu hợp đồng và các chi phí liên quan.
* **Thống kê và báo cáo**
  Hệ thống cung cấp các chức năng thống kê và báo cáo nhằm hỗ trợ công tác quản lý, bao gồm:

  * Thống kê doanh thu theo tháng
  * Thống kê số lượng phòng đang thuê và phòng trống
  * Tổng hợp tình hình thanh toán hóa đơn

  Các thông tin thống kê được hiển thị dưới dạng bảng hoặc biểu đồ giúp chủ trọ dễ dàng theo dõi và ra quyết định.
* **Quản lý tài khoản và thông báo**
  Hệ thống cho phép quản lý tài khoản người dùng với các vai trò khác nhau:

  * Chủ trọ
  * Nhân viên quản lý
  * Người thuê

  Mỗi vai trò có quyền truy cập khác nhau vào các chức năng của hệ thống. Ngoài ra, hệ thống hỗ trợ gửi và hiển thị thông báo (ví dụ: thông báo hóa đơn, nhắc nhở thanh toán, thông báo hợp đồng sắp hết hạn) đến người thuê và nhân viên.



#### XÁC ĐỊNH ACTOR

Hệ thống có  **3 actor chính** , phân quyền rõ ràng theo nghiệp vụ thực tế.

| Actor                   | Mô tả                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| **Chủ trọ**     | Người sở hữu và quản lý toàn bộ nhà trọ, có toàn quyền sử dụng hệ thống       |
| **Nhân viên**   | Người hỗ trợ chủ trọ trong việc quản lý phòng, người thuê, hợp đồng, hóa đơn |
| **Người thuê** | Người thuê phòng, chỉ được xem các thông tin liên quan đến bản thân              |

#### XÁC ĐỊNH USE CASE

**Nhóm xác thực**

* **Đăng nhập hệ thống**

**Nhóm quản lý phòng**

* **Quản lý phòng**
  (thêm, sửa, xóa, xem phòng; quản lý diện tích, giá thuê, dịch vụ, trạng thái phòng)

**Nhóm quản lý người thuê**

* **Quản lý người thuê**
  (thêm, sửa, xóa thông tin người thuê)
* **Gán người thuê vào phòng**

**Nhóm quản lý hợp đồng**

* **Quản lý hợp đồng thuê**
  (lập hợp đồng, cập nhật trạng thái, kết thúc hợp đồng)

 **Nhóm quản lý hóa đơn**

* **Quản lý hóa đơn**
  (lập hóa đơn, nhập chỉ số điện nước, tính chi phí dịch vụ, cập nhật trạng thái thanh toán)

**Nhóm thống kê & báo cáo**

* **Xem thống kê & báo cáo**
  (doanh thu, phòng trống, tình trạng thanh toán)

**Nhóm quản lý hệ thống**

* **Quản lý tài khoản**
* **Gửi thông báo**

**Nhóm chức năng dành cho Người thuê**

* **Xem thông tin thuê phòng**
* **Xem hóa đơn**
* **Nhận thông báo**

### Use case Tổng quát

![uc_tong_quat](pttk_img/uc_tong_quat.jpg)
