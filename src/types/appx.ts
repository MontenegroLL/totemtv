// APPX Types - Versão 1.0
// Estruturado para expansão futura (V2: Admin remoto, V3: Dashboard)

export interface UserCredentials {
  login: string;
  password: string;
}

export interface AppConfig {
  // Configurações de mídia
  mediaUrl: string;
  imageInterval: number; // segundos entre imagens
  
  // Configurações de orientação
  orientation: 'horizontal' | 'vertical';
  
  // Configurações de automação (V2)
  autoStartEnabled: boolean;
  autoStartTime: string; // HH:mm
  autoStopTime: string;  // HH:mm
  
  // Identificação do dispositivo (V2/V3)
  deviceId?: string;
  deviceName?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number; // para vídeos
}

export interface PlaybackState {
  isPlaying: boolean;
  currentIndex: number;
  currentMedia: MediaItem | null;
}

// Credenciais de admin (será substituído por auth real na V3)
export const ADMIN_CREDENTIALS: UserCredentials = {
  login: 'luciano',
  password: '908070lop'
};

export const DEFAULT_CONFIG: AppConfig = {
  mediaUrl: '',
  imageInterval: 10,
  orientation: 'horizontal',
  autoStartEnabled: false,
  autoStartTime: '08:00',
  autoStopTime: '22:00',
};
