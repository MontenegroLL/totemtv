import { useEffect, useRef, useState } from 'react';
import { PlaybackState, AppConfig } from '@/types/appx';
import { ImageOff, Shuffle, Image, Video } from 'lucide-react';

interface MediaPlayerProps {
  playbackState: PlaybackState;
  config: AppConfig;
  onVideoEnd: () => void;
  mediaCount?: number;
}

export function MediaPlayer({ playbackState, config, onVideoEnd, mediaCount = 0 }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Reset errors quando mídia muda
    setImageError(false);
    setVideoError(false);
  }, [playbackState.currentMedia?.url]);

  useEffect(() => {
    if (videoRef.current && playbackState.currentMedia?.type === 'video') {
      if (playbackState.isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [playbackState.isPlaying, playbackState.currentMedia]);

  // Listener para tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && playbackState.isPlaying) {
        // ESC é tratado pelo componente pai
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackState.isPlaying]);

  if (!playbackState.isPlaying || !playbackState.currentMedia) {
    return null;
  }

  const media = playbackState.currentMedia;
  const rotationStyle = config.orientation === 'vertical' 
    ? { transform: 'rotate(90deg)', transformOrigin: 'center center' }
    : {};

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Conteúdo da mídia */}
      {media.type === 'image' ? (
        imageError ? (
          <div className="flex flex-col items-center gap-4 text-white/60">
            <ImageOff size={64} />
            <span>Erro ao carregar imagem</span>
          </div>
        ) : (
          <img
            src={media.url}
            alt="Media content"
            className="w-full h-full object-contain transition-all duration-700 ease-in-out"
            style={rotationStyle}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        )
      ) : (
        videoError ? (
          <div className="flex flex-col items-center gap-4 text-white/60">
            <Video size={64} />
            <span>Erro ao carregar vídeo</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={media.url}
            className="w-full h-full object-contain"
            style={rotationStyle}
            autoPlay
            playsInline
            onEnded={onVideoEnd}
            onError={() => setVideoError(true)}
          />
        )
      )}
      
      {/* Indicador de reprodução aleatória */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
        <Shuffle size={16} className="text-appx-accent animate-pulse" />
        <div className="flex items-center gap-2">
          {media.type === 'image' ? (
            <Image size={14} className="text-appx-success" />
          ) : (
            <Video size={14} className="text-appx-warning" />
          )}
          <span className="text-sm text-white/80 font-medium">
            {playbackState.currentIndex + 1} / {mediaCount}
          </span>
        </div>
      </div>

      {/* Instrução para sair */}
      <div className="absolute top-6 right-6 bg-black/50 px-3 py-1.5 rounded text-white/50 text-xs backdrop-blur-sm">
        ESC para sair
      </div>
    </div>
  );
}
