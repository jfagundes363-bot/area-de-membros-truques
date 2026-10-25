import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, X } from 'lucide-react';
import { ThemeMode, PetProfile } from '../types';

interface ConfigTabProps {
  petProfile: PetProfile;
  onUpdatePetProfile: (updated: Partial<PetProfile>) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onResetProgress: () => void;
  onRestartCheckin: () => void;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({
  petProfile,
  onUpdatePetProfile,
  theme,
  onResetProgress,
  onRestartCheckin
}) => {
  const [nameInput, setNameInput] = useState(petProfile.name || '');
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    if (petProfile.name) {
      setNameInput(petProfile.name);
    }
  }, [petProfile.name]);

  const isDark = theme === 'dark';

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || 'Pipoca';
    setNameInput(finalName);
    onUpdatePetProfile({
      name: finalName
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 pb-28 font-sans">
      {/* Title */}
      <div className="mb-6">
        <h2 className={`text-xl font-bold font-display ${
          isDark ? 'text-white' : 'text-neutral-900'
        }`}>
          Configurações
        </h2>
        <p className={`text-xs mt-0.5 ${
          isDark ? 'text-neutral-400' : 'text-neutral-500'
        }`}>
          Altere o nome do seu pet para personalizar a saudação na aba Início
        </p>
      </div>

      {/* Pet Name Card */}
      <div className={`p-5 sm:p-6 rounded-3xl border mb-6 transition-all ${
        isDark
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-white border-neutral-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🐾</span>
          <h3 className={`text-base font-bold font-display ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            Nome do Seu Pet
          </h3>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isDark ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              Nome do Pet (aparece no cabeçalho da Home):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ex: Thor, Mel, Luke..."
                  maxLength={25}
                  className={`w-full px-4 py-2.5 pr-9 rounded-xl text-sm font-medium outline-none transition-all border ${
                    isDark
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-amber-400'
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-amber-500 focus:bg-white'
                  }`}
                />
                {nameInput.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setNameInput('')}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors cursor-pointer ${
                      isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-700' : 'text-neutral-400 hover:text-black hover:bg-neutral-200'
                    }`}
                    title="Limpar campo"
                    aria-label="Limpar campo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </form>

        {isSavedToast && (
          <div className="mt-3 py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>Nome salvo com sucesso! A Home já foi atualizada.</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        <button
          onClick={onRestartCheckin}
          className={`w-full py-2.5 px-4 rounded-2xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border ${
            isDark
              ? 'border-neutral-800 text-amber-400 hover:bg-neutral-800'
              : 'border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <span>🐾 Voltar para tela de Check-in</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('Deseja realmente zerar todo o progresso dos truques aprendidos?')) {
              onResetProgress();
            }
          }}
          className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Zerar progresso dos 15 truques</span>
        </button>
      </div>
    </div>
  );
};
