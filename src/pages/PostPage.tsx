import { useParams, Link } from 'react-router-dom';
import { useBlog, PostFormat } from '@/contexts/BlogContext';
import { useState } from 'react';
import { FormatSwitcher } from '@/components/FormatSwitcher';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { getPost } = useBlog();
  const post = getPost(id || '');
  const [format, setFormat] = useState<PostFormat>('full');
  const isMobile = useIsMobile();

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Post not found.</p>
        <Button variant="link" asChild className="mt-4">
          <Link to="/">← Back to posts</Link>
        </Button>
      </div>
    );
  }

  const content = post.formats[format] || '';

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 text-muted-foreground">
        <Link to="/"><ArrowLeft className="mr-1.5 h-3 w-3" /> All Posts</Link>
      </Button>

      {isMobile && (
        <div className="mb-6">
          <FormatSwitcher active={format} onChange={setFormat} />
        </div>
      )}

      <div className="flex gap-10">
        {!isMobile && (
          <aside className="w-56 shrink-0">
            <FormatSwitcher active={format} onChange={setFormat} />
          </aside>
        )}

        <article className="min-w-0 flex-1">
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>
          <h1 className="mb-8 font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {post.title}
          </h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={format}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-mono prose-headings:tracking-tight prose-p:text-foreground/85 prose-li:text-foreground/85 prose-strong:text-foreground"
            >
              {content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="mt-8 mb-3 text-xl font-semibold">{line.replace('## ', '')}</h2>;
                if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                if (line.startsWith('- **')) {
                  const parts = line.replace('- **', '').split('**');
                  return <div key={i} className="flex gap-2 py-1"><span className="text-primary">•</span><p><strong>{parts[0]}</strong>{parts[1] || ''}</p></div>;
                }
                if (line.startsWith('- ')) return <div key={i} className="flex gap-2 py-1"><span className="text-primary">•</span><p>{line.replace('- ', '')}</p></div>;
                if (line.trim() === '') return <div key={i} className="h-3" />;
                return <p key={i} className="leading-relaxed">{line}</p>;
              })}
            </motion.div>
          </AnimatePresence>
        </article>
      </div>
    </div>
  );
}
