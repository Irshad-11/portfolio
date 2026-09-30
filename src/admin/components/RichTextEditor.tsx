import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import {
  Bold, Italic, Underline as UIcon, Strikethrough, Code, Highlighter, List, ListOrdered, Quote, SquareCode, Minus,
  AlignLeft, AlignCenter, AlignRight, Link2, Link2Off, ImagePlus, Table as TableIcon, Undo2, Redo2, RemoveFormatting, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '../../lib/storage'
import { toHtml } from '../../lib/richtext'

function Btn({ on, onClick, title, children, disabled }: { on?: boolean; onClick: () => void; title: string; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="button" title={title} aria-label={title} disabled={disabled} onMouseDown={e => e.preventDefault()} onClick={onClick}
      className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-md transition-colors disabled:opacity-30 ${on ? 'bg-[color:var(--accent)] text-[color:var(--accent-ink)]' : 'text-[color:var(--text-muted)] hover:bg-white/10 hover:text-[color:var(--text)]'}`}>
      {children}
    </button>
  )
}
const Sep = () => <span className="w-px h-5 bg-[color:var(--border)] mx-1 shrink-0" />

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  compact?: boolean // fewer tools (testimonials)
  minHeight?: number
  folder?: string
}

/** Rich text editor (Tiptap). Output is HTML rendered by <RichContent/> with the site typography. */
export default function RichTextEditor({ value, onChange, placeholder = 'Start writing…', compact = false, minHeight = 240, folder = 'content' }: Props) {
  const [bar, setBar] = useState<null | 'link' | 'image'>(null)
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const file = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: false }), TableRow, TableHeader, TableCell,
    ],
    content: toHtml(value),
    editorProps: { attributes: { class: 'prose-rich', style: `min-height:${minHeight}px` } },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
  })

  // keep in sync if the value is replaced from outside (e.g. form reset)
  useEffect(() => {
    if (!editor || editor.isFocused) return
    const cur = editor.isEmpty ? '' : editor.getHTML()
    if ((value || '') !== cur) editor.commands.setContent(toHtml(value), false)
  }, [value, editor])

  if (!editor) return null
  const e: Editor = editor

  const applyLink = () => {
    const href = url.trim()
    if (!href) e.chain().focus().extendMarkRange('link').unsetLink().run()
    else e.chain().focus().extendMarkRange('link').setLink({ href: /^(https?:|mailto:|tel:|#|\/)/i.test(href) ? href : `https://${href}` }).run()
    setBar(null); setUrl('')
  }
  const applyImage = () => {
    if (url.trim()) e.chain().focus().setImage({ src: url.trim() }).run()
    setBar(null); setUrl('')
  }
  const upload = async (f?: File | null) => {
    if (!f) return
    setBusy(true)
    try { const u = await uploadImage(f, folder); e.chain().focus().setImage({ src: u }).run(); setBar(null) }
    catch (err) { toast.error(`Upload failed: ${(err as Error).message}`) }
    setBusy(false)
  }

  const heading = e.isActive('heading', { level: 2 }) ? '2' : e.isActive('heading', { level: 3 }) ? '3' : e.isActive('heading', { level: 4 }) ? '4' : '0'

  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-white/[0.02] overflow-hidden focus-within:border-[color:var(--accent)] transition-colors">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-[color:var(--border)] bg-black/20">
        <Btn title="Undo" onClick={() => e.chain().focus().undo().run()} disabled={!e.can().undo()}><Undo2 size={15} /></Btn>
        <Btn title="Redo" onClick={() => e.chain().focus().redo().run()} disabled={!e.can().redo()}><Redo2 size={15} /></Btn>
        <Sep />
        {!compact && (
          <select value={heading} onChange={ev => { const v = ev.target.value; v === '0' ? e.chain().focus().setParagraph().run() : e.chain().focus().toggleHeading({ level: Number(v) as 2 | 3 | 4 }).run() }}
            className="h-8 rounded-md bg-transparent text-xs text-[color:var(--text-muted)] border border-[color:var(--border)] px-1.5 mr-1" aria-label="Text style">
            <option value="0">Paragraph</option><option value="2">Heading 2</option><option value="3">Heading 3</option><option value="4">Label</option>
          </select>
        )}
        <Btn title="Bold" on={e.isActive('bold')} onClick={() => e.chain().focus().toggleBold().run()}><Bold size={15} /></Btn>
        <Btn title="Italic" on={e.isActive('italic')} onClick={() => e.chain().focus().toggleItalic().run()}><Italic size={15} /></Btn>
        <Btn title="Underline" on={e.isActive('underline')} onClick={() => e.chain().focus().toggleUnderline().run()}><UIcon size={15} /></Btn>
        <Btn title="Strikethrough" on={e.isActive('strike')} onClick={() => e.chain().focus().toggleStrike().run()}><Strikethrough size={15} /></Btn>
        <Btn title="Highlight" on={e.isActive('highlight')} onClick={() => e.chain().focus().toggleHighlight().run()}><Highlighter size={15} /></Btn>
        <Btn title="Inline code" on={e.isActive('code')} onClick={() => e.chain().focus().toggleCode().run()}><Code size={15} /></Btn>
        <Sep />
        <Btn title="Bullet list" on={e.isActive('bulletList')} onClick={() => e.chain().focus().toggleBulletList().run()}><List size={15} /></Btn>
        <Btn title="Numbered list" on={e.isActive('orderedList')} onClick={() => e.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></Btn>
        <Btn title="Quote" on={e.isActive('blockquote')} onClick={() => e.chain().focus().toggleBlockquote().run()}><Quote size={15} /></Btn>
        {!compact && <Btn title="Code block" on={e.isActive('codeBlock')} onClick={() => e.chain().focus().toggleCodeBlock().run()}><SquareCode size={15} /></Btn>}
        {!compact && <Btn title="Divider" onClick={() => e.chain().focus().setHorizontalRule().run()}><Minus size={15} /></Btn>}
        {!compact && (
          <>
            <Sep />
            <Btn title="Align left" on={e.isActive({ textAlign: 'left' })} onClick={() => e.chain().focus().setTextAlign('left').run()}><AlignLeft size={15} /></Btn>
            <Btn title="Align center" on={e.isActive({ textAlign: 'center' })} onClick={() => e.chain().focus().setTextAlign('center').run()}><AlignCenter size={15} /></Btn>
            <Btn title="Align right" on={e.isActive({ textAlign: 'right' })} onClick={() => e.chain().focus().setTextAlign('right').run()}><AlignRight size={15} /></Btn>
          </>
        )}
        <Sep />
        <Btn title="Link" on={e.isActive('link') || bar === 'link'} onClick={() => { setUrl(e.getAttributes('link').href || ''); setBar(bar === 'link' ? null : 'link') }}><Link2 size={15} /></Btn>
        {e.isActive('link') && <Btn title="Remove link" onClick={() => e.chain().focus().unsetLink().run()}><Link2Off size={15} /></Btn>}
        {!compact && (
          <>
            <Btn title="Image" on={bar === 'image'} onClick={() => { setUrl(''); setBar(bar === 'image' ? null : 'image') }}><ImagePlus size={15} /></Btn>
            <Btn title="Table" on={e.isActive('table')} onClick={() => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={15} /></Btn>
          </>
        )}
        <Btn title="Clear formatting" onClick={() => e.chain().focus().unsetAllMarks().clearNodes().run()}><RemoveFormatting size={15} /></Btn>
      </div>

      {bar && (
        <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[color:var(--border)] bg-black/30">
          <input autoFocus value={url} onChange={ev => setUrl(ev.target.value)} placeholder={bar === 'link' ? 'https://… (empty removes link)' : 'Image URL'}
            onKeyDown={ev => { if (ev.key === 'Enter') { ev.preventDefault(); bar === 'link' ? applyLink() : applyImage() } if (ev.key === 'Escape') setBar(null) }}
            className="admin-input !py-1.5 !text-xs flex-1 min-w-[10rem]" />
          <button type="button" onClick={bar === 'link' ? applyLink : applyImage} className="btn-primary !h-8 !px-3 !text-xs !rounded-md !normal-case !tracking-normal !font-sans">Apply</button>
          {bar === 'image' && (
            <>
              <input ref={file} type="file" accept="image/*" hidden onChange={ev => { upload(ev.target.files?.[0]); ev.target.value = '' }} />
              <button type="button" onClick={() => file.current?.click()} disabled={busy} className="btn-outline !h-8 !px-3 !text-xs !rounded-md !normal-case !tracking-normal !font-sans">
                {busy ? <Loader2 size={13} className="animate-spin" /> : 'Upload image'}
              </button>
            </>
          )}
        </div>
      )}

      <div className="max-h-[70vh] overflow-y-auto" style={{ background: 'var(--bg)' }}>
        <div className="p-4"><EditorContent editor={editor} /></div>
      </div>
    </div>
  )
}