'use client';

import { useEffect, useRef, useState } from 'react';
import { JourneyCheckin } from '@/lib/api';

interface Props {
    checkins: JourneyCheckin[];
    imageSources?: Array<{
        stage: number;
        src: string;
    }>;
}

export default function PhotoboothCanvas({ checkins, imageSources }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [style, setStyle] = useState<'GRID' | 'FRAME'>('FRAME');
    const [isRendering, setIsRendering] = useState(false);
    const [renderError, setRenderError] = useState<string | null>(null);

    useEffect(() => {
        if (checkins.length < 4) return;
        renderCanvas();
    }, [checkins, imageSources, style]);

    const renderCanvas = async () => {
        setIsRendering(true);
        setRenderError(null);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Size configuration (Vertical story size 1080x1920)
        const WIDTH = 1080;
        const HEIGHT = 1920;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const sorted = [...(imageSources ?? checkins.map((checkin) => ({ stage: checkin.stage, src: checkin.imageUrl })))].sort((a, b) => a.stage - b.stage);

        const loadImage = (src: string, attempt: number = 0): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                if (!src.startsWith('blob:')) {
                    img.crossOrigin = "anonymous";
                }
                img.onload = () => resolve(img);
                img.onerror = () => {
                    if (attempt < 4) {
                        window.setTimeout(() => {
                            loadImage(src, attempt + 1).then(resolve).catch(reject);
                        }, 1200);
                        return;
                    }
                    reject(new Error(`Failed to load image after retries: ${src}`));
                };
                const finalSrc = src.startsWith('blob:') ? src : `${src}${src.includes('?') ? '&' : '?'}v=${Date.now()}-${attempt}`;
                img.src = finalSrc;
            });
        };

        try {
            const images = await Promise.all(sorted.map((item) => loadImage(item.src)));

            if (style === 'GRID') {
                ctx.fillStyle = '#0a0a0a';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 100px serif';
                ctx.textAlign = 'center';
                ctx.fillText('CĂN SỐ', WIDTH / 2, 220);

                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.font = '30px sans-serif';
                ctx.letterSpacing = "10px";
                ctx.fillText('HÀNH TRÌNH TÌM VỀ CĂN', WIDTH / 2, 280);

                const margin = 60;
                const gridY = 380;
                const cellW = (WIDTH - margin * 3) / 2;
                const cellH = (HEIGHT - gridY - margin * 2) / 2;

                const names = ['TRẦN', 'CĂN', 'CÕI', 'HOÀN TRẦN'];
                const accents = ['#7f1d1d', '#064e3b', '#e2e8f0', '#78350f'];

                images.forEach((img, index) => {
                    const row = Math.floor(index / 2);
                    const col = index % 2;
                    const x = margin + col * (cellW + margin);
                    const y = gridY + row * (cellH + margin);

                    // Simple border
                    ctx.fillStyle = accents[index];
                    ctx.fillRect(x - 5, y - 5, cellW + 10, cellH + 10);

                    drawCover(ctx, img, x, y, cellW, cellH);

                    ctx.fillStyle = 'rgba(0,0,0,0.7)';
                    ctx.fillRect(x, y + cellH - 60, cellW, 60);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '24px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${names[index]}`, x + cellW / 2, y + cellH - 22);
                });

            } else {
                // FILMSTRIP FRAME
                ctx.fillStyle = '#f4f4f5';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                const margin = 80;
                ctx.fillStyle = '#18181b';
                ctx.fillRect(margin, margin, WIDTH - margin * 2, HEIGHT - margin * 2);

                const cellW = WIDTH - margin * 4;
                const cellH = (HEIGHT - margin * 6) / 4;

                images.forEach((img, index) => {
                    const x = margin * 2;
                    const y = margin * 2 + index * (cellH + margin / 2);
                    drawCover(ctx, img, x, y, cellW, cellH);
                });

                ctx.save();
                ctx.translate(margin / 2 + 10, HEIGHT / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillStyle = '#18181b';
                ctx.font = 'bold 70px serif';
                ctx.textAlign = 'center';
                ctx.fillText('HÀNH TRÌNH CĂN SỐ', 0, 0);
                ctx.restore();

                ctx.save();
                ctx.translate(WIDTH - margin / 2 - 10, HEIGHT / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillStyle = '#18181b';
                ctx.font = '40px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('2026 EXHIBITION', 0, 0);
                ctx.restore();
            }

            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setDownloadUrl(dataUrl);

        } catch (err) {
            console.error('Canvas render error:', err);
            setRenderError('Chưa thể ghép ảnh ngay lúc này. Vui lòng chờ vài giây rồi thử lại.');
        } finally {
            setIsRendering(false);
        }
    };

    const drawCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
        const aspectCanvas = w / h;
        const aspectImg = img.width / img.height;
        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0;
        let sy = 0;

        if (aspectImg > aspectCanvas) {
            sWidth = img.height * aspectCanvas;
            sx = (img.width - sWidth) / 2;
        } else {
            sHeight = img.width / aspectCanvas;
            sy = (img.height - sHeight) / 2;
        }
        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2 mb-8 p-1 bg-black/40 rounded-lg backdrop-blur mx-auto">
                <button
                    onClick={() => setStyle('FRAME')}
                    className={`px-4 py-3 rounded-md text-sm font-medium tracking-widest uppercase transition-all ${style === 'FRAME' ? 'bg-white text-black' : 'text-white'}`}
                >
                    Kiểu Filmstrip
                </button>
                <button
                    onClick={() => setStyle('GRID')}
                    className={`px-4 py-3 rounded-md text-sm font-medium tracking-widest uppercase transition-all ${style === 'GRID' ? 'bg-white text-black' : 'text-white'}`}
                >
                    Kiểu Lưới Thẻ
                </button>
            </div>

            <div className="w-full max-w-[320px] aspect-[9/16] bg-black/30 rounded-2xl overflow-hidden shadow-2xl relative mb-8 border border-white/10 mx-auto">
                {isRendering ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-t-white border-white/20 rounded-full animate-spin mb-4"></div>
                        <span className="text-white text-sm opacity-80 tracking-widest uppercase">Đang xử lý ảnh...</span>
                    </div>
                ) : renderError ? (
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <span className="text-white text-sm opacity-80 leading-relaxed">{renderError}</span>
                    </div>
                ) : downloadUrl ? (
                    <img src={downloadUrl} alt="Photobooth Final" className="w-full h-full object-contain" />
                ) : null}
            </div>

            <a
                href={downloadUrl || '#'}
                download={`canso_journey_${Date.now()}.jpg`}
                className={`w-full max-w-[320px] mx-auto py-5 bg-[#E63946] text-white text-center rounded-xl font-bold tracking-widest uppercase shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${!downloadUrl && 'opacity-50 pointer-events-none'}`}
            >
                Tải ảnh Sự kiện
            </a>
        </div>
    );
}
