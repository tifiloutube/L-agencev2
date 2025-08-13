"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./page.module.css"

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Erreur lors de l'inscription")
                return
            }

            // Redirection vers login après succès
            router.push("/login")
        } catch (err) {
            console.error(err)
            setError("Une erreur est survenue")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.pageContainer}>
            {/* Main Content */}
            <main className={styles.main}>
                <div className={`wrapper ${styles.contentWrapper}`}>
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <div className={styles.welcomeIcon}>👋</div>
                            <h1 className={styles.title}>Créer un compte</h1>
                            <p className={styles.subtitle}>Rejoignez La Crémaillère et trouvez votre bien idéal</p>
                        </div>

                        <form onSubmit={handleRegister} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    <span className={styles.labelIcon}>👤</span>
                                    Nom complet
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.input}
                                    placeholder="Votre nom et prénom"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    <span className={styles.labelIcon}>📧</span>
                                    Adresse email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="password" className={styles.label}>
                                    <span className={styles.labelIcon}>🔒</span>
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    placeholder="Minimum 8 caractères"
                                    minLength={8}
                                />
                                <div className={styles.passwordHint}>
                                    <span className={styles.hintIcon}>💡</span>
                                    <span className={styles.hintText}>
                                        Utilisez au moins 8 caractères avec des lettres et des chiffres
                                      </span>
                                </div>
                            </div>

                            {error && (
                                <div className={styles.errorMessage}>
                                    <span className={styles.errorIcon}>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className={`button ${styles.submitButton}`}>
                                {loading ? (
                                    <>
                                        <span className={styles.loadingIcon}>⏳</span>
                                        Création en cours...
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.buttonIcon}>🚀</span>
                                        Créer mon compte
                                    </>
                                )}
                            </button>

                            <div className={styles.divider}>
                                <span className={styles.dividerText}>ou</span>
                            </div>

                            <div className={styles.loginPrompt}>
                                <span className={styles.promptText}>Vous avez déjà un compte ?</span>
                                <Link href="/login" className={styles.loginLink}>
                                    Se connecter
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}