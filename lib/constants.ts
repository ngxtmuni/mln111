import type { RegionItem } from "@/components/region-timeline";

export const REGION_DATA: RegionItem[] = [
  {
    label: "Bắc Bộ",
    title: "Giữ gìn tinh hoa và cội nguồn",
    description:
      "Bắc Bộ không chỉ là cái nôi thiêng liêng của Tín ngưỡng Thờ Mẫu Tam Phủ, mà còn là vùng đất định hình nên mọi chuẩn mực vàng son của nghi lễ. Hồn cốt của di sản ngự tại những Đền Phủ cổ kính, nơi mỗi nghi thức Hầu Đồng, tinh hoa trong từng lời văn, trang phục và điệu múa đều được xem như là di sản quý báu được giữ gìn nghiêm cẩn qua bao thế hệ cho đến mai sau.",
  },
  {
    label: "Trung Bộ",
    title: "Giao thoa văn hóa Nam – Bắc",
    description:
      "Khi di sản xuôi dòng về miền Trung, tìm thấy sự hòa quyện kỳ diệu với văn hóa bản địa. Đây là hành trình của sự biến đổi hài hòa, nơi Tín ngưỡng Thờ Mẫu giao thoa với lịch sử và các vị thần địa phương. Vùng đất này trở thành cầu nối linh hoạt, không chỉ tiếp nhận mà còn làm giàu đẹp thêm di sản bằng những sắc thái, nghi thức và câu chuyện Thánh nhân gắn liền với lịch sử, khẳng định sức sống mãnh liệt của niềm tin trên mọi miền đất nước.",
  },
  {
    label: "Nam Bộ",
    title: "Lan tỏa Di sản vào đời sống hiện đại",
    description:
      "Tại miền Nam, Tín ngưỡng Thờ Mẫu mang một sức sống hoàn toàn mới, như một dòng chảy linh thiêng mượt mà hòa vào nhịp đập đô thị. Nơi đây, di sản không hề rập khuôn mà được cộng đồng tôn vinh qua ngôn ngữ và hình thức sáng tạo. Đây chính là bằng chứng diệu kỳ về khả năng vươn mình của Tín ngưỡng, qua đó mở rộng biên giới di sản từ những Đền Phủ để khẳng định sự tiếp nối không ngừng nghỉ của niềm tin giữa lòng thành thị sôi động.",
  },
];

export type NavSubItem = {
  href: string;
  label: string;
};

export type NavItem = {
  href: string;
  label: string;
  button?: boolean;
  submenu?: NavSubItem[];
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/news", label: "Tin tức" },
  { href: "/projects", label: "Dự án" },
  {
    href: "/library",
    label: "Thư viện",
    submenu: [{ href: "/library/dao-mau", label: "Ứng dụng Đạo Mẫu" }],
  },
  { href: "/contests", label: "Cuộc thi", button: true },
];
