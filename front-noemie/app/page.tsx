"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Scale,
  Zap,
  Database,
  Brain,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { useEffect, useState } from "react"

const TypewriterText = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, delay, text])

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{count}</span>
}

const ChatMockup = () => {
  const [messages, setMessages] = useState([{ text: "Comment créer une Junior Entreprise ?", isUser: true, delay: 0 }])

  useEffect(() => {
    const timeouts = [
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Pour créer une JE, vous devez rédiger des statuts conformes...",
            isUser: false,
            delay: 1000,
          },
        ])
      }, 2000),
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Quelles sont les obligations fiscales ?",
            isUser: true,
            delay: 0,
          },
        ])
      }, 4000),
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Les JE bénéficient d'exonérations de TVA sous conditions...",
            isUser: false,
            delay: 1000,
          },
        ])
      }, 6000),
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <Badge variant="secondary" className="text-xs">
          JE Legal AI
        </Badge>
      </div>

      <div className="space-y-3 h-64 overflow-hidden">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500">Tapez votre question...</div>
        <Button size="sm" className="rounded-full">
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold">JE Legal AI</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Badge variant="outline" className="text-white border-white/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
              <Link href="/chat">
                <Button variant="secondary" className="bg-white text-slate-900 hover:bg-gray-100">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Essayer gratuitement
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={`transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
                🚀 IA Juridique Spécialisée
              </Badge>

              <h2 className="text-5xl font-extrabold mb-6 leading-tight">
                Assistant IA pour
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  <TypewriterText text="Junior Entreprises" delay={150} />
                </span>
              </h2>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Obtenez des réponses juridiques instantanées et fiables grâce à notre IA spécialisée, alimentée par la
                base de données officielle des Junior Entreprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-3 group"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Commencer maintenant
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/50 text-white bg-white/10 hover:bg-white/20 hover:border-white/70"
                >
                  Voir la démo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    <AnimatedCounter end={1000} />+
                  </div>
                  <div className="text-sm text-gray-400">Questions résolues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    <AnimatedCounter end={95} />%
                  </div>
                  <div className="text-sm text-gray-400">Précision</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    <AnimatedCounter end={24} />
                    h/24
                  </div>
                  <div className="text-sm text-gray-400">Disponible</div>
                </div>
              </div>
            </div>

            {/* Right Content - Chat Mockup */}
            <div
              className={`transform transition-all duration-1000 delay-500 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <ChatMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extrabold mb-4">Pourquoi choisir JE Legal AI ?</h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Une technologie de pointe au service du droit des Junior Entreprises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Base de données officielle",
                description:
                  "Alimenté par les sources officielles de la Confédération Nationale des Junior-Entreprises",
                color: "text-blue-400",
              },
              {
                icon: Brain,
                title: "IA RAG avancée",
                description:
                  "Technologie de Retrieval Augmented Generation avec modèles GPT-4 pour une précision maximale",
                color: "text-purple-400",
              },
              {
                icon: Zap,
                title: "Réponses instantanées",
                description: "Obtenez des réponses juridiques en moins de 3 secondes, 24h/24 et 7j/7",
                color: "text-yellow-400",
              },
              {
                icon: Shield,
                title: "Fiabilité garantie",
                description: "Informations vérifiées et mises à jour en temps réel selon la législation en vigueur",
                color: "text-green-400",
              },
              {
                icon: Clock,
                title: "Historique intelligent",
                description: "Sauvegarde et analyse de vos conversations pour des recommandations personnalisées",
                color: "text-cyan-400",
              },
              {
                icon: CheckCircle,
                title: "Validation juridique",
                description: "Chaque réponse est cross-référencée avec le Code de commerce et les textes officiels",
                color: "text-pink-400",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <feature.icon
                    className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                  />
                  <h4 className="text-xl font-semibold mb-3 text-white">{feature.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-12 border border-white/20">
            <h3 className="text-4xl font-extrabold mb-6">Prêt à révolutionner votre approche juridique ?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Rejoignez les centaines de Junior Entrepreneurs qui font déjà confiance à notre IA juridique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                >
                  Commencer gratuitement
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white/50 text-white bg-white/10 hover:bg-white/20 hover:border-white/70"
              >
                Planifier une démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 JE Legal AI. Assistant juridique IA spécialisé pour Junior Entreprises.
          </p>
        </div>
      </footer>
    </div>
  )
}
