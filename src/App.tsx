import React, { useState, useEffect, useMemo } from 'react';
import { TRICKS_DATA } from './data/tricksData';
import { Trick, TrickStatus, ThemeMode, ActiveTab, PetProfile } from './types';
import { CheckinScreen } from './components/CheckinScreen';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { VideoRow } from './components/VideoRow';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { FavoritesTab } from './components/FavoritesTab';
import { ProgressTab } from './components/ProgressTab';
import { ConfigTab } from './components/ConfigTab';
import { BottomNav } from './components/BottomNav';
import { Sparkles, Check, Heart } from 'lucide-react';

const STORAGE_KEYS = {
  THEME: 'pet_tricks_theme',
  UNLOCKED: 'pet_tricks_unlocked',
  PET_PROFILE: 'pet_tricks_pet_profile',
  FAVORITES: 'pet_tricks_favorites',
  STATUSES: 'pet_tricks_statuses'
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light'; // Default light as requested: "fundo branco, com opção de por modo escuro"
  });

  // Check-in unlock state: always starts locked (false) on every page reload/load for optimization and check-in flow
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Clear any persistent unlock flag on reload/mount so the page always starts on check-in
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.UNLOCKED);
      sessionStorage.removeItem(STORAGE_KEYS.UNLOCKED);
    } catch {
      // storage unavailable
    }
  }, []);

  // Pet Profile state
  const [petProfile, setPetProfile] = useState<PetProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PET_PROFILE);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return { name: '', avatarId: 0 };
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [1, 5]; // Default 2 popular tricks favorited for a rich first impression
  });

  // Trick status ('nao_iniciado' | 'aprendendo' | 'aprendeu')
  const [trickStatuses, setTrickStatuses] = useState<Record<number, TrickStatus>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.STATUSES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      1: 'aprendendo' // Pre-start lesson 1 so tutor sees immediate progress link
    };
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Video Player Modal
  const [selectedVideo, setSelectedVideo] = useState<Trick | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ text: string; iconType?: 'heart' | 'check' } | null>(null);

  // Sync theme class to document body / root
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }, [theme]);

  // Sync pet profile
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PET_PROFILE, JSON.stringify(petProfile));
  }, [petProfile]);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Sync statuses
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(trickStatuses));
  }, [trickStatuses]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (text: string, iconType: 'heart' | 'check' = 'check') => {
    setToast({ text, iconType });
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const handleUnlockCheckin = (enteredPetName: string) => {
    const updatedName = enteredPetName || petProfile.name || 'Pipoca';
    setPetProfile((prev) => ({ ...prev, name: updatedName }));
    setIsUnlocked(true);
    showToast(`Bem-vindo, tutor de ${updatedName}! 🐾`);
  };

  const handleRestartCheckin = () => {
    setIsUnlocked(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.UNLOCKED);
      sessionStorage.removeItem(STORAGE_KEYS.UNLOCKED);
    } catch {
      // ignore
    }
  };

  const handleToggleFavorite = (id: number) => {
    setFavoriteIds((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        showToast('Removido dos favoritos', 'heart');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Adicionado aos favoritos', 'heart');
        return [...prev, id];
      }
    });
  };

  const handleSetStatus = (id: number, status: TrickStatus) => {
    setTrickStatuses((prev) => ({
      ...prev,
      [id]: status
    }));

    const trick = TRICKS_DATA.find((t) => t.id === id);
    const title = trick ? trick.title : `Truque #${id}`;

    if (status === 'aprendeu') {
      showToast(`Parabéns! ${petProfile.name || 'Seu pet'} aprendeu "${title}"! 🎉`);
    } else if (status === 'aprendendo') {
      showToast(`"${title}" enviado para a aba de Progresso! 🐾`);
    }
  };

  // Ensinar button action from Home
  const handleTeachNow = (id: number) => {
    handleSetStatus(id, 'aprendendo');
    const targetTrick = TRICKS_DATA.find((t) => t.id === id);
    if (targetTrick) {
      setSelectedVideo(targetTrick);
    }
  };

  const handleResetProgress = () => {
    setTrickStatuses({});
    setFavoriteIds([]);
    showToast('Progresso zerado com sucesso!');
  };

  // All 15 tricks, filterable by search term
  const filteredTricks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return TRICKS_DATA;
    return TRICKS_DATA.filter((trick) => {
      return (
        trick.title.toLowerCase().includes(q) ||
        trick.commandWord.toLowerCase().includes(q) ||
        trick.category.toLowerCase().includes(q) ||
        trick.difficulty.toLowerCase().includes(q) ||
        trick.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const learnedCount = useMemo(() => {
    return Object.values(trickStatuses).filter((s) => s === 'aprendeu').length;
  }, [trickStatuses]);

  // If not unlocked, render the required Check-in screen
  if (!isUnlocked) {
    return (
      <CheckinScreen
        theme={theme}
        onToggleTheme={toggleTheme}
        onUnlock={handleUnlockCheckin}
        initialPetName={petProfile.name}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-200 ${
        isDark ? 'bg-black text-white' : 'bg-white text-neutral-900'
      }`}
    >
      {/* Toast popup */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold shadow-xl border animate-bounce ${
          toast.iconType === 'heart'
            ? 'bg-neutral-900 text-white border-neutral-800'
            : 'bg-amber-500 text-black border-amber-400'
        }`}>
          {toast.iconType === 'heart' ? (
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 stroke-rose-600 shrink-0" />
          ) : (
            <Check className="w-4 h-4 shrink-0 text-black" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Main Content Area based on Active Tab */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
        {activeTab === 'inicio' && (
          <main className="w-full pb-24">
            {/* Standard Header with Greeting */}
            <Header
              petName={petProfile.name}
              theme={theme}
              onToggleTheme={toggleTheme}
            />

            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              theme={theme}
            />

            {/* 15 Video layouts arranged in a single row with arrows */}
            <VideoRow
              tricks={filteredTricks}
              theme={theme}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
              trickStatuses={trickStatuses}
              onTeachNow={handleTeachNow}
              onOpenVideo={setSelectedVideo}
            />

            {/* Quick Training Tip Banner */}
            <div className="px-4 sm:px-6 mt-4">
              <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isDark
                  ? 'bg-neutral-900/70 border-neutral-800'
                  : 'bg-amber-50/70 border-amber-200/80 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                    💡
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold font-display ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      Dica de Ouro do Adestrador para {petProfile.name || 'seu cão'}
                    </h3>
                    <p className={`text-xs mt-0.5 leading-relaxed max-w-xl ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      Treine sempre em sessões de apenas <strong>5 a 10 minutos</strong> por dia. Termine sempre com festa e petisco para seu pet esperar ansioso pela próxima aula!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('progresso')}
                  className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold whitespace-nowrap shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ver Trilha de Progresso</span>
                </button>
              </div>
            </div>
          </main>
        )}

        {activeTab === 'favoritos' && (
          <FavoritesTab
            allTricks={TRICKS_DATA}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            trickStatuses={trickStatuses}
            onTeachNow={handleTeachNow}
            onOpenVideo={setSelectedVideo}
            onGoHome={() => setActiveTab('inicio')}
            theme={theme}
          />
        )}

        {activeTab === 'progresso' && (
          <ProgressTab
            allTricks={TRICKS_DATA}
            trickStatuses={trickStatuses}
            onSetStatus={handleSetStatus}
            onOpenVideo={setSelectedVideo}
            onGoHome={() => setActiveTab('inicio')}
            petName={petProfile.name}
            theme={theme}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'config' && (
          <ConfigTab
            petProfile={petProfile}
            onUpdatePetProfile={(updated) => setPetProfile((prev) => ({ ...prev, ...updated }))}
            theme={theme}
            onToggleTheme={toggleTheme}
            onResetProgress={handleResetProgress}
            onRestartCheckin={handleRestartCheckin}
          />
        )}
      </div>

      {/* 9:16 Video Player Modal (Layout de telefone com X para voltar ao home) */}
      {selectedVideo && (
        <VideoPlayerModal
          trick={selectedVideo}
          onClose={() => {
            setSelectedVideo(null);
            setActiveTab('inicio');
          }}
        />
      )}

      {/* 4 Footer Buttons strictly as requested: inicio, favoritos, progresso, config */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        favoritesCount={favoriteIds.length}
        learnedCount={learnedCount}
        theme={theme}
      />
    </div>
  );
}
