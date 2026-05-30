# Frontend Web AI Context

## Purpose

`frontend-web/` là website Next.js App Router cho public site, dashboard người dùng và admin web.
Với phần AI, web là giai đoạn public-facing: sau khi nghệ nhân đã đào tạo AI đủ tốt trên mobile, user cuối sẽ dùng web để trò chuyện với AI của từng nghệ nhân.

## Read These First

1. `app/layout.tsx`
2. `app/page.tsx`
3. `lib/api.ts`
4. `lib/firebase/config.ts`
5. `components/auth-provider.tsx`
6. Route/page cụ thể trong `app/` theo task

## Main Structure

- `app/`: routes theo App Router.
- `components/`: UI và feature components.
- `lib/api.ts`: request layer tới backend Spring Boot.
- `lib/firebase/`: auth/firebase config.
- `lib/supabase/`: client phụ trợ.
- `styles/`: styling phụ trợ.

## Route Groups Worth Knowing

- `app/admin/`: admin pages.
- `app/dashboard/`: user dashboard.
- `app/judging/`: giao diện chấm điểm chỉ dành cho 3 tài khoản BGK có role `judge`.
- `app/admin/judging/`: giao diện admin để xem tiến độ chấm và kết quả tổng hợp, admin không phải người chấm điểm.
- `app/auth/callback/route.ts`: auth callback route.
- `app/artists/`, `app/community/`, `app/contests/`, `app/news/`, `app/library/`, `app/events/`: feature pages chính.
- `app/[slug]/page.tsx`: renderer chung cho các trang nội dung tĩnh/chuyên đề, dữ liệu nằm ở `content/static-pages/data.ts`.
- `app/events/`: chứa các trang đăng ký sự kiện riêng biệt:
  - `app/events/su-kien-ra-mat-du-an-.../`: Sự kiện 1 — Dòng Chảy Di Sản (đã đóng/ended)
  - `app/events/hanh-trinh-di-san/`: Sự kiện 2 — Hành Trình Di Sản (đã đóng đăng ký, `isFull` hardcoded `true`)
  - `app/events/trien-lam-nghe-thuat-can-so/`: Sự kiện 3 — Triển Lãm Nghệ Thuật Căn Số (đang mở, không giới hạn slot)

## Exhibition Notes

- Web app triển lãm "Căn Số" là một flow **mobile-first trên web**, không phải feature của Expo mobile app.
- Entry points chính:
  - `app/exhibition/canso/page.tsx`
  - `app/exhibition/canso/journey/layout.tsx`
  - `app/exhibition/canso/journey/context.tsx`
  - `app/exhibition/canso/journey/page.tsx`
  - `components/exhibition/PhotoboothCanvas.tsx`
  - `app/admin/exhibition/page.tsx`
- API đi qua `lib/api.ts` với namespace `api.exhibition.*`.
- Luồng hiện tại:
  - User phải đăng nhập trước khi tham gia exhibition.
  - Landing page `/exhibition/canso` chỉ còn CTA bắt đầu hành trình, không còn nhập mã riêng.
  - Khi vào `/exhibition/canso/journey`, `JourneyProvider` gọi backend bằng token hiện tại để lấy hoặc tự khởi tạo hành trình của user.
  - Mỗi chặng upload 1 ảnh check-in qua API backend.
  - Khi đủ 4 ảnh, client render photobooth bằng canvas và cho tải trực tiếp trên trình duyệt.
  - Admin chỉ theo dõi danh sách hành trình theo user ở `/admin/exhibition`, không còn QR hay generate code.
- Nguyên tắc khi sửa feature này:
  - Ưu tiên trải nghiệm mượt trên điện thoại trước desktop.
  - Tránh animation nặng hoặc layout làm cản trở thao tác upload camera.
  - Nếu sửa contract dữ liệu journey/checkin, cập nhật cả type trong `lib/api.ts` và context.
  - Nếu đổi flow photobooth, kiểm tra lại admin expectation vì hiện ảnh cuối đang render client-side, không lưu như một asset riêng trên backend.

## Community Module Notes

- Module Cộng đồng cho phép người dùng chia sẻ ảnh di sản, tương tác (Like/Save/Comment) và báo cáo vi phạm qua website.
- Entry points chính:
  - `app/community/page.tsx`: Trang thư viện cộng đồng (Masonry Gallery + Infinite Scroll).
  - `app/community/[id]/page.tsx`: Trang chi tiết bài viết (nếu mở trực tiếp link).
  - `components/masonry-gallery.tsx`: Component hiển thị lưới ảnh Masonry.
  - `components/community-post-dialog.tsx`: Modal chi tiết bài viết (Likes, Saves, Comments, Reports).
  - `components/community-upload-dialog.tsx`: Form đăng bài mới (Turnstile CAPTCHA).
  - `app/dashboard/community/page.tsx`: Trang quản lý cá nhân (4 tabs: Đã đăng, Đã lưu, Đã thích, Đã bình luận).
  - `app/admin/reports/page.tsx`: Admin quản lý báo cáo (phân loại Bài thi vs Bài cộng đồng).
- API integration:
  - Tất cả các gọi API đi qua `lib/api.ts` dưới namespace `api.community.*`.
- Nguyên tắc quan trọng:
  - **Masonry Layout**: Sử dụng `framer-motion` cho animation. Khi sửa đổi, đảm bảo đóng thẻ JSX đúng (`motion.div`).
  - **Auth Required**: Đăng bài, Like, Save, Comment, và Dashboard yêu cầu đăng nhập qua `AuthProvider`.
  - **Admin Actions**: Khi Admin xác nhận báo cáo bài viết cộng đồng, bài viết sẽ bị ẩn (`status = HIDDEN`).

## Event System Notes

- **EventPopup** (`components/event-popup.tsx`): popup tự động hiện sau 2 giây trên trang chủ, quảng bá sự kiện đang mở nhất. LocalStorage key format: `hideEventPopup-{slug}`. Hiện đang trỏ đến sự kiện 3 (`trien-lam-nghe-thuat-can-so`). Khi đổi sang sự kiện mới: cập nhật slug, title, description, `src` poster, và `href` Link.
- **EventCarousel** (`components/event-carousel.tsx`): hiển thị tại trang chủ (section "Dòng Chảy Di Sản"). Danh sách events được hardcode trong `const events[]`. Status quyết định nút CTA: `ended` → "Xem thêm", `open` → "Đăng ký ngay", `upcoming` → disabled "Sắp mở đăng ký". Khi thêm/sửa sự kiện chỉ cần sửa mảng `events`.
- **Google Sheets Script** (`scripts/web to google sheets.txt`): Apps Script dùng chung cho mọi sự kiện. `doPost` tự nhận diện event slug từ `data.event` để map đúng cột. Sự kiện 3 (`trien-lam-nghe-thuat-can-so`) dùng `data.currentLive` cho cột E và `data.selectedDates` (array) cho cột I. Sự kiện cũ dùng `data.major` cho cột E. Cần redeploy script sau mỗi lần thay đổi.
- **Form đăng ký sự kiện đóng**: để đóng đăng ký, set `isFull = true` và `registrationCount = MAX_REGISTRATIONS` cứng trong `useEffect`, không gọi API đếm slot nữa.
- **Slug convention**: folder route phải khớp slug trong `event-carousel.tsx`, `event-popup.tsx`, và field `data.event` trong form submit. Ba nơi phải đồng bộ khi thêm/đổi tên sự kiện.

## Judging Notes

- Entry points: `app/judging/page.tsx`, `app/judging/content.tsx`, `app/judging/components/ScoringModal.tsx`, `app/judging/components/ScoringCriteria.tsx`.
- Entry points admin: `app/admin/judging/page.tsx`, `app/admin/judging/content.tsx`.
- API judging đi qua `lib/api.ts` với namespace `api.judging.*`.
- Quy ước role hiện tại:
  `/judging` chỉ cho `judge` truy cập và chấm điểm.
  `admin` không đi qua flow chấm điểm, chỉ xem `/admin/judging`.
- Luồng nghiệp vụ hiện tại:
  có đúng 3 tài khoản BGK được cấp sẵn account role `judge` để chấm bài thật.
  Admin không chấm bài, chỉ theo dõi tiến độ chấm, bảng tổng hợp điểm và kết quả bình chọn.
- Mapping cột điểm ở `/admin/judging`:
  `BGK 1`, `BGK 2`, `BGK 3` được map cố định theo tên account `Ban Giám Khảo 1`, `Ban Giám Khảo 2`, `Ban Giám Khảo 3` từ backend, không còn map theo thứ tự `judge_id`.
- `app/judging/content.tsx` đã được tối ưu để:
  - chuẩn hóa `submission.media` và `coverImage` ngay sau fetch
  - chuẩn hóa `mediaType` về uppercase khi render judging để tránh mất ảnh khi backend trả `image`/`IMAGE` không đồng nhất
  - dùng `memo` cho card (`SubmissionJudgingCard`)
  - tránh animation nặng trên toàn grid
- Error handling cần nhớ:
  - `lib/api.ts` chỉ retry lỗi `5xx`, không retry lỗi `403`.
  - `/judging` và `/admin/judging` đều có state lỗi riêng; nếu load API fail thì phải hiện lỗi rõ ràng, không được giả thành "không có dữ liệu".
- `ScoringModal` không được nuốt mọi lỗi khi load `my-score`; nếu load điểm cũ thất bại phải hiện lỗi, không mặc định reset form về 0 rồi cho lưu đè.
- **Image display rules:**
  - Card thumbnail (`SubmissionJudgingCard`): dùng `object-cover` để ảnh luôn fill đầy khung `aspect-[3/4]`. **KHÔNG dùng `object-contain`** ở đây — sẽ gây ảnh nhỏ, letterbox, và trông lệch khi tỉ lệ ảnh gốc không khớp khung.
  - Detail modal (`SubmissionDetailModal`): dùng `object-contain` để xem toàn bộ ảnh không bị crop.
- Z-index note:
  sticky header ở `/judging` phải nằm trên badge SBD/card overlay khi cuộn trang; nếu sửa card badge thì không tăng `z-index` vượt header.
- Không đặt conditional `return null` trước hook bất kỳ trong component. **Đây là Rules of Hooks violation** — sẽ gây lỗi "Rendered fewer hooks than expected". Đã từng xảy ra ở `components/navigation.tsx` (early return ẩn nav trên `/judging` bị đặt trước `useEffect`). Fix: luôn gọi đủ hooks trước, đặt conditional return **sau** tất cả hooks.
- Không dùng hook như `useDeferredValue` sau nhánh `return` có điều kiện trong trang này; trước đó đã gây React production error `#310` do sai thứ tự hooks.

## Request/Data Flow

- Hầu hết dữ liệu động đi qua `lib/api.ts`.
- `API_URL` lấy từ `NEXT_PUBLIC_API_URL`, fallback hiện tại là backend production Render.
- Auth token lấy từ Firebase `auth.currentUser.getIdToken()`.
- Khi lỗi UI có nguồn từ server, check ở `lib/api.ts` trước rồi mới xuống từng page/component.

## AI Product Direction

- Mobile là nơi nghệ nhân dạy AI:
  - bổ sung tri thức
  - trả lời câu hỏi follow-up
  - định hình cách diễn đạt và cá tính riêng
- Web là nơi public sử dụng AI sau giai đoạn đào tạo:
  - user cuối trò chuyện với AI của từng nghệ nhân
  - không phải một chatbot chung vô danh
  - response cần đúng cả nội dung lẫn persona của nghệ nhân tương ứng
- Khi làm tính năng AI trên web, luôn tự kiểm tra:
  1. user đang chat với nghệ nhân nào
  2. request đã scope đúng theo nghệ nhân đó chưa
  3. UI có đang thể hiện rõ đây là AI của nghệ nhân cụ thể không
  4. câu trả lời có còn generic, mất cá tính riêng hay không

## Typical Trace By Task

- Lỗi trang admin/news/report/submission:
  route trong `app/admin/...` -> component liên quan -> `lib/api.ts` -> backend controller
- Lỗi login/profile:
  auth page/component -> `components/auth-provider.tsx` hoặc `lib/firebase/*` -> `lib/api.ts`
- Lỗi artist/chat/community:
  route page -> feature component -> `lib/api.ts`
- Lỗi AI public chat theo nghệ nhân:
  route chat/artist page -> component chat -> `lib/api.ts` hoặc AI endpoint tương ứng -> `ai-service`
- Lỗi judging:
  BGK chấm bài:
  `app/judging/content.tsx` -> `app/judging/components/*` -> `lib/api.ts` -> backend `JudgingController`
  Admin xem tiến độ/kết quả:
  `app/admin/judging/content.tsx` -> `lib/api.ts` -> backend `JudgingController`

## Run And Verify

```bash
npm run dev
npm run build
```

Hoặc nếu team dùng pnpm/bun theo local setup hiện có:

```bash
pnpm dev
pnpm build
```

## When AI Works Here

- Mở route trong `app/` trước, rồi xem component được import ngay trong route đó.
- Chỉ search toàn `components/` nếu route không đủ rõ.
- Nếu sửa contract dữ liệu, kiểm tra lại type/interface trong `lib/api.ts`.
- Nếu task liên quan AI trên web, nhớ bối cảnh đúng:
  - đây là lớp public chat cho user cuối
  - tri thức/persona gốc đến từ quá trình đào tạo trên mobile
  - ưu tiên trải nghiệm trò chuyện theo từng nghệ nhân, không gom thành một AI chung
