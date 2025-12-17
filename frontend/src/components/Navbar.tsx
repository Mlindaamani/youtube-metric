import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Radio } from 'lucide-react';

export function Navbar() {
  const { channel, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand">
              <Radio className="h-5 w-5 text-brand-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Thinker<span className="text-brand">&</span>Builder</h1>
              {channel.current && (
                <p className="text-xs text-muted-foreground">{channel.current.customName || channel.current.title}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
