"use client";

import ParallaxHero from "@/components/parallax-hero";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Image as ImageIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ContestResults from "./components/ContestResults";


const sectionColors = [
  { bg: "#EEF2FF", header: "#C7D2FE", body: "#EEF2FF" },
  { bg: "#E0E7FF", header: "#818CF8", body: "#E0E7FF" },
  { bg: "#C7D2FE", header: "#6366F1", body: "#C7D2FE" },
  { bg: "#818CF8", header: "#4F46E5", body: "#818CF8" },
  { bg: "#393ADD", header: "#1E1F8C", body: "#393ADD" },
];

const accordionSections = [
  {
    id: "moc-thoi-gian",
    title: "MỐC THỜI GIAN",
    colorIndex: 0,
  },
  {
    id: "the-loai-tac-pham",
    title: "HẠNG MỤC DỰ THI",
    colorIndex: 1,
  },
  {
    id: "ban-giam-khao",
    title: "BAN GIÁM KHẢO",
    colorIndex: 2,
  },
  {
    id: "giai-thuong-hap-dan",
    title: "GIẢI THƯỞNG HẤP DẪN",
    colorIndex: 3,
  },
  {
    id: "mot-so-luu-y",
    title: "MỘT SỐ LƯU Ý",
    colorIndex: 4,
  },
];

const SectionContent = ({
  sectionId,
  colors,
}: {
  sectionId: string;
  colors: (typeof sectionColors)[0];
}) => {
  switch (sectionId) {
    case "moc-thoi-gian":
      return (
        <div
          className="rounded-lg overflow-hidden overflow-x-auto"
          style={{ backgroundColor: colors.bg }}
        >
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  className="py-4 px-6 text-center font-medium text-gray-900"
                  style={{ backgroundColor: colors.header }}
                >
                  Nhận tác phẩm
                </td>
                <td
                  className="py-4 px-6 text-center text-gray-900"
                  style={{ backgroundColor: colors.body }}
                >
                  28/02/2026 - 28/03/2026
                </td>
              </tr>
              <tr>
                <td
                  className="py-4 px-6 text-center font-medium text-gray-900"
                  style={{ backgroundColor: colors.header }}
                >
                  Bình chọn sản phẩm
                </td>
                <td
                  className="py-4 px-6 text-center text-gray-900"
                  style={{ backgroundColor: colors.body }}
                >
                  14/03/2026 - 28/03/2026
                </td>
              </tr>
              <tr>
                <td
                  className="py-4 px-6 text-center font-medium text-gray-900"
                  style={{ backgroundColor: colors.header }}
                >
                  Công bố kết quả
                </td>
                <td
                  className="py-4 px-6 text-center text-gray-900"
                  style={{ backgroundColor: colors.body }}
                >
                  31/03/2026
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    case "the-loai-tac-pham":
      return (
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: colors.bg }}
        >
          <div
            className="py-4 px-4 text-center font-bold text-gray-900 border-b border-gray-200/20"
            style={{ backgroundColor: colors.header }}
          >
            ĐỒ HỌA SÁNG TẠO
          </div>
          <div
            className="p-6 md:p-8 grid md:grid-cols-2 gap-8 text-gray-900"
            style={{ backgroundColor: colors.body }}
          >
            <div className="space-y-4">
              <p className="font-medium">
                Cuộc thi dành cho công dân Việt Nam từ 18 - 30 tuổi
              </p>
              <p className="font-medium">
                Mỗi cá nhân được đăng ký tối đa 01 tác phẩm dự thi
              </p>
              <div className="pt-4">
                <p className="font-bold mb-2">Hình thức thể hiện</p>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                  <li>Thiết kế đồ họa</li>
                  <li>Minh họa nghệ thuật</li>
                  <li>Poster sáng tạo</li>
                  <li>Digital art</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <p className="font-bold mb-2">Yêu cầu kích thước</p>
                <ul className="space-y-1 opacity-90 text-sm">
                  <li>Tỷ lệ 5:7 (kích thước pixel tối thiểu 5906 x 8268 px)</li>
                  <li>Tỷ lệ 2:3 (kích thước pixel tối thiểu 7087 x 10630 px)</li>
                  <li>Tỷ lệ 7:10 (kích thước pixel tối thiểu 8268 x 11811 px)</li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-2">Yêu cầu định dạng</p>
                <ul className="space-y-1 opacity-90 text-sm">
                  <li>File JPEG/PNG (hệ màu RGB)</li>
                  <li>File PDF (hệ màu CMYK)</li>
                </ul>
              </div>
              <p className="font-bold text-sm">Đảm bảo độ phân giải 300 DPI</p>
            </div>
          </div>
        </div>
      );
    case "ban-giam-khao":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
          {[
            {
              name: "Nghệ sĩ\nTùng Monkey",
              intro: "Nghệ sĩ nghệ thuật thị giác, nổi bật với các tác phẩm sáng tạo mang dấu ấn cá nhân và tư duy mỹ thuật đương đại",
              image: "https://i.ibb.co/DHW2xYRs/bai-16-alumni-25-nam-feanh-1-1731252794028-1.png", // Add image URL here
              isMiddle: false
            },
            {
              name: "Nghệ nhân\nNguyễn Đức Hiển",
              intro: "Đồng thầy thực hành tín ngưỡng thờ Mẫu tại Việt Nam, người đã có những đóng góp trong việc bảo tồn và lan tỏa giá trị văn hóa dân gian",
              image: "https://i.ibb.co/DPwLZHf0/Frame-48097402.png", // Add image URL here
              isMiddle: true
            },
            {
              name: "Nhà báo\nNguyễn Thông",
              intro: "Giám đốc trang tin Giải Trí Văn Hóa cung cấp đã dạng những chuyên mục phù hợp với mọi đối tượng",
              image: "https://i.ibb.co/4gMCDpzT/z7571073296816-2dc7381a56c265d97283a0c16233b581-1.png", // Add image URL here
              isMiddle: false
            }
          ].map((judge, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`rounded-2xl overflow-hidden shadow-xl flex flex-col transition-shadow duration-300 ${judge.isMiddle ? 'md:mb-4' : ''}`}
              style={{ backgroundColor: colors.body }}
            >
              <div className="aspect-[4/5] bg-gray-200/50 relative flex items-center justify-center overflow-hidden">
                {judge.image ? (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={judge.image}
                    alt={judge.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="p-6 text-center">
                <h4 className="font-bold text-gray-900 text-lg mb-2 whitespace-pre-line">{judge.name}</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{judge.intro}</p>
              </div>
            </motion.div>
          ))}
        </div>
      );
    case "mot-so-luu-y":
      return (
        <div
          className="rounded-lg p-8 text-white"
          style={{ backgroundColor: colors.body }}
        >
          <ul className="list-disc list-inside space-y-5 text-lg md:text-xl font-medium">
            <li>
              Tác phẩm dự thi chưa từng công bố hoặc đoạt giải ở cuộc thi khác
            </li>
            <li>
              Thí sinh phải chịu trách nhiệm về bản quyền hình ảnh, nội dung
            </li>
            <li>
              Không chấp nhận tác phẩm được hỗ trợ thực hiện bằng phần mềm trí
              tuệ nhân tạo (AI)
            </li>
            <li>Thí sinh cần đảm bảo nộp sản phẩm đúng hạn</li>
          </ul>
        </div>
      );
    case "giai-thuong-hap-dan":
      const prizes = [
        {
          title: "01 GIẢI NHẤT",
          desc: "1.000.000 VNĐ hiện kim + 15.000.000 VNĐ hiện vật",
          color: "#4A4BA8"
        },
        {
          title: "01 GIẢI NHÌ",
          desc: "800.000 VNĐ hiện kim + 7.000.000 VNĐ hiện vật",
          color: "#3A3B9F"
        },
        {
          title: "01 GIẢI BA",
          desc: "500.000 VNĐ hiện kim + 3.000.000 VNĐ hiện vật",
          color: "#2A2B9A"
        },
        {
          title: "01 GIẢI KHUYẾN KHÍCH",
          desc: "200.000 VNĐ hiện kim + 2.000.000 VNĐ hiện vật",
          color: "#1A1B96"
        },
        {
          title: "05 GIẢI BÌNH CHỌN",
          desc: "1.000.000 VNĐ hiện vật mỗi giải",
          color: "#0B0D93"
        }
      ];

      return (
        <div className="space-y-3 flex flex-col items-center">
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="px-8 py-5 rounded-xl flex flex-col items-start justify-center text-left gap-1 shadow-lg border border-white/10 w-full max-w-xl"
              style={{ backgroundColor: prize.color }}
            >
              <h4 className="text-lg font-black text-white uppercase tracking-wider">
                {prize.title}
              </h4>
              <p className="text-white/90 font-medium text-sm leading-snug">
                {prize.desc}
              </p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof accordionSections)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const colors = sectionColors[item.colorIndex];

  return (
    <div
      className="mb-2 overflow-hidden rounded-2xl"
      style={{ backgroundColor: colors.bg }}
    >
      <button
        onClick={onToggle}
        className="w-full transition-all py-4 px-6 flex items-center justify-between"
        style={{ backgroundColor: colors.bg }}
      >
        <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide">
          {item.title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="w-6 h-6 text-gray-900" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6">
              <SectionContent sectionId={item.id} colors={colors} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContestList() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await api.contests.getAll({ limit: 10 });
        setContests(response.items || []);
      } catch (error) {
        console.error("Failed to fetch contests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  if (loading) return <div className="text-center py-10 text-white">Đang tải danh sách cuộc thi...</div>;
  if (contests.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false, amount: 0.3 }}
      className="py-12 mb-12"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center border-b border-white/20 pb-4">
          Các cuộc thi đang diễn ra
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <Link href={`/contests/${contest.id}`} key={contest.id}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#393ADD] transition-all duration-300 hover:shadow-lg hover:shadow-[#393ADD]/10 group h-full flex flex-col">
                <div className="relative h-48 bg-zinc-800">
                  {contest.coverImageUrl ? (
                    <img
                      src={contest.coverImageUrl}
                      alt={contest.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#393ADD]/20 to-purple-500/20">
                      <Users className="w-12 h-12 text-[#393ADD]/50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant={contest.status === 'submit_open' ? 'default' : 'secondary'} className="bg-[#393ADD]">
                      {contest.status === 'submit_open' ? 'Đang nhận bài' :
                        contest.status === 'vote_open' ? 'Đang bình chọn' : contest.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#393ADD] transition-colors line-clamp-2">
                    {contest.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2 flex-1">
                    {contest.description || "Chưa có mô tả"}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{contest.submitOpenAt ? format(new Date(contest.submitOpenAt), 'dd/MM') : 'TBA'} - {contest.submitCloseAt ? format(new Date(contest.submitCloseAt), 'dd/MM') : 'TBA'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function ContestsPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const router = useRouter();

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handleAgree = () => {
    setShowRulesDialog(false);
    router.push("/contests/submit");
  };

  return (
    <ParallaxHero
      title="CUỘC THI SÁNG TẠO NGHỆ THUẬT"
      description="Lời kêu gọi gửi đến cộng đồng trẻ yêu Di sản Văn hóa Việt Nam"
      imageUrl="https://i.ibb.co/BHqDThSQ/C-ng-ng.png"
      heroChildren={
        <Button
          onClick={() => setShowRulesDialog(true)}
          className="bg-[#393ADD] hover:bg-[#393ADD]/90 text-white font-bold py-6 px-10 rounded-full cursor-pointer transition-all shadow-lg text-lg h-auto"
        >
          Tham gia ngay
        </Button>
      }
    >
      <main className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-zinc-900 border-zinc-800">
              <DialogHeader className="p-6 border-b border-zinc-800 shrink-0">
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#393ADD]" />
                  THỂ LỆ CUỘC THI
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 bg-zinc-800 relative overflow-hidden">
                <iframe
                  src="/THỂ LỆ CUỘC THI.pdf"
                  className="w-full h-full border-none"
                  title="Thể lệ cuộc thi"
                />
              </div>

              <DialogFooter className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row sm:justify-between items-center gap-4 shrink-0">
                <p className="text-sm text-zinc-400 hidden sm:block">
                  Vui lòng đọc kỹ thể lệ trước khi tham gia
                </p>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setShowRulesDialog(false)}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Đóng
                  </Button>
                  <Button
                    onClick={handleAgree}
                    className="bg-[#393ADD] hover:bg-[#393ADD]/90 text-white px-8"
                  >
                    Tôi đã hiểu và đồng ý
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="py-12"
          >
            <div
              className="max-w-4xl mx-auto rounded-lg overflow-hidden relative"
              style={{
                background:
                  "linear-gradient(180deg, #393ADD 2%, #5D5EA3 100%)",
              }}
            >
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              <div className="relative z-10">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 pb-4 border-b border-white/20">
                    Giới thiệu cuộc thi
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8 text-gray-200 text-sm leading-relaxed">
                    <div>
                      <p>
                        Cuộc thi Sáng tạo Nghệ thuật <span className="font-bold uppercase">“CĂN SỐ”</span> là sự khơi nguồn
                        tinh thần, đánh thức niềm tin yêu di sản từ bên trong
                        của mỗi bạn trẻ Việt Nam. Thông qua <span className="font-bold uppercase">“CĂN SỐ”</span>, thông qua
                        những sản phẩm sáng tạo, nơi người trẻ trở thành chủ thể
                        lưu giữ, truyền tải và tái sinh những giá trị văn hóa
                        bằng chính lăng kính của mình, để mỗi tác phẩm không chỉ
                        ghi lại “cái đã có” mà còn dự phóng cho “cái sẽ tiếp tục
                        sống”.
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-bold">Đề tài:</span> Hãy khám phá “cái căn” của chính mình, là cảm
                        nhận, rung động, niềm tin, hay mảnh ký ức văn hóa, và
                        tái diễn giải chúng bằng ngôn ngữ nghệ thuật của thời
                        đại số. Dù là một nét vẽ, một thiết kế hay một câu
                        chuyện, mỗi tác phẩm là dấu chỉ để bạn trả lời câu hỏi{" "}
                        <br />
                        “Bạn có căn không?”. <br /> Căn trong di sản <br /> Căn
                        trong tâm linh <br /> Căn trong bản ngã sáng tạo <br />{" "}
                        Tất cả đều đúng, miễn đó là tiếng gọi của bạn.
                      </p>
                    </div>
                  </div>
                </div>
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
            <h2 className="text-xl md:text-2xl font-medium text-center text-white mb-12">
              Hãy để tác phẩm của bạn trở thành mảnh ghép mới trong bức tranh di
              sản đương đại
            </h2>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.05 }}
            className="py-8"
          >
            <div className="max-w-4xl mx-auto">
              {accordionSections.map((item) => (
                <div key={item.id}>
                  <AccordionItem
                    item={item}
                    isOpen={openSection === item.id}
                    onToggle={() => toggleSection(item.id)}
                  />
                </div>
              ))}
              {/* Sau ngày 4/4: hiển thị BXH kết quả thay vì nút bình chọn */}
              {new Date() >= new Date('2026-04-04T23:59:59+07:00') ? (
                <ContestResults contestId="1740a8d0-988e-4d6e-84a2-ee8b01f2a5f3" />
              ) : (
                <div className="flex justify-center mt-8">
                  <Link
                    href="/contests/vote"
                    className="bg-[#393ADD] hover:bg-[#393ADD]/90 text-white font-bold py-3 px-10 rounded-full transition-all shadow-lg"
                  >
                    Bình chọn ngay
                  </Link>
                </div>
              )}
            </div>
          </motion.section>
        </div>
        <Footer />
      </main>
    </ParallaxHero>
  );
}
