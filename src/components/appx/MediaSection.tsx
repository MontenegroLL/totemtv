import { useState } from 'react';
import { Link2, Play, Square, Tv } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlaybackState } from '@/types/appx';

interface MediaSectionProps {
  disabled: boolean;
  playbackState: PlaybackState;
  onLoadMedia: (url: string) => void;
  onStart: () => void;
  onStop: () => void;
}

export function MediaSection({ 
  disabled, 
  playbackState, 
  onLoadMedia, 
  onStart, 
  onStop 
}: MediaSectionProps) {
  const [url, setUrl] = useState('');

  const handleLoadUrl = () => {
    if (url.trim()) {
      onLoadMedia(url.trim());
    }
  };

  const handleTogglePlayback = () => {
    if (playbackState.isPlaying) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className={`appx-card p-6 transition-opacity duration-300 ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <Tv className="w-4 h-4 text-primary" />
        <span className="appx-section-title">Mídia Indoor</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="url"
            placeholder="Insira a URL da mídia ou pasta do Google Drive"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled}
            className="appx-input pl-10 h-12 text-base"
          />
        </div>
        
        <Button
          onClick={handleLoadUrl}
          disabled={disabled || !url.trim()}
          className="appx-btn-secondary h-12 px-6"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Carregar URL
        </Button>
        
        <Button
          onClick={handleTogglePlayback}
          disabled={disabled || !playbackState.currentMedia}
          className={`h-12 px-8 ${
            playbackState.isPlaying 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
              : 'appx-btn-primary'
          }`}
        >
          {playbackState.isPlaying ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Parar
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </>
          )}
        </Button>
      </div>
      
      {playbackState.currentMedia && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${playbackState.isPlaying ? 'bg-appx-success animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-muted-foreground">
            {playbackState.isPlaying ? 'Reproduzindo' : 'Pronto para iniciar'}
          </span>
        </div>
      )}
    </div>
  );
}
