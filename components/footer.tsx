"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-primary/10 via-35% to-primary/45 py-12 px-4">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Cột trái: Thông tin đơn vị & Đội ngũ */}
          <div className="space-y-4">
            <p className="text-white text-sm font-bold">
              Đội ngũ thực hiện: Nhóm MLN101
            </p>
            
            <div className="flex flex-col gap-2 pt-2 text-white/80 text-sm">
              <span>
                Sự ra đời của sản phẩm có sự hỗ trợ từ
              </span>
              
              <div className="flex items-center gap-3">
                <img 
                  src="/ChatGPT_logo.svg" 
                  alt="ChatGPT"
                  title="ChatGPT" 
                  className="h-5 w-auto object-contain brightness-95 hover:brightness-110 transition-all cursor-help"
                />
                <img 
                  src="/Google-gemini-icon.svg.png" 
                  alt="Gemini"
                  title="Gemini" 
                  className="h-5 w-auto object-contain brightness-95 hover:brightness-110 transition-all cursor-help"
                />
              </div>
            </div>

            {/* <p className="text-white text-sm">
              <span className="font-semibold">Tel:</span> 035 643 7530
            </p>
            */}

            {/* <p className="text-white text-sm">
              <span className="font-semibold">Email:</span>{" "}
              contact@govietnameze.vn
            </p>
            */}
          </div>

          {/* Cột phải: Liên hệ Biên tập */}
          <div className="space-y-4 md:text-right flex flex-col md:items-end">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">
                Thông tin liên hệ
              </h4>
              <p className="text-white text-sm">
                <span className="font-semibold">Trưởng nhóm dự án:</span> Nguyễn Thế Minh
              </p>
              
              {/* <p className="text-white text-sm">
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