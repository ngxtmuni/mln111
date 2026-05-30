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

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-primary/10 via-35% to-primary/45 py-12 px-4">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Cột trái: Thông tin đơn vị & Đội ngũ */}
          <div className="space-y-4">
            <p className="text-white text-sm">
              <span className="font-semibold">Điều phối sản xuất:</span> Trung Tâm
              Xúc Tiến Quảng Bá Di Sản Văn Hóa Phi Vật Thể Việt Nam
            </p>
            <p className="text-white text-sm font-bold">
              Đội ngũ thực hiện: Nhóm dự án Gõ Việt Nam | GOVIETNAMEZE
            </p>
            <p className="text-white text-sm">
              <span className="font-semibold">Tel:</span> 035 643 7530
            </p>
            <p className="text-white text-sm">
              <span className="font-semibold">Email:</span>{" "}
              contact@govietnameze.vn
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.facebook.com/gochauthienhoi?locale=vi_VN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@govietnameze?_r=1&_t=ZS-94JMR5ubylz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Cột phải: Liên hệ Biên tập & Logo nhà tài trợ */}
          <div className="space-y-4 md:text-right flex flex-col md:items-end">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">
                Thông tin liên hệ
              </h4>
              <p className="text-white text-sm">
                <span className="font-semibold">Trưởng ban Biên tập:</span> Võ
                Đoàn Gia Hân
              </p>
              <p className="text-white text-sm">
                <span className="font-semibold">Tel:</span> 0948 609 179
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <img
                src="https://i.ibb.co/RGPW6FRf/ng-T-Ch-c-VICH-2.png"
                alt="VICAS"
                className="h-10 md:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <img
                src="/GVN@2x 1.png"
                alt="GVN"
                className="h-10 md:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
