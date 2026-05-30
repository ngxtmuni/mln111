"use client";

import { useState, useRef, useEffect, useId } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Film,
  ExternalLink,
  AlertCircle,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
} from "lucide-react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
            onError?: () => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState?: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

function isYouTubePlayerReady(player: YouTubePlayer | null): player is YouTubePlayer {
  return Boolean(
    player &&
      typeof player.playVideo === "function" &&
      typeof player.pauseVideo === "function" &&
      typeof player.mute === "function" &&
      typeof player.unMute === "function" &&
      typeof player.isMuted === "function" &&
      typeof player.seekTo === "function" &&
      typeof player.getCurrentTime === "function" &&
      typeof player.getDuration === "function"
  );
}

interface DriveVideoSectionProps {
  driveFileId?: string;
  youtubeVideoId?: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  titleClassName?: string;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function DriveVideoSection({
  driveFileId,
  youtubeVideoId,
  title,
  subtitle,
  description,
  badge = "Video",
  titleClassName,
}: DriveVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerShellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeHostRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const youtubeProgressRef = useRef<number | null>(null);
  const youtubeElementId = useId().replace(/:/g, "");

  const isYouTube = Boolean(youtubeVideoId);
  const viewUrl = driveFileId ? `https://drive.google.com/file/d/${driveFileId}/view` : "";
  const streamUrl = driveFileId ? `https://drive.google.com/uc?export=download&id=${driveFileId}` : "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerShellRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isVisible || !hasStarted || !isYouTube || !youtubeVideoId) return;

    let disposed = false;

    const bootPlayer = () => {
      if (disposed || youtubePlayerRef.current || !window.YT?.Player || !youtubeHostRef.current) return;

      youtubeHostRef.current.innerHTML = "";
      const mountNode = document.createElement("div");
      mountNode.id = youtubeElementId;
      mountNode.style.width = "100%";
      mountNode.style.height = "100%";
      youtubeHostRef.current.appendChild(mountNode);

      youtubePlayerRef.current = new window.YT.Player(youtubeElementId, {
        videoId: youtubeVideoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            if (disposed) return;
            setIsPlayerReady(true);
            setDuration(event.target.getDuration() || 0);
            setIsMuted(event.target.isMuted());
            event.target.playVideo();
          },
          onStateChange: (event) => {
            const playingState = window.YT?.PlayerState?.PLAYING ?? 1;
            const pausedState = window.YT?.PlayerState?.PAUSED ?? 2;
            const endedState = window.YT?.PlayerState?.ENDED ?? 0;

            if (event.data === playingState) setIsPlaying(true);
            if (event.data === pausedState) setIsPlaying(false);
            if (event.data === endedState) {
              setIsPlaying(false);
              setCurrentTime(event.target.getDuration() || 0);
            }
          },
          onError: () => {
            setHasError(true);
          },
        },
      });
    };

    if (window.YT?.Player) {
      bootPlayer();
    } else {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }

      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        bootPlayer();
      };
    }

    return () => {
      disposed = true;
    };
  }, [hasStarted, isVisible, isYouTube, youtubeElementId, youtubeVideoId]);

  useEffect(() => {
    if (!isVisible || !hasStarted || !isYouTube) return;

    youtubeProgressRef.current = window.setInterval(() => {
      const player = youtubePlayerRef.current;
      if (!isYouTubePlayerReady(player)) return;

      try {
        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
        setIsMuted(player.isMuted());
      } catch {
        // Ignore transient iframe API states while the player is initializing or tearing down.
      }
    }, 500);

    return () => {
      if (youtubeProgressRef.current) {
        window.clearInterval(youtubeProgressRef.current);
        youtubeProgressRef.current = null;
      }
    };
  }, [hasStarted, isVisible, isYouTube]);

  useEffect(() => {
    if (!isVisible || !isPlaying || isYouTube || !videoRef.current) return;

    const video = videoRef.current;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 0);
    const handleVolumeChange = () => setIsMuted(video.muted);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isPlaying, isVisible, isYouTube]);

  useEffect(() => {
    return () => {
      if (youtubeProgressRef.current) {
        window.clearInterval(youtubeProgressRef.current);
      }
      youtubePlayerRef.current?.destroy();
      if (youtubeHostRef.current) {
        youtubeHostRef.current.innerHTML = "";
      }
    };
  }, []);

  const startPlayback = async () => {
    setHasError(false);
    setHasStarted(true);
    setIsPlaying(true);

    if (isYouTube) return;

    try {
      await videoRef.current?.play();
      setIsPlayerReady(true);
    } catch {
      setHasError(true);
    }
  };

  const togglePlayback = async () => {
    if (isYouTube) {
      const player = youtubePlayerRef.current;
      if (!isYouTubePlayerReady(player)) return;

      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const seekTo = (nextTime: number) => {
    const clampedTime = Math.max(0, Math.min(nextTime, duration || 0));

    if (isYouTube) {
      youtubePlayerRef.current?.seekTo(clampedTime, true);
      setCurrentTime(clampedTime);
      return;
    }

    if (!videoRef.current) return;
    videoRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  };

  const toggleMute = () => {
    if (isYouTube) {
      const player = youtubePlayerRef.current;
      if (!isYouTubePlayerReady(player)) return;

      if (player.isMuted()) {
        player.unMute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
      return;
    }

    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = async () => {
    if (!playerShellRef.current) return;

    if (document.fullscreenElement === playerShellRef.current) {
      await document.exitFullscreen();
      return;
    }

    await playerShellRef.current.requestFullscreen();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="py-20 bg-black" ref={containerRef}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#393ADD]/10 border border-[#393ADD]/20 text-[#393ADD] text-xs font-black uppercase tracking-[0.2em] mb-6">
              <Film size={14} className="animate-pulse" />
              {badge}
            </div>
          )}
          <h2 className={`text-4xl md:text-6xl font-black mb-4 tracking-tighter ${titleClassName || "text-white"}`}>
            {title}
          </h2>
          {subtitle ? <p className="text-[#393ADD] font-bold text-lg mb-4">{subtitle}</p> : null}
          <div className="h-1.5 w-24 bg-[#393ADD] mx-auto rounded-full mb-6" />
          {description ? (
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light">
              {description}
            </p>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-br from-[#393ADD]/40 via-transparent to-[#393ADD]/20 rounded-2xl pointer-events-none z-10" />

          <div
            ref={playerShellRef}
            className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800"
          >
            {!hasStarted ? (
              <button
                onClick={startPlayback}
                className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/95 hover:bg-zinc-900/80 transition-all duration-500 group/btn z-20"
                aria-label="Phát video"
              >
                <div className="absolute inset-0 opacity-10">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-px w-full bg-[#393ADD]"
                      style={{ top: `${(i + 1) * 12.5}%` }}
                    />
                  ))}
                </div>

                <div className="relative flex flex-col items-center gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#393ADD] flex items-center justify-center shadow-[0_0_60px_rgba(57,58,221,0.6)] group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_80px_rgba(57,58,221,0.8)] transition-all duration-500">
                    <Play size={36} className="text-white fill-white translate-x-0.5" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg tracking-wide">Nhấn để xem video</p>
                    <p className="text-zinc-500 text-sm mt-1">
                      {isYouTube ? "Phát trực tiếp từ YouTube" : "Phát trực tiếp từ Google Drive"}
                    </p>
                  </div>
                </div>
              </button>
            ) : null}

            {isVisible && hasStarted && isYouTube ? (
              <div
                ref={youtubeHostRef}
                className={`absolute inset-0 h-full w-full overflow-hidden ${!isPlaying ? "pointer-events-none" : ""}`}
              />
            ) : null}

            {isVisible && hasStarted && !isYouTube ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                preload="metadata"
                muted={isMuted}
                onLoadedMetadata={() => {
                  setDuration(videoRef.current?.duration || 0);
                  setIsPlayerReady(true);
                }}
                onError={() => setHasError(true)}
                autoPlay
              >
                <source src={streamUrl} type="video/mp4" />
              </video>
            ) : null}

            {hasError ? (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-zinc-950/95 px-6 text-center">
                <AlertCircle className="text-amber-400" size={36} />
                <div>
                  <p className="text-white font-bold text-lg">Không thể phát video trực tiếp</p>
                  <p className="text-zinc-400 text-sm mt-2">
                    File Google Drive có thể chưa mở quyền stream công khai hoặc đang chặn phát trong trang.
                  </p>
                </div>
                {viewUrl ? (
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#393ADD] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3031BA]"
                  >
                    Mở video trên Google Drive
                    <ExternalLink size={16} />
                  </a>
                ) : null}
              </div>
            ) : null}

            {hasStarted && !hasError ? (
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 md:p-5">
                <div className="mb-3">
                  <div className="relative h-2 rounded-full bg-white/15 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-[#393ADD]" style={{ width: `${progressPercent}%` }} />
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={Math.min(currentTime, duration || 0)}
                      onChange={(e) => seekTo(Number(e.target.value))}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      aria-label="Thanh tiến trình video"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      onClick={togglePlayback}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                      aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                    </button>
                    <button
                      onClick={() => seekTo(currentTime - 10)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                      aria-label="Lùi 10 giây"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <button
                      onClick={() => seekTo(currentTime + 10)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                      aria-label="Tua tới 10 giây"
                    >
                      <RotateCw size={18} />
                    </button>
                    <button
                      onClick={toggleMute}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                      aria-label={isMuted ? "Bật tiếng" : "Tắt tiếng"}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums text-zinc-200">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <button
                      onClick={toggleFullscreen}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                      aria-label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
                    >
                      <Maximize size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {hasStarted && !isPlayerReady && !hasError ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 pointer-events-none">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
