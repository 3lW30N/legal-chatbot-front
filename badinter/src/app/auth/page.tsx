"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { login, register } from "@/lib/auth"
import styles from "./auth.module.css"

export default function AuthPage() {
  const router = useRouter()
  const { isAuthenticated, refreshAuth } = useAuth()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Rediriger vers le chat si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(loginData.email, loginData.password)
      if (success) {
        await refreshAuth()
        router.push("/chat")
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (error) {
      setError("Erreur de connexion. Vérifiez votre connexion internet.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registerData.password !== registerData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (registerData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setIsLoading(true)

    try {
      const success = await register(
        registerData.fullName,
        registerData.email,
        registerData.password
      )
      if (success) {
        await refreshAuth()
        router.push("/chat")
      } else {
        setError("Erreur lors de l'inscription. Email peut-être déjà utilisé.")
      }
    } catch (error) {
      setError("Erreur d'inscription. Vérifiez votre connexion internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header avec logo */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Image
            src="/logoo.png"
            alt="Logo Badinter"
            width={150}
            height={60}
            priority
            className={styles.logo}
            onClick={() => router.push("/")}
          />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>
              {activeTab === "login" ? "Connexion" : "Inscription"}
            </h1>
            <p className={styles.subtitle}>
              {activeTab === "login" 
                ? "Connectez-vous pour accéder à Badinter" 
                : "Créez votre compte et commencez à utiliser Badinter"}
            </p>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`}
              onClick={() => {
                setActiveTab("login")
                setError("")
              }}
            >
              Connexion
            </button>
            <button
              className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`}
              onClick={() => {
                setActiveTab("register")
                setError("")
              }}
            >
              Inscription
            </button>
          </div>

          {/* Affichage des erreurs */}
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* Formulaire de connexion */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <div className={styles.inputContainer}>
                  <Mail className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputContainer}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={styles.input}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? (
                  <>
                    <Loader2 className={styles.spinner} />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>
          )}

          {/* Formulaire d'inscription */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className={styles.form}>
              <div className={styles.inputGroup}>
                <div className={styles.inputContainer}>
                  <User className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputContainer}>
                  <Mail className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputContainer}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className={styles.input}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputContainer}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmer le mot de passe"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className={styles.input}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.passwordToggle}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? (
                  <>
                    <Loader2 className={styles.spinner} />
                    Inscription...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </form>
          )}

          <div className={styles.footer}>
            <p className={styles.footerText}>
              En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </main>

      {/* Image décorative */}
      <Image
        src="/dessin.png"
        alt="Illustration décorative"
        width={400}
        height={300}
        className={styles.decorativeImage}
      />
    </div>
  )
}
