'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { ensureExhibitionParticipant } from '@/lib/exhibition-participant';
import messagesData from '@/data/exhibition-messages.json';

function ThongDiepContent() {
    const router = useRouter();
    const [numberInput, setNumberInput] = useState('');
    const [message, setMessage] = useState<any>(null);
    const [hasOpenedIntro, setHasOpenedIntro] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const messageCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const participant = ensureExhibitionParticipant();
        setEmail(participant.email);
    }, []);

    useEffect(() => {
        if (!email) return;

        let isMounted = true;

        const loadClaimedMessage = async () => {
            try {
                const journey = await api.exhibition.getJourney(email);
                if (!isMounted || !journey.messageNumber) return;

                const found = messagesData.find((item) => item.number === journey.messageNumber);
                if (found) {
                    setMessage(found);
                }
            } catch {
                // Keep page usable even if journey fetch fails.
            }
        };

        loadClaimedMessage();

        return () => {
            isMounted = false;
        };
    }, [email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const num = parseInt(numberInput);
        if (isNaN(num) || num < 1 || num > 23) {
            setError('Vui lòng nhập một số hợp lệ từ 1 đến 23.');
            return;
        }

        const found = messagesData.find(m => m.number === num);
        if (found && email) {
            try {
                setIsSubmitting(true);
                await api.exhibition.claimMessage(email, found.number, found.title);
                setMessage(found);
            } catch (err: any) {
                setError(err?.message || 'Không thể lưu thông điệp lúc này. Vui lòng thử lại.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setError('Không tìm thấy thông điệp cho số này.');
        }
    };

    const wrapCanvasText = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
        shouldDraw = true,
        align: 'left' | 'center' = 'left',
        preserveNewlines = false
    ) => {
        const paragraphs = text.split('\n\n');
        let cursorY = y;
        const previousAlign = ctx.textAlign;

        paragraphs.forEach((paragraph) => {
            if (preserveNewlines) {
                const lines = paragraph.split('\n');
                lines.forEach((lineText) => {
                    const lineWords = lineText.trim().split(/\s+/).filter(Boolean);
                    if (lineWords.length === 0) {
                        cursorY += lineHeight * 0.5;
                        return;
                    }

                    let currentLine = '';
                    lineWords.forEach((word) => {
                        const testLine = currentLine ? `${currentLine} ${word}` : word;
                        const metrics = ctx.measureText(testLine);

                        if (metrics.width > maxWidth && currentLine) {
                            if (shouldDraw) {
                                ctx.textAlign = align;
                                ctx.fillText(currentLine, x, cursorY);
                            }
                            currentLine = word;
                            cursorY += lineHeight;
                        } else {
                            currentLine = testLine;
                        }
                    });

                    if (currentLine) {
                        if (shouldDraw) {
                            ctx.textAlign = align;
                            ctx.fillText(currentLine, x, cursorY);
                        }
                        cursorY += lineHeight;
                    }
                });
            } else {
                // Treat single newlines as spaces within a paragraph
                const cleanPara = paragraph.replace(/(?<!\n)\n(?!\n)/g, ' ').replace(/\s+/g, ' ').trim();
                const words = cleanPara.split(/\s+/).filter(Boolean);

                if (words.length === 0) {
                    cursorY += lineHeight * 0.5;
                    return;
                }

                let currentLine = '';
                words.forEach((word) => {
                    const testLine = currentLine ? `${currentLine} ${word}` : word;
                    const metrics = ctx.measureText(testLine);

                    if (metrics.width > maxWidth && currentLine) {
                        if (shouldDraw) {
                            ctx.textAlign = align;
                            ctx.fillText(currentLine, x, cursorY);
                        }
                        currentLine = word;
                        cursorY += lineHeight;
                    } else {
                        currentLine = testLine;
                    }
                });

                if (currentLine) {
                    if (shouldDraw) {
                        ctx.textAlign = align;
                        ctx.fillText(currentLine, x, cursorY);
                    }
                    cursorY += lineHeight;
                }
            }

            cursorY += lineHeight * 0.4;
        });

        ctx.textAlign = previousAlign;
        return cursorY;
    };

    const handleDownloadMessage = async () => {
        if (!message) return;

        try {
            setIsDownloading(true);

            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Canvas not supported');
            }

            ctx.textAlign = 'center';
            ctx.fillStyle = '#7C7DF6';
            ctx.font = '700 28px Roboto Flex, Arial, sans-serif';

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '800 56px Roboto Flex, Arial, sans-serif';
            const titleEndY = wrapCanvasText(ctx, String(message.title).toUpperCase(), canvas.width / 2, 250, 900, 68, false, 'center');

            ctx.textAlign = 'left';
            ctx.fillStyle = '#E6E7FF';
            ctx.font = '500 38px Roboto Flex, Arial, sans-serif';
            const poemStartY = titleEndY + 110;
            const poemEndY = wrapCanvasText(ctx, message.poem || '', 140, poemStartY, 920, 56, false, 'left', true) || poemStartY;

            const personalityTitleY = poemEndY + 55;
            const personalityStartY = personalityTitleY + 48;
            ctx.fillStyle = '#F4F4F5';
            ctx.font = '500 30px Roboto Flex, Arial, sans-serif';
            const personalityEndY = wrapCanvasText(ctx, message.personality || '', 140, personalityStartY, 920, 46, false) || personalityStartY;

            let finalHeight = personalityEndY + 120;
            let adviceBoxY = 0;

            if (message.advice) {
                adviceBoxY = personalityEndY + 55;
                ctx.font = '500 30px Roboto Flex, Arial, sans-serif';
                const adviceTextStartY = adviceBoxY + 60;
                const adviceTextEndY = wrapCanvasText(ctx, message.advice, 140, adviceTextStartY, 900, 46, false) || adviceTextStartY;
                finalHeight = adviceTextEndY + 120;
            }

            canvas.height = Math.max(1500, Math.ceil(finalHeight));

            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(57,58,221,0.22)');
            gradient.addColorStop(1, 'rgba(57,58,221,0.04)');
            ctx.fillStyle = gradient;
            ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

            ctx.strokeStyle = 'rgba(124,125,246,0.35)';
            ctx.lineWidth = 2;
            ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

            ctx.fillStyle = '#7C7DF6';
            ctx.font = '700 28px Roboto Flex, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`CHÂN LINH SỐ ${message.number}`, canvas.width / 2, 150);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '800 56px Roboto Flex, Arial, sans-serif';
            const renderedTitleEndY = wrapCanvasText(ctx, String(message.title).toUpperCase(), canvas.width / 2, 250, 900, 68, true, 'center');

            ctx.strokeStyle = 'rgba(57,58,221,0.4)';
            ctx.beginPath();
            const dividerY = renderedTitleEndY + 35;
            ctx.moveTo(220, dividerY);
            ctx.lineTo(980, dividerY);
            ctx.stroke();

            ctx.textAlign = 'left';
            ctx.fillStyle = '#E6E7FF';
            ctx.font = '500 38px Roboto Flex, Arial, sans-serif';
            let cursorY = wrapCanvasText(ctx, message.poem || '', 140, renderedTitleEndY + 110, 920, 56, true, 'left', true) || (renderedTitleEndY + 110);

            cursorY += 40;
            ctx.fillStyle = '#A1A1AA';
            ctx.font = '700 22px Roboto Flex, Arial, sans-serif';
            ctx.fillText('TÍNH CÁCH & BẢN NGÃ', 140, cursorY);

            cursorY += 48;
            ctx.fillStyle = '#F4F4F5';
            ctx.font = '500 30px Roboto Flex, Arial, sans-serif';
            cursorY = wrapCanvasText(ctx, message.personality || '', 140, cursorY, 920, 46) || cursorY;

            if (message.advice) {
                cursorY += 55;
                const adviceBoxHeight =
                    Math.max(250, (wrapCanvasText(ctx, message.advice, 140, cursorY + 60, 900, 46, false) || (cursorY + 60)) - cursorY + 55);
                ctx.fillStyle = 'rgba(57,58,221,0.14)';
                ctx.fillRect(110, cursorY - 30, 980, adviceBoxHeight);
                ctx.strokeStyle = 'rgba(57,58,221,0.3)';
                ctx.strokeRect(110, cursorY - 30, 980, adviceBoxHeight);

                ctx.fillStyle = '#7C7DF6';
                ctx.font = '700 22px Roboto Flex, Arial, sans-serif';
                ctx.fillText('LỜI KHUYÊN', 140, cursorY + 10);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '500 30px Roboto Flex, Arial, sans-serif';
                wrapCanvasText(ctx, message.advice, 140, cursorY + 60, 900, 46);
            }

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `thong-diep-can-so-${message.number}.png`;
            link.click();
        } catch (err) {
            setError('Không thể lưu ảnh lúc này. Vui lòng thử lại.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShareMessage = async () => {
        if (!message) return;

        const shareText = `${message.title}\n\n${message.poem || ''}\n\n${message.advice || ''}`.trim();

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Thông điệp Căn Số ${message.number}`,
                    text: shareText,
                });
                return;
            }

            await navigator.clipboard.writeText(shareText);
            setError('Đã sao chép nội dung thông điệp để bạn chia sẻ.');
        } catch {
            setError('Không thể chia sẻ thông điệp lúc này. Vui lòng thử lại.');
        }
    };

    if (!email) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Đang tải...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=1000')] bg-cover bg-center mix-blend-overlay"></div>

            <AnimatePresence mode="wait">
                {!hasOpenedIntro ? (
                    <motion.div
                        key="intro-popup"
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.45 }}
                        className="z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-black/70 p-8 text-center shadow-2xl backdrop-blur-2xl"
                    >
                        <div className="mb-4 inline-flex rounded-full border border-[#393ADD]/30 bg-[#393ADD]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-[#8F90FF]">
                            Triển lãm Căn Số
                        </div>

                        <h1 className="mb-4 text-3xl font-black uppercase tracking-[0.12em] text-white md:text-4xl">
                            Căn số của bạn là gì?
                        </h1>

                        <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-gray-300 md:text-base">
                            Chọn tiếp tục để mở phần nhập số và khám phá lời nhắn dành riêng cho mình tại triển lãm.
                        </p>

                        <button
                            type="button"
                            onClick={() => setHasOpenedIntro(true)}
                            className="w-full rounded-xl bg-[#393ADD] px-4 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#3031BA] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[0_10px_35px_rgba(57,58,221,0.28)]"
                        >
                            Tiếp tục
                        </button>

                    </motion.div>
                ) : !message ? (
                    <motion.div 
                        key="input-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8 }}
                        className="z-10 text-center max-w-sm w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
                    >
                        <h1 className="text-2xl font-black mb-2 tracking-[0.15em] text-[#393ADD] uppercase drop-shadow-[0_0_20px_rgba(57,58,221,0.25)]">
                            Nhận Thông Điệp
                        </h1>
                        <p className="text-sm text-gray-400 mb-8 opacity-80 leading-relaxed font-light">
                            Nhập con số bạn nhận được từ Staff tại Sự kiện Triển lãm Căn Số.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <input 
                                    type="number"
                                    min="1"
                                    max="23"
                                    required
                                    value={numberInput}
                                    onChange={(e) => setNumberInput(e.target.value)}
                                    placeholder="Ví dụ: 7"
                                    className="w-full bg-black/40 border border-white/20 text-white text-center text-3xl font-black tracking-widest py-4 rounded-xl focus:outline-none focus:border-[#393ADD] focus:ring-2 focus:ring-[#393ADD]/20 transition-colors"
                                />
                                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#393ADD] text-white rounded-xl font-bold tracking-widest uppercase transition-all hover:bg-[#3031BA] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[0_10px_35px_rgba(57,58,221,0.28)] disabled:opacity-60"
                            >
                                {isSubmitting ? 'Đang mở...' : 'Mở Thông Điệp'}
                            </button>
                        </form>

                        <div className="mt-3 flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={() => setHasOpenedIntro(false)}
                                className="w-full py-4 rounded-xl border border-white/10 text-white font-bold tracking-[0.18em] uppercase transition-all hover:bg-white/5"
                            >
                                Quay lại
                            </button>

                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="message-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        ref={messageCardRef}
                        className="z-10 max-w-md w-full bg-white/5 backdrop-blur-xl border border-[#393ADD]/35 p-8 rounded-3xl shadow-2xl shadow-[0_18px_60px_rgba(57,58,221,0.18)] text-center relative overflow-y-auto max-h-[90vh]"
                    >
                        <button 
                            onClick={() => setMessage(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>

                        <div className="text-[#7C7DF6] text-sm tracking-[0.3em] uppercase mb-4 opacity-90 font-bold">
                            Chân linh số {message.number}
                        </div>
                        <h2 className="text-3xl font-black text-white mb-8 tracking-[0.1em] uppercase leading-tight">
                            {message.title}
                        </h2>

                        {message.poem && (
                            <div className="mb-8">
                                <div className="rounded-2xl border border-[#393ADD]/20 bg-[#393ADD]/8 px-5 py-5 text-[#E6E7FF] text-base leading-8 font-medium tracking-[0.01em] whitespace-pre-line">
                                    {message.poem.split('\n\n').map((para: string, i: number) => (
                                        <p key={i} className="mb-4 last:mb-0">
                                            {para.split('\n').map((line, j) => (
                                                <span key={j} className="block min-h-[1.5rem]">{line}</span>
                                            ))}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="w-12 h-[1px] bg-[#393ADD]/40 mx-auto mb-8"></div>

                        {message.personality && (
                            <div className="mb-8">
                                <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Tính Cách & Bản Ngã</h3>
                                <div className="text-gray-200 text-sm leading-relaxed text-justify opacity-90 mx-auto whitespace-pre-line">
                                    {message.personality
                                        .split('\n\n')
                                        .map((para: string, i: number) => {
                                            const cleanPara = para.replace(/(?<!\n)\n(?!\n)/g, ' ').replace(/\s+/g, ' ').trim();
                                            return <p key={i} className="mb-4 last:mb-0">{cleanPara}</p>;
                                        })
                                    }
                                </div>
                            </div>
                        )}

                        {message.advice && (
                            <div className="mb-8 bg-[#393ADD]/12 p-5 rounded-2xl border border-[#393ADD]/25">
                                <h3 className="text-xs uppercase tracking-[0.2em] text-[#7C7DF6] mb-3">Lời Khuyên</h3>
                                <div className="text-[#F3F3FF] text-sm leading-relaxed text-justify whitespace-pre-line">
                                    {message.advice
                                        .split('\n\n')
                                        .map((para: string, i: number) => {
                                            const cleanPara = para.replace(/(?<!\n)\n(?!\n)/g, ' ').replace(/\s+/g, ' ').trim();
                                            return <p key={i} className="mb-4 last:mb-0">{cleanPara}</p>;
                                        })
                                    }
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                onClick={handleDownloadMessage}
                                disabled={isDownloading}
                                className="w-full py-4 bg-[#393ADD] text-white rounded-xl font-bold tracking-widest uppercase transition-all hover:bg-[#3031BA] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[0_10px_35px_rgba(57,58,221,0.28)] disabled:opacity-60"
                            >
                                {isDownloading ? 'Đang lưu...' : 'Lưu Thông Điệp Về Máy'}
                            </button>
                            <button
                                onClick={handleShareMessage}
                                className="w-full py-4 border border-[#393ADD]/30 text-white rounded-xl font-bold tracking-widest uppercase transition-all hover:bg-[#393ADD]/12"
                            >
                                Chia sẻ Thông Điệp
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ThongDiepPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Đang tải...</div>}>
            <ThongDiepContent />
        </Suspense>
    );
}
