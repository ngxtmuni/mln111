"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail, Check, RefreshCw } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { useRouter, useSearchParams } from "next/navigation"
import { auth } from "@/lib/firebase/config"
import { sendEmailVerification } from "firebase/auth"
import { Turnstile } from "@marsidev/react-turnstile"

type SignupStep = "form" | "success"

export default function SignupForm() {
  const [step, setStep] = useState<SignupStep>("form")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [turnstileToken, setTurnstileToken] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendMessage, setResendMessage] = useState("")

  // Password validation requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasSpecialChar: false,
    hasNumber: false,
    hasUpperCase: false,
  })

  // Validate password requirements
  const validatePassword = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasSpecialChar: /[!@#$%]/.test(password),
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")

    // Validate password in real-time
    if (name === "password") {
      validatePassword(value)
    }
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get("redirect") ? `?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : ""

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp!")
      return
    }

    // Validate all password requirements
    if (!passwordRequirements.minLength || !passwordRequirements.hasSpecialChar || !passwordRequirements.hasNumber || !passwordRequirements.hasUpperCase) {
      setError("Mật khẩu chưa đủ điều kiện bảo mật!")
      return
    }

    setIsLoading(true)

    try {
      const { firebaseAuth } = await import('@/lib/firebase/auth');
      const trimmedEmail = formData.email.trim();
      
      if (!turnstileToken) {
        setError("Vui lòng xác thực bảo mật!");
        setIsLoading(false);
        return;
      }

      await firebaseAuth.signUp(trimmedEmail, formData.password, formData.fullName, turnstileToken);
      setStep("success");
    } catch (err: any) {
      console.error('Signup error:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError("Email đã được sử dụng!");
      } else {
        setError(err.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!auth.currentUser) return;
    try {
      setResendMessage("")
      await sendEmailVerification(auth.currentUser);
      setResendMessage("Đã gửi lại email xác thực!");
    } catch (error: any) {
      setResendMessage("Lỗi gửi lại: " + error.message);
    }
  };

  if (step === "success") {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kiểm tra Email của bạn!</h2>
          <p className="text-gray-600 text-sm">
            Chúng tôi đã gửi link xác thực đến
            <br />
            <span className="font-semibold text-gray-900">{formData.email}</span>
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-700 leading-relaxed">
              Nếu không thấy email trong <strong>Hộp thư đến</strong>, bạn vui lòng kiểm tra kỹ trong mục <strong>Thư rác (Spam)</strong> nhé!
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = `/login${redirectParam}`}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Đến trang đăng nhập
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleResendEmail}
            className="w-full border-primary-200 text-primary/90 hover:bg-primary-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Gửi lại email xác thực
          </Button>
          
          {resendMessage && (
            <p className="text-xs text-center text-green-600 font-medium">
              {resendMessage}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">Họ và tên</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Nguyễn Văn A"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">Mật khẩu</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            minLength={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Mật khẩu cần đủ điều kiện:</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Check size={12} className={passwordRequirements.minLength ? 'text-green-500' : 'text-gray-300'} />
              <span className="text-xs text-gray-600">Ít nhất 8 ký tự</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={12} className={passwordRequirements.hasSpecialChar ? 'text-green-500' : 'text-gray-300'} />
              <span className="text-xs text-gray-600">Ký tự đặc biệt (!@#$%)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={12} className={passwordRequirements.hasNumber ? 'text-green-500' : 'text-gray-300'} />
              <span className="text-xs text-gray-600">Ít nhất 1 chữ số</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={12} className={passwordRequirements.hasUpperCase ? 'text-green-500' : 'text-gray-300'} />
              <span className="text-xs text-gray-600">Chữ cái viết hoa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">Xác nhận mật khẩu</label>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-center my-2">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
          onSuccess={(token) => setTurnstileToken(token)}
          options={{
            theme: 'light',
            size: 'normal',
          }}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-white">
        {isLoading ? "Đang xử lý..." : "Đăng ký"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Đã có tài khoản? <Link href={`/login${redirectParam}`} className="text-primary font-semibold">Đăng nhập</Link>
      </p>
    </form>
  )
}
