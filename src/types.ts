export type Difficulty = 'Fácil' | 'Médio' | 'Avançado';
export type Category = 'Fundamentos' | 'Divertidos' | 'Impressionantes' | 'Agilidade';
export type TrickStatus = 'nao_iniciado' | 'aprendendo' | 'aprendeu';
export type ThemeMode = 'light' | 'dark';
export type ActiveTab = 'inicio' | 'favoritos' | 'progresso' | 'config';

export interface Trick {
  id: number;
  title: string;
  category: Category;
  difficulty: Difficulty;
  duration: string;
  commandWord: string;
  description: string;
  trainerSecret: string;
  steps: string[];
  equipment: string;
  badgeIcon: string;
  accentColor: string;
  bgGradient: string;
  sampleVideoTime: number; // in seconds
  imageUrl?: string;
  videoUrl?: string;
}

export interface PetProfile {
  name: string;
  breed?: string;
  age?: string;
  avatarId?: number;
  favoriteReward?: string;
}
