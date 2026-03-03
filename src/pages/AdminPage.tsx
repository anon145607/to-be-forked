import { useState } from 'react';
import { useBlog, BlogPost, PostFormat } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, LogIn, LogOut } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const FORMAT_LABELS: Record<PostFormat, string> = {
  full: 'Full Post',
  summary: '3-Sentence Summary',
  paragraph: 'Single Paragraph',
  pareto: 'Pareto Principle (80/20)',
  bullets: 'Key Bullet Points',
};

const emptyFormats = (): Record<PostFormat, string> => ({
  full: '', summary: '', paragraph: '', pareto: '', bullets: '',
});

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { posts, addPost, updatePost, deletePost } = useBlog();

  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [excerpt, setExcerpt] = useState('');
  const [formats, setFormats] = useState<Record<PostFormat, string>>(emptyFormats());

  if (!authed) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LogIn className="h-4 w-4" /> Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (username === 'user' && password === 'user') {
                  setAuthed(true);
                } else {
                  toast.error('Invalid credentials');
                }
              }}
              className="space-y-3"
            >
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resetForm = () => {
    setTitle(''); setDate(new Date().toISOString().split('T')[0]);
    setExcerpt(''); setFormats(emptyFormats());
    setEditing(null); setShowForm(false);
  };

  const startEdit = (post: BlogPost) => {
    setTitle(post.title); setDate(post.date);
    setExcerpt(post.excerpt); setFormats({ ...post.formats });
    setEditing(post.id); setShowForm(true);
  };

  const handleSave = () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    const postData = { title, date, excerpt, formats };
    if (editing) {
      updatePost(editing, postData);
      toast.success('Post updated');
    } else {
      addPost(postData);
      toast.success('Post created');
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deletePost(id);
    toast.success('Post deleted');
    if (editing === id) resetForm();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          {!showForm && (
            <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
              <Plus className="mr-1.5 h-3 w-3" /> New Post
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setAuthed(false)}>
            <LogOut className="mr-1.5 h-3 w-3" /> Logout
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{editing ? 'Edit Post' : 'Create Post'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description" rows={2} />
            </div>
            {(Object.keys(FORMAT_LABELS) as PostFormat[]).map(key => (
              <div key={key}>
                <Label>{FORMAT_LABELS[key]}</Label>
                <Textarea
                  value={formats[key]}
                  onChange={e => setFormats(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`Content for "${FORMAT_LABELS[key]}" format`}
                  rows={key === 'full' ? 10 : 4}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
              <Button variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-28">Date</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{post.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(post)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No posts yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
