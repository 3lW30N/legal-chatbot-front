"use client"

import type React from "react"
import "./chatbot.css"
import Image from "next/image"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, Plus, Send, User, Gavel, Trash2, LogOut, UserCircle, Loader2, Menu, X } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
}

export default function ChatbotInterface() {
  const [activeChat, setActiveChat] = useState<string>("1")
  const [inputValue, setInputValue] = useState("")
  const [chats, setChats] = useState<Chat[]>([])
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [isBotResponding, setIsBotResponding] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (chats.length === 0) {
      startNewChat()
    }
  }, [])

  // Défilement automatique vers le bas lors de l'ajout de nouveaux messages
  useEffect(() => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      const container = messagesContainerRef.current
      container.scrollTop = container.scrollHeight
    }
  }, [chats, shouldAutoScroll])

  // Focus sur le champ de saisie quand le bot termine de répondre
  useEffect(() => {
    if (!isBotResponding && inputRef.current && canSendMessage()) {
      inputRef.current.focus()
    }
  }, [isBotResponding])

  // Gérer les événements de défilement pour détecter le défilement utilisateur
  const handleScroll = () => {
    if (!messagesContainerRef.current) return

    const container = messagesContainerRef.current
    const { scrollTop, scrollHeight, clientHeight } = container

    // Vérifier si l'utilisateur est près du bas (dans les 100px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

    // Si l'utilisateur a fait défiler vers le haut de manière significative, désactiver le défilement automatique
    if (!isNearBottom && !isUserScrolling) {
      setIsUserScrolling(true)
      setShouldAutoScroll(false)
    }

    // Si l'utilisateur a fait défiler vers le bas, réactiver le défilement automatique
    if (isNearBottom && isUserScrolling) {
      setIsUserScrolling(false)
      setShouldAutoScroll(true)
    }

    // Effacer le timeout existant
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Définir un timeout pour détecter quand l'utilisateur arrête de faire défiler
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false)
    }, 150)
  }

  // Réinitialiser le défilement automatique lors du changement de conversation
  useEffect(() => {
    setShouldAutoScroll(true)
    setIsUserScrolling(false)

    // Focus sur l'input lors du changement de conversation
    if (inputRef.current && canSendMessage()) {
      inputRef.current.focus()
    }

    if (inputRef.current && canSendMessage()) {
      inputRef.current.focus()
    }

    // Fermer la sidebar après sélection d'un chat
    setIsSidebarOpen(false)
  }, [activeChat])

  // Vérifier si l'utilisateur peut envoyer un message
  const canSendMessage = () => {
    if (isBotResponding) return false

    const currentChat = chats.find((chat) => chat.id === activeChat)
    if (!currentChat) return true

    const messages = currentChat.messages
    // Si pas de messages ou le dernier message est du bot, l'utilisateur peut envoyer
    return messages.length === 0 || messages[messages.length - 1].role === "assistant"
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || !canSendMessage()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastUpdated: new Date(),
          }
        }
        return chat
      })
    })

    setInputValue("")
    setIsBotResponding(true)

    // S'assurer que le défilement automatique est activé pour les nouveaux messages
    setShouldAutoScroll(true)
    setIsUserScrolling(false)

    // Simuler une réponse du bot après un délai
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Merci pour votre message ! Je suis là pour vous aider avec toutes vos questions.",
        role: "assistant",
        timestamp: new Date(),
      }

      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              messages: [...chat.messages, botResponse],
              lastUpdated: new Date(),
            }
          }
          return chat
        })
      })

      setIsBotResponding(false)

      // Le focus sera automatiquement mis sur l'input grâce à l'useEffect qui surveille isBotResponding
    }, 2000) // Délai plus long pour mieux voir l'effet
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startNewChat = () => {
    const newChatId = Date.now().toString()
    const newChat: Chat = {
      id: newChatId,
      title: `Nouvelle discussion ${new Date().toLocaleDateString("fr-FR")}`,
      lastUpdated: new Date(),
      messages: [], // Commencer avec une liste vide
    }

    setChats((prevChats) => [newChat, ...prevChats])
    setActiveChat(newChatId)

    // Focus sur l'input lors de la création d'une nouvelle conversation
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  const selectChat = (chatId: string) => {
    setActiveChat(chatId)
  }

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (chats.length === 1) {
      const newChatId = Date.now().toString()
      const newChat: Chat = {
        id: newChatId,
        title: `Nouvelle discussion ${new Date().toLocaleDateString("fr-FR")}`,
        lastUpdated: new Date(),
        messages: [], // Commencer avec une liste vide
      }
      setChats([newChat])
      setActiveChat(newChatId)
    } else {
      const updatedChats = chats.filter((chat) => chat.id !== chatId)
      setChats(updatedChats)

      if (activeChat === chatId) {
        setActiveChat(updatedChats[0].id)
      }
    }
  }

  const handleProfile = () => {
    // Logique pour ouvrir le profil utilisateur
    console.log("Ouverture du profil utilisateur")
  }

  const handleLogout = () => {
    // Logique pour déconnecter l'utilisateur
    console.log("Déconnexion de l'utilisateur")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Vérifier si l'input doit être désactivé
  const isInputDisabled = !canSendMessage()

  return (
    <div className="chatbot-container">
      {/* Overlay pour fermer la sidebar */}
      {isSidebarOpen && <div className="sidebar-overlay active" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar - Toujours cachée par défaut */}
      <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <button onClick={startNewChat} className="new-chat-button">
            <Plus className="icon" />
            Nouveau Chat
          </button>
          {/* Bouton fermer */}
          <button className="sidebar-close-button" onClick={() => setIsSidebarOpen(false)}>
            <X className="icon" />
          </button>
        </div>

        <div className="sidebar-content">
          <div className="chat-list">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${activeChat === chat.id ? "active" : ""}`}
                onClick={() => selectChat(chat.id)}
              >
                <div className="chat-item-content">
                  <MessageCircle className="chat-icon" />
                  <div className="chat-details">
                    <h3 className="chat-title">{chat.title}</h3>
                    <p className="chat-preview">
                      {chat.messages.length > 0
                        ? chat.messages.find((msg) => msg.role === "user")?.content ||
                          chat.messages[0]?.content ||
                          "Pas de messages"
                        : "Nouvelle conversation"}
                    </p>
                    <p className="chat-date">{chat.lastUpdated.toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>

                <button className="delete-button" onClick={(e) => deleteChat(chat.id, e)}>
                  <Trash2 className="delete-icon" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone principale - Prend toute la largeur */}
      <div className="main-area">
        {/* Barre supérieure */}
        <div className="header">
          <div className="header-left">
            {/* Bouton hamburger toujours visible */}
            <button className="hamburger-button" onClick={toggleSidebar}>
              <Menu className="hamburger-icon" />
            </button>
            <div className="bot-avatar">
              <Image
                src="/logochatbot.png"
                alt="logo "
                width={400}
                height={200}
                priority
                className="bot-icon"
              />
            </div>
            <h1 className="header-title">BADINTER</h1>
          </div>

          <div className="header-buttons">
            <button className="header-button" onClick={handleProfile} title="Profil">
              <UserCircle className="header-button-icon" />
            </button>
            <button className="header-button logout-button" onClick={handleLogout} title="Déconnexion">
              <LogOut className="header-button-icon" />
            </button>
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="chat-area" ref={messagesContainerRef} onScroll={handleScroll}>
          <Image
            src="/logoo.png"
            alt="logo badinter"
            width={400}
            height={200}
            priority
            className="decorativeImage"
          />
          <div className="messages-container">
            {chats
              .find((chat) => chat.id === activeChat)
              ?.messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  {message.role === "assistant" && (
                    <div className="message-avatar assistant">
                      <Gavel className="avatar-icon" />
                    </div>
                  )}

                  <div className={`message-bubble ${message.role}`}>
                    <p className="message-text">{message.content}</p>
                    <p className={`message-time ${message.role}`}>
                      {message.timestamp.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="message-avatar user">
                      <User className="avatar-icon" />
                    </div>
                  )}
                </div>
              ))}

            {/* Indicateur de réponse en cours */}
            {isBotResponding && (
              <div className="message assistant typing-indicator">
                <div className="message-avatar assistant">
                  <Gavel className="avatar-icon" />
                </div>
                <div className="message-bubble assistant typing">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="input-area">
          <div className="input-container">
            <div className="input-wrapper">
              <div className="input-field-wrapper">
                <input
                  type="text"
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isInputDisabled ? "Attendez la réponse..." : "Tapez votre message ici..."}
                  className={`input-field ${isInputDisabled ? "disabled" : ""}`}
                  disabled={isInputDisabled}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isInputDisabled}
                className="send-button"
              >
                {isBotResponding ? <Loader2 className="send-icon animate-spin" /> : <Send className="send-icon" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
