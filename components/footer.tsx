import { Facebook, Instagram } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function CozeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.366 12.096a.61.61 0 0 0-.608.608v1.218a.609.609 0 1 0 1.217 0v-1.218a.61.61 0 0 0-.609-.608m.8 3.453a.605.605 0 0 1 0-.86.605.605 0 0 1 .859 0 1.52 1.52 0 0 0 2.149 0 .605.605 0 0 1 .859 0 .605.605 0 0 1 0 .86 2.73 2.73 0 0 1-3.867 0m4.062-2.24a.61.61 0 1 1 .609.609.606.606 0 0 1-.61-.609zM3.023 0A3.024 3.024 0 0 0 0 3.023v17.954A3.024 3.024 0 0 0 3.023 24h17.954A3.024 3.024 0 0 0 24 20.977V3.023A3.024 3.024 0 0 0 20.977 0ZM12.1 3.78h.004a6.287 6.287 0 0 1 6.283 6.286v2.635h1.508c1.73 0 2.12 2.426.476 2.97l-1.984.663v1.137a1.513 1.513 0 0 1-2.19 1.353l-1.101-.549c-.052-.024-.115 0-.131.055-.892 2.785-4.835 2.785-5.727 0a.095.095 0 0 0-.13-.055l-1.102.55a1.513 1.513 0 0 1-2.19-1.354v-1.139l-1.984-.66c-1.647-.541-1.254-2.97.477-2.97h1.507v-2.636A6.285 6.285 0 0 1 12.1 3.78" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-primary/10 via-35% to-primary/45 py-12 px-4">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Cột trái: Thông tin đơn vị & Đội ngũ */}
          <div className="space-y-4">
            <p className="text-white text-sm">
              <span className="font-semibold">Trưởng nhóm dự án:</span> Nguyễn Thế Minh
            </p>
            <p className="text-white text-sm font-bold">
              Đội ngũ thực hiện: Nhóm MLN101
            </p>
            
            {/* AI Attribution Stack with Icon */}
            <div className="flex items-center gap-2 pt-2 text-white/80 text-sm">
              <CozeIcon className="w-5 h-5 text-[#4D53E8]" />
              <span>
                Sự ra đời của sản phẩm có sự hỗ trợ từ trí tuệ nhân tạo Coze AI
              </span>
            </div>

            {/* 
            <p className="text-white text-sm">
              <span className="font-semibold">Tel:</span> 035 643 7530
            </p>
            */}

            {/* 
            <p className="text-white text-sm">
              <span className="font-semibold">Email:</span>{" "}
              contact@govietnameze.vn
            </p>
            */}
          </div>

          {/* Cột phải: Liên hệ Biên tập & Logo nhà tài trợ */}
          <div className="space-y-4 md:text-right flex flex-col md:items-end">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">
                Thông tin liên hệ
              </h4>
              <p className="text-white text-sm">
                <span className="font-semibold">Trưởng nhóm dự án:</span> Nguyễn Thế Minh
              </p>
              
              {/* 
              <p className="text-white text-sm">
                <span className="font-semibold">Tel:</span> 0948 609 179
              </p>
              */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}