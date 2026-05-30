'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth-provider';

export default function CansoLanding() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user, firebaseUser } = useAuth();

    // Auto-redirect if user is already logged in
    useEffect(() => {
        const skipAuthenticatedAutoSync = localStorage.getItem('exhibitionSkipAuthAutoSync') === 'true';
        if (skipAuthenticatedAutoSync) return;
        if (firebaseUser?.email) {
            localStorage.setItem('exhibitionEmail', firebaseUser.email);
            const participantName = user?.name ?? firebaseUser.displayName;
            if (participantName) localStorage.setItem('exhibitionParticipantName', participantName);
            router.push('/exhibition/canso/thong-diep?skipUrl=/exhibition/canso/journey');
        }
    }, [firebaseUser, router, user]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim() || !email.includes('@')) return;
        setIsLoading(true);
        localStorage.removeItem('exhibitionSkipAuthAutoSync');
        localStorage.setItem('exhibitionParticipantName', fullName.trim().replace(/\s+/g, ' '));
        localStorage.setItem('exhibitionEmail', email.trim().toLowerCase());
        router.push('/exhibition/canso/thong-diep?skipUrl=/exhibition/canso/journey');
    };

    // Silent redirect is happening — don't show form
    if (firebaseUser?.email) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-[#393ADD] border-t-transparent animate-spin" />
                <p className="text-gray-400 text-sm tracking-widest uppercase">Chào, {user?.name ?? firebaseUser.displayName ?? firebaseUser.email}! Đang dẫn vào hành trình…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000')] bg-cover bg-center mix-blend-overlay"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="z-10 text-center max-w-lg"
            >
                <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-[0.18em] text-[#393ADD] uppercase leading-tight drop-shadow-[0_0_24px_rgba(57,58,221,0.25)]">
                    HÀNH TRÌNH TÌM VỀ CĂN
                </h1>
                <p className="text-sm md:text-base text-gray-400 mb-8 uppercase tracking-[0.22em]">
                    Một trải nghiệm nghệ thuật tương tác tại Sự kiện Triển lãm Căn Số
                </p>

                <p className="text-gray-300 text-lg mb-12 font-light leading-relaxed">
                    Bạn không chỉ đến để xem, bạn bước vào một hành trình nơi mỗi trải nghiệm là một chặng mở ra tâm hồn chính bạn.
                </p>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full max-w-sm mx-auto shadow-2xl">
                    <form onSubmit={handleJoin} className="flex flex-col gap-4">
                        <input
                            type="text"
                            required
                            placeholder="Nhập họ và tên của bạn"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-black/40 border border-white/20 text-white text-base py-3 px-4 rounded-xl focus:outline-none focus:border-[#393ADD] focus:ring-2 focus:ring-[#393ADD]/20 transition-colors"
                        />
                        <input
                            type="email"
                            required
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/20 text-white text-base py-3 px-4 rounded-xl focus:outline-none focus:border-[#393ADD] focus:ring-2 focus:ring-[#393ADD]/20 transition-colors"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading || !fullName.trim() || !email.trim()}
                            className="w-full bg-[#393ADD] text-white font-medium px-4 py-3 rounded-xl disabled:opacity-50 transition-all hover:bg-[#3031BA]"
                        >
                            {isLoading ? 'Đang tải...' : 'Bắt đầu hành trình tìm số'}
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-4 font-light">
                        Vui lòng nhập họ tên và email để lưu lại toàn bộ tiến trình, hiển thị đúng người tham gia và tải ảnh sau khi hoàn thành.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
