import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, X } from 'lucide-react';

interface InlineCitationProps {
  text: string;
}

export function InlineCitation({ text }: InlineCitationProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="inline-flex flex-col">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center justify-center mx-1 align-middle w-5 h-5 rounded-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
        aria-label={open ? 'Skrýt citaci' : 'Zobrazit citaci'}
        type="button"
      >
        <Quote className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="block overflow-hidden"
          >
            <span className="my-2 flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm italic text-foreground/80">
              <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
              <span className="flex-1">{text}</span>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Skrýt citaci"
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
