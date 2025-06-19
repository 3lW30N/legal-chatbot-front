"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { checkAuth, logout as apiLogout } from '@/lib/auth'
interface User {
  email: string
  role: string
  id: string
  is_active: boolean
  created_at?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier l'authentification au chargement
  useEffect(() => {
    refreshAuth()
  }, [])

  const refreshAuth = async () => {
    try {
      setIsLoading(true)
      const authResult = await checkAuth()
      
      if (authResult.isAuthenticated && authResult.user) {
        setUser(authResult.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification d\'authentification:', error)
      
      // Si c'est une erreur de connectivité, on considère l'utilisateur comme non connecté
      // mais on ne bloque pas l'application
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        console.warn('API non disponible - mode déconnecté')
      }
      
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      await apiLogout()
      setUser(null)
      setIsAuthenticated(false)
      // Rediriger vers la page de connexion
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
