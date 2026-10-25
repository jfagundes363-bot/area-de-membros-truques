import React from 'react';
import { Home, Heart, Award, Settings } from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  favoritesCount: number;
  learnedCount: number;
  theme: ThemeMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  favoritesCount,
  learnedCount,
  theme
}) => {
  const isDark = theme === 'dark';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'inicio',
      label: 'Início',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'favoritos',
      label: 'Favoritos',
      icon: <Heart className="w-5 h-5" />,
      badge: favoritesCount > 0 ? favoritesCount : undefined
    },
    {
      id: 'progresso',
      label: 'Progresso',
      icon: <Award className="w-5 h-5" />,
      badge: `${learnedCount}/15`
    },
    {
      id: 'config',
      label: 'Config',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav
      aria-label="Navegação Principal"
      className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl transition-colors duration-200 border-t ${
        isDark
          ? 'bg-black/90 border-neutral-800 text-neutral-400'
          : 'bg-white/95 border-neutral-200 text-neutral-600 shadow-lg'
      }`}
    >
      <div className="max-w-md md:max-w-xl mx-auto grid grid-cols-4 items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-all select-none ${
                isActive
                  ? isDark
                    ? 'text-amber-400 font-bold'
                    : 'text-amber-600 font-bold'
                  : 'hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>

                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full leading-tight ${
                      isActive
                        ? 'bg-amber-500 text-black'
                        : isDark
                        ? 'bg-neutral-800 text-neutral-300'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label single-line */}
              <span className="text-[11px] tracking-tight mt-1 whitespace-nowrap">
                {item.label}
              </span>

              {/* Active Indicator bar */}
              {isActive && (
                <span className="absolute bottom-1 w-5 h-1 rounded-full bg-amber-500 transition-all" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
