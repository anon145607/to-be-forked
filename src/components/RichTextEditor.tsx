import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Citation } from '@/extensions/CitationExtension';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote as QuoteIcon,
  Code, Minus, Undo, Redo, Table as TableIcon,
  AlignLeft, AlignCenter, AlignRight, Trash2,
  Plus, Columns2, Rows2, BookmarkPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${active ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}

export function RichTextEditor({ content, onChange, placeholder, minHeight = '200px' }: RichTextEditorProps) {
  const [citationOpen, setCitationOpen] = useState(false);
  const [citationText, setCitationText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing…' }),
      Citation,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const handleInsertCitation = () => {
    if (citationText.trim()) {
      editor.chain().focus().insertCitation(citationText.trim()).run();
    }
    setCitationText('');
    setCitationOpen(false);
  };

  return (
    <>
      <div className="rounded-md border border-input bg-background overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-1.5 py-1">
          <ToolbarButton icon={Undo} label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
          <ToolbarButton icon={Redo} label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
          <Separator orientation="vertical" className="mx-1 h-5" />

          <ToolbarButton icon={Bold} label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} />
          <ToolbarButton icon={Italic} label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} />
          <ToolbarButton icon={UnderlineIcon} label="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} />
          <ToolbarButton icon={Strikethrough} label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} />
          <ToolbarButton icon={Code} label="Inline Code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} />
          <Separator orientation="vertical" className="mx-1 h-5" />

          <ToolbarButton icon={Heading1} label="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} />
          <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} />
          <ToolbarButton icon={Heading3} label="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} />
          <Separator orientation="vertical" className="mx-1 h-5" />

          <ToolbarButton icon={List} label="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} />
          <ToolbarButton icon={ListOrdered} label="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} />
          <ToolbarButton icon={QuoteIcon} label="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} />
          <ToolbarButton icon={Minus} label="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
          <Separator orientation="vertical" className="mx-1 h-5" />

          <ToolbarButton icon={AlignLeft} label="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} />
          <ToolbarButton icon={AlignCenter} label="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} />
          <ToolbarButton icon={AlignRight} label="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} />
          <Separator orientation="vertical" className="mx-1 h-5" />

          <ToolbarButton
            icon={TableIcon}
            label="Insert Table"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          />
          {editor.isActive('table') && (
            <>
              <ToolbarButton icon={Plus} label="Add Column" onClick={() => editor.chain().focus().addColumnAfter().run()} />
              <ToolbarButton icon={Columns2} label="Delete Column" onClick={() => editor.chain().focus().deleteColumn().run()} />
              <ToolbarButton icon={Rows2} label="Add Row" onClick={() => editor.chain().focus().addRowAfter().run()} />
              <ToolbarButton icon={Trash2} label="Delete Table" onClick={() => editor.chain().focus().deleteTable().run()} />
            </>
          )}
          <Separator orientation="vertical" className="mx-1 h-5" />

          <ToolbarButton
            icon={BookmarkPlus}
            label="Insert Citation"
            onClick={() => setCitationOpen(true)}
          />
        </div>

        {/* Editor */}
        <div className="tiptap-editor px-4 py-3" style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>

      <Dialog open={citationOpen} onOpenChange={setCitationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Citation</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Citation Text</Label>
            <Textarea
              value={citationText}
              onChange={e => setCitationText(e.target.value)}
              placeholder="Enter the citation content…"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCitationOpen(false)}>Cancel</Button>
            <Button onClick={handleInsertCitation} disabled={!citationText.trim()}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
