"use client";

export default function ScoringCriteria() {
  const criteria = [
    {
      group: "Nhóm I — Chuyên môn",
      groupWeight: "40%",
      color: "blue",
      items: [
        { num: 1, name: "Bố cục & Thị giác", weight: "10%", desc: "Cấu trúc layout rõ ràng; bắt mắt về thị giác; khả năng tổ chức thông tin mạch lạc" },
        { num: 2, name: "Màu sắc & Hình khối", weight: "10%", desc: "Màu sắc phù hợp với nội dung truyền tải, bắt mắt, sinh động; nội dung chữ và hình hài hòa" },
        { num: 3, name: "Kỹ thuật & Khả năng ứng dụng số", weight: "10%", desc: "Sử dụng các phần mềm công cụ phù hợp, linh hoạt; phù hợp với nội dung mà tác phẩm truyền tải" },
        { num: 4, name: "Ngôn ngữ thiết kế", weight: "10%", desc: "Khả năng kể chuyện, truyền tải thông điệp bằng hình khối; nội dung cô đọng, gắn sát với chủ đề cuộc thi" },
      ],
    },
    {
      group: "Nhóm II — Tiêu chí khác",
      groupWeight: "60%",
      color: "purple",
      items: [
        { num: 5, name: "Cảm nhận & Cách diễn giải", weight: "15%", desc: "Tác phẩm thể hiện rõ \"cái căn\" của tác giả thành những hình ảnh, cấu trúc, chuyển động sinh động, cụ thể" },
        { num: 6, name: "Sự kết nối với tín ngưỡng văn hóa dân gian", weight: "15%", desc: "Mức độ thấu hiểu, tôn trọng và kết hợp, giao thoa nhuần nhuyễn các chất liệu văn hóa (đặc biệt là Thờ Mẫu Tam Phủ)" },
        { num: 7, name: "Tính thời đại", weight: "10%", desc: "Tác phẩm mang tính thời sự, được đặt trong bối cảnh hôm nay; gần gũi với đời sống người trẻ" },
        { num: 8, name: "Sự sáng tạo & Đột phá", weight: "10%", desc: "Tác phẩm mang đến góc nhìn mới lạ, không rập khuôn, thể hiện được nét độc đáo, dấu ấn riêng biệt; tránh minh họa sáo mòn" },
        { num: 9, name: "Khả năng lan tỏa", weight: "10%", desc: "Tác phẩm có khả năng khơi gợi cảm xúc, tạo suy ngẫm kết nối cộng đồng và đối thoại xã hội" },
      ],
    },
  ];

  const reference = [
    { range: "0 – 20 điểm", desc: "Chưa đạt yêu cầu cơ bản, nội dung sơ sài, kỹ thuật yếu, thiếu sự đầu tư.", color: "text-red-400 bg-red-500/10 border-red-500/30" },
    { range: "21 – 50 điểm", desc: "Đáp ứng ở mức cơ bản nhưng chưa ấn tượng, còn nhiều lỗi kỹ thuật hoặc bố cục.", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
    { range: "51 – 80 điểm", desc: "Tác phẩm tốt, có sự đầu tư, thể hiện rõ thông điệp và kỹ thuật khá.", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { range: "81 – 100 điểm", desc: "Tác phẩm xuất sắc, đột phá, kỹ thuật điêu luyện, cảm xúc mạnh mẽ và tính ứng dụng cao.", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Khung Tiêu Chí Chấm Điểm</h2>
        <p className="text-zinc-400 mt-2">Thang điểm 100 — (Dự thảo) Kế hoạch thực hiện xếp hạng cuộc thi CĂN SỐ</p>
      </div>

      {criteria.map((group) => (
        <div key={group.group} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className={`px-6 py-4 flex items-center justify-between ${group.color === "blue" ? "bg-blue-600/20 border-b border-blue-600/30" : "bg-purple-600/20 border-b border-purple-600/30"}`}>
            <h3 className={`font-bold text-lg ${group.color === "blue" ? "text-blue-300" : "text-purple-300"}`}>{group.group}</h3>
            <span className={`text-2xl font-black ${group.color === "blue" ? "text-blue-400" : "text-purple-400"}`}>{group.groupWeight}</span>
          </div>
          <div className="divide-y divide-zinc-800">
            {group.items.map((item) => (
              <div key={item.num} className="px-6 py-4 flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${group.color === "blue" ? "bg-blue-600/20 text-blue-400" : "bg-purple-600/20 text-purple-400"}`}>
                  {item.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold">{item.name}</p>
                    <span className={`text-sm font-bold ${group.color === "blue" ? "text-blue-400" : "text-purple-400"}`}>{item.weight}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Reference table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h3 className="font-bold text-white text-lg">Bảng Tham Chiếu — Mức Độ Hoàn Thành</h3>
        </div>
        <div className="divide-y divide-zinc-800">
          {reference.map((r) => (
            <div key={r.range} className={`px-6 py-4 flex items-start gap-4 border-l-4 ${r.color}`}>
              <span className={`font-mono font-bold text-sm flex-shrink-0 w-28 ${r.color.split(" ")[0]}`}>{r.range}</span>
              <p className="text-zinc-300 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
