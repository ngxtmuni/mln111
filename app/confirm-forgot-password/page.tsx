"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Needs import
    const oobCode = searchParams.get('oobCode');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    
    // Validate oobCode on mount
    useEffect(() => {
        const verifyCode = async () => {
            if (!oobCode) {
                 setMessage({ type: 'error', text: "Đường dẫn không hợp lệ (thiếu mã xác thực)." });
                 return;
            }

            try {
                const { auth } = await import('@/lib/firebase/config');
                const { verifyPasswordResetCode } = await import('firebase/auth');
                await verifyPasswordResetCode(auth, oobCode);
                setIsReady(true);
            } catch (error: any) {
                setMessage({ type: 'error', text: "Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." });
            }
        };
        verifyCode();
    }, [oobCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: "Mật khẩu không khớp" });
            return;
        }

        if (!oobCode) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const { auth } = await import('@/lib/firebase/config');
            const { confirmPasswordReset } = await import('firebase/auth');
            
            await confirmPasswordReset(auth, oobCode, password);

            setMessage({ type: 'success', text: "Đổi mật khẩu thành công. Đang chuyển hướng..." });
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
             console.error("Reset password error:", err);
            setMessage({ type: 'error', text: err.message || "Có lỗi xảy ra khi đặt lại mật khẩu." });
        } finally {
            setIsLoading(false);
        }
    };

    if (message?.type === 'error' && !isReady) {
        return (
            <div className="text-center text-red-600">
                {message.text} <Link href="/forgot-password" className="underline">Thử lại</Link>
            </div>
        );
    }

    if (!isReady) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhập lại mật khẩu</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
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
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đặt lại mật khẩu"}
            </button>
        </form>
    );
}

export default function ConfirmForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-black flex justify-center overflow-y-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg mt-24">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">Đặt lại mật khẩu</h1>
                    <p className="text-gray-400 text-sm sm:text-base">Nhập mật khẩu mới của bạn</p>
                </div>

                <div className="bg-white rounded-xl p-8 sm:p-10 lg:p-12 shadow-2xl">
                    <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin" /></div>}>
                        <ConfirmResetForm />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
