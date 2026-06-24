import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2,
  PaintBucket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

const COLORS = [
  { label: 'Black', value: '#1a1a1a' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Purple', value: '#7c3aed' },
]

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const ToolButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-1.5 rounded transition-colors',
        active ? 'bg-journal-300 text-white' : 'text-journal-600 hover:bg-journal-100'
      )}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-journal-200 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-0.5 p-1.5 border-b border-journal-100 flex-wrap">
        <ToolButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </ToolButton>
        <ToolButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </ToolButton>
        <ToolButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="w-4 h-4" />
        </ToolButton>
        <div className="w-px h-5 bg-journal-200 mx-0.5" />
        <ToolButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="w-4 h-4" />
        </ToolButton>
        <ToolButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </ToolButton>
        <div className="w-px h-5 bg-journal-200 mx-0.5" />
        {COLORS.map((c) => (
          <ToolButton
            key={c.value}
            active={editor.isActive('textStyle', { color: c.value })}
            onClick={() => editor.chain().focus().setColor(c.value).run()}
          >
            <div className="flex items-center gap-1">
              <PaintBucket className="w-4 h-4" style={{ color: c.value }} />
              <span className="text-[10px]">{c.label}</span>
            </div>
          </ToolButton>
        ))}
      </div>
      <EditorContent editor={editor} className="tiptap p-4" />
    </div>
  )
}
