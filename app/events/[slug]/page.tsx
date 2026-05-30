"use client"

import { useRef, useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2, Mail, User, Phone, Users, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ParallaxHero from "@/components/parallax-hero"
import Footer from "@/components/footer"
import VariableProximity from "@/components/VariableProximity"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Họ tên phải ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại không hợp lệ.",
  }),
  referralSource: z.string().min(1, {
    message: "Vui lòng chọn nguồn bạn biết đến dự án.",
  }),
  otherReferralSource: z.string().optional(),
  participantCount: z.string().min(1, {
    message: "Vui lòng nhập số lượng người tham gia.",
  }),
})

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby1e53hqLBFhTP75VWTHyo8bBFoq7XOdANtOEtXEM_ufRulqjM_xApZfoxRAzeKtNd6vA/exec"

export default function EventRegistrationPage() {
  const params = useParams()
  const slug = params.slug as string
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isFull = false // Mặc định là false, Backend sẽ xử lý qua API sau này

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      referralSource: "",
      otherReferralSource: "",
      participantCount: "1",
    },
  })

  const referralSource = form.watch("referralSource")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const submissionData = {
        ...values,
        referralSource: values.referralSource === "khac" ? values.otherReferralSource : values.referralSource,
        event: slug,
        date: new Date().toLocaleString("vi-VN")
      }

      if (!GOOGLE_SCRIPT_URL) {
        console.log("Dữ liệu đăng ký (Chưa cấu hình URL):", submissionData)
        await new Promise(resolve => setTimeout(resolve, 1500))
      } else {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        })
      }

      setIsSubmitted(true)
      toast.success("Đăng ký thành công!")
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const containerRef = useRef(null);

  return (
    <div className="bg-black min-h-screen">
      {/* SECTION 1: HERO POSTER */}
      <ParallaxHero
        title="DÒNG CHẢY DI SẢN"
        description="Chương trình di sản #1"
        imageUrl="/poster-event-1.png"
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {/* SECTION 2: TITLE */}
            <section className="py-12 bg-black text-center">
              <div className="relative inline-flex items-center justify-center mx-auto" ref={containerRef}>
                <img
                  src="/Cloud.png"
                  alt=""
                  className="absolute w-24 md:w-32 h-auto transform -left-4 md:left-1 -top-4 md:top-4 z-7 pointer-events-none"
                />

                
                <VariableProximity
                  label={'THỦ ĐÔ HÀ NỘI'}
                  className={'text-4xl md:text-6xl text-white tracking-tighter uppercase px-8 md:px-16 z-8'}
                  fromFontVariationSettings="'wght' 400, 'opsz' 9"
                  toFontVariationSettings="'wght' 1000, 'opsz' 40"
                  containerRef={containerRef}
                  radius={100}
                  falloff='linear'
                />
                <img
                  src="/Cloud-2.png"
                  alt=""
                  className="absolute w-24 md:w-36 h-auto -right-4 md:-right-8 -top-4 md:-top-8 z-7 pointer-events-none"
                />
              </div>
            </section>

            {/* SECTION 3: PROJECT POSTER */}
            <section className="bg-black flex justify-center px-4">
              <div className="max-w-6xl w-full">
                <img
                  src="/poster-event-1.png"
                  alt="Poster dự án"
                  className="w-full h-auto object-contain shadow-2xl rounded-sm"
                />
              </div>
            </section>

            {/* SECTION 4: PROJECT INFO */}
            <section className="py-20 bg-black">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 relative">
                <img
                  src="/canh-bien.png"
                  alt=""
                  className="hidden md:block absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-auto z-10 pointer-events-none"
                />
                {/* Left side (60%) */}
                <div className="md:w-[60%] bg-[#3031BA] p-8 md:p-12 text-white flex flex-col justify-center relative">
                  <img src="/Cloud-3.png" alt="Cloud" className="hidden md:block w-32 h-auto absolute top-12" />
                  <p className="italic text-sm md:text-base opacity-80 mb-6 font-light">
                    08h00 - 11h00, 06/03/2026
                  </p>
                  <h3 className="text-3xl md:text-4xl font-black leading-tight mb-8 uppercase">
                    RA MẮT DỰ ÁN QUẢNG BÁ DI SẢN THỰC HÀNH TÍN NGƯỠNG THỜ MẪU TAM PHỦ
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed opacity-90 font-light z-8">
                    Với mong muốn tạo ra một không gian giao thoa giữa giá trị truyền thống và nhịp sống đương đại, thu hẹp khoảng cách giữa người trẻ và Tín ngưỡng Thờ Mẫu Tam Phủ. Đây không chỉ là hành trình tìm về cội nguồn mà còn là nỗ lực kiến tạo nên một nền tảng tri thức, một góc nhìn chính thống, đa chiều và gần gũi về Di sản Văn hóa Phi vật thể đại diện của nhân loại, đồng thời nỗ lực lan tỏa giá trị di sản đến thế hệ trẻ trên cả ba miền đất nước.
                  </p>
                  <img src="/Dan.png" alt="Dan" className="w-44 h-auto hidden md:block absolute bottom-8 right-10 z-7 opacity-55" />
                </div>

                {/* Right side (40%) */}
                <div className="md:w-[40%] bg-white p-8 md:p-12 text-[#393ADD] flex flex-col justify-center">
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-lg mb-2">Ra mắt ấn phẩm nghiên cứu về Hát Văn của ông Ngô Nhật Tăng</h4>
                      <p className="text-sm leading-relaxed opacity-80">
                        Nhằm phát huy vai trò của các nhà nghiên cứu, nghệ nhân trong việc đồng hành, cố vấn chuyên môn cho thế hệ trẻ trong việc xây dựng các chương trình quảng bá di sản văn hóa. Ấn phẩm về Hát Văn là cả một quá trình tâm huyết của người nghệ nhân với công trình nghiên cứu và phân tích hơn 100 bản văn cổ, các điển tích điển cố.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Ra mắt Thư viện số hóa Đạo Mẫu Việt Nam</h4>
                      <p className="text-sm leading-relaxed opacity-80">
                        Thư viện là một tài sản trọng tâm của dự án, được phát triển từ kho tư liệu do nhóm nghiên cứu của bác Lê Văn Thao thực hiện, góp phần hệ thống hóa, bảo tồn và lan tỏa các giá trị tư liệu về tín ngưỡng thờ Mẫu.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Diễn đàn chia sẻ và giao lưu</h4>
                      <p className="text-sm leading-relaxed opacity-80">
                        Cùng nhau lắng nghe những chia sẻ từ những thế hệ kì cựu đến thế hệ kế cận như thanh niên, về hành trình giữ lửa, thắp đuốc và lan tỏa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: REGISTRATION FORM */}
            <section className="py-24 bg-black">
              <div className="max-w-2xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-black text-white mb-4 tracking-tight">ĐĂNG KÝ THAM GIA</h2>
                  <div className="h-1 w-20 bg-[#393ADD] mx-auto mb-6 rounded-full" />
                  <p className="text-zinc-500 uppercase tracking-widest text-xs">Vui lòng điền đầy đủ thông tin để tham gia sự kiện</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-zinc-800">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider ml-1">Họ và tên</FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#393ADD] transition-colors" />
                                      <Input 
                                        placeholder="Nhập họ tên của bạn" 
                                        {...field} 
                                        className="bg-zinc-950/40 border-zinc-800 h-14 pl-10 focus:ring-1 focus:ring-[#393ADD] transition-all rounded-2xl text-white placeholder:text-zinc-700" 
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider ml-1">Email</FormLabel>
                                    <FormControl>
                                      <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#393ADD] transition-colors" />
                                        <Input 
                                          placeholder="email@example.com" 
                                          type="email" 
                                          {...field} 
                                          className="bg-zinc-950/40 border-zinc-800 h-14 pl-10 focus:ring-1 focus:ring-[#393ADD] transition-all rounded-2xl text-white placeholder:text-zinc-700" 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-rose-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider ml-1">Số điện thoại</FormLabel>
                                    <FormControl>
                                      <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#393ADD] transition-colors" />
                                        <Input 
                                          placeholder="Nhập số điện thoại" 
                                          {...field} 
                                          className="bg-zinc-950/40 border-zinc-800 h-14 pl-10 focus:ring-1 focus:ring-[#393ADD] transition-all rounded-2xl text-white placeholder:text-zinc-700" 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage className="text-rose-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="referralSource"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider ml-1">Bạn biết đến dự án qua đâu?</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-14 bg-zinc-950/40 border-zinc-800 text-white rounded-2xl focus:ring-1 focus:ring-[#393ADD] transition-all">
                                        <SelectValue placeholder="Chọn nguồn thông tin" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                      <SelectItem value="fb" className="focus:bg-[#393ADD] focus:text-white cursor-pointer">Facebook</SelectItem>
                                      <SelectItem value="tiktok" className="focus:bg-[#393ADD] focus:text-white cursor-pointer">TikTok</SelectItem>
                                      <SelectItem value="banbe" className="focus:bg-[#393ADD] focus:text-white cursor-pointer">Bạn bè giới thiệu</SelectItem>
                                      <SelectItem value="khac" className="focus:bg-[#393ADD] focus:text-white cursor-pointer">Khác</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                              )}
                            />

                            {referralSource === "khac" && (
                              <FormField
                                control={form.control}
                                name="otherReferralSource"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        placeholder="Vui lòng cho chúng tôi biết bạn biết qua đâu" 
                                        {...field} 
                                        className="bg-zinc-950/40 border-zinc-800 h-14 rounded-2xl text-white focus:ring-1 focus:ring-[#393ADD] transition-all" 
                                      />
                                    </FormControl>
                                    <FormMessage className="text-rose-500 text-xs" />
                                  </FormItem>
                                )}
                              />
                            )}

                            <FormField
                              control={form.control}
                              name="participantCount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider ml-1">Số lượng người đăng ký tham gia</FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#393ADD] transition-colors" />
                                      <Input 
                                        type="number" 
                                        min="1" 
                                        {...field} 
                                        className="bg-zinc-950/40 border-zinc-800 h-14 pl-10 focus:ring-1 focus:ring-[#393ADD] transition-all rounded-2xl text-white" 
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-rose-500 text-xs" />
                                </FormItem>
                              )}
                            />

                            <Button
                              type="submit"
                              disabled={isLoading || isFull}
                              className={`w-full h-16 rounded-2xl font-black transition-all shadow-2xl text-xl tracking-widest ${
                                isFull 
                                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                                  : "bg-[#393ADD] hover:bg-[#3031BA] text-white"
                              }`}
                            >
                              {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                              ) : isFull ? (
                                "SỰ KIỆN ĐÃ ĐỦ NGƯỜI ĐĂNG KÝ"
                              ) : (
                                "GỬI ĐĂNG KÝ"
                              )}
                            </Button>
                            {isFull && (
                              <p className="text-center text-rose-500 text-sm font-medium animate-pulse">
                                Rất tiếc, sự kiện đã nhận đủ số lượng người đăng ký.
                              </p>
                            )}
                          </form>
                        </Form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 text-center"
                      >
                        <div className="flex justify-center mb-6">
                          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                          </div>
                        </div>
                        <h2 className="text-3xl font-black text-green-500 mb-3 tracking-tight">Đăng ký thành công!</h2>
                        <p className="text-zinc-400 mb-8 text-sm">
                          Thông tin của bạn đã được ghi lại. Hẹn gặp bạn tại sự kiện.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setIsSubmitted(false)}
                          className="border-[#393ADD] text-[#393ADD] hover:bg-[#393ADD]/10"
                        >
                          Gửi đăng ký khác
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </ParallaxHero>
    </div>
  )
}
