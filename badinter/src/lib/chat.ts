/**
 * Utilitaire du chat
 */
import { Chat, Message, Attachment, MessageCreate, MessageBot, FileInfo, ChatBotResponse } from "@/lib/types"
const API_URL = process.env.NEXT_PUBLIC_API_URL

// Envoyer un message
export async function sendMessage(msg: MessageCreate): Promise<{ message_id: string }> {
  try {
    const messageData: MessageCreate = {
      discussion_id: msg.discussion_id,
      content: msg.content,
      role: msg.role,
      attachments: msg.attachments && msg.attachments.length > 0 ? msg.attachments : []
    }

    const response = await fetch(`${API_URL}/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
      credentials: "include", // Pour inclure les cookies httpOnly
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Erreur lors de l'envoi du message")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    throw error
  }
}

// Créer un nouveau chat
export async function createChat(userId: string): Promise<Chat> {
    try {
        console.log("📤 Envoi de la requête createChat pour userId:", userId)
        
        const response = await fetch(`${API_URL}/chat/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
        credentials: "include", // Pour inclure les cookies httpOnly
        })
    
        console.log("📥 Réponse createChat status:", response.status)
        
        if (!response.ok) {
            const errorData = await response.text()
            console.error("❌ Erreur createChat response:", errorData)
            throw new Error(`Erreur lors de la création du chat: ${response.status} - ${errorData}`)
        }
    
        const data = await response.json()
        console.log("✅ Données createChat reçues:", data)
        
        // ✅ CORRECTION : Retourner l'objet Chat complet, pas seulement l'ID
        return data // data contient déjà l'objet Chat complet avec id, user_id, topic, etc.
    } catch (error) {
        console.error("❌ Erreur lors de la création du chat:", error)
        throw error
    }
}

// Récupérer les messages d'un chat
export async function getMessages(chatId: string): Promise<Message[]> {
    try {
        const response = await fetch(`${API_URL}/messages/${chatId}`, {
            method: "GET",
            credentials: "include", // Pour inclure les cookies httpOnly
        })
        
        if (!response.ok) {
            console.error(`Erreur lors de la récupération des messages: ${response.status} - ${response.statusText}`)
            return []
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error)
        throw error
    }
}
// Récupérer les chats d'un utilisateur
export async function getChats(): Promise<Chat[]> {
  try {
    // ✅ CORRECTION : Utiliser l'endpoint correct qui ne nécessite pas d'userId dans l'URL
    const response = await fetch(`${API_URL}/chat/`, {
      method: "GET",
      credentials: "include", // Pour inclure les cookies httpOnly
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des chats")
    }

    const data = await response.json()
    return data // Retourne directement la liste des chats
  } catch (error) {
    console.error("Erreur lors de la récupération des chats:", error)
    throw error
  }
}
// Supprimer un chat
export async function deleteChat(chatId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
      method: "DELETE",
      credentials: "include", // Pour inclure les cookies httpOnly
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du chat")
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du chat:", error)
    throw error
  }
}
// Mettre à jour le sujet d'un chat
export async function updateChatTopic(chatId: string, topic: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
      credentials: "include", // Pour inclure les cookies httpOnly
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du sujet du chat")
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du sujet du chat:", error)
    throw error
  }
}

// Uploader un fichier vers GridFS
export async function uploadFile(file: File): Promise<Attachment> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_URL}/upload/gridfs`, {
      method: "POST",
      body: formData,
      credentials: "include", // Pour inclure les cookies httpOnly
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        console.error("Erreur détaillée upload:", errorData)
        errorMessage = errorData.detail || errorMessage
      } catch {
        // Si on ne peut pas parser la réponse, on garde le message HTTP basique
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log("Réponse upload réussie:", data)
    
    // Construire l'URL pour accéder au fichier GridFS
    const fileUrl = `${API_URL}/upload/gridfs/${data.id}`
    
    return {
      filename: data.filename, // Le nom original du fichier
      url: fileUrl // URL pour télécharger depuis GridFS
    }
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error)
    throw error
  }
}

// Récupérer les fichiers de l'utilisateur depuis GridFS (seulement les fichiers actifs)
export async function getUserFiles(): Promise<Attachment[]> {
  try {
    // ✅ CORRECTION : Utiliser la nouvelle route qui ne retourne que les fichiers actifs
    const response = await fetch(`${API_URL}/upload/gridfs/list/active-files`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      console.error("Erreur lors de la récupération des fichiers GridFS:", response.status)
      throw new Error("Erreur lors de la récupération des fichiers")
    }

    const files = await response.json()
    console.log("Fichiers GridFS actifs récupérés:", files)
    
    return files.map((file: FileInfo) => ({
      filename: file.filename,
      url: `${API_URL}/upload/gridfs/${file.id}`
    }))
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers:", error)
    throw error
  }
}

// Supprimer un fichier GridFS
export async function deleteGridFSFile(fileId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/upload/gridfs/${fileId}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du fichier")
    }

    return true
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier:", error)
    throw error
  }
}

// Obtenir les métadonnées d'un fichier GridFS
export async function getFileInfo(fileId: string): Promise<FileInfo> {
  try {
    const response = await fetch(`${API_URL}/upload/${fileId}`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des informations du fichier")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des informations du fichier:", error)
    throw error
  }
}

// Charger une image depuis GridFS avec authentification
export async function loadImageWithAuth(url: string): Promise<string> {
  try {
    console.log("Tentative de chargement d'image depuis:", url)
    
    const response = await fetch(url, {
      credentials: "include"
    })
    
    if (!response.ok) {
      console.error(`Erreur lors du chargement de l'image: ${response.status} - ${response.statusText}`)
      
      // Essayer de lire la réponse d'erreur
      try {
        const errorData = await response.text()
        console.error("Détails de l'erreur:", errorData)
      } catch {
        console.error("Impossible de lire les détails de l'erreur")
      }
      
      throw new Error(`Erreur lors du chargement de l'image: ${response.status}`)
    }
    
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    console.log("Image chargée avec succès, blob URL créée:", blobUrl)
    
    return blobUrl
  } catch (error) {
    console.error("Erreur lors du chargement de l'image:", error)
    throw error
  }
}

// Fonction pour nettoyer manuellement les fichiers orphelins
export async function cleanupOrphanedFiles(): Promise<{ deleted_count: number; message: string }> {
  try {
    const response = await fetch(`${API_URL}/upload/gridfs/cleanup/orphaned`, {
      method: "DELETE",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Erreur lors du nettoyage des fichiers orphelins")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors du nettoyage des fichiers orphelins:", error)
    throw error
  }
}

// Fonction de la réponse du chatbot
export async function chatBot(msg: MessageCreate): Promise<{ 
  message_id?: string
  response?: string
  sources?: Array<{source: string, page?: number}>
}> {
  try{
    const message: MessageBot={
      content:msg.content,
      attachments: msg.attachments,
    }
    
    console.log("📤 Envoi de la requête chatbot:", {
      url: `${API_URL}/messages/${msg.discussion_id}/chatbot`,
      payload: {query: message.content},
      discussion_id: msg.discussion_id
    })
    
    const response = await fetch(`${API_URL}/messages/${msg.discussion_id}/chatbot`,{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({query:message.content}),
      credentials: "include"
    })
    
    console.log("📥 Réponse chatbot status:", response.status)
    
    if (!response.ok){
      const errorData = await response.text()
      console.error("❌ Erreur chatbot response:", errorData)
      throw new Error(`Erreur chatbot ${response.status}: ${errorData}`)
    }
    
    // ✅ NOUVEAU : Traiter la réponse du serveur avec le nouveau format
    const data = await response.json()
    console.log("✅ Données chatbot reçues:", data)
    
    // Si la réponse contient un tuple [answer, sources]
    if (data.response && Array.isArray(data.response)) {
      const [answer, rawSources] = data.response
      
      // Transformer les sources du format [[source, page], ...] vers [{source, page}, ...]
      const sources = rawSources?.map((sourceItem: any) => ({
        source: sourceItem[0] || sourceItem.source,
        page: sourceItem[1] || sourceItem.page
      })) || []
      
      return {
        message_id: data.message_id,
        response: answer,
        sources: sources
      }
    }
    
    // Si la réponse est une string contenant les sources à la fin (format actuel)
    if (typeof data.response === 'string') {
      let response = data.response
      const sources: Array<{source: string, page?: number}> = []
      
      // Méthode plus simple : détecter le début des sources et couper là
      const sourceStartIndex = response.indexOf('/home/')
      
      if (sourceStartIndex !== -1) {
        console.log("🧹 Début des sources détecté à la position:", sourceStartIndex)
        
        // Extraire seulement la partie avant les sources
        const cleanResponse = response.substring(0, sourceStartIndex).trim()
        
        // Extraire la partie sources pour compter
        const sourcePart = response.substring(sourceStartIndex)
        console.log("📁 Partie sources:", sourcePart)
        
        // Compter le nombre de fichiers .json pour créer des sources génériques
        const sourceMatches = (sourcePart.match(/\.json/g) || []).length
        const uniqueSourceCount = Math.min(sourceMatches, 5) // Limiter à 5 sources max
        
        // Créer des sources génériques
        for (let i = 0; i < uniqueSourceCount; i++) {
          sources.push({
            source: `Document juridique ${i + 1}`,
            page: undefined
          })
        }
        
        console.log("✅ Réponse nettoyée:", cleanResponse)
        console.log("📚 Sources créées:", sources.length)
        
        return {
          message_id: data.message_id,
          response: cleanResponse,
          sources: sources
        }
      }
      
      // Si pas de sources détectées, retourner la réponse telle quelle
      return {
        message_id: data.message_id,
        response: response.trim(),
        sources: []
      }
    }
    
    // Fallback pour les autres formats
    return data
  }catch(err){
    console.error("❌ Erreur chatBot:", err)
    throw new Error(`Erreur lors de la récupération de la réponse du chatbot: ${err}`)
  }
}