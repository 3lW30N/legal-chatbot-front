"use client"

import type React from "react"
import { useState, useEffect, useRef} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, ArrowLeft, Scale, History, Plus, LogOut, Sparkles, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/AuthGuard"
import { logout, checkAuth } from "@/lib/auth"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const SAMPLE_RESPONSES = {
  statuts:
    "Pour créer une Junior Entreprise, les statuts doivent obligatoirement contenir : l'objet social (prestations intellectuelles par des étudiants), la dénomination sociale, le siège social, la durée (99 ans max), les conditions d'admission des membres, et les règles de fonctionnement des organes dirigeants. Les statuts doivent être déposés en préfecture.",
  tva: "Les Junior Entreprises bénéficient d'une exonération de TVA sous certaines conditions : elles doivent avoir un caractère désintéressé, leurs activités doivent être d'utilité générale, et elles ne doivent pas concurrencer le secteur commercial. Le chiffre d'affaires annuel ne doit pas dépasser 63 059€ pour conserver cette exonération.",
  membres:
    "Les membres d'une JE sont généralement des étudiants de l'établissement d'enseignement supérieur de rattachement. Ils peuvent être membres actifs (avec droit de vote) ou membres d'honneur. Les cotisations sont librement fixées par l'AG. L'exclusion d'un membre doit suivre une procédure contradictoire prévue dans les statuts.",
  assemblée:
    "L'Assemblée Générale doit se réunir au moins une fois par an. Elle approuve les comptes, élit le bureau, et vote les modifications statutaires. Le quorum est généralement fixé à 50% des membres. Les décisions ordinaires se prennent à la majorité simple, les modifications statutaires à la majorité des 2/3.",
  responsabilité:
    "La responsabilité civile de la JE peut être engagée pour les prestations réalisées. Il est obligatoire de souscrire une assurance responsabilité civile professionnelle. Les membres du bureau peuvent voir leur responsabilité personnelle engagée en cas de faute de gestion.",
  default:
    "Je suis spécialisé dans le droit des Junior Entreprises. Je peux vous renseigner sur les statuts, la fiscalité, la gestion des membres, les assemblées générales, la responsabilité civile, et tous les aspects juridiques liés au fonctionnement d'une JE. Posez-moi une question spécifique !",
}

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("statut") || lowerMessage.includes("création") || lowerMessage.includes("constitution")) {
    return SAMPLE_RESPONSES.statuts
  }
  if (
    lowerMessage.includes("tva") ||
    lowerMessage.includes("fiscal") ||
    lowerMessage.includes("impôt") ||
    lowerMessage.includes("taxe")
  ) {
    return SAMPLE_RESPONSES.tva
  }
  if (
    lowerMessage.includes("membre") ||
    lowerMessage.includes("adhésion") ||
    lowerMessage.includes("cotisation") ||
    lowerMessage.includes("exclusion")
  ) {
    return SAMPLE_RESPONSES.membres
  }
  if (
    lowerMessage.includes("assemblée") ||
    lowerMessage.includes("ag") ||
    lowerMessage.includes("vote") ||
    lowerMessage.includes("élection")
  ) {
    return SAMPLE_RESPONSES.assemblée
  }
  if (lowerMessage.includes("responsabilité") || lowerMessage.includes("assurance") || lowerMessage.includes("faute")) {
    return SAMPLE_RESPONSES.responsabilité
  }

  return SAMPLE_RESPONSES.default
}

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté via les cookies httpOnly
    const verifyAuth = async () => {
      const { isAuthenticated, user: authUser } = await checkAuth()
      if (!isAuthenticated) {
        router.push("/auth")
        return
      }
    
      if (authUser) {
        const userForComponent = {
          name: authUser.email.split('@')[0],
          email: authUser.email
        }
        setUser(userForComponent)
        // synchro avec localStorage pour affichage rapide
        localStorage.setItem("user", JSON.stringify(userForComponent))
      }
    }
    
    verifyAuth()
    
    // Charger les conversations sauvegardées
    const savedConversations = localStorage.getItem("conversations")
    if (savedConversations) {
      
    }

    // Créer une nouvelle conversation par défaut seulement si l'utilisateur est connecté
    // Cette partie sera exécutée après la vérification d'auth
  }, [router])

  useEffect(() => {
    const data = fetch(process.env.NEXT_PUBLIC_API_URL + "/chat", {
        method: "GET",
        credentials: "include",
      })
      data.then((data) => {
        if (data.ok) {
          return data.json()
        } else {
          throw new Error("Failed to fetch conversations")
        }
      }
      ).then((data) => {
        console.log("Conversations:", data)
        const parsedConversations: Conversation[] = data
        setConversations(parsedConversations)
        if (parsedConversations.length > 0) {
          setCurrentConversation(parsedConversations[0])
        } else {
          createNewConversation()
        }
      }
      )
  },[])

  // Créer une nouvelle conversation quand l'utilisateur est défini
  useEffect(() => {
    if (user && conversations.length === 0) {
      createNewConversation()
    }
  }, [user, conversations.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentConversation?.messages])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "Nouvelle conversation",
      messages: [
        {
          id: "welcome",
          content:
            "Bonjour ! Je suis votre assistant juridique spécialisé dans le cadre légal des Junior Entreprises. Comment puis-je vous aider aujourd'hui ?",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setCurrentConversation(newConversation)
    setConversations((prev) => [newConversation, ...prev])
  }

  const saveConversations = (convs: Conversation[]) => {
    localStorage.setItem("conversations", JSON.stringify(convs))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentConversation) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      title:
        currentConversation.title === "Nouvelle conversation" ? input.slice(0, 50) + "..." : currentConversation.title,
      updatedAt: new Date(),
    }

    setCurrentConversation(updatedConversation)
    setInput("")
    setIsLoading(true)

    // Mettre à jour la liste des conversations
    const updatedConversations = conversations.map((conv) =>
      conv.id === currentConversation.id ? updatedConversation : conv,
    )
    setConversations(updatedConversations)
    saveConversations(updatedConversations)

    // Simuler la réponse de l'IA
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponse(input),
        role: "assistant",
        timestamp: new Date(),
      }

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date(),
      }

      setCurrentConversation(finalConversation)
      const finalConversations = conversations.map((conv) =>
        conv.id === currentConversation.id ? finalConversation : conv,
      )
      setConversations(finalConversations)
      saveConversations(finalConversations)
      setIsLoading(false)
    }, 1500)
  }

  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation)
  }

  const deleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter((conv) => conv.id !== conversationId)
    setConversations(updatedConversations)
    saveConversations(updatedConversations)

    if (currentConversation?.id === conversationId) {
      if (updatedConversations.length > 0) {
        setCurrentConversation(updatedConversations[0])
      } else {
        createNewConversation()
      }
    }
  }

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      localStorage.removeItem("conversations")
      router.push("/auth")
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden`}>
          <div className="h-full bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Scale className="h-6 w-6 text-blue-400 mr-2" />
                  <h1 className="text-lg font-semibold">JE Legal AI</h1>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  ←
                </Button>
              </div>

              <Button
                onClick={createNewConversation}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle conversation
              </Button>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                      currentConversation?.id === conversation.id
                        ? "bg-white/20 border border-white/30"
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{conversation.title}</h3>
                        <p className="text-xs text-white/60 mt-1">
                          {conversation.updatedAt.toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conversation.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* User Profile */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-white/60">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/70 hover:text-white">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {!sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="mr-4 text-white/70 hover:text-white"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                )}
                <Link href="/" className="mr-4">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-blue-400" />
                  <h1 className="text-lg font-semibold">Assistant Juridique JE</h1>
                  <Badge className="ml-3 bg-green-500/20 text-green-300 border-green-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    En ligne
                  </Badge>
                </div>
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {currentConversation?.messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-4 animate-fade-in-up ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-10 w-10 border-2 border-blue-400/30">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[80%] ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                          : "bg-white/10 backdrop-blur-md border border-white/20 text-white"
                      } rounded-2xl px-6 py-4 shadow-lg`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-white/60"}`}>
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-10 w-10 border-2 border-purple-400/30">
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-4 animate-fade-in-up">
                    <Avatar className="h-10 w-10 border-2 border-blue-400/30">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/5 backdrop-blur-md border-t border-white/20">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question sur le droit des Junior Entreprises..."
                    disabled={isLoading}
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60 pr-12 py-6 text-lg rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Quick Questions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Comment créer les statuts d'une JE ?",
                  "Quelles sont les règles de TVA ?",
                  "Comment gérer les membres ?",
                  "Comment organiser une AG ?",
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="border-white/50 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/70 rounded-full"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AuthGuard>
  )
}
