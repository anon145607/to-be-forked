import { useParams, Link } from 'react-router-dom';
import { useBlog } from '@/contexts/BlogContext';
import { useState } from 'react';
import { FormatSwitcher } from '@/components/FormatSwitcher';
import { InlineCitation } from '@/components/InlineCitation';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

function convertLegacyCitations(html: string): string {
  // Convert c("...") syntax (including multiline) to <citation> tags
  return html.replace(/c\(&quot;([\s\S]*?)&quot;\)/g, (_match, text: string) => {
    return `<citation data-text="${encodeURIComponent(text)}">📎</citation>`;
  }).replace(/c\("([\s\S]*?)"\)/g, (_match, text: string) => {
    return `<citation data-text="${encodeURIComponent(text)}">📎</citation>`;
  });
}

function renderContentWithCitations(html: string) {
  // First convert any legacy c("...") syntax to <citation> tags
  const normalizedHtml = convertLegacyCitations(html);

  // Split HTML on <citation> elements
  const parts = normalizedHtml.split(/(<citation[^>]*>.*?<\/citation>)/gi);
  if (parts.length === 1) {
    return <div dangerouslySetInnerHTML={{ __html: normalizedHtml }} />;
  }
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/<citation[^>]*data-text="([^"]*)"[^>]*>/i);
        if (match) {
          const text = decodeURIComponent(match[1]);
          return <InlineCitation key={i} text={text} />;
        }
        if (!part) return null;
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </>
  );
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { getPost } = useBlog();
  const post = getPost(id || '');
  const [format, setFormat] = useState<string>('full');
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
          <FormatSwitcher active={format} onChange={setFormat} customFormats={post.customFormats} />
        </div>
      )}

      <div className="flex gap-10">
        {!isMobile && (
          <aside className="w-56 shrink-0">
            <FormatSwitcher active={format} onChange={setFormat} customFormats={post.customFormats} />
          </aside>
        )}

        <article className="min-w-0 flex-1">
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>

          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

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
            >
              {renderContentWithCitations(content)}
            </motion.div>
          </AnimatePresence>
        </article>
      </div>
    </div>
  );
}
