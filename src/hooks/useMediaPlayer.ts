import { useState, useCallback, useRef, useEffect } from 'react';
import { MediaItem, PlaybackState, AppConfig } from '@/types/appx';

// Função para embaralhar array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Função para extrair arquivos de mídia de uma URL
// Suporta múltiplas URLs separadas por vírgula ou quebra de linha
function parseMediaUrls(input: string): MediaItem[] {
  if (!input.trim()) return [];
  
  // Separa por vírgula, quebra de linha ou ponto e vírgula
  const urls = input
    .split(/[,;\n]+/)
    .map(url => url.trim())
    .filter(url => url.length > 0);
  
  return urls.map((url, index) => {
    // Detecta se é imagem ou vídeo pela extensão
    const isVideo = /\.(mp4|webm|mov|avi|mkv|m4v)(\?|$)/i.test(url);
    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(url);
    
    return {
      id: `media-${Date.now()}-${index}`,
      type: isVideo ? 'video' : 'image',
      url: url,
    };
  });
}

// Função para selecionar próxima mídia aleatória
function getRandomIndex(currentIndex: number, length: number): number {
  if (length <= 1) return 0;
  let newIndex = currentIndex;
  while (newIndex === currentIndex) {
    newIndex = Math.floor(Math.random() * length);
  }
  return newIndex;
}

export function useMediaPlayer(config: AppConfig) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentIndex: 0,
    currentMedia: null,
  });
  
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [shuffledList, setShuffledList] = useState<MediaItem[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadMedia = useCallback((input: string) => {
    const items = parseMediaUrls(input);
    setMediaList(items);
    
    // Embaralha a lista para reprodução aleatória
    const shuffled = shuffleArray(items);
    setShuffledList(shuffled);
    
    if (shuffled.length > 0) {
      setPlaybackState({
        isPlaying: false,
        currentIndex: 0,
        currentMedia: shuffled[0],
      });
    }
  }, []);

  const nextMedia = useCallback(() => {
    if (shuffledList.length === 0) return;
    
    setPlaybackState(prev => {
      // Escolhe próximo índice aleatório diferente do atual
      const nextIndex = getRandomIndex(prev.currentIndex, shuffledList.length);
      return {
        ...prev,
        currentIndex: nextIndex,
        currentMedia: shuffledList[nextIndex],
      };
    });
  }, [shuffledList]);

  const startPlayback = useCallback(() => {
    if (shuffledList.length === 0) return;
    
    // Re-embaralha ao iniciar
    const newShuffled = shuffleArray(mediaList);
    setShuffledList(newShuffled);
    
    const randomIndex = Math.floor(Math.random() * newShuffled.length);
    
    setPlaybackState({
      isPlaying: true,
      currentIndex: randomIndex,
      currentMedia: newShuffled[randomIndex],
    });
  }, [mediaList, shuffledList.length]);

  const stopPlayback = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  // Timer para troca de imagens com intervalo aleatório adicional (±20%)
  useEffect(() => {
    if (playbackState.isPlaying && playbackState.currentMedia?.type === 'image') {
      // Adiciona variação de ±20% no tempo para parecer mais natural
      const baseTime = config.imageInterval * 1000;
      const variation = baseTime * 0.2;
      const randomTime = baseTime + (Math.random() * variation * 2 - variation);
      
      timerRef.current = setTimeout(() => {
        nextMedia();
      }, randomTime);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [playbackState.isPlaying, playbackState.currentMedia, playbackState.currentIndex, config.imageInterval, nextMedia]);

  return {
    playbackState,
    mediaList,
    loadMedia,
    startPlayback,
    stopPlayback,
    nextMedia,
  };
}
