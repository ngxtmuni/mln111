import SignupForm from "@/components/signup-form"
import { Suspense } from "react"

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black flex justify-center overflow-y-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg mt-24">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">Đăng ký</h1>
          <p className="text-gray-400 text-sm sm:text-base">Tạo tài khoản mới trên Thờ Mẫu Tam</p>
        </div>

        {/* Form Card - White Background */}
        <div className="bg-white rounded-xl p-8 sm:p-10 lg:p-12 shadow-2xl">
          <Suspense fallback={<div className="text-center py-4">Đang tải form đăng ký...</div>}>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
