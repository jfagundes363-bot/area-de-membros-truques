import React from 'react';
import { Heart } from 'lucide-react';
import { Trick, TrickStatus, ThemeMode } from '../types';
import { sounds } from '../utils/audio';

interface VideoCardProps {
  trick: Trick;
  theme: ThemeMode;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  status: TrickStatus;
  onTeachNow: (id: number) => void;
  onOpenVideo?: (trick: Trick) => void;
  showTeachButton?: boolean;
  customAction?: React.ReactNode;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  trick,
  theme,
  isFavorite,
  onToggleFavorite,
  status,
  onTeachNow,
  onOpenVideo,
  showTeachButton = true,
  customAction
}) => {
  const isDark = theme === 'dark';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(trick.id);
    sounds.playRewardChime();
  };

  const handleTeachClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTeachNow(trick.id);
    sounds.playClicker();
  };

  const handleCardClick = () => {
    if (onOpenVideo) {
      onOpenVideo(trick);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[175px] sm:max-w-[195px] mx-auto select-none group">
      {/* Título centralizado em cima do card com número de 1 a 15 */}
      <div className="mb-1.5 px-1 text-center w-full">
        <h3
          title={`${trick.id}. ${trick.title}`}
          className={`text-xs sm:text-sm font-bold font-display tracking-tight text-center truncate ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {trick.id}. {trick.title}
        </h3>
      </div>

      {/* 9:16 Video Layout Frame: Fundo Preto, Sem Bordas, Preparado para imagem de capa */}
      <div
        onClick={handleCardClick}
        className={`relative w-full aspect-[9/16] rounded-xl overflow-hidden shadow-md bg-black border-0 ${
          onOpenVideo ? 'cursor-pointer transition-transform duration-200 group-hover:scale-[1.02]' : ''
        }`}
      >
        {/* Imagem de capa otimizada com lazy loading e decoding assíncrono */}
        {trick.imageUrl ? (
          <img
            src={trick.imageUrl}
            alt={trick.title}
            width={195}
            height={346}
            loading={trick.id <= 4 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={trick.id <= 2 ? 'high' : 'auto'}
            className="w-full h-full object-cover transition-opacity duration-300"
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
          <div className="w-full h-full bg-black flex items-center justify-center">
            {/* Fundo preto limpo pronto para receber imagens de capa */}
            <div className="w-full h-full bg-neutral-950/70" />
          </div>
        )}

        {/* Heart Icon no canto superior direito */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Salvar como favorito'}
          className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md cursor-pointer touch-manipulation ${
            isFavorite
              ? 'bg-rose-500/25 border border-rose-500 text-rose-500 scale-105 shadow-sm shadow-rose-500/30'
              : 'bg-black/60 border border-white/30 text-white hover:bg-black/80 hover:scale-110 active:scale-95'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform ${
              isFavorite
                ? 'fill-rose-500 text-rose-500 stroke-rose-600'
                : 'fill-transparent text-white stroke-2'
            }`}
          />
        </button>
      </div>

      {/* Ação abaixo do card bem colado ao layout */}
      {customAction ? (
        <div className="mt-1 w-full">
          {customAction}
        </div>
      ) : (
        showTeachButton && (
          <div className="mt-1 w-full">
            <button
              onClick={handleTeachClick}
              aria-label={`Ensinar truque ${trick.title}`}
              className={`w-full py-1.5 sm:py-2 px-2 rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all duration-150 active:scale-95 shadow-sm cursor-pointer touch-manipulation ${
                isDark
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300'
              }`}
            >
              <span>Ensinar</span>
              {/* Paw Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 text-amber-500 shrink-0"
              >
                <ellipse cx="12" cy="16.5" rx="4.5" ry="3.8" />
                <ellipse cx="6.5" cy="10" rx="2" ry="2.7" transform="rotate(-15 6.5 10)" />
                <ellipse cx="10" cy="7" rx="2.1" ry="2.8" />
                <ellipse cx="14" cy="7" rx="2.1" ry="2.8" />
                <ellipse cx="17.5" cy="10" rx="2" ry="2.7" transform="rotate(15 17.5 10)" />
              </svg>
            </button>
          </div>
        )
      )}
    </div>
  );
};
