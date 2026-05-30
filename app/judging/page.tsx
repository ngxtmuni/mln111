import { Suspense } from "react";

import JudgingContent from "./content";

export const metadata = {
  title: "Chấm điểm BGK — Căn Số 2026",
  description: "Giao diện chấm điểm dành riêng cho Ban Giám Khảo cuộc thi Căn Số.",
};

export default function JudgingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Đang tải...</div>}>
      <JudgingContent />
    </Suspense>
  );
}
