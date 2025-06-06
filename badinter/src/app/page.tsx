import Image from "next/image"
import styles from "./pageacceuil.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Barre de navigation fixe */}
      <nav className={styles.navbar}>
        {/* Logo à gauche */}
        <Image src="/logoooo.png" alt="logo CB" width={180} height={50} priority className={styles.navLogo} />

        {/* Boutons de navigation à droite */}
        <div className={styles.navigation}>
          <button className={styles.navButton}>About</button>
          <button className={styles.navButton}>Contact</button>
        </div>
      </nav>

      {/* Section principale avec défilement */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Logo Badinter*/}
          <Image
            src="/logoo.png"
            alt="logo badinter"
            width={400}
            height={200}
            priority
            className={styles.badinterLogo}
          />

          {/* Boutons d'action */}
          <div className={styles.buttonContainer}>
            <button className={styles.actionButton}>Se connecter</button>
            <button className={styles.actionButton}>S'inscrire</button>
          </div>
        </div>

        {/* Contenu supplémentaire pour permettre le défilement */}
        <div className={styles.additionalContent}>
          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}></h2>
            <p className={styles.sectionText}>
            </p>
          </div>

          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}></h2>
            <p className={styles.sectionText}>
            </p>
          </div>

          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}></h2>
            <p className={styles.sectionText}>
            </p>
          </div>

          <div className={styles.contentSection}>
            <h2 className={styles.sectionTitle}></h2>
            <p className={styles.sectionText}>
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
    </div>
  )
}
