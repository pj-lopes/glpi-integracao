'use client'

import { Toggle } from '@/components/ui/toggle'
import { type Editor } from '@tiptap/react'
import '@tiptap/starter-kit'
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  StrikethroughIcon,
} from 'lucide-react'

interface Props {
  editor: Editor | null
}

export default function Toolbar({ editor }: Props) {
  if (!editor) {
    return null
  }

  return (
    <div className="mb-2 flex gap-3 rounded-lg border border-input p-1">
      <Toggle
        size="sm"
        pressed={editor.isActive('heading')}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
    </div>
  )
}
