'use client'

import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
}

export default function DivScrollFollowUps({ children }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (Array.isArray(children) && children.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [Array.isArray(children) && children.length])

  return (
    <div
      id="chatBubble"
      className="scrollbar-styled flex max-h-64 w-full flex-col space-y-2 overflow-x-hidden overflow-y-scroll scroll-smooth rounded-xl bg-gray-100/50 p-2"
    >
      {children}
      <div ref={messagesEndRef} />
    </div>
  )
}
