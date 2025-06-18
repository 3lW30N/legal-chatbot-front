export interface User {
  id: string
  email: string
  name?: string
  is_active: boolean
  role: string
  created_at: string
}

export interface Chat {
  id: string
  user_id: string
  topic?: string
  created_at: Date
  updated_at: Date
}

export interface Attachment {
  filename: string
  url: string 
}

export interface Message {
  _id?: string 
  discussion_id: string
  content: string
  role?: 'user' | 'bot' 
  date_created: Date
  attachments?: Attachment[] 
}

export interface MessageCreate {
  discussion_id: string
  content: string
  role?: 'user' | 'bot'
  attachments?: Attachment[]
}

export interface MessageBot{
  content: string
  attachments?: Attachment[]
}

// Type pour les informations complètes d'un fichier uploadé
export interface FileInfo {
  id: string
  filename: string
  url: string
  file_size: number
  content_type: string
  uploaded_at: string
  user_id: string
}

// Alias pour compatibilité (à supprimer progressivement)
export type Attachements = Attachment
