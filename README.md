# C&B Data Monitoring Dashboard (Next.js + shadcn/ui)

Bản chuyển từ thiết kế sang code. Giao diện chạy bằng dữ liệu mẫu (`lib/mock.ts`). Chưa có nút nào ghi dữ liệu thật.

## Cài đặt

1. Tạo project: `npx create-next-app@latest cb-dashboard --ts --tailwind --app --src-dir=false`, rồi chép đè các thư mục `app/`, `components/`, `lib/`, `db/` trong gói này.
2. `npx shadcn@latest init`
3. Thêm component:
   `npx shadcn@latest add button input label textarea select checkbox radio-group table badge card tabs progress dropdown-menu`
4. `npm i better-sqlite3 && npm i -D @types/better-sqlite3`
5. `npm run dev`

Font: dùng Inter qua `next/font` (đã khai báo trong `app/layout.tsx`). Màu chính: xanh `#1d4ed8` (đặt `--primary` trong `globals.css`).

## Cơ sở dữ liệu

PostgreSQL cần quyền admin nên dùng SQLite (`better-sqlite3`). `db/schema.sql` là schema v4. `lib/db.ts` tự tạo file `data/cb.db` và áp schema ở lần chạy đầu. Chạy trên Node runtime, không dùng edge.

## Bản đồ màn hình

| Route | Màn |
|---|---|
| `/` | Tổng quan |
| `/employees`, `/employees/new`, `/employees/[eid]/edit` | Danh sách + chi tiết, thêm, sửa dữ liệu C&B |
| `/sheets`, `/sheets/new`, `/sheets/[id]`, `/sheets/[id]/add`, `/sheets/[id]/commit` | Tất cả sheet, tạo mới, chi tiết, thêm người, xử lý xung đột |
| `/import`, `/import/preview` | Chọn file, cấu hình và xem trước |
| `/settings`, `/settings/email`, `/settings/domains`, `/settings/users` | Cài đặt |

## Việc tiếp theo

- Thay `lib/mock.ts` bằng truy vấn trong `lib/queries.ts` (view `v_c_status`, `v_c_effective`, `iv_employee`).
- Server Actions: import (upsert theo `upsert_rule`), tạo sheet, commit, lưu giá trị C&B.
- Chuẩn hoá và kiểm tra `value_key` theo `domain.data_schema` trước khi ghi.
- Đăng nhập và phân quyền theo vai trò.
