"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setIsVerified(true)
    }
  }, [searchParams])

  const handleResendVerification = async () => {
    try {
      const { auth } = await import('@/lib/firebase/config');
      const { sendEmailVerification } = await import('firebase/auth');

      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setError("Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư của bạn.");
      } else {
        // Should not happen if flow is correct, but if user is null, we can't send.
        // Maybe ask them to login again.
        setError("Vui lòng đăng nhập lại để gửi email xác thực.");
      }
    } catch (err: any) {
      // rare case: too many requests
      setError(err.message || "Không thể gửi email. Vui lòng thử lại sau.");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setNeedsVerification(false)

    try {
      const { firebaseAuth } = await import('@/lib/firebase/auth');
      const { auth } = await import('@/lib/firebase/config');

      const trimmedEmail = email.trim();
      const { backendUser } = await firebaseAuth.signIn(trimmedEmail, password);

      const user = auth.currentUser;
      const requireEmailVerification = process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION !== 'false';
      
      // Allow bypass for virtual judge domains or internal test domains
      const isInternalDomain = trimmedEmail.endsWith('@thomautmphu.vn') || 
                              trimmedEmail.endsWith('@knds.vn') || 
                              trimmedEmail.endsWith('@admin.com');

      if (user && !user.emailVerified && requireEmailVerification && !isInternalDomain) {
        setNeedsVerification(true);
        setError("Vui lòng xác thực email của bạn trước khi đăng nhập.");
        // Optional: Sign out immediately to prevent 'auth-provider' form creating a loop 
        // or leave them signed in but blocked by UI. 
        // Signing out is safer to prevent dashboard flickering.
        await firebaseAuth.logout();
        return;
      }

      const redirectTo = searchParams.get("redirect")

      if (redirectTo) {
        router.push(redirectTo);
      } else if (backendUser?.role === 'admin') {
        router.push("/admin");
      } else if (backendUser?.role === 'judge') {
        router.push("/judging");
      } else {
        router.push("/dashboard");
      }

    } catch (err: any) {
      if (err.message.includes("403") || err.message.includes("not verified") || err.message.includes("Vui lòng xác thực email")) {
        setNeedsVerification(true);
        setError("Vui lòng xác thực email của bạn trước khi đăng nhập.");
      } else if (err.message.includes("401") || err.message.includes("Invalid credentials") || err.message.includes("wrong password")) {
        setError("Email hoặc mật khẩu không đúng");
      } else if (err.message.includes("404") || err.code === 'auth/user-not-found') {
        setError("Tài khoản không tồn tại");
      } else if (err.message.includes("429") || err.message.includes("Too many failed login attempts")) {
        setError("Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.");
      } else {
        setError(err.message || "Đăng nhập thất bại");
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isVerified && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Email của bạn đã được xác thực thành công. Bây giờ bạn có thể đăng nhập!</span>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm">
          {error}
          {needsVerification && (
              <div className="mt-2">
                  <button 
                    type="button"
                    onClick={handleResendVerification}
                    className="text-primary hover:text-primary/90 font-semibold underline text-xs"
                  >
                      Gửi lại email xác thực
                  </button>
                  <p className="text-xs text-gray-500 mt-1 italic">Lưu ý: Bạn cần đăng nhập lại để gửi yêu cầu mới nếu phiên đã hết hạn.</p>
              </div>
          )}
        </div>
      )}
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">Mật khẩu</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
          <span className="text-gray-600">Nhớ tôi</span>
        </label>
        <Link href="/forgot-password" className="text-primary hover:text-primary/90 transition-colors">
          Quên mật khẩu?
        </Link>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50">
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      {/* Signup Link */}
      <p className="text-center text-sm text-gray-600">
        Chưa có tài khoản?{" "}
        <Link href="/signup" className="text-primary hover:text-primary/90 transition-colors font-semibold">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  )
}
