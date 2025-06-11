/**
 * Utilitaires d'authentification
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface User {
  email: string
  role: string
  id: string
  is_active: boolean
  created_at?: string
}

/**
 * Vérifier si l'utilisateur est connecté en vérifiant le cookie httpOnly
 */
export async function checkAuth(): Promise<{ isAuthenticated: boolean; user?: User }> {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    })

    if (response.ok) {
      const user = await response.json()
      return { isAuthenticated: true, user }
    } else {
      return { isAuthenticated: false }
    }
  } catch (error) {
    console.error("Erreur lors de la vérification d'authentification:", error)
    return { isAuthenticated: false }
  }
}

/**
 * Déconnecter l'utilisateur
 */
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", 
    })

    if (response.ok) {
      // Nettoyer le localStorage
      localStorage.removeItem("user")
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    return false
  }
}

/**
 * Obtenir les informations de l'utilisateur depuis localStorage ou API
 */
export function getStoredUser() {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  }
  return null
}

/**
 * Faire une requête authentifiée avec les cookies
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
}
