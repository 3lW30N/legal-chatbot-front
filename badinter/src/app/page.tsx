"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import styles from "./pageacceuil.module.css"

export default function Home() {
  // États pour gérer l'ouverture/fermeture des modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  // État pour basculer entre connexion et inscription dans le même modal
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  // Fonction pour fermer tous les modals
  const closeAllModals = () => {
    setIsAuthModalOpen(false)
    setIsContactModalOpen(false)
    setIsAboutModalOpen(false)
  }

  // Fonction pour ouvrir le modal d'authentification
  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  // Fonction pour basculer entre connexion et inscription
  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login")
  }

  // Fonction pour gérer la soumission des formulaires
  const handleFormSubmit = (e: React.FormEvent, formType: string) => {
    e.preventDefault()
    console.log(`Formulaire ${formType} soumis`)
    // Ici vous pouvez ajouter la logique de traitement des formulaires
    closeAllModals()
  }

  return (
    <div className={styles.container}>
      {/* Barre de navigation fixe */}
      <nav className={styles.navbar}>
        {/* Logo à gauche */}
        <Image src="/logoooo.png" alt="logo CB" width={180} height={50} priority className={styles.navLogo} />

        {/* Boutons de navigation à droite */}
        <div className={styles.navigation}>
          <button className={styles.navButton} onClick={() => setIsAboutModalOpen(true)}>
            À propos
          </button>
          <button className={styles.navButton} onClick={() => setIsContactModalOpen(true)}>
            Contact
          </button>
        </div>
      </nav>

      {/* Section principale avec défilement */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Logo Badinter en premier */}
          <Image
            src="/logoo.png"
            alt="logo badinter"
            width={400}
            height={200}
            priority
            className={styles.badinterLogo}
          />

          {/* Boutons d'action positionnés sous le logo Badinter */}
          <div className={styles.buttonContainer}>
            <button className={styles.actionButton} onClick={() => openAuthModal("login")}>
              Se connecter
            </button>
            <button className={styles.actionButton} onClick={() => openAuthModal("signup")}>
              S'inscrire
            </button>
          </div>
        </div>

        {/* Contenu supplémentaire pour permettre le défilement */}
        <div className={styles.additionalContent}>
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Votre assistant juridique intelligent</h2>
            <p className={styles.sectionText}>
              Badinter est un chatbot juridique conçu pour rendre le droit accessible à tous. Grâce à l'intelligence
              artificielle, notre assistant répond à vos questions juridiques en langage clair et vous guide dans vos
              démarches légales.
            </p>
          </div>

          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Nos Services</h2>
            <p className={styles.sectionText}>
              Consultation juridique instantanée, analyse de documents légaux, aide à la rédaction de courriers
              juridiques, et orientation vers les ressources adaptées à votre situation. Badinter est disponible 24/7
              pour répondre à vos questions.
            </p>
          </div>

          <div className={styles.chatbotDemo}>
            <h2 className={styles.sectionTitle}>Découvrez Badinter en action</h2>
            <div className={styles.chatInterface}>
              <div className={styles.chatMessage}>
                <div className={styles.botMessage}>
                  <p>Bonjour ! Je suis Badinter, votre assistant juridique. Comment puis-je vous aider aujourd'hui ?</p>
                </div>
                <div className={styles.userMessage}>
                  <p>J'ai une question sur mon contrat de location.</p>
                </div>
                <div className={styles.botMessage}>
                  <p>
                    Je peux vous aider avec ça ! Pourriez-vous me préciser quelle partie du contrat vous pose problème ?
                    (préavis, caution, charges...)
                  </p>
                </div>
              </div>
              <div className={styles.chatInputDemo}>
                <button className={styles.chatDemoButton} onClick={() => openAuthModal("signup")}>
                  Créez un compte pour discuter avec Badinter
                </button>
              </div>
            </div>
          </div>

          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>Pourquoi choisir Badinter ?</h2>
            <p className={styles.sectionText}>
              Développé par une équipe d'élèves ingénieurs passionnés par l'IA et le droit, Badinter combine expertise
              technique et rigueur juridique. Notre mission est de démocratiser l'accès au droit grâce à la technologie.
            </p>
          </div>
        </div>
      </main>

      {/* Image décorative fixe en bas à droite */}
      <Image
        src="/dessin.png"
        alt="dessin en bas"
        width={400}
        height={300}
        priority
        className={styles.decorativeImage}
      />

      {/* Modal d'authentification (connexion/inscription) */}
      {isAuthModalOpen && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{authMode === "login" ? "Se connecter" : "S'inscrire"}</h2>
              <button className={styles.closeButton} onClick={closeAllModals}>
                ×
              </button>
            </div>

            {/* Formulaire de connexion */}
            {authMode === "login" && (
              <>
                <form className={styles.form} onSubmit={(e) => handleFormSubmit(e, "connexion")}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="email">
                      Email
                    </label>
                    <input
                      className={styles.input}
                      type="email"
                      id="email"
                      placeholder="Votre adresse email"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="password">
                      Mot de passe
                    </label>
                    <input
                      className={styles.input}
                      type="password"
                      id="password"
                      placeholder="Votre mot de passe"
                      required
                    />
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    Se connecter
                  </button>
                </form>

                {/* Lien pour basculer vers l'inscription */}
                <div className={styles.authToggle}>
                  <p className={styles.authToggleText}>
                    Pas encore de compte ?{" "}
                    <button className={styles.authToggleButton} onClick={toggleAuthMode}>
                      S'inscrire ici
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* Formulaire d'inscription */}
            {authMode === "signup" && (
              <>
                <form className={styles.form} onSubmit={(e) => handleFormSubmit(e, "inscription")}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="firstName">
                      Prénom
                    </label>
                    <input className={styles.input} type="text" id="firstName" placeholder="Votre prénom" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="lastName">
                      Nom
                    </label>
                    <input className={styles.input} type="text" id="lastName" placeholder="Votre nom" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="signupEmail">
                      Email
                    </label>
                    <input
                      className={styles.input}
                      type="email"
                      id="signupEmail"
                      placeholder="Votre adresse email"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="signupPassword">
                      Mot de passe
                    </label>
                    <input
                      className={styles.input}
                      type="password"
                      id="signupPassword"
                      placeholder="Choisissez un mot de passe"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="confirmPassword">
                      Confirmer le mot de passe
                    </label>
                    <input
                      className={styles.input}
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirmez votre mot de passe"
                      required
                    />
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    S'inscrire
                  </button>
                </form>

                {/* Lien pour basculer vers la connexion */}
                <div className={styles.authToggle}>
                  <p className={styles.authToggleText}>
                    Déjà un compte ?{" "}
                    <button className={styles.authToggleButton} onClick={toggleAuthMode}>
                      Se connecter ici
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de contact */}
      {isContactModalOpen && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Nous contacter</h2>
              <button className={styles.closeButton} onClick={closeAllModals}>
                ×
              </button>
            </div>
            <form className={styles.form} onSubmit={(e) => handleFormSubmit(e, "contact")}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="contactName">
                  Nom complet
                </label>
                <input className={styles.input} type="text" id="contactName" placeholder="Votre nom complet" required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="contactEmail">
                  Email
                </label>
                <input
                  className={styles.input}
                  type="email"
                  id="contactEmail"
                  placeholder="Votre adresse email"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="subject">
                  Sujet
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="subject"
                  placeholder="Sujet de votre message"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="message">
                  Message
                </label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  id="message"
                  placeholder="Votre message..."
                  required
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal About Me */}
      {isAboutModalOpen && (
        <div className={styles.modalOverlay} onClick={closeAllModals}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>À propos de Badinter</h2>
              <button className={styles.closeButton} onClick={closeAllModals}>
                ×
              </button>
            </div>
            <div className={styles.aboutContent}>
              <h3>Notre Projet</h3>
              <p>
                Badinter est un chatbot juridique développé par une équipe d'élèves ingénieurs passionnés par
                l'intelligence artificielle et le droit. Notre objectif est de démocratiser l'accès à l'information
                juridique en proposant un assistant virtuel capable de répondre aux questions légales courantes.
              </p>

              <h3>Notre Équipe</h3>
              <p>
                Nous sommes des étudiants en école d'ingénieur spécialisés en intelligence artificielle, traitement du
                langage naturel et développement web. Guidés par notre passion pour l'innovation technologique au
                service du bien commun, nous avons créé Badinter pour rendre le droit plus accessible.
              </p>

              <h3>Notre Technologie</h3>
              <p>
                Badinter utilise des algorithmes avancés de traitement du langage naturel et d'apprentissage automatique
                pour comprendre vos questions juridiques et y répondre de manière précise et accessible. Notre base de
                connaissances est régulièrement mise à jour pour refléter les évolutions législatives.
              </p>

              <h3>Notre Vision</h3>
              <p>
                Nous croyons que l'accès à l'information juridique est un droit fondamental. Notre vision est de créer
                un outil qui permet à chacun de comprendre ses droits et obligations, indépendamment de ses moyens
                financiers ou de son niveau d'éducation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
