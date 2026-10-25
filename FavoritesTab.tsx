import React from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Trick, TrickStatus, ThemeMode } from '../types';
import { VideoCard } from './VideoCard';

interface FavoritesTabProps {
  allTricks: Trick[];
  favoriteIds: number[];
  onToggleFavorite: (id: number) => void;
  trickStatuses: Record<number, TrickStatus>;
  onTeachNow: (id: number) => void;
  onOpenVideo: (trick: Trick) => void;
  onGoHome: () => void;
  theme: ThemeMode;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  allTricks,
  favoriteIds,
  onToggleFavorite,
  trickStatuses,
  onTeachNow,
  onOpenVideo,
  onGoHome,
  theme
}) => {
  const isDark = theme === 'dark';
  const favoriteTricks = allTricks.filter((t) => favoriteIds.includes(t.id));

  return (
    <div className="w-full px-4 sm:px-6 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className={`text-xl font-bold font-display ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Seus Truques Favoritos
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            {favoriteTricks.length} {favoriteTricks.length === 1 ? 'vídeo salvo' : 'vídeos salvos'} nos favoritos
          </p>
        </div>
      </div>

      {favoriteTricks.length > 0 ? (
        <div className="max-w-sm sm:max-w-md md:max-w-xl mx-auto px-1 sm:px-2">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
            {favoriteTricks.map((trick) => (
              <div key={trick.id} className="w-full flex justify-center">
                <VideoCard
                  trick={trick}
                  theme={theme}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  status={trickStatuses[trick.id] || 'nao_iniciado'}
                  onTeachNow={onTeachNow}
                  onOpenVideo={onOpenVideo}
                  showTeachButton={true}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`p-8 sm:p-12 text-center rounded-3xl border flex flex-col items-center justify-center my-6 ${
          isDark
            ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
            : 'bg-neutral-50 border-neutral-200 text-neutral-600'
        }`}>
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-4">
            <Heart className="w-8 h-8 stroke-2 fill-transparent" />
          </div>
          <h3 className={`text-lg font-bold font-display mb-1 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            Nenhum favorito marcado ainda
          </h3>
          <p className="text-xs max-w-sm mb-6 leading-relaxed">
            Ao navegar pelas aulas na aba Início, clique no coração no canto do vídeo para salvá-lo aqui e praticar quando quiser!
          </p>
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explorar Truques no Início</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
