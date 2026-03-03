import { cn } from '@/lib/utils';
import { FileText, AlignLeft, Type, PieChart, List } from 'lucide-react';
import { PostFormat } from '@/contexts/BlogContext';
import { useIsMobile } from '@/hooks/use-mobile';

const formats: { key: PostFormat; label: string; icon: React.ElementType }[] = [
  { key: 'full', label: 'Full Post', icon: FileText },
  { key: 'summary', label: '3-Sentence Summary', icon: AlignLeft },
  { key: 'paragraph', label: 'Single Paragraph', icon: Type },
  { key: 'pareto', label: '80/20 Pareto', icon: PieChart },
  { key: 'bullets', label: 'Key Bullets', icon: List },
];

interface Props {
  active: PostFormat;
  onChange: (f: PostFormat) => void;
}

export function FormatSwitcher({ active, onChange }: Props) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {formats.map(f => (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              active === f.key
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30'
            )}
          >
            <f.icon className="h-3 w-3" />
            {f.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <nav className="sticky top-20 space-y-1">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Reading Format
      </p>
      {formats.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all text-left',
            active === f.key
              ? 'bg-accent text-accent-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <f.icon className="h-4 w-4 shrink-0" />
          {f.label}
        </button>
      ))}
    </nav>
  );
}
