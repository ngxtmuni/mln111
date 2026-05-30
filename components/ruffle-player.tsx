'use client';

import { useEffect, useRef } from 'react';

interface RufflePlayerProps {
  swfPath: string;
}

declare global {
  interface Window {
    RufflePlayer: any;
  }
}

export default function RufflePlayer({ swfPath }: RufflePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Nạp script Ruffle từ CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@ruffle-rs/ruffle';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.RufflePlayer = window.RufflePlayer || {};
      const ruffle = window.RufflePlayer.newest();
      
      if (containerRef.current && !playerRef.current) {
        const player = ruffle.createPlayer();
        containerRef.current.appendChild(player);
        playerRef.current = player;

        player.style.width = '100%';
        player.style.height = '100%';
        player.style.minHeight = '600px';

        player.config = {
          autoplay: 'on',
          unmuteOverlay: 'visible',
          letterbox: 'on',
          backgroundColor: '#000000',
          allowScriptAccess: true,
          splashScreen: true,
          // Chỉ định thư mục gốc để tìm các file .swf và dữ liệu con
          base: swfPath.substring(0, swfPath.lastIndexOf('/') + 1),
          publicPath: swfPath.substring(0, swfPath.lastIndexOf('/') + 1),
        };

        player.load(swfPath);
      }
    };

    return () => {
      // Cleanup nếu cần
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [swfPath]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[600px] rounded-lg overflow-hidden border border-gray-800 bg-black shadow-2xl"
    />
  );
}
