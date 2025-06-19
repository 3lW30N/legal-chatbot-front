"use client"

import React, { useState, useEffect, useRef } from 'react'

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
  wordByWord?: boolean
}

export function TypewriterText({ 
  text, 
  speed = 30, 
  className = "", 
  onComplete,
  wordByWord = true 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Vérification de type pour éviter les erreurs
    if (!text || typeof text !== 'string') {
      console.warn("TypewriterText: text n'est pas une chaîne valide:", text)
      setDisplayedText("")
      setIsTyping(false)
      return
    }
    
    if (currentIndex < text.length) {
      setIsTyping(true)
      
      if (wordByWord) {
        // Effet mot par mot plus naturel
        const words = text.split(' ')
        let currentWordIndex = 0
        let wordEndIndex = 0
        
        // Trouver le mot actuel basé sur l'index des caractères
        for (let i = 0; i < words.length; i++) {
          wordEndIndex += words[i].length + (i < words.length - 1 ? 1 : 0) // +1 pour l'espace
          if (currentIndex < wordEndIndex) {
            currentWordIndex = i
            break
          }
        }
        
        const wordsToShow = words.slice(0, currentWordIndex + 1).join(' ')
        
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(wordsToShow)
          // Aller au prochain mot
          const nextWordEndIndex = wordsToShow.length
          setCurrentIndex(nextWordEndIndex + 1)
        }, speed * 3) // Plus lent pour un effet plus naturel
      } else {
        // Effet caractère par caractère
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(text.substring(0, currentIndex + 1))
          setCurrentIndex(prev => prev + 1)
        }, speed)
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    } else if (currentIndex >= text.length) {
      setIsTyping(false)
      setDisplayedText(text) // S'assurer que tout le texte est affiché
      if (onComplete) {
        setTimeout(onComplete, 300) // Petit délai avant d'appeler onComplete
      }
    }
  }, [currentIndex, text, speed, onComplete, wordByWord])

  // Reset when text changes
  useEffect(() => {
    if (!text || typeof text !== 'string') {
      setDisplayedText("")
      setIsTyping(false)
      return
    }
    
    setDisplayedText("")
    setCurrentIndex(0)
    setIsTyping(true)
  }, [text])

  return (
    <div className={`inline-block ${className}`}>
      <span 
        className="whitespace-pre-wrap"
        style={{ 
          lineHeight: '1.6',
          wordBreak: 'break-word'
        }}
      >
        {displayedText}
      </span>
      {isTyping && (
        <span className="inline-block w-0.5 h-4 bg-current ml-1 animate-pulse opacity-75">
          |
        </span>
      )}
    </div>
  )
}
