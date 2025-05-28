"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Scale, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation d'authentification
    setTimeout(() => {
      const userData = {
        name: formData.name || formData.email.split("@")[0],
        email: formData.email,
      }
      localStorage.setItem("user", JSON.stringify(userData))
      router.push("/chat")
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Scale className="h-8 w-8 text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold">JE Legal AI</h1>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">Assistant IA Juridique</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                <Scale className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">{isLogin ? "Connexion" : "Inscription"}</CardTitle>
              <CardDescription className="text-white/70">
                {isLogin
                  ? "Accédez à votre assistant juridique personnel"
                  : "Créez votre compte pour sauvegarder vos conversations"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/90">
                      Nom complet
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Votre nom complet"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 group"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isLogin ? "Connexion..." : "Inscription..."}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {isLogin ? "Se connecter" : "S'inscrire"}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
                >
                  {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
                </button>
              </div>

              <div className="pt-4 border-t border-white/20">
                <p className="text-xs text-white/60 text-center">
                  En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <Scale className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">Expertise Juridique</h3>
              </div>
              <p className="text-xs text-white/70">Réponses spécialisées en droit des Junior Entreprises</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-white">IA Avancée</h3>
              </div>
              <p className="text-xs text-white/70">Technologie RAG avec modèles GPT-4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
