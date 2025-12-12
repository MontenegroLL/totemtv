import { useState, useEffect, useCallback } from 'react';
import { Logo } from '@/components/appx/Logo';
import { LoginSection } from '@/components/appx/LoginSection';
import { MediaSection } from '@/components/appx/MediaSection';
import { ConfigSection } from '@/components/appx/ConfigSection';
import { MediaPlayer } from '@/components/appx/MediaPlayer';
import { useAuth } from '@/hooks/useAuth';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { AppConfig, DEFAULT_CONFIG } from '@/types/appx';

const Index = () => {
  const { isAuthenticated, error, login, logout } = useAuth();
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  
  const {
    playbackState,
    mediaList,
    loadMedia,
    startPlayback,
    stopPlayback,
    nextMedia,
  } = useMediaPlayer(config);

  const handleConfigChange = useCallback((updates: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Handler para ESC sair do fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && playbackState.isPlaying) {
        stopPlayback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackState.isPlaying, stopPlayback]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-border/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="text-xs text-muted-foreground">
            v1.0.0 • Mídia Indoor
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center p-6">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Seção Superior - Login */}
          <LoginSection
            isAuthenticated={isAuthenticated}
            error={error}
            onLogin={login}
            onLogout={logout}
          />

          {/* Seção Inferior - Controles (habilitado após login) */}
          <div className="space-y-4">
            {/* Mídia Indoor */}
            <MediaSection
              disabled={!isAuthenticated}
              playbackState={playbackState}
              onLoadMedia={loadMedia}
              onStart={startPlayback}
              onStop={stopPlayback}
            />

            {/* Configurações */}
            <ConfigSection
              disabled={!isAuthenticated}
              config={config}
              onConfigChange={handleConfigChange}
            />
          </div>

          {/* Status Footer */}
          {!isAuthenticated && (
            <div className="text-center text-sm text-muted-foreground animate-pulse">
              Faça login para acessar os controles
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 border-t border-border/30">
        <div className="max-w-6xl mx-auto flex items-center justify-center text-xs text-muted-foreground">
          <span>APPX © 2024 • Sistema de Mídia Indoor</span>
        </div>
      </footer>

      {/* Player Fullscreen */}
      <MediaPlayer
        playbackState={playbackState}
        config={config}
        onVideoEnd={nextMedia}
        mediaCount={mediaList.length}
      />
    </div>
  );
};

export default Index;
