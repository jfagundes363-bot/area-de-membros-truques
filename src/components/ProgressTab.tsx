import React, { useState } from 'react';
import { Award, CheckCircle2, ArrowRight, Sparkles, RotateCcw, Clock } from 'lucide-react';
import { Trick, TrickStatus, ThemeMode } from '../types';
import { sounds } from '../utils/audio';
import { VideoCard } from './VideoCard';

interface ProgressTabProps {
  allTricks: Trick[];
  trickStatuses: Record<number, TrickStatus>;
  onSetStatus: (id: number, status: TrickStatus) => void;
  onOpenVideo: (trick: Trick) => void;
  onGoHome: () => void;
  petName: string;
  theme: ThemeMode;
  favoriteIds?: number[];
  onToggleFavorite?: (id: number) => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  allTricks,
  trickStatuses,
  onSetStatus,
  onOpenVideo,
  onGoHome,
  petName,
  theme,
  favoriteIds = [],
  onToggleFavorite = () => {}
}) => {
  const [filterMode, setFilterMode] = useState<'aprendendo' | 'aprendeu'>('aprendendo');
  const [showCertificate, setShowCertificate] = useState(false);

  const isDark = theme === 'dark';

  // Counts
  const learnedCount = allTricks.filter((t) => trickStatuses[t.id] === 'aprendeu').length;
  const learningCount = allTricks.filter((t) => trickStatuses[t.id] === 'aprendendo').length;
  const totalTricks = allTricks.length; // 15
  const progressPercentage = Math.round((learnedCount / totalTricks) * 100);

  const learningList = allTricks.filter((t) => trickStatuses[t.id] === 'aprendendo');
  const learnedList = allTricks.filter((t) => trickStatuses[t.id] === 'aprendeu');

  const displayedList = filterMode === 'aprendendo' ? learningList : learnedList;

  const handleMarkLearned = (id: number) => {
    onSetStatus(id, 'aprendeu');
    sounds.playRewardChime();
    if (learnedCount + 1 === totalTricks) {
      setTimeout(() => {
        sounds.playUnlockFanfare();
        setShowCertificate(true);
      }, 500);
    }
  };

  const handleMarkLearning = (id: number) => {
    onSetStatus(id, 'aprendendo');
    sounds.playClicker();
  };

  const handleTeachLater = (id: number) => {
    onSetStatus(id, 'nao_iniciado');
    sounds.playClicker();
  };

  return (
    <div className="w-full px-4 sm:px-6 py-4 pb-24 font-sans">
      {/* Top Banner with Progress Bar */}
      <div className={`p-5 sm:p-6 rounded-3xl border mb-6 transition-all ${
        isDark
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-white border-neutral-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold font-display ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                Evolução de {petName || 'Seu Pet'}
              </h2>
              <p className={`text-xs ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {learnedCount} de {totalTricks} truques aprendidos ({progressPercentage}%)
              </p>
            </div>
          </div>

          {learnedCount === totalTricks ? (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-3 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
            >
              <Award className="w-4 h-4" />
              <span>Ver Certificado</span>
            </button>
          ) : (
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-500">
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* 15 Truques Visual Progress Bar */}
        <div className="w-full">
          <div className="w-full h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5 relative">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(4, progressPercentage)}%` }}
            />
          </div>

          {/* 15 Step ticks */}
          <div className="flex justify-between items-center px-1 mt-2 text-[10px] text-neutral-400 font-mono">
            <span>0</span>
            <span>3</span>
            <span>6</span>
            <span>9</span>
            <span>12</span>
            <span className="font-bold text-amber-500">15 Truques</span>
          </div>
        </div>

        {/* Nível atual */}
        <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-100 text-neutral-600'
        }`}>
          <span>Nível Atual:</span>
          <span className="font-bold text-amber-500 flex items-center gap-1">
            {learnedCount >= 15
              ? '👑 Grande Mestre dos Truques VIP'
              : learnedCount >= 10
              ? '🎪 Showman Canino Avançado'
              : learnedCount >= 5
              ? '🌟 Cão Prodígio em Treino'
              : learnedCount >= 1
              ? '🐾 Filhote Iniciante Esperto'
              : '🌱 Pronto para o Primeiro Truque'}
          </span>
        </div>
      </div>

      {/* Filter Buttons: "Aprendendo" e "Ele Aprendeu!" reajustados em 2 colunas equilibradas */}
      <div className="grid grid-cols-2 gap-2.5 mb-6 max-w-sm sm:max-w-md md:max-w-xl mx-auto">
        <button
          onClick={() => setFilterMode('aprendendo')}
          className={`w-full py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 border cursor-pointer ${
            filterMode === 'aprendendo'
              ? 'bg-amber-500 border-amber-400 text-black shadow-md scale-101'
              : isDark
              ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              : 'bg-white border-neutral-200 text-neutral-600 hover:text-black shadow-sm'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="truncate">Aprendendo ({learningCount})</span>
        </button>

        <button
          onClick={() => setFilterMode('aprendeu')}
          className={`w-full py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 border cursor-pointer ${
            filterMode === 'aprendeu'
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md scale-101'
              : isDark
              ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              : 'bg-white border-neutral-200 text-neutral-600 hover:text-black shadow-sm'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span className="truncate">Ele Aprendeu! ({learnedCount})</span>
        </button>
      </div>

      {/* Grade de Vídeos com o MESMO layout da aba Home (2 colunas, 9:16, título em cima) com botão de pôr aprendeu */}
      <div className="max-w-sm sm:max-w-md md:max-w-xl mx-auto px-1 sm:px-2">
        {displayedList.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
            {displayedList.map((trick) => {
              const currentStatus = trickStatuses[trick.id] || 'nao_iniciado';

              return (
                <div key={trick.id} className="w-full flex justify-center">
                  <VideoCard
                    trick={trick}
                    theme={theme}
                    isFavorite={favoriteIds.includes(trick.id)}
                    onToggleFavorite={onToggleFavorite}
                    status={currentStatus}
                    onTeachNow={() => onOpenVideo(trick)}
                    onOpenVideo={onOpenVideo}
                    customAction={
                      currentStatus === 'aprendeu' ? (
                        <button
                          onClick={() => {
                            handleMarkLearning(trick.id);
                            onOpenVideo(trick);
                          }}
                          title="Clique para assistir e ensinar este truque de novo"
                          className={`w-full py-1.5 sm:py-2 px-2 rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95 border ${
                            isDark
                              ? 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-neutral-700 hover:border-amber-400'
                              : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300 hover:border-amber-500'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>Ensinar de novo</span>
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1.5 w-full">
                          <button
                            onClick={() => onOpenVideo(trick)}
                            title={`Ensinar truque ${trick.title}`}
                            className={`w-full py-1.5 sm:py-2 px-2 rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all duration-150 active:scale-95 shadow-sm cursor-pointer ${
                              isDark
                                ? 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700'
                                : 'bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300'
                            }`}
                          >
                            <span>Ensinar</span>
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
                          <button
                            onClick={() => handleMarkLearned(trick.id)}
                            title="Marcar como aprendido"
                            className="w-full py-1.5 sm:py-2 px-2 rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm cursor-pointer transition-all active:scale-95 border border-emerald-500/50"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                            <span>Aprendeu!</span>
                          </button>
                          <button
                            onClick={() => handleTeachLater(trick.id)}
                            title="Remover do aprendizado e ensinar depois"
                            className={`w-full py-1.5 sm:py-2 px-2 rounded-lg font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95 border ${
                              isDark
                                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700 hover:border-amber-400'
                                : 'bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 border-neutral-300 hover:border-amber-500'
                            }`}
                          >
                            <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>Ensinar depois</span>
                          </button>
                        </div>
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`p-8 sm:p-12 text-center rounded-3xl border flex flex-col items-center justify-center my-6 ${
            isDark
              ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
              : 'bg-neutral-50 border-neutral-200 text-neutral-600'
          }`}>
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 text-2xl">
              {filterMode === 'aprendendo' ? '🐾' : '🎓'}
            </div>
            <h3 className={`text-base font-bold font-display mb-1 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              {filterMode === 'aprendendo'
                ? 'Nenhum truque em aprendizado no momento'
                : 'Nenhum truque marcado como aprendido'}
            </h3>
            <p className="text-xs max-w-sm mb-5 leading-relaxed">
              {filterMode === 'aprendendo'
                ? 'Vá até a aba Início e clique no botão "Ensinar" em qualquer um dos 15 vídeos para enviá-lo para cá!'
                : 'Quando seu pet aprender um truque na aba de aprendizado, clique em "Aprendeu!" para registrar o progresso!'}
            </p>
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Ir para a aba Início</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center relative border shadow-2xl ${
            isDark
              ? 'bg-neutral-900 border-amber-500/40 text-white'
              : 'bg-white border-amber-400 text-neutral-900'
          }`}>
            <div className="text-5xl mb-3">🎓</div>
            <div className="text-xs uppercase tracking-widest text-amber-500 font-bold mb-1">
              Certificado de Conclusão VIP
            </div>
            <h3 className="text-2xl font-extrabold font-display mb-2">
              Super Cão Adestrado!
            </h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
              Certificamos solenemente que o pet <strong className="text-amber-500">{petName || 'Seu Pet'}</strong> e seu dedicado tutor completaram e dominaram com louvor todos os <strong>15 Truques Incríveis</strong>!
            </p>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs mb-6 font-mono text-amber-400">
              15 de 15 Módulos em Vídeo 9:16 Concluídos • Nível Mestre
            </div>
            <button
              onClick={() => setShowCertificate(false)}
              className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer"
            >
              Fechar Certificado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
