import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Sun, Moon, X } from 'lucide-react';
import { ThemeMode } from '../types';

interface CheckinScreenProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onUnlock: (petName: string) => void;
  initialPetName?: string;
}

export const CheckinScreen: React.FC<CheckinScreenProps> = ({
  theme,
  onToggleTheme,
  onUnlock,
  initialPetName = ''
}) => {
  const [petName, setPetName] = useState(initialPetName);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);


  const trackRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const trackWidthRef = useRef(0);
  const handleWidthRef = useRef(52);

  const isDark = theme === 'dark';

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 600);
  };

  const handleStart = (clientX: number) => {
    if (!petName.trim()) {
      triggerError('Digite o nome do seu pet antes de deslizar!');
      return;
    }
    setErrorMessage('');
    setIsDragging(true);
    startXRef.current = clientX;
    if (trackRef.current && dragHandleRef.current) {
      trackWidthRef.current = trackRef.current.clientWidth;
      handleWidthRef.current = dragHandleRef.current.clientWidth;
    }
  };

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const maxDistance = trackWidthRef.current - handleWidthRef.current - 8;
    if (maxDistance <= 0) return;

    const delta = clientX - startXRef.current;
    const clampedDelta = Math.max(0, Math.min(delta, maxDistance));
    const progress = clampedDelta / maxDistance;
    setDragProgress(progress);

    if (progress >= 0.92 && !isUnlocked) {
      setIsUnlocked(true);
      setIsDragging(false);
      setDragProgress(1);
      setTimeout(() => {
        onUnlock(petName.trim());
      }, 250);
    }
  }, [isDragging, isUnlocked, onUnlock, petName]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragProgress < 0.92) {
      // Snap back smoothly
      setDragProgress(0);
    }
  }, [isDragging, dragProgress]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', touchMoveFallback);
      window.removeEventListener('touchend', touchEndFallback);
    };
    function touchMoveFallback(e: TouchEvent) {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    }
    function touchEndFallback() {
      handleEnd();
    }
  }, [isDragging, handleMove, handleEnd]);

  // Max translate px
  const maxTravel = trackRef.current && dragHandleRef.current 
    ? trackRef.current.clientWidth - dragHandleRef.current.clientWidth - 8 
    : 240;
  const currentTranslateX = dragProgress * Math.max(0, maxTravel);

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-300 font-sans ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Top bar with Sun and Moon switch */}
      <header className="w-full max-w-xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-500 text-sm">🐾</span>
          <span className={`text-xs font-semibold tracking-tight font-display ${
            isDark ? 'text-white/80' : 'text-neutral-700'
          }`}>
            TruquesPet
          </span>
        </div>

        {/* Theme toggle: Sun and Moon button */}
        <button
          onClick={onToggleTheme}
          aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 border cursor-pointer ${
            isDark
              ? 'bg-neutral-900 border-neutral-800 text-amber-400 hover:bg-neutral-800'
              : 'bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200'
          }`}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-neutral-700" />
              <span className="text-xs font-semibold text-black">Escuro</span>
            </>
          )}
        </button>
      </header>

      {/* Main checkin card / content */}
      <main className="w-full max-w-md mx-auto px-6 py-8 flex flex-col items-center justify-center flex-1 my-auto">
        {/* Área de Membros centralizada no lugar do acesso exclusivo */}
        <div className={`mb-6 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
          isDark
            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            : 'bg-amber-50 text-amber-800 border border-amber-200 shadow-sm'
        }`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Área de Membros</span>
        </div>

        {/* Central text strictly matching user requirement */}
        <h1
          className={`text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-6 font-display ${
            isDark ? 'text-white' : 'text-black'
          }`}
        >
          Qual o nome do seu pet?
        </h1>

        {/* Horizontal input for pet's name */}
        <div className="w-full mb-8">
          <div
            className={`w-full relative transition-transform ${
              errorShake ? 'animate-bounce' : ''
            }`}
          >
            <input
              type="text"
              value={petName}
              onChange={(e) => {
                setPetName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && petName.trim()) {
                  // Allow quick enter if user prefers
                  setDragProgress(1);
                  setIsUnlocked(true);
                  setTimeout(() => onUnlock(petName.trim()), 200);
                }
              }}
              placeholder="Ex: Thor, Mel, Bob, Pipoca..."
              autoFocus
              maxLength={25}
              className={`w-full px-10 py-4 rounded-2xl text-base sm:text-lg font-medium text-center outline-none transition-all duration-200 shadow-sm ${
                isDark
                  ? 'bg-neutral-900 border-2 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                  : 'bg-neutral-50 border-2 border-neutral-300 text-black placeholder-neutral-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white'
              } ${errorShake ? 'border-red-500 ring-2 ring-red-500/20' : ''}`}
            />
            {petName.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPetName('');
                  if (errorMessage) setErrorMessage('');
                }}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-400 hover:text-black hover:bg-neutral-200'
                }`}
                title="Limpar nome"
                aria-label="Limpar nome"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {errorMessage ? (
            <p className="text-xs text-red-500 font-semibold text-center mt-2.5">
              {errorMessage}
            </p>
          ) : (
            <p className={`text-[11px] text-center mt-2 ${
              isDark ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
              {petName.trim() ? 'Pronto! Agora deslize a patinha abaixo 🐾' : 'Digite o nome acima para liberar a área de membros'}
            </p>
          )}
        </div>

        {/* Interactive Slide to Unlock Button (Left to Right drag with Paw icon) */}
        <div className="w-full">
          <div
            ref={trackRef}
            className={`w-full h-16 rounded-full relative p-1.5 flex items-center select-none overflow-hidden transition-all duration-200 border ${
              isDark
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-neutral-100 border-neutral-200'
            } ${petName.trim() ? 'shadow-inner' : 'opacity-80'}`}
          >
            {/* Background filled progress */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-amber-400 transition-all pointer-events-none rounded-full opacity-30"
              style={{ width: `${Math.min(100, Math.max(12, dragProgress * 100))}%` }}
            />

            {/* Hint text centered in track */}
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none text-xs sm:text-sm font-semibold tracking-wide transition-opacity duration-200 pl-8 ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}
              style={{ opacity: Math.max(0, 1 - dragProgress * 1.6) }}
            >
              {petName.trim() ? 'Deslize a patinha para entrar ➔' : 'Digite o nome do pet primeiro'}
            </div>

            {/* Draggable button with Paw Icon */}
            <div
              ref={dragHandleRef}
              onMouseDown={(e) => handleStart(e.clientX)}
              onTouchStart={(e) => {
                if (e.touches[0]) handleStart(e.touches[0].clientX);
              }}
              style={{
                transform: `translateX(${currentTranslateX}px)`,
                transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className={`w-13 h-13 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 transition-shadow ${
                isUnlocked
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
                  : 'bg-gradient-to-br from-amber-400 to-amber-500 text-black shadow-md shadow-amber-500/30 hover:scale-105 active:scale-95'
              }`}
            >
              {isUnlocked ? (
                <span className="text-xl animate-pulse">✓</span>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 transition-transform group-hover:rotate-6"
                >
                  {/* Paw Print SVG icon */}
                  <ellipse cx="12" cy="16.5" rx="4.5" ry="3.8" />
                  <ellipse cx="6.5" cy="10" rx="2" ry="2.7" transform="rotate(-15 6.5 10)" />
                  <ellipse cx="10" cy="7" rx="2.1" ry="2.8" />
                  <ellipse cx="14" cy="7" rx="2.1" ry="2.8" />
                  <ellipse cx="17.5" cy="10" rx="2" ry="2.7" transform="rotate(15 17.5 10)" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer spacer */}
      <footer className="w-full py-3" />
    </div>
  );
};
