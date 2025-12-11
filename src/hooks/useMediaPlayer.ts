import { useState, useCallback, useRef, useEffect } from 'react';
import { MediaItem, PlaybackState, AppConfig } from '@/types/appx';

// Função para extrair ID da pasta do Google Drive de uma URL
function extractDriveFolderId(url: string): string | null {
  const patterns = [
    /folders\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]+)$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Simula busca de arquivos (V1: entrada manual de URL)
// Na V3, isso será substituído por chamada real à API do Google Drive
function parseMediaUrl(url: string): MediaItem[] {
  if (!url.trim()) return [];
  
  // Por enquanto, trata a URL como uma única mídia
  // Detecta se é imagem ou vídeo pela extensão
  const isVideo = /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url);
  
  return [{
    id: Date.now().toString(),
    type: isVideo ? 'video' : 'image',
    url: url.trim(),
  }];
}

export function useMediaPlayer(config: AppConfig) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentIndex: 0,
    currentMedia: null,
  });
  
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadMedia = useCallback((url: string) => {
    const items = parseMediaUrl(url);
    setMediaList(items);
    
    if (items.length > 0) {
      setPlaybackState({
        isPlaying: false,
        currentIndex: 0,
        currentMedia: items[0],
      });
    }
  }, []);

  const nextMedia = useCallback(() => {
    if (mediaList.length === 0) return;
    
    setPlaybackState(prev => {
      const nextIndex = (prev.currentIndex + 1) % mediaList.length;
      return {
        ...prev,
        currentIndex: nextIndex,
        currentMedia: mediaList[nextIndex],
      };
    });
  }, [mediaList]);

  const startPlayback = useCallback(() => {
    if (mediaList.length === 0) return;
    
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: true,
      currentMedia: mediaList[prev.currentIndex],
    }));
  }, [mediaList]);

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

  // Timer para troca de imagens
  useEffect(() => {
    if (playbackState.isPlaying && playbackState.currentMedia?.type === 'image') {
      timerRef.current = setInterval(() => {
        nextMedia();
      }, config.imageInterval * 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [playbackState.isPlaying, playbackState.currentMedia, config.imageInterval, nextMedia]);

  return {
    playbackState,
    mediaList,
    loadMedia,
    startPlayback,
    stopPlayback,
    nextMedia,
  };
}
