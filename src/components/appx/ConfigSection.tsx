import { useState } from 'react';
import { Settings, Monitor, Clock, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AppConfig } from '@/types/appx';

interface ConfigSectionProps {
  disabled: boolean;
  config: AppConfig;
  onConfigChange: (config: Partial<AppConfig>) => void;
}

export function ConfigSection({ disabled, config, onConfigChange }: ConfigSectionProps) {
  const [orientationOpen, setOrientationOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <div className={`appx-card p-6 transition-opacity duration-300 ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-accent" />
        <span className="appx-section-title">Configurações</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Botão Características (Orientação) */}
        <Dialog open={orientationOpen} onOpenChange={setOrientationOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={disabled}
              className="appx-btn-secondary h-12 flex-1"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Características
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Orientação da Tela
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Defina a orientação de exibição da mídia na TV.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={config.orientation === 'horizontal' ? 'default' : 'outline'}
                  className={config.orientation === 'horizontal' ? 'appx-btn-primary' : ''}
                  onClick={() => {
                    onConfigChange({ orientation: 'horizontal' });
                    setOrientationOpen(false);
                  }}
                >
                  <Monitor className="w-5 h-5 mr-2" />
                  Horizontal
                </Button>
                <Button
                  variant={config.orientation === 'vertical' ? 'default' : 'outline'}
                  className={config.orientation === 'vertical' ? 'appx-btn-primary' : ''}
                  onClick={() => {
                    onConfigChange({ orientation: 'vertical' });
                    setOrientationOpen(false);
                  }}
                >
                  <Monitor className="w-5 h-5 mr-2 rotate-90" />
                  Vertical
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Atual: <span className="text-primary font-medium">{config.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</span>
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Botão Config (Temporizadores) */}
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={disabled}
              className="appx-btn-secondary h-12 flex-1"
            >
              <Clock className="w-4 h-4 mr-2" />
              Config
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Configurações de Tempo
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Intervalo de Imagens */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Tempo entre imagens (segundos)
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={300}
                  value={config.imageInterval}
                  onChange={(e) => onConfigChange({ imageInterval: parseInt(e.target.value) || 10 })}
                  className="appx-input"
                />
                <p className="text-xs text-muted-foreground">
                  Cada imagem será exibida por {config.imageInterval} segundos
                </p>
              </div>

              {/* Ligar/Desligar Automático (V2 Preview) */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Ligar/Desligar Automático</Label>
                    <p className="text-xs text-muted-foreground">
                      Baseado na hora regional
                    </p>
                  </div>
                  <Switch
                    checked={config.autoStartEnabled}
                    onCheckedChange={(checked) => onConfigChange({ autoStartEnabled: checked })}
                  />
                </div>

                {config.autoStartEnabled && (
                  <div className="grid grid-cols-2 gap-4 animate-slide-up">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Ligar às</Label>
                      <Input
                        type="time"
                        value={config.autoStartTime}
                        onChange={(e) => onConfigChange({ autoStartTime: e.target.value })}
                        className="appx-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Desligar às</Label>
                      <Input
                        type="time"
                        value={config.autoStopTime}
                        onChange={(e) => onConfigChange({ autoStopTime: e.target.value })}
                        className="appx-input"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          Orientação: <span className="text-foreground">{config.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}</span>
        </span>
        <span>•</span>
        <span>
          Intervalo: <span className="text-foreground">{config.imageInterval}s</span>
        </span>
      </div>
    </div>
  );
}
