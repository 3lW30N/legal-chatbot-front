"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"

interface AuthTabsProps {
  onClose?: () => void
}

export function AuthTabs({ onClose }: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState("login")

  const handleRegisterSuccess = () => {
    // Basculer vers l'onglet de connexion après inscription réussie
    setActiveTab("login")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Connexion</TabsTrigger>
        <TabsTrigger value="register">Inscription</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="mt-6">
        <LoginForm 
          onSwitchToRegister={() => setActiveTab("register")}
        />
      </TabsContent>
      
      <TabsContent value="register" className="mt-6">
        <RegisterForm 
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setActiveTab("login")}
        />
      </TabsContent>
    </Tabs>
  )
}
