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
              className="blog-content prose prose-sm max-w-none dark:prose-invert prose-headings:font-mono prose-headings:tracking-tight prose-p:text-foreground/85 prose-li:text-foreground/85 prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </AnimatePresence>
        </article>
      </div>
    </div>
  );
}
