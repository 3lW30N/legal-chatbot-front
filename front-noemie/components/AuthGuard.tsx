"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkAuth } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated } = await checkAuth()
      
      setIsAuthenticated(isAuthenticated)
      
      if (!isAuthenticated) {
        router.push("/auth")
      }
    }

    verifyAuth()
  }, [router])

  // Loading state
  if (isAuthenticated === null) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Vérification de l&apos;authentification...</p>
          </div>
        </div>
      )
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null // Redirection handled in useEffect
  }

  // Authenticated
  return <>{children}</>
}
