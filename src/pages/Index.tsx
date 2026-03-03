import { Link } from 'react-router-dom';
import { useBlog } from '@/contexts/BlogContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { posts } = useBlog();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12">
        <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Microsoft Licensing,{' '}
          <span className="text-primary">Simplified.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Clear, concise breakdowns of Microsoft licensing — from M365 plans to Azure cost optimization. 
          Every post comes in 5 reading formats so you get exactly what you need.
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <Link to={`/post/${post.id}`}>
              <Card className="group transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>
                  <CardTitle className="mt-1 text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Read in 5 formats <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}

        {posts.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No posts yet. Head to the admin dashboard to create your first post.
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
