import LoginForm from "@/components/login-form"
import { Suspense } from "react"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex justify-center overflow-y-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg mt-24">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">Đăng nhập</h1>
          <p className="text-gray-400 text-sm sm:text-base">Truy cập tài khoản của bạn trên Thờ Mẫu Tam Phủ</p>
        </div>

        {/* Form Card - White Background */}
        <div className="bg-white rounded-xl p-8 sm:p-10 lg:p-12 shadow-2xl">
          <Suspense fallback={<div className="text-center py-4">Đang tải form đăng nhập...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
