# Badinter - Chatbot Juridique

Application front-end Next.js pour le chatbot juridique Badinter.

## Fonctionnalités

### 🔐 Authentification
- **Connexion sécurisée** avec email/mot de passe
- **Cookies httpOnly** pour la gestion des sessions
- **Protection des routes** avec AuthGuard
- **Redirection automatique** selon l'état de connexion

### 💬 Interface de Chat
- **Gestion des conversations** multiples
- **Envoi de messages** en temps réel
- **Réponses du chatbot** via l'API IA
- **Gestion des pièces jointes** (PDF, DOC, TXT)
- **Interface responsive** avec sidebar collapsible

### 📁 Gestion des fichiers
- **Upload de documents** vers GridFS
- **Prévisualisation des pièces jointes**
- **Téléchargement des fichiers**
- **Nettoyage automatique** des fichiers orphelins

## Architecture

### Structure des dossiers
```
src/
├── app/                 # Pages Next.js App Router
│   ├── page.tsx        # Page d'accueil avec login
│   ├── layout.tsx      # Layout principal avec AuthProvider
│   └── chat/           # Page de chat protégée
├── components/         # Composants réutilisables
│   ├── AuthGuard.tsx   # Protection des routes
│   ├── ChatInterface.tsx # Interface principale du chat
│   ├── login-form.tsx  # Formulaire de connexion
│   └── ui/            # Composants UI (shadcn/ui)
├── context/           # Contextes React
│   └── AuthContext.tsx # Gestion de l'état d'authentification
└── lib/              # Utilitaires et API
    ├── auth.ts       # Fonctions d'authentification
    ├── chat.ts       # Fonctions de chat et fichiers
    └── types.ts      # Types TypeScript
```

### APIs utilisées

#### Authentification (`auth.ts`)
- `checkAuth()` - Vérifier l'état de connexion
- `login(email, password)` - Connexion utilisateur
- `logout()` - Déconnexion
- `getStoredUser()` - Récupérer les infos utilisateur

#### Chat (`chat.ts`)
- `createChat(userId)` - Créer une nouvelle conversation
- `getChats()` - Récupérer les conversations de l'utilisateur
- `sendMessage(message)` - Envoyer un message
- `getMessages(chatId)` - Récupérer les messages d'un chat
- `chatBot(message)` - Obtenir une réponse du bot
- `deleteChat(chatId)` - Supprimer une conversation

#### Fichiers (`chat.ts`)
- `uploadFile(file)` - Upload vers GridFS
- `getUserFiles()` - Lister les fichiers de l'utilisateur
- `deleteGridFSFile(fileId)` - Supprimer un fichier

## Configuration

### Variables d'environnement
Créer un fichier `.env.local` :
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### Installation
```bash
npm install
npm run dev
```

## Utilisation

### 1. Page d'accueil
- **Logo Badinter** et présentation
- **Boutons de connexion** ouvrant un modal
- **Redirection automatique** vers /chat si connecté

### 2. Authentification
- **Formulaire de connexion** avec validation
- **Messages d'erreur** en cas d'échec
- **Loading states** pendant la connexion

### 3. Interface de chat
- **Sidebar** avec liste des conversations
- **Zone de messages** avec auto-scroll
- **Input** avec support des pièces jointes
- **Profil utilisateur** et déconnexion

### 4. Gestion des conversations
- **Nouveau chat** créé automatiquement
- **Messages utilisateur** et **réponses du bot**
- **Suppression** des conversations
- **Persistence** des données

### 5. Pièces jointes
- **Upload** par glisser-déposer ou sélection
- **Prévisualisation** avant envoi
- **Téléchargement** des fichiers joints
- **Formats supportés** : PDF, DOC, DOCX, TXT

## Sécurité

- **Authentification par cookies httpOnly**
- **Protection CSRF** via credentials: "include"
- **Routes protégées** avec AuthGuard
- **Validation côté client** et serveur
- **Gestion des erreurs** appropriée

## État de l'authentification

Le contexte `AuthContext` gère :
- **État de connexion** (`isAuthenticated`)
- **Données utilisateur** (`user`)
- **État de chargement** (`isLoading`)
- **Fonctions** de connexion/déconnexion
- **Actualisation** automatique de l'état

## Types TypeScript

```typescript
interface User {
  id: string
  email: string
  role: string
  is_active: boolean
  created_at?: string
}

interface Chat {
  id: string
  user_id: string
  topic?: string
  created_at: Date
  updated_at: Date
}

interface Message {
  _id?: string
  discussion_id: string
  content: string
  role?: 'user' | 'bot'
  date_created: Date
  attachments?: Attachment[]
}

interface Attachment {
  filename: string
  url: string
}
```

## Développement

### Bonnes pratiques
- **Gestion d'erreur** dans tous les appels API
- **Loading states** pour l'UX
- **TypeScript strict** pour la sécurité
- **Composants modulaires** et réutilisables
- **Responsive design** mobile-first

### Points d'attention
- **Variables d'environnement** correctement configurées
- **CORS** configuré sur le backend
- **Cookies** et **sessions** fonctionnels
- **GridFS** configuré pour les fichiers

Cette architecture garantit une expérience utilisateur fluide et sécurisée pour l'interaction avec le chatbot juridique Badinter.
