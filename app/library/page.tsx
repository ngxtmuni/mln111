"use client";

import ParallaxHero from "@/components/parallax-hero";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const hierarchyItems = [
  "NGỌC HOÀNG",
  "THÁNH MẪU",
  "NGŨ VỊ TÔN QUAN",
  "CHÂU BÀ",
  "ÔNG HOÀNG",
  "THÁNH CÔ",
  "THÁNH CẬU",
];

const valueCards = [
  {
    id: 1,
    title: "Name",
    image: "https://picsum.photos/seed/value1/400/300",
    description: "Mô tả giá trị",
  },
  {
    id: 2,
    title: "Name",
    image: "https://picsum.photos/seed/value2/400/300",
    description: "Mô tả giá trị",
  },
];

const libraryCategories = [
  {
    id: "thanh-nhan",
    title: "Thánh Nhân",
    image: "https://picsum.photos/seed/thanhnhan/300/400",
  },
  {
    id: "ma-le",
    title: "Mã Lệ",
    image: "https://picsum.photos/seed/male/300/400",
  },
  {
    id: "chau-van",
    title: "Châu Văn",
    image: "https://picsum.photos/seed/chauvan/300/400",
  },
];

export default function LibraryPage() {
  return (
    <ParallaxHero
      title="THƯ VIỆN"
      description="Kho tư liệu số hóa hệ thống các giá trị di sản Thờ Mẫu Tam Phủ nhằm bảo tồn những giá trị cốt lõi của di sản"
      imageUrl="https://i.ibb.co/BHqDThSQ/C-ng-ng.png"
    >
      <main className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-8 py-16">
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="py-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              <div className="relative w-full aspect-[4/3] md:aspect-auto md:w-[55%] shrink-0 overflow-hidden rounded-lg">
                <Image
                  src="/thu-vien-1.png"
                  alt="Thánh Nhân"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Nguồn gốc của Tín ngưỡng Thờ Mẫu
                </h2>
                <p className="leading-relaxed text-lg text-justify">
                  Tín ngưỡng Thờ Mẫu Tam Phủ có cội rễ sâu xa bắt nguồn từ tục
                  thờ Nữ thần và Mẫu thần. Đây là tín ngưỡng bản địa hình thành
                  trên nền văn hóa nông nghiệp lúa nước, nơi các hiện tượng tự
                  nhiên như Trời, Đất, Nước, và Rừng núi được nhân thần hóa
                  thành các vị thần có khả năng sản sinh, bảo trợ và che chở cho
                  con người. Từ sự tôn thờ Nữ thần tự nhiên này, tín ngưỡng dần
                  được hệ thống hóa thành Tam Phủ, bao gồm Thiên Phủ (miền
                  Trời), Địa Phủ (miền Đất) và Thoải Phủ (miền Sông Nước).{" "}
                  <br />
                  <br />
                  Bước ngoặt lớn nhất trong lịch sử phát triển của Tín ngưỡng
                  Thờ Mẫu là sự xuất hiện của Thánh Mẫu Liễu Hạnh. Thần tích của
                  Mẫu là sự tổng hòa giữa thiên thần và nhân thần, giúp hình
                  tượng Thánh Mẫu trở nên vừa linh thiêng vừa gần gũi. Đồng thời
                  giúp hệ thống thần linh bản địa được hoàn thiện, trở nên nhân
                  bản và có tính tổ chức cao hơn, duy trì sức sống bền bỉ của di
                  sản này cho đến tận ngày nay.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="py-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-4">Hệ thống thần linh</h2>
                <p className="leading-relaxed text-lg text-justify">
                  Trong tín ngưỡng thờ Mẫu của người Việt, hệ thống thần linh
                  được tổ chức theo cả chiều dọc và chiều ngang. Chiều dọc phân
                  theo quyền uy của các vị thần thánh, chiều ngang được phân
                  theo miền (còn gọi là phủ), có bốn miền tương ứng với bốn yếu
                  tố ảnh hưởng trực tiếp đến đời sống của con người Thiên phủ
                  (miền Trời), Địa phủ (miền Đất), Thoải phủ (miền Nước) và Nhạc
                  phủ (miền Rừng núi). Mỗi phủ do một vị Thánh Mẫu đứng đầu,
                  dưới đó là hệ thống các thần linh trong thực hành tín ngưỡng
                  như Quan Lớn, Chầu Bà, Ông Hoàng, các Cô, các Cậu, Ngũ Hổ, Ông
                  Lốt hay các linh thần bản địa khác. <br />
                  <br />
                  Theo một thần tích thì thần chủ của đạo Mẫu là Thánh Mẫu Liễu
                  Hạnh được Phật Bà Quan Âm phù giúp nên đã quy y Phật pháp, từ
                  ấy có thờ Phật Bà ở trên cùng trong hệ thống thần linh, đồng
                  thời cũng cho thấy sự giao thoa với Phật giáo và tín ngưỡng
                  Thờ Mẫu. Mặc dù được gọi là “thờ Mẫu”, hệ thống thần linh
                  không chỉ gồm các nữ thần mà còn có nhiều nam thần, thể hiện
                  sự dung hòa giữa các quan niệm tín ngưỡng và nét tương đồng
                  với truyền thống thờ cúng tổ tiên. Bên cạnh đó, Ngọc Hoàng
                  Thượng Đế cũng được xem là hình tượng đại diện cho yếu tố phụ
                  hệ trong vũ trụ quan dân gian. Tuy nhiên, cả Phật Bà Quan Âm
                  và Ngọc Hoàng Thượng Đế chủ yếu mang ý nghĩa biểu trưng về
                  quyền năng tối linh, ít xuất hiện trực tiếp trong các nghi
                  thức thực hành.
                </p>
              </div>
              <div className="relative w-full aspect-[4/3] md:aspect-auto md:w-1/2 shrink-0 overflow-hidden rounded-lg order-1 md:order-2">
                <Image
                  src="/thu-vien-2.png"
                  alt="Thánh Nhân"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </div>
          </motion.section>

          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="py-4 text-3xl md:text-5xl text-primary font-bold"
          >
            Hệ thống giá trị
          </motion.h2>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="py-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              <div className="relative w-full aspect-[4/3] md:aspect-auto md:w-[55%] shrink-0 overflow-hidden rounded-lg">
                <Image
                  src="/thu-vien-3.png"
                  alt="Thánh Nhân"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Giá trị văn hóa</h2>
                <p className="leading-relaxed text-lg text-justify">
                  Tín ngưỡng Thờ Mẫu Tam Phủ giữ vai trò trung tâm trong đời
                  sống tinh thần của người Việt được thể hiện qua những giá trị
                  vô song. Với hệ thống thần điện đặt Mẫu ở vị trí chủ đạo, qua
                  đó tôn vinh hình tượng người phụ nữ. Bên cạnh đó, Thờ Mẫu còn
                  là nguồn “giáo dục lịch sử trực quan”, tích hợp các anh hùng
                  dân tộc để nuôi dưỡng lòng yêu nước sâu sắc. Cấu trúc Tam Phủ
                  phản ánh tinh thần hòa hợp dân tộc, khả năng dung nạp và gắn
                  kết cộng đồng văn hóa. Cùng với nghi lễ Hầu đồng đáp ứng nhu
                  cầu tâm linh, mang chức năng trị liệu, giúp giải tỏa cảm xúc
                  và nâng đỡ tinh thần trong đời sống hiện đại.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="py-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-stretch">
              <div>
                <h2 className="text-3xl font-bold mb-4 md:text-right">
                  Giá trị nghệ thuật
                </h2>
                <p className="leading-relaxed text-lg text-justify">
                  Giá trị nghệ thuật là phương tiện sống động và trực quan để
                  truyền tải văn hóa của thực hành Tín ngưỡng Thờ Mẫu. Nền tảng
                  của nghệ thuật này là âm nhạc Chầu Văn, với giai điệu linh
                  hoạt và nhạc cụ truyền thống giữ vai trò chủ đạo, dẫn dắt
                  Thanh Đồng đạt trạng thái nhập đồng. Nghi lễ còn là một hình
                  thức kịch nghệ độc đáo được thể hiện qua điệu múa Hầu đồng
                  mang tính biểu tượng, mô phỏng hành trạng Thánh. Yếu tố thị
                  giác được mã hóa mạnh mẽ qua ngôn ngữ trang phục. Tất cả các
                  yếu tố này được đặt trong không gian Đền Phủ, tạo nên một bối
                  cảnh linh thiêng và thẩm mỹ cho mọi nghi thức.
                </p>
              </div>
              <div className="relative w-full aspect-[4/3] md:aspect-auto md:w-1/2 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src="/thu-vien-4.png"
                  alt="Thánh Nhân"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </div>
          </motion.section>
        </div>
        <Footer />
      </main>
    </ParallaxHero>
  );
}
