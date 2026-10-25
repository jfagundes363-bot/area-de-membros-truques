import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  petName: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenClickerTrainer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  petName,
  theme,
  onToggleTheme
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="w-full px-4 sm:px-6 pt-5 pb-3">
      {/* Top Brand & Utility bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-sm bg-neutral-900 shrink-0">
            <img
              src="https://i.imgur.com/1WEvgHo.png"
              alt="Truques Pet VIP"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('.jpg')) {
                  target.src = 'https://i.imgur.com/1WEvgHo.jpg';
                }
              }}
            />
          </div>
          <div>
            <h1 className={`text-base font-bold font-display leading-tight ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Truques Pet VIP
            </h1>
          </div>
        </div>

        {/* Action icons: Theme switcher */}
        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border cursor-pointer ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-amber-400'
                : 'bg-white border-neutral-200 hover:bg-neutral-100 shadow-sm text-neutral-700'
            }`}
          >
            {isDark ? (
              <Sun className="w-5 h-5 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>

      {/* Standard Required Greeting Phrase */}
      {/* "Olá, seja bem vindo , tutor de ( o nome que a pessoa colocar na aba de chekin ou quando ela alterar nas config ) e no final, o que vamos ensinar hoje ?" */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all mb-4 ${
        isDark
          ? 'bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900/50 border-neutral-800'
          : 'bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border-amber-100 shadow-sm'
      }`}>
        <p className={`text-base sm:text-xl font-extrabold font-display leading-snug tracking-tight ${
          isDark ? 'text-white' : 'text-neutral-900'
        }`}>
          Olá, seja bem-vindo, tutor de{' '}
          <span className="text-amber-500 underline decoration-amber-400/40 decoration-2 underline-offset-4">
            {petName.trim() || 'seu pet'}
          </span>
          ! O que vamos ensinar hoje?
        </p>
      </div>
    </header>
  );
};
