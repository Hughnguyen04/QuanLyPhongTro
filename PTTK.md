# QuanLyPhongTro

# BUỔI 1: THỐNG KÊ & BÁO CÁO 

## 1. Mục tiêu chức năng

Chức năng Thống kê & Báo cáo được xây dựng nhằm hỗ trợ chủ trọ và nhân viên quản lý theo dõi, tổng hợp và nắm bắt tình hình hoạt động của hệ thống phòng trọ thông qua các chỉ số tổng hợp cơ bản và nâng cao, phục vụ công tác quản lý, đánh giá hiệu quả và ra quyết định trong vận hành hàng ngày và chiến lược.

## 2. Đối tượng sử dụng

* **Chủ trọ** : Quản lý toàn bộ các tòa/dãy trọ trong hệ thống.
* **Nhân viên quản lý** : Quản lý các tòa/dãy trọ được phân công.

## 3. Nội dung thống kê

### 3.1 Các chỉ số thống kê tổng hợp (Dashboard)

**Chỉ số tổng quan:**

* Tổng doanh thu theo tháng/năm
* Số lượng phòng đang cho thuê
* Số lượng phòng còn trống
* Tỷ lệ lấp đầy (Occupancy Rate)
* Doanh thu trên mỗi phòng (Revenue Per Room)
* Số hợp đồng sắp hết hạn (trong vòng 30 ngày)

**Thống kê theo vòng đời hợp đồng:**

* Số hợp đồng mới tạo trong kỳ (Tháng/Quý)
* Số hợp đồng đã gia hạn trong kỳ
* Số hợp đồng đã thanh lý/chấm dứt trong kỳ
* Số hợp đồng chấm dứt trước hạn & Lý do (tự ý bỏ, vi phạm...)
* Thời gian lưu trú trung bình (Average Length of Stay)

**Thống kê tài chính chi tiết:**

* Cơ cấu doanh thu: Tiền phòng, tiền điện, tiền nước, phí dịch vụ, phí phát sinh...
* Tổng số tiền đặt cọc hiện đang giữ
* Tổng giá trị các hóa đơn quá hạn thanh toán
* Biến động giá phòng theo thời gian (nếu có điều chỉnh)

### 3.2 Danh sách theo dõi & Báo cáo

* **Danh sách hóa đơn chưa/trễ thanh toán** : Ghi rõ số ngày quá hạn.
* **Danh sách hợp đồng sắp hết hạn** : Để chủ động liên hệ gia hạn.
* **Danh sách phòng sắp trống** : Dựa trên hợp đồng sắp thanh lý.
* **Báo cáo công nợ chi tiết** : Theo từng phòng/khách thuê.
* **Báo cáo sử dụng điện nước** : So sánh giữa các kỳ, phát hiện bất thường.

## 4. Phạm vi dữ liệu và phân quyền truy cập

* **Đối với Chủ trọ** :
  * Xem toàn bộ số liệu thống kê, báo cáo của tất cả các tòa/dãy trọ.
  * Theo dõi mọi danh sách và báo cáo chi tiết trên toàn hệ thống.
* **Đối với Nhân viên quản lý** :
  * Xem số liệu thống kê, báo cáo trong phạm vi các tòa/dãy trọ được phân công.
  * Theo dõi các danh sách thuộc phạm vi quản lý.

## 5. Quy trình nghiệp vụ

1. **Người dùng đăng nhập** vào hệ thống.
2. **Hệ thống xác định vai trò và phạm vi quản lý** của người dùng.
3. **Người dùng truy cập chức năng Thống kê & Báo cáo** .
4. **Hệ thống tổng hợp dữ liệu từ các phân hệ liên quan** :

* **Quản lý hợp đồng & Phòng** : Trạng thái phòng, vòng đời HĐ.
* **Quản lý thanh toán & Hóa đơn** : Doanh thu, công nợ.
* **Quản lý điện nước & dịch vụ** : Chỉ số công tơ, đơn giá, phí phát sinh.

1. **Dữ liệu được xử lý, tính toán** theo các quy tắc nghiệp vụ và hiển thị phù hợp với quyền truy cập.

## 6. Quy tắc nghiệp vụ & Ràng buộc

### 6.1 Ràng buộc từ vòng đời Hợp đồng và Phòng

* **Dữ liệu thống kê phải phản ánh chính xác trạng thái hiện tại** của Hợp đồng (Mới, Đang hiệu lực, Đã thanh lý, Chấm dứt trước hạn) và Phòng (Đang thuê, Sắp trống, Đang trống, Đang sửa chữa).
* **Số phòng "đang thuê"** chỉ tính các phòng có Hợp đồng đang ở trạng thái "Đang hiệu lực".
* **Số phòng "sắp trống"** được tính dựa trên các Hợp đồng sắp hết hạn (vd: còn dưới 30 ngày) mà chưa có quyết định gia hạn.
* **Hợp đồng chấm dứt trước hạn** phải được ghi nhận lý do và ảnh hưởng đến thống kê doanh thu, tỷ lệ lấp đầy.

### 6.2 Ràng buộc về tính toán tài chính

* **Cơ chế chốt chỉ số và tính tiền điện/nước:**
  1. **Định kỳ chốt công tơ** : Mỗi tháng, NVQL có nhiệm vụ nhập **chỉ số công tơ điện/nước cuối kỳ** cho từng phòng vào một mốc thời gian cố định (vd: ngày 25 hàng tháng).
  2. **Tự động tính toán** : Hệ thống tự tính **lượng tiêu thụ** = (Chỉ số cuối kỳ - Chỉ số đầu kỳ). **Chỉ số đầu kỳ** chính là **Chỉ số cuối kỳ** của tháng trước.
  3. **Áp dụng đơn giá** : Hệ thống áp dụng đơn giá điện/nước (theo bậc thang hoặc cố định) đã được cấu hình để tính thành tiền.
  4. **Tích hợp vào hóa đơn** : Số tiền này được tự động đưa vào hóa đơn tháng sau cùng với tiền phòng và các dịch vụ khác.
* **Đặt cọc** : Số tiền đặt cọc được thống kê riêng. Khi thanh lý HĐ, nếu có phát sinh phí phải đền bù, số tiền sẽ được trừ từ tiền cọc. Thống kê phải phản ánh số cọc "thực tế đang giữ".
* **Điều chỉnh giá phòng** : Mọi điều chỉnh giá phòng trong hợp đồng đều phải được ghi nhận lịch sử và thời điểm hiệu lực. Báo cáo doanh thu phải tính theo đúng giá áp dụng trong từng khoảng thời gian.
* **Chi phí dịch vụ** : Các loại phí dịch vụ (rác, internet, gửi xe...) phải được cấu hình rõ đơn giá và phương thức tính (theo phòng/ theo người/ cố định).

### 6.3 Quy tắc chung

* Dữ liệu thống kê được tổng hợp theo các kỳ linh hoạt (Tháng, Quý, Năm, Tùy chọn khoảng ngày).
* Thông tin hiển thị đảm bảo tính chính xác, nhất quán và cập nhật theo thời gian thực khi có nghiệp vụ phát sinh.
* Mọi báo cáo đều có thể xuất ra file (PDF, Excel).

## 7. Use Case: Xem thống kê & báo cáo

**Tác nhân:** Chủ trọ, Nhân viên quản lý

**Mô tả:** Người dùng truy cập hệ thống để xem các số liệu thống kê tổng quan và báo cáo chi tiết phục vụ công tác quản lý.

**Luồng chính:**

1. Người dùng đăng nhập hệ thống thành công.
2. Hệ thống xác định vai trò (Chủ trọ/NVQL) và phạm vi dữ liệu được phép truy cập.
3. Người dùng điều hướng đến chức năng  **Thống kê & Báo cáo** .
4. Hệ thống hiển thị **Dashboard tổng quan** với các chỉ số chính được tính toán theo thời gian thực.
5. Người dùng có thể:
   * **Lọc/Xem** dữ liệu theo Tòa nhà, Khoảng thời gian (tháng/năm/tùy chỉnh).
   * **Chuyển tab** để xem các báo cáo chi tiết: Báo cáo doanh thu, Báo cáo hợp đồng, Báo cáo công nợ, Báo cáo điện nước.
   * **Xuất file** báo cáo ra định dạng mong muốn.

**Kết quả:** Người dùng nắm bắt được toàn diện tình hình hoạt động, tài chính và hiệu quả quản lý của hệ thống/khu vực được phân công.

**Luồng ngoại lệ:**

* **Không có dữ liệu** trong khoảng thời gian/ phạm vi lọc → Hiển thị giao diện thông báo "Không có dữ liệu" thay vì biểu đồ/số liệu trống.
* **Dữ liệu chưa đầy đủ** (Vd: chưa chốt chỉ số điện nước cho kỳ này) → Hệ thống cảnh báo trên Dashboard/Báo cáo liên quan: "Dữ liệu [tên chỉ số] có thể chưa đầy đủ do chưa chốt chỉ số".
* **Lỗi trong quá trình tính toán** (Vd: thiếu đơn giá điện) → Hiển thị thông báo lỗi cụ thể cho quản trị viên và ghi nhận log.

# BUỔI 2: MÔ TẢ BÀI TOÁN

Mô tả bài toán:

Trong thực tế, việc quản lý nhà trọ thường được thực hiện thủ công thông qua sổ sách hoặc các file rời rạc như Excel, dẫn đến nhiều khó khăn trong việc theo dõi và cập nhật thông tin. Chủ trọ và nhân viên quản lý phải quản lý đồng thời nhiều loại dữ liệu như thông tin phòng trọ, người thuê, hợp đồng thuê, các khoản chi phí hàng tháng (tiền phòng, tiền điện, tiền nước, dịch vụ), cũng như tình trạng thanh toán và thống kê doanh thu. Việc quản lý thủ công này dễ gây sai sót, trùng lặp dữ liệu, mất nhiều thời gian tổng hợp và khó kiểm soát khi số lượng phòng trọ tăng lên.

Xuất phát từ nhu cầu thực tế đó, nhóm xây dựng website quản lý phòng trọ nhằm hỗ trợ chủ trọ, nhân viên quản lý và người thuê phòng trong việc quản lý, tra cứu và theo dõi thông tin một cách tập trung, chính xác và hiệu quả.

1. Quản lý phòng trọ

Hệ thống cho phép quản lý chi tiết thông tin của từng phòng trọ, bao gồm:

Mã phòng, tên/số phòng

Diện tích phòng

Giá thuê cơ bản

Trạng thái phòng (trống, đang thuê)

Các dịch vụ đi kèm (wifi, giữ xe, vệ sinh, …)

Chi phí dịch vụ (nếu có)

Thông tin phòng được sử dụng làm cơ sở để lập hợp đồng thuê và tính toán hóa đơn hàng tháng.

2. Quản lý người thuê

Hệ thống lưu trữ thông tin người thuê phòng, bao gồm:

Họ tên

Số điện thoại

Căn cước công dân (CCCD)

Ngày bắt đầu thuê

Phòng đang thuê

Người thuê có thể được gán vào phòng thông qua hợp đồng thuê, đảm bảo việc quản lý mối quan hệ giữa phòng và người thuê được chặt chẽ.

3. Quản lý hợp đồng thuê

Hệ thống cho phép lập và quản lý hợp đồng thuê phòng với các thông tin:

Phòng thuê

Người thuê

Ngày bắt đầu và ngày kết thúc hợp đồng

Tiền cọc

Giá thuê áp dụng

Trạng thái hợp đồng (còn hiệu lực, hết hạn, đã kết thúc)

Hợp đồng là cơ sở để phát sinh hóa đơn và theo dõi tình trạng thuê phòng.

4. Quản lý hóa đơn và chi phí

Hệ thống hỗ trợ lập và quản lý hóa đơn hàng tháng cho từng hợp đồng, bao gồm:

Tiền thuê phòng

Tiền điện (chỉ số điện, đơn giá điện)

Tiền nước (chỉ số nước, đơn giá nước)

Chi phí dịch vụ khác (nếu có)

Tổng số tiền phải thanh toán

Trạng thái hóa đơn (đã thanh toán, chưa thanh toán)

Việc tính toán hóa đơn được thực hiện dựa trên dữ liệu hợp đồng và các chi phí liên quan.

5. Thống kê và báo cáo

Hệ thống cung cấp các chức năng thống kê và báo cáo nhằm hỗ trợ công tác quản lý, bao gồm:

Thống kê doanh thu theo tháng

Thống kê số lượng phòng đang thuê và phòng trống

Tổng hợp tình hình thanh toán hóa đơn

Các thông tin thống kê được hiển thị dưới dạng bảng hoặc biểu đồ giúp chủ trọ dễ dàng theo dõi và ra quyết định.

6. Quản lý tài khoản và thông báo

Hệ thống cho phép quản lý tài khoản người dùng với các vai trò khác nhau:

Chủ trọ

Nhân viên quản lý

Người thuê

Mỗi vai trò có quyền truy cập khác nhau vào các chức năng của hệ thống. Ngoài ra, hệ thống hỗ trợ gửi và hiển thị thông báo (ví dụ: thông báo hóa đơn, nhắc nhở thanh toán, thông báo hợp đồng sắp hết hạn) đến người thuê và nhân viên.

Công nghệ sử dụng

Website được xây dựng dưới dạng ứng dụng web sử dụng HTML, CSS và JavaScript, dữ liệu được mô phỏng bằng JavaScript nhằm phục vụ mục đích học tập và minh họa nghiệp vụ quản lý phòng trọ. Hệ thống có giao diện đơn giản, dễ sử dụng và có khả năng mở rộng trong tương lai.


# PHÂN TÍCH CÁC GIAO DIỆN CẦN THIẾT

## 1. Giao diện đăng nhập

Mục đích: Đăng nhập vào hệ thống với 3 loại tài khoản: Chủ trọ, Nhân viên quản lý, Người thuê.

Thành phần chính:

Form đăng nhập với username/email và password

Lựa chọn loại tài khoản (Chủ trọ/Nhân viên/Người thuê)

Nút "Đăng nhập" và link "Quên mật khẩu?"

Hiển thị thông báo lỗi nếu đăng nhập sai

## 2. Giao diện Dashboard

### 2.1 Dashboard Chủ trọ

Thống kê nhanh: Tổng phòng, phòng đang thuê, phòng trống

Doanh thu tháng hiện tại

Danh sách hợp đồng sắp hết hạn

Danh sách hóa đơn chưa thanh toán

Biểu đồ doanh thu 6 tháng gần nhất

### 2.2 Dashboard Nhân viên quản lý

Tương tự Dashboard Chủ trọ nhưng chỉ hiển thị phòng được phân công quản lý

Thêm phần báo cáo công việc hàng ngày

### 2.3 Dashboard Người thuê

Thông tin cá nhân và phòng đang thuê

Hóa đơn hiện tại và lịch sử thanh toán

Thông báo từ chủ trọ/nhân viên

## 3. Giao diện quản lý phòng trọ

Mục đích: Quản lý danh sách và thông tin các phòng.

Thành phần chính:

Danh sách phòng dạng bảng với các cột: Mã phòng, Tên phòng, Diện tích, Giá thuê, Trạng thái

Chức năng tìm kiếm và lọc theo trạng thái, giá thuê

Nút thêm phòng mới, sửa, xóa phòng

Form thêm/sửa phòng với các thông tin: mã phòng, diện tích, giá thuê, dịch vụ đi kèm

Trạng thái phòng: Trống (có thể cho thuê), Đang thuê, Đang sửa chữa

## 4. Giao diện quản lý người thuê

Mục đích: Lưu trữ và quản lý thông tin người thuê phòng.

Thành phần chính:

Danh sách người thuê với các cột: Họ tên, SĐT, CCCD, Phòng đang thuê

Tìm kiếm theo tên, SĐT, CCCD

Nút thêm người thuê mới, sửa, xóa

Form thêm/sửa người thuê với các thông tin cơ bản: họ tên, SĐT, CCCD, ngày sinh, quê quán, nghề nghiệp

Hồ sơ chi tiết người thuê: thông tin cá nhân, hợp đồng hiện tại, lịch sử thanh toán

## 5. Giao diện quản lý hợp đồng

Mục đích: Quản lý hợp đồng thuê phòng từ khi tạo đến khi kết thúc.

Thành phần chính:

Danh sách hợp đồng với các cột: Số hợp đồng, Người thuê, Phòng, Ngày bắt đầu/kết thúc, Trạng thái

Lọc theo trạng thái: Đang hiệu lực, Sắp hết hạn, Đã kết thúc

Nút tạo hợp đồng mới, gia hạn, kết thúc hợp đồng

Form tạo hợp đồng:

Bước 1: Chọn phòng trống

Bước 2: Chọn người thuê (có thể chọn từ danh sách hoặc tạo mới)

Bước 3: Nhập thông tin hợp đồng: ngày bắt đầu/kết thúc, tiền cọc, giá thuê, đơn giá điện/nước

Bước 4: Xác nhận và in hợp đồng

Form gia hạn hợp đồng: Chọn ngày kết thúc mới, điều chỉnh giá nếu cần

Form kết thúc hợp đồng: Nhập ngày kết thúc thực tế, kiểm tra tình trạng phòng, quyết toán tiền cọc

## 6. Giao diện quản lý hóa đơn

Mục đích: Tạo và quản lý hóa đơn thanh toán hàng tháng.

Thành phần chính:

Danh sách hóa đơn với các cột: Số hóa đơn, Phòng, Người thuê, Tháng, Tổng tiền, Trạng thái

Lọc theo trạng thái: Chưa thanh toán, Đã thanh toán, Quá hạn

Nút tạo hóa đơn mới, thanh toán, in hóa đơn

Form tạo hóa đơn:

Chọn hợp đồng (tự động điền thông tin phòng, người thuê)

Chọn kỳ thanh toán (tháng/năm)

Nhập chỉ số điện/nước: chỉ số đầu kỳ (tự động từ kỳ trước), chỉ số cuối kỳ (nhập mới)

Hệ thống tự tính: Sản lượng = Chỉ số cuối - Chỉ số đầu; Tiền = Sản lượng × Đơn giá

Tự động tính tiền phòng và dịch vụ từ hợp đồng

Tính tổng tiền và hạn thanh toán

Form thanh toán hóa đơn: Nhập ngày thanh toán, phương thức thanh toán, in biên lai

## 7. Giao diện chốt chỉ số điện nước

Mục đích: Hỗ trợ nhân viên chốt chỉ số điện nước hàng tháng.

Thành phần chính:

Chọn tháng cần chốt số

Bảng danh sách các phòng với các cột: Mã phòng, Người thuê, Chỉ số điện đầu/cuối, Chỉ số nước đầu/cuối

Chỉ số đầu kỳ tự động lấy từ kỳ trước

Nhập chỉ số cuối kỳ cho từng phòng

Hệ thống tự tính sản lượng và cảnh báo nếu sản lượng bất thường

Nút lưu, hoàn thành chốt số, in bảng chốt số

## 8. Giao diện thống kê báo cáo

Mục đích: Thống kê và báo cáo tình hình hoạt động.

Thành phần chính:

Báo cáo doanh thu theo tháng (biểu đồ và bảng)

Thống kê tỷ lệ phòng đang thuê/trống

Báo cáo tình hình thanh toán hóa đơn

Thống kê hợp đồng: số lượng mới, gia hạn, kết thúc

Lọc theo khoảng thời gian (tháng, quý, năm)

Xuất báo cáo ra Excel/PDF

## 9. Giao diện quản lý tài khoản

Mục đích: Quản lý tài khoản người dùng hệ thống.

Thành phần chính:

Cho Chủ trọ: Quản lý danh sách nhân viên, thêm/sửa/xóa tài khoản nhân viên, phân quyền tòa nhà

Cho Nhân viên: Xem và cập nhật thông tin cá nhân, đổi mật khẩu

Cho Người thuê: Xem và cập nhật thông tin cá nhân, đổi mật khẩu

Form thêm/sửa tài khoản: username, password, họ tên, SĐT, email, vai trò

## 10. Giao diện quản lý thông báo

Mục đích: Gửi và nhận thông báo trong hệ thống.

Thành phần chính:

Gửi thông báo:

Chọn loại: Nhắc thanh toán, Nhắc gia hạn hợp đồng, Thông báo chung

Chọn người nhận: Tất cả người thuê, Người thuê cụ thể, Theo phòng

Nhập tiêu đề và nội dung

Hộp thông báo: Danh sách thông báo đã nhận, đánh dấu đã đọc

Lịch sử gửi: Danh sách thông báo đã gửi

## 11. Giao diện cài đặt hệ thống (Chỉ Chủ trọ)

Mục đích: Cấu hình các thông số hệ thống.

Thành phần chính:

Cài đặt đơn giá mặc định: điện, nước, dịch vụ

Cấu hình ngày chốt số điện nước hàng tháng

Cài đặt template thông báo

Cấu hình thông tin liên hệ của nhà trọ
