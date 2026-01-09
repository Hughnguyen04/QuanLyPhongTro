
# PHÂN TÍCH THIẾT KẾ HỆ THỐNG QUẢN LÝ PHÒNG TRỌ

## Phạm vi phân tích

Tài liệu này tập trung **phân tích – thiết kế chi tiết** cho  **2 phân hệ** :

* **Quản lý hợp đồng thuê trọ**
* **Quản lý hóa đơn (tiền phòng, điện, nước, dịch vụ)**

Hệ thống áp dụng cho mô hình:

* **01 Chủ trọ** : sở hữu toàn bộ các dãy trọ
* **N Quản lý dãy trọ** : mỗi quản lý phụ trách 1 hoặc nhiều dãy trọ

## I. TÁC NHÂN (ACTOR)

### 1. Chủ trọ

* Quyền cao nhất trong hệ thống
* Quản lý toàn bộ dãy trọ, hợp đồng và hóa đơn
* Xem báo cáo tổng hợp

### 2. Quản lý dãy trọ

* Quản lý các phòng thuộc dãy trọ được phân công
* Lập hợp đồng, lập hóa đơn
* Không có quyền xem/sửa dữ liệu dãy trọ khác

## II. PHÂN TÍCH NGHIỆP VỤ QUẢN LÝ HỢP ĐỒNG

### 1. Mục tiêu nghiệp vụ

* Quản lý vòng đời hợp đồng thuê phòng
* Đảm bảo mỗi phòng chỉ có **1 hợp đồng hiệu lực tại 1 thời điểm**
* Lưu trữ lịch sử hợp đồng

---

### 2. Thông tin hợp đồng

| Thuộc tính     | Mô tả                       |
| ---------------- | ----------------------------- |
| Mã hợp đồng  | Định danh duy nhất         |
| Phòng           | Phòng được thuê          |
| Người thuê    | Thông tin khách thuê       |
| Ngày bắt đầu | Ngày hiệu lực              |
| Ngày kết thúc | Ngày hết hạn               |
| Giá thuê       | Giá phòng / tháng          |
| Tiền cọc       | Số tiền đặt cọc          |
| Trạng thái     | Hiệu lực / Hết hạn / Hủy |
| Người tạo     | Chủ trọ / Quản lý         |

### 3. Use Case: Tạo hợp đồng

**Actor:** Quản lý dãy trọ / Chủ trọ

**Luồng chính:**

1. Actor chọn phòng trống
2. Nhập thông tin người thuê
3. Nhập thời hạn hợp đồng
4. Nhập giá thuê, tiền cọc
5. Lưu hợp đồng
6. Hệ thống cập nhật trạng thái phòng = Đang thuê

**Luồng thay thế:**

* Phòng đang có hợp đồng hiệu lực → từ chối tạo

### 4. Use Case: Gia hạn hợp đồng

* Áp dụng khi người thuê tiếp tục ở
* Cập nhật ngày kết thúc mới
* Lưu lịch sử gia hạn

### 5. Use Case: Thanh lý hợp đồng

**Điều kiện:** Hợp đồng đang hiệu lực

**Xử lý:**

* Cập nhật trạng thái = Hết hạn
* Trả phòng về trạng thái Trống
* Kết thúc phát sinh hóa đơn

## III. PHÂN TÍCH NGHIỆP VỤ QUẢN LÝ HÓA ĐƠN

### 1. Mục tiêu nghiệp vụ

* Tự động hóa việc tính tiền thuê trọ hàng tháng
* Quản lý chi tiết điện, nước, dịch vụ
* Theo dõi tình trạng thanh toán

### 2. Thông tin hóa đơn

| Thuộc tính             | Mô tả                 |
| ------------------------ | ----------------------- |
| Mã hóa đơn           | Định danh             |
| Hợp đồng              | Hợp đồng liên quan  |
| Tháng/Năm              | Kỳ thanh toán         |
| Tiền phòng             | Theo hợp đồng        |
| Chỉ số điện cũ/mới | Dùng tính tiền       |
| Chỉ số nước cũ/mới | Dùng tính tiền       |
| Phí dịch vụ           | Internet, rác, gửi xe |
| Tổng tiền              | Tổng phải trả        |
| Trạng thái             | Chưa thu / Đã thu    |
| Ngày thu                | Ngày thanh toán       |

### 3. Use Case: Lập hóa đơn tháng

**Actor:** Quản lý dãy trọ / Chủ trọ

**Luồng chính:**

1. Chọn hợp đồng đang hiệu lực
2. Nhập chỉ số điện, nước mới
3. Hệ thống tính toán tiền điện, nước
4. Cộng tiền phòng và phí dịch vụ
5. Lưu hóa đơn

### 4. Use Case: Thu tiền hóa đơn

**Luồng chính:**

1. Chọn hóa đơn chưa thu
2. Xác nhận đã thanh toán
3. Cập nhật trạng thái = Đã thu
4. Lưu ngày thu

### 5. Quy tắc nghiệp vụ

* Mỗi hợp đồng → tối đa 1 hóa đơn / tháng
* Không cho sửa hóa đơn đã thu
* Không lập hóa đơn nếu hợp đồng đã hết hạn

## IV. PHÂN QUYỀN HỆ THỐNG

| Chức năng                      | Chủ trọ | Quản lý |
| -------------------------------- | --------- | --------- |
| Tạo / sửa hợp đồng          | ✔        | ✔        |
| Thanh lý hợp đồng            | ✔        | ✔        |
| Xem hợp đồng toàn hệ thống | ✔        | ✘        |
| Lập hóa đơn                  | ✔        | ✔        |
| Thu tiền                        | ✔        | ✔        |
| Báo cáo doanh thu              | ✔        | ✘        |

## V. MÔ HÌNH DỮ LIỆU KHÁI QUÁT

**Quan hệ chính:**

* Dãy trọ 1 — N Phòng
* Phòng 1 — N Hợp đồng
* Hợp đồng 1 — N Hóa đơn

## VI. KẾT LUẬN

Phân hệ **Quản lý hợp đồng và hóa đơn** là lõi của hệ thống quản lý phòng trọ. Việc tách rõ vai trò **Chủ trọ** và **Quản lý dãy trọ** giúp đảm bảo phân quyền, bảo mật và vận hành hiệu quả.
