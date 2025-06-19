/**
 * Utilitaires d'authentification
 */
import { Chat } from "./types"
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

export async function login(email:string, password:string): Promise<boolean>{
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
    method: "POST",
    mode: "cors",
    credentials: "include", // Important pour les cookies httpOnly
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: email,
      password:password,
    }),
  })
  if (response.ok) {
    const data = await response.json()
    // Sauvegarder les infos utilisateur localement
    localStorage.setItem("user", JSON.stringify(data.user))
    console.log("Connexion réussie:", data.message)
    return true
  } else {
    const errorData = await response.json()
    console.error("Erreur de connexion:", errorData.detail || "Erreur inconnue")
    return false
  }
}

/**
 * Inscrire un nouvel utilisateur
 */
export async function register(fullName: string, email: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name: fullName,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log("Inscription réussie:", data.message)
      return true
    } else {
      const errorData = await response.json()
      console.error("Erreur d'inscription:", errorData.detail || "Erreur inconnue")
      return false
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return false
  }
}

export async function getChats(): Promise<Chat[]>{
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/chat", {
    method: "GET",
    credentials: "include",
  })
  
  if (response.ok) {
    const data = await response.json()
    console.log("Conversations:", data)
    return data
  } else {
    throw new Error("Failed to fetch conversations")
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


