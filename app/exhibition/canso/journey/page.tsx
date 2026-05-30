// app/exhibition/canso/journey/page.tsx
'use client';

import { useJourney } from './context';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoboothCanvas from '@/components/exhibition/PhotoboothCanvas';
import { useRouter } from 'next/navigation';

const STAGES = [
    {
        id: 1,
        title: 'TRẦN',
        color: 'bg-red-900',
        textColor: 'text-red-100',
        accentColor: '#450a0a',
        message: '“Tôi đang nhìn thấy một thế giới”',
        desc: 'Bạn bắt đầu bước vào không gian như một người quan sát. Mọi thứ hiện ra như một cánh cửa mở ra thế giới khác...',
        booth: 'LỄ MÃ HÓA VÀNG'
    },
    {
        id: 2,
        title: 'CĂN',
        color: 'bg-emerald-900',
        textColor: 'text-emerald-100',
        accentColor: '#064e3b',
        message: '“Tôi bắt đầu nhìn thấy chính mình”',
        desc: 'Những gì bạn tiếp nhận không còn là thông tin mà đã trở thành tấm gương phản chiếu chính mình...',
        booth: 'CĂN SỐ CỦA BẠN LÀ GÌ?'
    },
    {
        id: 3,
        title: 'CÕI',
        color: 'bg-slate-900',
        textColor: 'text-slate-100',
        accentColor: '#0f172a',
        message: '“Tôi đối diện và lựa chọn mình là ai”',
        desc: 'Không còn quan sát, không còn tìm hiểu. Đây là lúc bạn dừng lại và lựa chọn...',
        booth: 'CĂN NGUYỆN'
    },
    {
        id: 4,
        title: 'TRẦN (KẾT)',
        color: 'bg-amber-900',
        textColor: 'text-amber-100',
        accentColor: '#78350f',
        message: '“Tôi hiểu mình sẽ sống như thế nào”',
        desc: '',
        booth: 'HỒI QUANG'
    }
];

async function optimizeImageForUpload(file: File): Promise<File> {
    if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
        return file;
    }

    const maxDimension = 1200;
    const inputUrl = URL.createObjectURL(file);

    try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Không thể đọc ảnh đã chọn.'));
            img.src = inputUrl;
        });

        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const targetWidth = Math.max(1, Math.round(image.width * scale));
        const targetHeight = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
        if (!context) {
            return file;
        }

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, 0, 0, targetWidth, targetHeight);

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.80);
        });

        if (!blob) {
            return file;
        }

        const optimizedName = file.name.replace(/\.[^.]+$/, '') || 'checkin';
        const optimizedFile = new File([blob], `${optimizedName}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
        });

        return optimizedFile.size < file.size ? optimizedFile : file;
    } finally {
        URL.revokeObjectURL(inputUrl);
    }
}

export default function JourneyPage() {
    const { journey, isLoading: journeyLoading, error, checkin, clearJourney } = useJourney();
    const router = useRouter();

    const [currentStageIdx, setCurrentStageIdx] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [localPreviewUrls, setLocalPreviewUrls] = useState<Record<number, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const photoboothRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (journey) {
            if (journey.checkins.length === 0 && !sessionStorage.getItem('skippedThongDiep')) {
                router.push('/exhibition/canso/thong-diep?skipUrl=/exhibition/canso/journey');
                return;
            }

            const maxStage = Math.max(0, ...journey.checkins.map(c => c.stage));
            if (maxStage < 4) {
                setCurrentStageIdx(maxStage);
            } else {
                setCurrentStageIdx(3);
            }
        }
    }, [journey, router]);

    useEffect(() => {
        if (journey && journey.checkins.length === 4 && currentStageIdx === 3) {
            window.setTimeout(() => {
                photoboothRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 250);
        }
    }, [journey, currentStageIdx]);

    useEffect(() => {
        return () => {
            Object.values(localPreviewUrls).forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    if (journeyLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Đang tải hành trình...</div>;

    if (error || !journey) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
                <p className="text-red-400 mb-6">{error || 'Không tìm thấy phiên làm việc.'}</p>
                <button onClick={clearJourney} className="px-6 py-2 bg-white text-black rounded-lg">Quay lại</button>
            </div>
        );
    }

    const currentStage = STAGES[currentStageIdx];
    const isStageCompleted = journey.checkins.some(c => c.stage === currentStage.id);
    const completedStagesCount = journey.checkins.length;
    const stagePreviewUrl = localPreviewUrls[currentStage.id];
    const activeStageCount = Math.min(4, Math.max(completedStagesCount, currentStageIdx + 1));
    const progressPercentage = (activeStageCount / 4) * 100;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const stageId = currentStage.id;

        const previewUrl = URL.createObjectURL(file);

        try {
            setUploading(true);
            setLocalPreviewUrls((prev) => {
                const next = { ...prev, [stageId]: previewUrl };
                return next;
            });

            // Small delay to allow preview image and uploading state to render smoothly before heavy CPU work
            await new Promise(resolve => setTimeout(resolve, 150));
            
            const optimizedFile = await optimizeImageForUpload(file);
            await checkin(stageId, optimizedFile);
            setLocalPreviewUrls((prev) => {
                const next = { ...prev };
                delete next[stageId];
                return next;
            });
            URL.revokeObjectURL(previewUrl);
        } catch (err: any) {
            URL.revokeObjectURL(previewUrl);
            setLocalPreviewUrls((prev) => {
                const next = { ...prev };
                delete next[stageId];
                return next;
            });
            alert(err?.message || 'Upload thất bại. Vui lòng thử lại.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const resolvedImageSources = journey.checkins.map((checkin) => ({
        stage: checkin.stage,
        src: checkin.imageUrl,
    }));

    return (
        <div className={`min-h-screen ${currentStageIdx === 2 ? 'bg-zinc-100 text-black' : currentStage.color + ' ' + currentStage.textColor} transition-colors duration-1000 flex flex-col`}>
            {/* Progress Bar */}
            <div
                className="fixed left-4 right-4 z-50"
                style={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
            >
                <div className={`rounded-full border px-3 py-2 backdrop-blur-xl shadow-lg ${currentStageIdx === 2 ? 'border-black/10 bg-white/80 text-black' : 'border-white/10 bg-black/30 text-white'}`}>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-70 whitespace-nowrap">
                            Chặng {activeStageCount}/4
                        </span>
                        <div className={`relative h-2 flex-1 overflow-hidden rounded-full ${currentStageIdx === 2 ? 'bg-black/10' : 'bg-white/15'}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${currentStageIdx === 2 ? 'bg-black' : 'bg-white'}`}
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="px-6 pt-16 pb-6 flex justify-between items-center opacity-70">
                <div className="text-xs tracking-widest uppercase opacity-80 border border-current px-2 py-1 rounded">
                    {journey.userName || 'Hành trình của bạn'}
                </div>
                <button onClick={clearJourney} className="text-sm font-medium hover:opacity-100 underline underline-offset-4">Đóng</button>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStage.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <h2 className="text-sm tracking-[0.3em] opacity-70 mb-6 uppercase">Chặng {currentStage.id}</h2>
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[0.18em] mb-6 leading-none">
                            {currentStage.title}
                        </h1>
                        <p className="text-lg md:text-xl font-medium opacity-90 mb-8 tracking-[0.04em] leading-relaxed max-w-sm mx-auto">
                            {currentStage.message}
                        </p>

                        <div className="w-12 h-[1px] bg-current mx-auto mb-8 opacity-30"></div>

                        <p className="text-sm opacity-80 leading-relaxed mb-6">
                            {currentStage.desc}
                        </p>

                        <div className={`mt-12 backdrop-blur-sm ${currentStageIdx === 2 ? 'bg-black/5' : 'bg-black/10'} p-6 rounded-2xl border border-current/10`}>
                            <h3 className="text-xs uppercase tracking-widest opacity-60 mb-4">Booth Check-in</h3>
                            <p className="font-medium tracking-wide mb-6">{currentStage.booth}</p>

                            {!isStageCompleted ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className={`w-full py-4 px-6 border border-current rounded-xl font-medium tracking-widest uppercase transition-all flex items-center justify-center gap-2
                                            ${uploading ? 'opacity-50' : 'hover:bg-current hover:text-[var(--bg-color)]'}`}
                                    >
                                        {uploading ? 'Đang gửi...' : 'Chụp ảnh Check-in'}
                                    </button>
                                    {stagePreviewUrl ? (
                                        <div className="mt-4 w-full h-32 bg-black/20 rounded-xl overflow-hidden border border-current/20 flex items-center justify-center relative">
                                            <img
                                                src={stagePreviewUrl}
                                                alt="Đang tải ảnh lên"
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <span className="text-white text-xs tracking-widest font-bold border border-white/40 px-3 py-1 rounded backdrop-blur-md">
                                                    ĐANG TẢI ẢNH LÊN
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-full h-32 bg-black/20 rounded-xl overflow-hidden border border-current/20 flex items-center justify-center relative">
                                        <img
                                            src={localPreviewUrls[currentStage.id] || journey.checkins.find(c => c.stage === currentStage.id)?.imageUrl}
                                            alt="Check-in"
                                            className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <span className="text-white text-xs tracking-widest font-bold border border-white/50 px-2 py-1 rounded backdrop-blur-md">HOÀN THÀNH</span>
                                        </div>
                                    </div>

                                    {currentStageIdx < 3 ? (
                                        <button
                                            onClick={() => setCurrentStageIdx(prev => prev + 1)}
                                            className={`w-full py-4 ${currentStageIdx === 2 ? 'bg-black text-white' : 'bg-white text-black'} rounded-xl font-medium tracking-widest uppercase`}
                                        >
                                            Tiếp tục
                                        </button>
                                    ) : (
                                        <p className="text-xs opacity-60">Hành trình đã kết thúc.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Photobooth overlay at the very end */}
            {completedStagesCount === 4 && currentStageIdx === 3 && (
                <div ref={photoboothRef} className="py-12 px-6 flex flex-col items-center border-t border-current/10 bg-black/20 backdrop-blur-lg mt-auto min-h-screen">
                    <h3 className="text-3xl font-black uppercase tracking-[0.14em] mb-4 text-center mt-12">Lưu giữ Khoảnh Khắc</h3>
                    <p className="text-sm opacity-70 mb-8 text-center max-w-xs leading-relaxed">
                        Chặng đường của bạn đã trọn vẹn. Hãy lưu lại bức ảnh này làm kỷ niệm.
                    </p>
                    <PhotoboothCanvas checkins={journey.checkins} imageSources={resolvedImageSources} />

                    <button
                        onClick={() => router.push('/exhibition/canso/thong-diep?skipUrl=/exhibition/canso/journey')}
                        className="w-full max-w-[320px] mx-auto mt-4 py-4 bg-transparent border border-current rounded-xl tracking-widest uppercase transition-transform hover:scale-[1.02] active:scale-[0.98] font-bold text-sm"
                    >
                        Tiết lộ Thông điệp Căn Số
                    </button>
                    <div className="h-10"></div>
                </div>
            )}

        </div>
    );
}
