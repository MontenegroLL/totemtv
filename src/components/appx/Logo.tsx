import { Monitor } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Monitor className="w-10 h-10 text-primary animate-pulse-glow" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-appx-success rounded-full border-2 border-background" />
      </div>
      <div className="flex flex-col">
        <span className="font-orbitron text-2xl font-bold appx-gradient-text tracking-wider">
          APPX
        </span>
        <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase -mt-1">
          Mídia Indoor
        </span>
      </div>
    </div>
  );
}
