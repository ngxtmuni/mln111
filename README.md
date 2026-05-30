# Dự án Frontend Web - Kết Nối Di Sản

Frontend cho nền tảng Kết Nối Di Sản, được xây dựng bằng Next.js và Tailwind CSS.

## Khởi chạy dự án

1.  **Clone repository:**
    ```bash
    git clone git@github.com:ketnoidisan/frontend-web.git
    ```

2.  **Di chuyển vào thư mục dự án:**
    ```bash
    cd frontend-web
    ```

3.  **Cài đặt dependencies:**
    Dự án sử dụng `pnpm`.
    ```bash
    pnpm install
    ```

4.  **Chạy server phát triển:**
    ```bash
    pnpm dev
    ```
    Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn.

---

## Quy trình làm việc với Git

Dự án sử dụng mô hình Git Flow đơn giản để quản lý code và phối hợp làm việc.

### Các nhánh chính

-   `main`: Chứa phiên bản code đã ổn định, sẵn sàng cho production. Chỉ merge từ `develop` vào.
-   `develop`: Nhánh phát triển chính. Tất cả các nhánh `feature` sẽ được merge vào đây.

### Quy trình phát triển một tính năng mới

Khi bạn bắt đầu làm một công việc mới (ví dụ: code trang Cộng đồng), hãy tuân thủ quy trình sau:

**Bước 1: Bắt đầu từ nhánh `develop` mới nhất**

Luôn đảm bảo bạn có phiên bản code mới nhất trước khi bắt đầu.

```bash
# Chuyển về nhánh develop
git checkout develop

# Kéo code mới nhất từ GitHub về
git pull origin develop
```

**Bước 2: Tạo nhánh `feature` mới**

Tên nhánh nên có tiền tố `feature/` và mô tả ngắn gọn tính năng.

```bash
# Cú pháp: git checkout -b feature/ten-tinh-nang
# Ví dụ:
git checkout -b feature/community-page
```

**Bước 3: Bắt đầu code**

Bây giờ bạn có thể bắt đầu code trên nhánh `feature` của mình.

**Bước 4: Lưu và đẩy code lên GitHub**

Sau khi hoàn thành công việc hoặc muốn lưu lại tiến độ, hãy `commit` và `push` nhánh của bạn.

```bash
# Thêm tất cả các file đã thay đổi
git add .

# Commit với một tin nhắn rõ ràng
git commit -m "feat: Hoan thien layout trang Cong dong"

# Đẩy nhánh của bạn lên GitHub
git push origin feature/community-page
```

**Bước 5: Tạo Pull Request (PR)**

-   Sau khi đẩy code lên, truy cập trang GitHub của repository.
-   Bạn sẽ thấy một thông báo để tạo **Pull Request** từ nhánh `feature` của bạn vào nhánh `develop`.
-   Điền các thông tin cần thiết và tạo PR để team có thể review code trước khi merge.

### Xử lý xung đột (Merge Conflicts)

-   Vì mỗi người làm việc trên các file riêng biệt, xung đột sẽ hiếm khi xảy ra.
-   Xung đột chỉ xuất hiện nếu nhiều người cùng chỉnh sửa **cùng một file**.
-   Nếu cần sửa file chung (ví dụ: `layout.tsx`, `navigation.tsx`), hãy thông báo cho các thành viên khác trong team.
