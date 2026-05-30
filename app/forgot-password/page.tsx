"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);


        try {
            const { auth } = await import('@/lib/firebase/config');
            const { sendPasswordResetEmail } = await import('firebase/auth');
            
            await sendPasswordResetEmail(auth, email, {
                url: `${window.location.origin}/login`, // Redirect back to login after reset (handled via email link)
                handleCodeInApp: true,
            });

            setMessage({ type: 'success', text: "Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn (kể cả thư mục spam)." });
        } catch (err: any) {
            console.error("Forgot password error:", err);
            if (err.code === 'auth/user-not-found') {
                // For security, don't reveal if user exists, but for UX maybe say "If account exists..."
                // However, standard Firebase error is "User not found". 
                // Let's just say "sent" or generic error? 
                // To be helpful but secure: "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn."
                // But keeping it simple for now as per current code.
                setMessage({ type: 'error', text: "Không tìm thấy tài khoản với email này." });
            } else {
                setMessage({ type: 'error', text: err.message || "Có lỗi xảy ra." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex justify-center overflow-y-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg mt-24">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">Quên mật khẩu?</h1>
                    <p className="text-gray-400 text-sm sm:text-base">Nhập email của bạn để khôi phục mật khẩu</p>
                </div>

                <div className="bg-white rounded-xl p-8 sm:p-10 lg:p-12 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}



                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi yêu cầu"}
                        </button>

                        <div className="text-center">
                            <Link href="/login" className="text-sm text-gray-600 hover:text-primary">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
