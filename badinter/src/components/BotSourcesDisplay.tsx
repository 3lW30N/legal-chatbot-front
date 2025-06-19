"use client"

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react'

interface SourceItem {
  source: string
  page?: number
}

interface BotSourcesDisplayProps {
  sources: SourceItem[]
  className?: string
}

export function BotSourcesDisplay({ sources, className = "" }: BotSourcesDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!sources || sources.length === 0) {
    return null
  }

  // Filtrer les sources valides
  const validSources = sources.filter(source => source.source && source.source.trim() !== "")

  if (validSources.length === 0) {
    return null
  }

  return (
    <div className={`mt-3 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/10 transition-colors rounded-lg focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-300" />
          <span className="text-sm font-medium text-white/90">
            📚 Sources ({validSources.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/60" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/60" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {validSources.map((source, index) => (
            <div
              key={index}
              className={`p-3 rounded-md transition-all duration-200 hover:scale-[1.02] ${
                index % 2 === 0 
                  ? 'bg-white/10 hover:bg-white/15' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-blue-400 mt-0.5 flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white/95 break-words">
                      {getDisplayName(source.source)}
                    </h4>
                    {source.page && (
                      <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-200 rounded-full">
                        Page {source.page}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-white/70 mt-1 break-all">
                    {source.source}
                  </p>
                  
                  {/* Icône pour indiquer que c'est une source externe */}
                  <div className="flex items-center gap-1 mt-2">
                    <ExternalLink className="w-3 h-3 text-white/50" />
                    <span className="text-xs text-white/50">Source documentaire</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Animation d'apparition */}
      <style jsx>{`
        @keyframes sourceSlideIn {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-source-in {
          animation: sourceSlideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// Fonction utilitaire pour extraire un nom lisible depuis le chemin
function getDisplayName(sourcePath: string): string {
  if (!sourcePath) return "Document"
  
  // Extraire le nom du fichier depuis le chemin
  const fileName = sourcePath.split('/').pop() || sourcePath.split('\\').pop() || sourcePath
  
  // Supprimer l'extension si présente
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "")
  
  // Capitaliser et formater
  return nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .substring(0, 50) // Limiter la longueur
}
