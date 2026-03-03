import { Link } from 'react-router-dom';
import { Sun, Moon, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <span className="font-mono text-sm font-bold text-primary-foreground">LS</span>
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            LicensingSimplified
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin" aria-label="Admin dashboard">
              <Shield className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
