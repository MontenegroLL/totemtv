import { useEffect, useRef } from 'react';
import { PlaybackState, AppConfig } from '@/types/appx';
import { ImageOff, Tv } from 'lucide-react';

interface MediaPlayerProps {
  playbackState: PlaybackState;
  config: AppConfig;
  onVideoEnd: () => void;
}

export function MediaPlayer({ playbackState, config, onVideoEnd }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && playbackState.currentMedia?.type === 'video') {
      if (playbackState.isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playbackState.isPlaying, playbackState.currentMedia]);

  if (!playbackState.isPlaying || !playbackState.currentMedia) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center opacity-0 pointer-events-none">
        {/* Player oculto quando não está reproduzindo */}
      </div>
    );
  }

  const media = playbackState.currentMedia;
  const rotationClass = config.orientation === 'vertical' ? 'rotate-90' : '';

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {media.type === 'image' ? (
        <img
          src={media.url}
          alt="Media content"
          className={`max-w-full max-h-full object-contain ${rotationClass} transition-transform duration-500`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={media.url}
          className={`max-w-full max-h-full object-contain ${rotationClass}`}
          autoPlay
          onEnded={onVideoEnd}
          onError={(e) => {
            console.error('Video error:', e);
          }}
        />
      )}
      
      {/* Indicador de reprodução */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
        <div className="w-2 h-2 bg-appx-success rounded-full animate-pulse" />
        <span className="text-sm text-white/80 font-medium">
          {media.type === 'image' ? 'Imagem' : 'Vídeo'}
        </span>
      </div>

      {/* Botão para sair do fullscreen (tecla ESC) */}
      <div className="absolute top-6 right-6 text-white/40 text-xs">
        Pressione ESC para sair
      </div>
    </div>
  );
}
