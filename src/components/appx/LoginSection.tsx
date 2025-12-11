import { useState } from 'react';
import { User, Lock, LogIn, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserCredentials } from '@/types/appx';

interface LoginSectionProps {
  isAuthenticated: boolean;
  error: string | null;
  onLogin: (credentials: UserCredentials) => boolean;
  onLogout: () => void;
}

export function LoginSection({ isAuthenticated, error, onLogin, onLogout }: LoginSectionProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin({ login, password });
    if (success) {
      setLogin('');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="appx-card p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full appx-gradient flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conectado como</p>
              <p className="font-semibold text-foreground">Administrador</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="appx-card p-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="appx-input pl-10 h-12 text-base"
              autoComplete="username"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appx-input pl-10 h-12 text-base"
              autoComplete="current-password"
            />
          </div>
        </div>
        
        <Button type="submit" className="appx-btn-primary h-12 px-8">
          <LogIn className="w-4 h-4 mr-2" />
          Entrar
        </Button>
      </div>
      
      {error && (
        <p className="mt-3 text-sm text-destructive animate-slide-up">{error}</p>
      )}
    </form>
  );
}
