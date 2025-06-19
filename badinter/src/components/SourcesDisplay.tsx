"use client"

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, ExternalLink, BookOpen } from 'lucide-react'

interface SourceItem {
  source: string
  page?: number
}

interface SourcesDisplayProps {
  sources: SourceItem[]
  className?: string
}

export function SourcesDisplay({ sources, className = "" }: SourcesDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!sources || sources.length === 0) {
    return null
  }

  // Filtrer les sources valides
  const validSources = sources.filter(source => source.source && source.source.trim() !== "")

  if (validSources.length === 0) {
    return null
  }

  // Couleurs alternées pour les sources
  const sourceColors = [
    { bg: 'bg-blue-500/20', border: 'border-blue-400/30', text: 'text-blue-100', icon: 'text-blue-300' },
    { bg: 'bg-purple-500/20', border: 'border-purple-400/30', text: 'text-purple-100', icon: 'text-purple-300' },
    { bg: 'bg-green-500/20', border: 'border-green-400/30', text: 'text-green-100', icon: 'text-green-300' },
    { bg: 'bg-orange-500/20', border: 'border-orange-400/30', text: 'text-orange-100', icon: 'text-orange-300' },
    { bg: 'bg-pink-500/20', border: 'border-pink-400/30', text: 'text-pink-100', icon: 'text-pink-300' },
  ]

  return (
    <div className={`mt-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/10 transition-all duration-200 rounded-lg focus:outline-none group"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
          <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            📚 Sources référencées ({validSources.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
          {validSources.map((source, index) => {
            const colors = sourceColors[index % sourceColors.length]
            
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border rounded-lg p-3 hover:bg-opacity-30 transition-all duration-200 group`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <FileText className={`w-4 h-4 ${colors.icon} group-hover:scale-110 transition-transform duration-200`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-xs font-medium ${colors.text} opacity-75`}>
                        Document #{index + 1}
                      </span>
                      {source.page && (
                        <span className={`text-xs ${colors.text} opacity-60 bg-white/10 px-2 py-0.5 rounded-full`}>
                          Page {source.page}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-sm ${colors.text} leading-relaxed break-words font-medium`}>
                      {source.source}
                    </p>
                    
                    {/* Effet de gradient en bas pour indiquer que c'est cliquable */}
                    <div className="mt-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Footer décoratif */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 text-center italic">
              Sources extraites automatiquement du contenu analysé
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
