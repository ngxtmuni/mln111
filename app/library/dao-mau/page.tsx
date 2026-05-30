import RufflePlayer from '@/components/ruffle-player';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Ứng dụng Di sản Đạo Mẫu | Kết nối Di sản',
  description: 'Khám phá không gian văn hóa Đạo Mẫu thông qua ứng dụng tương tác.',
};

export default function DaoMauPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#393ADD]">
              Số hóa di sản: Thờ Mẫu Tam Phủ
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Ứng dụng tương tác giúp bạn tìm hiểu chi tiết về hệ thống thần linh, trang phục và các nghi lễ trong tín ngưỡng thờ Mẫu của người Việt.
            </p>
          </div>

          {/* Flash App Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-red-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 shadow-2xl overflow-hidden">
              <div className="p-2 bg-zinc-800/50 flex justify-between items-center border-b border-zinc-700">
                <div className="flex gap-2 ml-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-xs text-zinc-500 font-mono italic">
                  Powered by Ruffle Emulator
                </div>
              </div>
              <div className="aspect-video w-full min-h-[600px]">
                <iframe 
                  src="/apps/dao-mau/index.html" 
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen"
                ></iframe>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-white italic max-w-3xl mx-auto">
            Nội dung bạn đang xem được kế thừa từ công trình nghiên cứu thực hiện bởi nhà nghiên cứu Lê Văn Thao và nhóm nhà xuất bản Enter Việt Nam
          </p>

          {/* Instructions */}
          <div className="grid md:grid-cols-2 gap-8 text-sm text-zinc-400 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50">
            <div>
              <h3 className="text-white font-semibold mb-2">Hướng dẫn tương tác:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Sử dụng chuột để nhấn vào các biểu tượng và thực thể trên màn hình.</li>
                <li>Hầu hết các mục đều có nút quay lại (Back) để về menu chính.</li>
                <li>Âm nhạc được tích hợp sẵn trong ứng dụng.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Lưu ý về phiên bản:</h3>
              <p>
                Đây là phiên bản web được giả lập bằng công nghệ Ruffle. Một số tính năng video có thể bị hạn chế trong bản thử nghiệm này để đảm bảo tốc độ tải trang nhanh nhất.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
