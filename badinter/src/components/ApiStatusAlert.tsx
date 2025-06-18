"use client"

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function ApiStatusAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const [isApiDown, setIsApiDown] = useState(false)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
          method: 'GET',
          mode: 'cors',
        })
        
        if (!response.ok) {
          setIsApiDown(true)
          setShowAlert(true)
        } else {
          setIsApiDown(false)
          setShowAlert(false)
        }
      } catch (error) {
        setIsApiDown(true)
        setShowAlert(true)
      }
    }

    // Vérifier immédiatement
    checkApiStatus()

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkApiStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!showAlert || !isApiDown) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200 p-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div className="text-sm text-amber-800">
            <strong>Service temporairement indisponible</strong>
            <p className="text-xs">
              L'API backend n'est pas accessible. Certaines fonctionnalités peuvent être limitées.
              {process.env.NODE_ENV === 'development' && (
                <span> Assurez-vous que le serveur backend est démarré sur {process.env.NEXT_PUBLIC_API_URL}</span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAlert(false)}
          className="text-amber-600 hover:text-amber-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
