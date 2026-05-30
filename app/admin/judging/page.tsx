import { Suspense } from "react";
import AdminJudgingContent from "./content";

export const metadata = {
  title: "Kết Quả Chấm Điểm — Admin",
};

export default function AdminJudgingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Đang tải...</div>}>
      <AdminJudgingContent />
    </Suspense>
  );
}
