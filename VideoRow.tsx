import React from 'react';
import { Trick, TrickStatus, ThemeMode } from '../types';
import { VideoCard } from './VideoCard';

interface VideoRowProps {
  tricks: Trick[];
  theme: ThemeMode;
  favoriteIds: number[];
  onToggleFavorite: (id: number) => void;
  trickStatuses: Record<number, TrickStatus>;
  onTeachNow: (id: number) => void;
  onOpenVideo: (trick: Trick) => void;
}

export const VideoRow: React.FC<VideoRowProps> = ({
  tricks,
  theme,
  favoriteIds,
  onToggleFavorite,
  trickStatuses,
  onTeachNow,
  onOpenVideo
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="w-full">
      {/* Header com o texto centralizado e ícone de pata abaixo centralizado */}
      <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 mb-4 w-full">
        <h2 className={`text-sm sm:text-base font-bold font-display tracking-tight ${
          isDark ? 'text-white' : 'text-neutral-900'
        }`}>
          veja as aulas abaixo
        </h2>
        <span className="text-amber-500 text-base mt-1 select-none">
          🐾
        </span>
      </div>

      {/* Grade de 2 colunas: duas lado a lado, duas embaixo, navegando com scroll vertical */}
      <div className="max-w-sm sm:max-w-md md:max-w-xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
          {tricks.map((trick) => (
            <div key={trick.id} className="w-full flex justify-center">
              <VideoCard
                trick={trick}
                theme={theme}
                isFavorite={favoriteIds.includes(trick.id)}
                onToggleFavorite={onToggleFavorite}
                status={trickStatuses[trick.id] || 'nao_iniciado'}
                onTeachNow={onTeachNow}
                onOpenVideo={onOpenVideo}
              />
            </div>
          ))}
        </div>

        {tricks.length === 0 && (
          <div className={`w-full py-16 text-center text-sm ${
            isDark ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            Nenhum vídeo encontrado.
          </div>
        )}
      </div>
    </div>
  );
};
