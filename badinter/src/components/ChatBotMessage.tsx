"use client"

import React, { useState, useRef, useEffect } from 'react'
import { TypewriterText } from './TypewriterText'
import { SourceDisplay } from './SourceDisplay'
import { Bot } from 'lucide-react'
import Image from 'next/image'

interface ChatBotMessageProps {
  content: string
  sources?: Array<{
    title: string
    url?: string
    excerpt?: string
    type?: 'document' | 'webpage' | 'article'
  }>
  isTyping?: boolean
  onTypingComplete?: () => void
  className?: string
}

export function ChatBotMessage({ 
  content, 
  sources = [], 
  isTyping = false, 
  onTypingComplete,
  className = "" 
}: ChatBotMessageProps) {
  const [showSources, setShowSources] = useState(false)
  const [isContentComplete, setIsContentComplete] = useState(!isTyping)

  const handleTypingComplete = () => {
    setIsContentComplete(true)
    setShowSources(true)
    if (onTypingComplete) {
      onTypingComplete()
    }
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      {/* Avatar du bot */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Contenu du message */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
          {isTyping ? (
            <TypewriterText
              text={content}
              speed={25}
              wordByWord={true}
              onComplete={handleTypingComplete}
              className="text-gray-800 leading-relaxed"
            />
          ) : (
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>

        {/* Affichage des sources avec animation */}
        {showSources && sources.length > 0 && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <SourceDisplay sources={sources} className="mt-3" />
          </div>
        )}

        {/* Indicateur de typing si le contenu n'est pas encore complet */}
        {isTyping && !isContentComplete && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>Le bot réfléchit...</span>
          </div>
        )}
      </div>
    </div>
  )
}
