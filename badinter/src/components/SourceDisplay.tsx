"use client"

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, FileText, Link } from 'lucide-react'

interface Source {
  title: string
  url?: string
  excerpt?: string
  type?: 'document' | 'webpage' | 'article'
}

interface SourceDisplayProps {
  sources: Source[]
  className?: string
}

export function SourceDisplay({ sources, className = "" }: SourceDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!sources || sources.length === 0) {
    return null
  }

  const getSourceIcon = (type: string = 'document') => {
    switch (type) {
      case 'webpage':
        return <Link className="w-4 h-4" />
      case 'article':
        return <ExternalLink className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className={`mt-4 border border-gray-200 rounded-lg bg-gray-50 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-100 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Sources ({sources.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-2">
                <div className="text-blue-600 mt-0.5">
                  {getSourceIcon(source.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {source.title}
                    </h4>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {source.excerpt && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {source.excerpt}
                    </p>
                  )}
                  {source.url && (
                    <p className="text-xs text-blue-600 mt-1 truncate">
                      {source.url}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
