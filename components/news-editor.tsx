"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { useCallback, useState, useEffect } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { api } from '@/lib/api'

// Extend Image extension to support alignment and custom classes
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        renderHTML: attributes => {
          if (attributes.align === 'left') return { 
            style: 'float: left; margin-right: 1.5rem; margin-bottom: 1rem; max-width: 50%; height: auto; border-radius: 0.5rem;' 
          }
          if (attributes.align === 'right') return { 
            style: 'float: right; margin-left: 1.5rem; margin-bottom: 1rem; max-width: 50%; height: auto; border-radius: 0.5rem;' 
          }
          return { 
            style: 'display: block; margin-left: auto; margin-right: auto; margin-top: 1.5rem; margin-bottom: 1.5rem; max-width: 100%; height: auto; border-radius: 0.5rem;' 
          }
        }
      },
      'data-loading': {
        default: null,
        renderHTML: attributes => {
          if (attributes['data-loading']) return { class: 'opacity-40 animate-pulse' }
          return {}
        }
      }
    }
  }
})

interface NewsEditorProps {
  content: string
  onChange: (content: string) => void
}

// Upload all base64/blob images found in an HTML string and replace src with real URLs
async function extractAndUploadImages(html: string, uploadFn: (file: File) => Promise<{ mediaUrl: string }>, editor: any): Promise<void> {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const images = Array.from(doc.querySelectorAll('img'))
  
  // Filter only images that need uploading (base64 or blob)
  const imagesToUpload = images.filter(img => img.src.startsWith('data:') || img.src.startsWith('blob:'))
  
  if (imagesToUpload.length === 0) {
    editor?.commands.insertContent(html)
    return
  }

  // 1. "Optimistic UI": Replace base64 with local blob URLs immediately so user sees them fast
  const localMap = new Map<string, string>()
  for (const img of imagesToUpload) {
    const originalSrc = img.src
    try {
      const res = await fetch(originalSrc)
      const blob = await res.blob()
      const localUrl = URL.createObjectURL(blob)
      localMap.set(originalSrc, localUrl)
      img.src = localUrl
      img.setAttribute('data-loading', 'true')
    } catch (e) {
      console.error('Failed to create local preview', e)
    }
  }

  // Insert the content immediately with local previews
  editor?.commands.insertContent(doc.body.innerHTML)

  // 2. Background Upload: Process in batches to avoid "Bad SQL grammar"
  const batchSize = 2 
  for (let i = 0; i < imagesToUpload.length; i += batchSize) {
    const batch = imagesToUpload.slice(i, i + batchSize)
    await Promise.all(batch.map(async (img) => {
      const originalSrc = Array.from(localMap.entries()).find(([_, local]) => local === img.src)?.[0] || img.src
      try {
        let file: File
        const res = await fetch(originalSrc)
        const blob = await res.blob()
        const ext = blob.type.split('/')[1] || 'png'
        file = new File([blob], `paste-${Date.now()}.${ext}`, { type: blob.type })
        
        const { mediaUrl } = await uploadFn(file)
        
        // Find the image in the editor and update its src
        if (editor) {
          const { state } = editor
          state.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'image' && node.attrs.src === localMap.get(originalSrc)) {
              editor.commands.command(({ tr }: any) => {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: mediaUrl, 'data-loading': null })
                return true
              })
            }
          })
        }
        URL.revokeObjectURL(localMap.get(originalSrc) || '')
      } catch (err) {
        console.error('Background upload failed:', err)
      }
    }))
  }
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [isUploading, setIsUploading] = useState(false)

  const addImage = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        setIsUploading(true)
        try {
          const res = await api.media.upload(file)
          if (res.mediaUrl) {
            editor.chain().focus().setImage({ src: res.mediaUrl }).run()
          }
        } catch (err) {
          console.error('Failed to upload image', err)
          alert('Failed to upload image')
        } finally {
          setIsUploading(false)
        }
      }
    }
    input.click()
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  const navButtonClass = "h-8 w-8 p-0"

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/40 rounded-t-lg sticky top-0 z-10 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${navButtonClass} ${editor.isActive('bold') ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${navButtonClass} ${editor.isActive('italic') ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`${navButtonClass} ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`${navButtonClass} ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`${navButtonClass} ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${navButtonClass} ${editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${navButtonClass} ${editor.isActive('heading', { level: 3 }) ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${navButtonClass} ${editor.isActive('bulletList') ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${navButtonClass} ${editor.isActive('orderedList') ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={`${navButtonClass} ${editor.isActive('link') ? 'bg-muted text-primary' : ''}`}
        type="button"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
        disabled={isUploading}
        className={navButtonClass}
        title="Chèn hình ảnh"
        type="button"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={navButtonClass}
        type="button"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={navButtonClass}
        type="button"
      >
        <Redo className="h-4 w-4" />
      </Button>
      {isUploading && <span className="text-xs text-muted-foreground ml-2 animate-pulse">Đang tải...</span>}
    </div>
  )
}

export function NewsEditor({ content, onChange }: NewsEditorProps) {
  const [isProcessingPaste, setIsProcessingPaste] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CustomImage.configure({
        inline: true,
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const imageItems = items.filter(item => item.type.startsWith('image/'))
        const hasHtml = items.some(item => item.type === 'text/html')

        if (imageItems.length > 0 && !hasHtml) {
          event.preventDefault()
          imageItems.forEach(async item => {
            const file = item.getAsFile()
            if (file) {
              const localUrl = URL.createObjectURL(file)
              const { schema } = view.state
              const node = schema.nodes.image.create({ src: localUrl, 'data-loading': 'true' })
              const transaction = view.state.tr.replaceSelectionWith(node)
              view.dispatch(transaction)

              try {
                const res = await api.media.upload(file)
                if (res.mediaUrl) {
                  const { state } = view
                  state.doc.descendants((node, pos) => {
                    if (node.type.name === 'image' && node.attrs.src === localUrl) {
                      const tr = view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: res.mediaUrl, 'data-loading': null })
                      view.dispatch(tr)
                    }
                  })
                }
                URL.revokeObjectURL(localUrl)
              } catch (err) {
                console.error('Failed to upload pasted image', err)
              }
            }
          })
          return true
        }

        if (hasHtml) {
          const htmlItem = items.find(item => item.type === 'text/html')
          if (htmlItem) {
            htmlItem.getAsString(async (rawHtml) => {
              const hasEmbeddedImages = /src=["'](data:|blob:)/i.test(rawHtml)
              if (!hasEmbeddedImages) {
                editor?.commands.insertContent(rawHtml)
                return
              }

              event.preventDefault()
              setIsProcessingPaste(true)
              try {
                await extractAndUploadImages(rawHtml, api.media.upload, editor)
              } catch (err) {
                console.error('Failed to process pasted HTML with images', err)
              } finally {
                setIsProcessingPaste(false)
              }
            })
            return true
          }
        }

        return false
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image')) {
            event.preventDefault()
            const localUrl = URL.createObjectURL(file)
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })

            if (coordinates) {
              const { schema } = view.state
              const node = schema.nodes.image.create({ src: localUrl, 'data-loading': 'true' })
              const transaction = view.state.tr.insert(coordinates.pos, node)
              view.dispatch(transaction)

              api.media.upload(file).then(res => {
                if (res.mediaUrl) {
                  const { state } = view
                  state.doc.descendants((node, pos) => {
                    if (node.type.name === 'image' && node.attrs.src === localUrl) {
                      const tr = view.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: res.mediaUrl, 'data-loading': null })
                      view.dispatch(tr)
                    }
                  })
                }
                URL.revokeObjectURL(localUrl)
              }).catch(err => {
                console.error('Failed to upload dropped image', err)
              })
            }
            return true
          }
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && editor.isEmpty) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const setImageAlign = (align: string) => {
    if (editor) {
      editor.chain().focus().updateAttributes('image', { align }).run()
    }
  }

  return (
    <div className="border border-border rounded-lg bg-background flex flex-col focus-within:ring-1 focus-within:ring-primary overflow-hidden shadow-sm relative">
      <MenuBar editor={editor} />
      
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor }) => editor.isActive('image')}
          className="flex items-center gap-1 bg-black/90 text-white p-1 rounded-lg border border-zinc-700 shadow-xl"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImageAlign('left')}
            className={`h-8 w-8 p-0 hover:bg-white/20 text-white ${editor.getAttributes('image').align === 'left' ? 'text-primary' : ''}`}
            title="Căn trái (Chữ bao quanh)"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImageAlign('center')}
            className={`h-8 w-8 p-0 hover:bg-white/20 text-white ${editor.getAttributes('image').align === 'center' ? 'text-primary' : ''}`}
            title="Căn giữa"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImageAlign('right')}
            className={`h-8 w-8 p-0 hover:bg-white/20 text-white ${editor.getAttributes('image').align === 'right' ? 'text-primary' : ''}`}
            title="Căn phải (Chữ bao quanh)"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 bg-zinc-700" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().deleteSelection().run()}
            className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
            title="Xóa hình"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      <div className="flex-1 w-full bg-background rounded-b-lg overflow-y-auto max-h-[800px] flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <EditorContent editor={editor} />
        </div>
      </div>
      
      <style jsx global>{`
        .prose img {
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .prose img[data-loading="true"] {
          filter: blur(2px);
          border: 2px solid #393ADD;
        }
        .prose img:hover {
          outline: 2px solid #393ADD;
        }
        .prose img.ProseMirror-selectednode {
          outline: 3px solid #393ADD;
          box-shadow: 0 0 15px rgba(57, 58, 221, 0.3);
        }
      `}</style>
    </div>
  )
}
