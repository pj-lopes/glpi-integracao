'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from '@/components/custom/rich-text/toolbar'
import { ControllerRenderProps, FieldPath } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface FieldValues {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any
}

interface Props<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> {
  description: TName
  field: ControllerRenderProps<T, TName>
  className?: string
}

export default function RichText<T extends FieldValues>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description,
  field: { onBlur, name, value, onChange, ref },
  className,
}: Props<T>) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        heading: {
          HTMLAttributes: {
            class: 'text-xl font-bol',
            levels: [2],
          },
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: twMerge(
          'rounded-md border min-h-[150px] bg-background disabled:opacity-50 p-2 h-full text-start [&>p]:block',
          className,
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML(), { shouldValidate: true })
      console.log(editor.getHTML())
    },
    onBlur() {
      onBlur()
    },
  })

  return (
    <div className="flex h-full flex-col justify-stretch">
      <Toolbar editor={editor} />
      <EditorContent ref={ref} id={name} name={name} editor={editor} />
    </div>
  )
}
