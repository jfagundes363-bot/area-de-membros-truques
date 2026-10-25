import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, RotateCcw, Play, Volume2, VolumeX } from 'lucide-react';
import { Trick } from '../types';

interface VideoPlayerModalProps {
  trick: Trick | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  trick,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isFinished, setIsFinished] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Total seconds calculation
  const totalSeconds = trick?.sampleVideoTime || 165;

  // Reset state when opening a new trick
  useEffect(() => {
    if (!trick) return;
    setIsPlaying(true);
    setProgress(0);
    setCurrentTimeSec(0);
    setIsFinished(false);
    setVideoError(false);
    isDraggingRef.current = false;
  }, [trick]);

  // Video element sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    if (isPlaying && !isFinished) {
      video.play().catch(() => {
        // Autoplay with sound may be blocked by browser; retry muted
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  }, [isPlaying, isFinished, videoError]);

  // Simulated playback when not a real video or when video has error
  useEffect(() => {
    if (!trick || (trick.videoUrl && !videoError)) return;

    let interval: NodeJS.Timeout;
    if (isPlaying && !isFinished && !isDragging) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setIsFinished(true);
            setCurrentTimeSec(totalSeconds);
            return 100;
          }
          const next = prev + (100 / (totalSeconds * 4)); // updates every 250ms
          setCurrentTimeSec(Math.min(totalSeconds, Math.floor((next / 100) * totalSeconds)));
          return next;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [trick, isPlaying, isFinished, isDragging, videoError, totalSeconds]);

  // Native video time update
  const handleNativeTimeUpdate = () => {
    if (isDraggingRef.current) return;
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const current = video.currentTime;
    const dur = video.duration;
    setCurrentTimeSec(Math.floor(current));
    const pct = (current / dur) * 100;
    setProgress(pct);

    if (pct >= 99.8) {
      setIsPlaying(false);
      setIsFinished(true);
    }
  };

  // Scrubber calculation from clientX
  const seekToClientX = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clampedX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (clampedX / rect.width) * 100;
      setProgress(percentage);

      const targetSeconds = (percentage / 100) * (videoRef.current?.duration || totalSeconds);
      setCurrentTimeSec(Math.floor(targetSeconds));

      if (videoRef.current && !videoError) {
        videoRef.current.currentTime = targetSeconds;
      }

      if (percentage < 99) {
        setIsFinished(false);
      }
    },
    [totalSeconds, videoError]
  );

  // Mouse & Touch scrubber events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    isDraggingRef.current = true;
    seekToClientX(e.clientX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      seekToClientX(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    isDraggingRef.current = true;
    if (e.touches[0]) seekToClientX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches[0]) seekToClientX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  const handleRestart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProgress(0);
    setCurrentTimeSec(0);
    setIsFinished(false);
    setIsPlaying(true);
    if (videoRef.current && !videoError) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlayPause = () => {
    if (isFinished) {
      handleRestart();
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted((prev) => !prev);
  };

  if (!trick) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn select-none">
      {/* Phone Mockup Frame (Aba de Telefone 9:16) */}
      <div className="relative w-[340px] sm:w-[380px] max-w-[94vw] aspect-[9/16] max-h-[86vh] rounded-[48px] border-[10px] sm:border-[12px] border-neutral-900 bg-black shadow-[0_0_80px_rgba(0,0,0,0.9),0_25px_50px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col ring-1 ring-neutral-700/60">
        
        {/* Dynamic Island / Top Speaker Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-between px-2.5 pointer-events-none border border-neutral-800 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
        </div>

        {/* APENAS O X COMO BOTÃO PARA VOLTAR AO HOME */}
        <button
          onClick={onClose}
          aria-label="Voltar para a Home"
          title="Fechar e voltar para a Home"
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/70 hover:bg-black/90 active:scale-90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:border-amber-400 group"
        >
          <X className="w-5 h-5 stroke-[2.5] group-hover:scale-110 transition-transform" />
        </button>

        {/* Video Screen Area (9 por 16) */}
        <div
          onClick={togglePlayPause}
          className="relative w-full flex-1 overflow-hidden bg-black cursor-pointer flex items-center justify-center"
        >
          {/* Real Video for Dar a Pata or any trick with videoUrl */}
          {trick.videoUrl && !videoError ? (
            <video
              ref={videoRef}
              src={trick.videoUrl}
              poster={trick.imageUrl}
              playsInline
              autoPlay
              muted={isMuted}
              preload="auto"
              onTimeUpdate={handleNativeTimeUpdate}
              onError={() => {
                // If video fails to load, gracefully fall back to trick image
                setVideoError(true);
              }}
              onEnded={() => {
                setIsPlaying(false);
                setIsFinished(true);
              }}
              className="w-full h-full object-cover"
            />
          ) : trick.imageUrl ? (
            /* High quality 9:16 Cover Image */
            <img
              src={trick.imageUrl}
              alt={trick.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.endsWith('.jpeg')) {
                  target.src = target.src.replace('.jpeg', '.png');
                } else if (target.src.endsWith('.png')) {
                  target.src = target.src.replace('.png', '.jpg');
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-neutral-950 flex items-center justify-center">
              <span className="text-4xl">🐾</span>
            </div>
          )}

          {/* Sound Toggle (if real video) */}
          {trick.videoUrl && !videoError && (
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
              className="absolute top-4 left-4 z-40 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-amber-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          )}

          {/* Play/Pause Overlay indicator */}
          {!isPlaying && !isFinished && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px] pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-2xl scale-100 animate-fadeIn">
                <Play className="w-7 h-7 ml-1 fill-white" />
              </div>
            </div>
          )}

          {/* Video Finished Replay Overlay */}
          {isFinished && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
              <button
                onClick={handleRestart}
                aria-label="Recomeçar vídeo"
                title="Iniciar vídeo de novo"
                className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-8 h-8 stroke-[2.5]" />
              </button>
              <span className="text-white text-xs font-bold mt-3 tracking-wide drop-shadow">
                Recomeçar aula
              </span>
            </div>
          )}

          {/* Subtle bottom shadow vignette behind scrubber */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10" />
        </div>

        {/* BARRA ABAIXO NO VÍDEO COM ANDAMENTO E CONTROLE DE ARRASTAR (SEM TEXTOS DE DURAÇÃO/TEMPO) */}
        <div className="relative z-30 w-full px-5 py-4 bg-black/95 border-t border-white/10">
          {/* Interactive Draggable Scrubber Track */}
          <div
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-8 flex items-center cursor-pointer touch-none relative group"
            title="Arraste para avançar ou voltar o vídeo"
          >
            {/* Background Rail */}
            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden relative shadow-inner">
              {/* Progress Fill */}
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-[width] duration-75"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>

            {/* Draggable Scrubber Thumb */}
            <div
              className={`absolute w-5 h-5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] border-2 border-white -translate-x-1/2 pointer-events-none transition-transform ${
                isDragging ? 'scale-125 bg-amber-300' : 'group-hover:scale-110'
              }`}
              style={{ left: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {/* Phone Bottom Home Indicator bar */}
        <div className="w-full py-1.5 bg-black flex justify-center items-center pointer-events-none">
          <div className="w-28 h-1 bg-neutral-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
