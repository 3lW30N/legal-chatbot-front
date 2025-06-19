"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, ArrowLeft, Plus, LogOut, Trash2, Paperclip, X, FileText, Image as ImageIcon, File as FileIcon, Menu } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { createChat, deleteChat, getMessages, sendMessage, uploadFile, loadImageWithAuth, getChats, chatBot } from "@/lib/chat"
import { Chat, Message, Attachment, MessageCreate } from "@/lib/types"
import { TypewriterText } from "@/components/TypewriterText"
import { SourcesDisplay } from "@/components/SourcesDisplay"
import { AuthGuard } from "@/components/AuthGuard"

export default function ChatInterface() {
  const router = useRouter()
  const { user, logout: authLogout, isAuthenticated } = useAuth()
  
  const [conversations, setConversations] = useState<Chat[]>([])
  const [currentConversation, setCurrentConversation] = useState<Chat | null>(null)
  const [input, setInput] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const [botSources, setBotSources] = useState<{[messageId: string]: Array<{source: string, page?: number}>}>({})
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentConversationRef = useRef<Chat | null>(null)

  // Fonction utilitaire pour scroller vers le bas
  const scrollToBottom = useCallback((delay = 100) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, delay)
  }, [])

  useEffect(() => {
    currentConversationRef.current = currentConversation
  }, [currentConversation])

  // Fonction pour recharger les conversations
  const fetchChats = useCallback(async () => {
    if (!user) return
    
    try {
      const data = await getChats()
      const parsedConversations: Chat[] = data.map((chat: Chat) => ({
        ...chat,
        created_at: new Date(chat.created_at),
        updated_at: new Date(chat.updated_at)
      })).filter(chat => chat.id)

      const uniqueConversations = parsedConversations.filter((conversation, index, self) => 
        index === self.findIndex(c => c.id === conversation.id)
      )
      
      // Trier les conversations par date de mise à jour, du plus récent au plus ancien
      const sortedConversations = uniqueConversations.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      
      setConversations(sortedConversations)
      if (sortedConversations.length > 0 && !currentConversationRef.current) {
        setCurrentConversation(sortedConversations[0])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des conversations:", error)
      if (user) {
        const newChat = async () => {
          try {
            console.log("🆕 Création d'un nouveau chat pour l'utilisateur:", user.id)
            const newConversation = await createChat(user.id)
            const chatWithDates: Chat = {
              ...newConversation,
              created_at: new Date(newConversation.created_at),
              updated_at: new Date(newConversation.updated_at)
            }
            setCurrentConversation(chatWithDates)
            setConversations([chatWithDates])
          } catch (createError) {
            console.error("Erreur lors de la création d'une nouvelle conversation:", createError)
          }
        }
        newChat()
      }
    }
  }, [user])

  // Chargement des conversations
  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  // Scroll automatique
  useEffect(() => {
    scrollToBottom(0)
  }, [currentConversation?.id, scrollToBottom])

  useEffect(() => {
    scrollToBottom(50)
  }, [messages, scrollToBottom])

  // Créer une nouvelle conversation
  const createNewConversation = useCallback(async () => {
    const userId = user?.id || (user as any)?._id
    console.log("🔥 BOUTON CLIQUÉ - userId:", userId, "user:", user)
    
    if (!userId) {
      console.log("❌ Pas d'utilisateur connecté pour créer un chat")
      return
    }
    
    try {
      console.log("🆕 Création d'une nouvelle conversation pour:", userId)
      const newChat = await createChat(userId)
      console.log("✅ Chat créé côté backend:", newChat)
      
      const newConversation: Chat = {
        ...newChat,
        created_at: new Date(newChat.created_at),
        updated_at: new Date(newChat.updated_at)
      }
      
      console.log("📝 Nouvelle conversation formatée:", newConversation)
      setConversations((prev) => [newConversation, ...prev])
      setCurrentConversation(newConversation)
      setMessages([])
      console.log("✅ Nouvelle conversation définie comme active")
      
      // Rafraîchir la liste pour s'assurer qu'elle est synchronisée
      setTimeout(() => {
        fetchChats()
      }, 300)
    } catch (error) {
      console.error("❌ Erreur lors de la création de la conversation:", error)
      alert("Erreur lors de la création d'une nouvelle conversation. Veuillez réessayer.")
    }
  }, [user?.id, user?.email, fetchChats])

  // Supprimer une conversation
  const handleDeleteConversation = useCallback(async (chatId: string) => {
    try {
      await deleteChat(chatId)
      const updatedConversations = conversations.filter((conv) => conv.id !== chatId)
      setConversations(updatedConversations)
      if (currentConversation?.id === chatId) {
        if (updatedConversations.length > 0) {
          setCurrentConversation(updatedConversations[0])
        } else {
          await createNewConversation()
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la conversation:", error)
    }
  }, [conversations, currentConversation, createNewConversation])

  // Charger les messages
  const loadMessages = useCallback(async () => {
    if (!currentConversation?.id) return
    try {
      const response = await getMessages(currentConversation.id)
      setMessages(response)
      setTypingMessageId(null)
      scrollToBottom(100)
    } catch (error) {
      console.error(error)
      setMessages([])
    }
  }, [currentConversation?.id, scrollToBottom])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Sélectionner une conversation
  const selectConversation = useCallback((conversation: Chat) => {
    setCurrentConversation(conversation)
  }, [])

  // Envoyer un message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentConversation?.id || !input.trim()) return
    
    console.log("🚀 Début envoi message:", {
      conversationId: currentConversation.id,
      content: input.trim(),
      attachments: attachments.length
    })
    
    try {
      const userMessage: Message = {
        discussion_id: currentConversation.id,
        content: input.trim(),
        role: "user",
        date_created: new Date(),
        attachments: attachments.length > 0 ? attachments : undefined
      }
      setMessages(prev => [...prev, userMessage])
      
      const messageContent = input.trim()
      const messageAttachments = [...attachments]
      setInput("")
      setAttachments([])
      setIsLoading(true)

      const messageData: MessageCreate = {
        discussion_id: currentConversation.id,
        content: messageContent,
        role: "user",
        attachments: messageAttachments
      }
      
      console.log("📤 Envoi du message utilisateur:", messageData)
      
      const data = await sendMessage(messageData)
      if (!data) {
        console.error("❌ Erreur lors de l'envoi du message")
        setMessages(prev => prev.slice(0, -1))
        alert("Erreur lors de l'envoi du message. Veuillez réessayer.")
        setIsLoading(false)
        return
      }

      console.log("✅ Message utilisateur envoyé:", data)
      
      try {
        console.log("🤖 Tentative d'obtenir la réponse du bot...")
        const botResponse = await chatBot(messageData)
        console.log("✅ Réponse du bot générée:", botResponse)
        
        // Créer le message bot avec la réponse nettoyée
        const cleanBotMessage: Message = {
          _id: botResponse.message_id,
          discussion_id: currentConversation.id,
          content: botResponse.response || "Erreur dans la réponse",
          role: "bot",
          date_created: new Date(),
        }
        
        // Ajouter le message bot nettoyé directement
        setMessages(prev => [...prev, cleanBotMessage])
        
        // Stocker les sources si disponibles
        if (botResponse.sources && botResponse.sources.length > 0) {
          console.log("📚 Sources reçues:", botResponse.sources)
          setBotSources(prev => ({
            ...prev,
            [cleanBotMessage._id!]: botResponse.sources!
          }))
        }
        
        // Démarrer l'effet typewriter
        if (cleanBotMessage._id) {
          setTypingMessageId(cleanBotMessage._id)
        }
        
        scrollToBottom(200)
        
        // Rafraîchir la liste des conversations pour mettre à jour les aperçus
        setTimeout(() => {
          fetchChats()
        }, 500)
        
      } catch (error) {
        console.error("❌ Erreur lors de la génération de la réponse du bot:", error)
        
        // Vérifier si c'est une erreur de clé API
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
          // Ajouter un message d'erreur informatif pour l'utilisateur
          const botErrorMessage: Message = {
            discussion_id: currentConversation.id,
            content: "⚠️ Désolé, le service de chatbot n'est pas disponible pour le moment. L'API de génération de réponses n'est pas configurée. Veuillez contacter l'administrateur.",
            role: "bot",
            date_created: new Date(),
          }
          setMessages(prev => [...prev, botErrorMessage])
        } else {
          // Autres erreurs - essayer de récupérer les derniers messages
          try {
            const latestMessages = await getMessages(currentConversation.id)
            setMessages(latestMessages)
            
            const lastBotMessage = latestMessages
              .filter(msg => msg.role === 'bot')
              .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())[0]
            
            if (lastBotMessage?._id) {
              setTypingMessageId(lastBotMessage._id)
            }
            
            scrollToBottom(200)
            
          } catch (fetchError) {
            console.error("Erreur lors de la récupération des messages:", fetchError)
          }
        }
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message:", error)
      setMessages(prev => prev.slice(0, -1))
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.")
      setIsLoading(false)
    }
  }

  // Upload de fichiers
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      
      setIsUploading(true)
      try {
        const uploadPromises = fileArray.map(file => uploadFile(file))
        const uploadResults = await Promise.all(uploadPromises)
        
        setAttachments(prev => [...prev, ...uploadResults])
        
        console.log('Fichiers uploadés avec succès:', uploadResults)
      } catch (error) {
        console.error('Erreur lors de l\'upload des fichiers:', error)
        
        const fallbackAttachments: Attachment[] = fileArray.map(file => ({
          filename: file.name,
          url: `https://placeholder.example.com/files/${encodeURIComponent(file.name)}`
        }))
        
        setAttachments(prev => [...prev, ...fallbackAttachments])
        alert(`Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
      } finally {
        setIsUploading(false)
      }
    }
  }, [])

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Déconnexion
  const handleLogout = async () => {
    try {
      await authLogout()
      localStorage.removeItem("conversations")
      router.push("/")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  // Fonctions utilitaires pour les fichiers
  const getFileIcon = useCallback((filename: string) => {
    const extension = filename.toLowerCase().split('.').pop()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return <ImageIcon className="h-4 w-4" />
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf':
        return <FileText className="h-4 w-4" />
      default:
        return <FileIcon className="h-4 w-4" />
    }
  }, [])

  const isImageFile = useCallback((filename: string) => {
    const extension = filename.toLowerCase().split('.').pop()
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')
  }, [])

  // Cache pour les images
  const imageCache = useRef<Map<string, { url: string; timestamp: number }>>(new Map())

  const cleanImageCache = useCallback(() => {
    const now = Date.now()
    const expiredKeys: string[] = []
    
    imageCache.current.forEach((value, key) => {
      if (now - value.timestamp > 3600000) {
        URL.revokeObjectURL(value.url)
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => {
      imageCache.current.delete(key)
    })
    
    if (expiredKeys.length > 0) {
      console.log(`🧹 Nettoyage du cache : ${expiredKeys.length} images expirées supprimées`)
    }
  }, [])

  useEffect(() => {
    cleanImageCache()
    const interval = setInterval(cleanImageCache, 300000)
    return () => clearInterval(interval)
  }, [cleanImageCache])

  // Composant pour les images authentifiées
  const AuthenticatedImage = React.memo(({ src, alt, className, onError }: {
    src: string
    alt: string
    className?: string
    onError?: () => void
  }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
      const cached = imageCache.current.get(src)
      const isExpired = cached && (Date.now() - cached.timestamp) > 3600000
      
      if (cached && !isExpired) {
        console.log("✅ Image trouvée dans le cache:", src)
        setImageSrc(cached.url)
        setIsLoading(false)
        return
      }

      if (cached && isExpired) {
        URL.revokeObjectURL(cached.url)
        imageCache.current.delete(src)
      }

      const loadImage = async () => {
        try {
          console.log("📥 Chargement de l'image:", src)
          setIsLoading(true)
          setHasError(false)
          const blobUrl = await loadImageWithAuth(src)
          
          imageCache.current.set(src, {
            url: blobUrl,
            timestamp: Date.now()
          })
          setImageSrc(blobUrl)
          console.log("✅ Image chargée et mise en cache:", src)
        } catch (error) {
          console.error("❌ Erreur lors du chargement de l'image:", error)
          setHasError(true)
          onError?.()
        } finally {
          setIsLoading(false)
        }
      }

      loadImage()
    }, [src, onError])

    if (isLoading) {
      return (
        <div className={`${className} flex items-center justify-center bg-white/10 rounded-lg`}>
          <div className="w-6 h-6 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }

    if (hasError || !imageSrc) {
      return (
        <div className={`${className} flex items-center justify-center bg-white/10 rounded-lg text-white/60 text-xs`}>
          <ImageIcon className="h-4 w-4 mr-1" />
          Image non disponible
        </div>
      )
    }

    return (
      <Image
        src={imageSrc}
        alt={alt}
        className={className}
        width={500}
        height={300}
        style={{ objectFit: 'cover' }}
        onError={() => {
          setHasError(true)
          onError?.()
        }}
      />
    )
  })

  AuthenticatedImage.displayName = 'AuthenticatedImage'

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen text-white overflow-hidden" style={{ backgroundColor: 'var(--primary-color)' }}>
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
                    <Image
                      src="/logoo.png"
                      alt="Logo Badinter"
                      width={120}
                      height={40}
                      className="object-contain"
                    />
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
              <div className="flex-1 p-4 overflow-y-auto">
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
                          <h3 className="text-sm font-medium truncate">{conversation.topic || "Nouvelle conversation"}</h3>
                          <p className="text-xs text-white/60 mt-1">
                            {new Date(conversation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConversation(conversation.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Profile */}
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      {(user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{user.email?.split('@')[0] || "Utilisateur"}</p>
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
                      <Menu className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mr-4 text-white/70 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-blue-400" />
                    <h1 className="text-lg font-semibold">Assistant Juridique Badinter</h1>
                    <div className="ml-3 px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs">
                      En ligne
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.length === 0 ? (
                    <div className="text-center text-white/60 py-12">
                      <Bot className="h-16 w-16 mx-auto mb-4 text-blue-400/50" />
                      <h3 className="text-lg font-medium mb-2">
                        {currentConversation?.topic || "Nouvelle conversation"}
                      </h3>
                      <p className="text-sm">
                        Posez votre première question pour commencer
                      </p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div key={message._id || `temp-${index}`} className="w-full mb-4">
                        {message.role === 'user' ? (
                          <div className="flex justify-end">
                            <div className="max-w-[80%] lg:max-w-[70%]">
                              <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm">
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    {message.attachments.map((attachment, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-2 p-2 bg-blue-700/30 hover:bg-blue-700/40 rounded-lg transition-colors"
                                      >
                                        <div className="flex-shrink-0">
                                          {getFileIcon(attachment.filename)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          {isImageFile(attachment.filename) ? (
                                            <div className="space-y-1">
                                              <AuthenticatedImage
                                                src={attachment.url}
                                                alt={attachment.filename}
                                                className="max-w-full h-auto max-h-48 rounded-lg object-cover"
                                              />
                                              <p className="text-xs truncate opacity-75">{attachment.filename}</p>
                                            </div>
                                          ) : (
                                            <a
                                              href={attachment.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs truncate hover:underline text-blue-100"
                                            >
                                              {attachment.filename}
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <p className="text-xs mt-2 text-blue-100 text-right">
                                  {new Date(message.date_created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-start">
                            <div className="flex items-start space-x-3 max-w-[80%] lg:max-w-[70%]">
                              <div className="flex-shrink-0 mt-1">
                                <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center">
                                  <Bot className="h-4 w-4" />
                                </div>
                              </div>
                              
                              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-2xl rounded-bl-sm">
                                {message.role === 'bot' && typingMessageId === message._id ? (
                                  <TypewriterText
                                    text={String(message.content || "")}
                                    speed={30}
                                    className="text-sm leading-relaxed"
                                    onComplete={() => {
                                      setTypingMessageId(null)
                                      scrollToBottom(100)
                                    }}
                                  />
                                ) : (
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                )}
                                
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    {message.attachments.map((attachment, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center space-x-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                      >
                                        <div className="flex-shrink-0">
                                          {getFileIcon(attachment.filename)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          {isImageFile(attachment.filename) ? (
                                            <div className="space-y-1">
                                              <AuthenticatedImage
                                                src={attachment.url}
                                                alt={attachment.filename}
                                                className="max-w-full h-auto max-h-48 rounded-lg object-cover"
                                              />
                                              <p className="text-xs truncate opacity-75">{attachment.filename}</p>
                                            </div>
                                          ) : (
                                            <a
                                              href={attachment.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-xs truncate hover:underline text-white/80"
                                            >
                                              {attachment.filename}
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <p className="text-xs mt-2 text-white/60">
                                  {new Date(message.date_created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              
                              {/* Affichage des sources du bot */}
                              {message.role === 'bot' && message._id && botSources[message._id] && (
                                <div className="mt-3">
                                  <SourcesDisplay sources={botSources[message._id]} />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {isLoading && (
                    <div className="w-full mb-4">
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3 max-w-[80%] lg:max-w-[70%]">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4" />
                            </div>
                          </div>
                          
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-2xl rounded-bl-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white/5 backdrop-blur-md border-t border-white/20">
              <div className="max-w-4xl mx-auto">
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 max-w-[250px]"
                        >
                          <div className="flex-shrink-0">
                            {getFileIcon(attachment.filename)}
                          </div>
                          <span className="text-sm text-white truncate flex-1">
                            {attachment.filename}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="h-5 w-5 p-0 text-white/60 hover:text-red-400 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Posez votre question juridique..."
                      disabled={isLoading}
                      className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/60 pr-24 py-6 text-lg rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    
                    {/* Attachment Button */}
                    <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={isUploading}
                        className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-50"
                      >
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Paperclip className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || (!input.trim() && attachments.length === 0)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>

                {/* Quick Questions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { id: "statuts", text: "Comment créer les statuts ?" },
                    { id: "tva", text: "Règles de TVA ?" },
                    { id: "membres", text: "Gestion des membres ?" },
                    { id: "ag", text: "Organiser une AG ?" },
                  ].map((question) => (
                    <Button
                      key={question.id}
                      variant="outline"
                      size="sm"
                      className="border-white/50 text-white bg-white/10 hover:bg-white/20 hover:text-white hover:border-white/70 rounded-full"
                      onClick={() => setInput(question.text)}
                    >
                      {question.text}
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
