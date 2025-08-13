"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import styles from "./page.module.css"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Email ou mot de passe incorrect")
            } else {
                router.push("/")
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la connexion")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.pageContainer}>
            <main className={styles.main}>
                <div className={`wrapper ${styles.contentWrapper}`}>
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h1 className={styles.title}>Bon retour !</h1>
                            <p className={styles.subtitle}>Connectez-vous à votre compte La Crémaillère</p>
                        </div>

                        <form onSubmit={handleLogin} className={styles.form}>
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
                                    placeholder="Votre mot de passe"
                                />
                                <div className={styles.forgotPassword}>
                                    <Link href="/forgot-password" className={styles.forgotLink}>
                                        Mot de passe oublié ?
                                    </Link>
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
                                        Connexion en cours...
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.buttonIcon}>🚀</span>
                                        Se connecter
                                    </>
                                )}
                            </button>

                            <div className={styles.divider}>
                                <span className={styles.dividerText}>ou</span>
                            </div>

                            <div className={styles.registerPrompt}>
                                <span className={styles.promptText}>Vous n'avez pas encore de compte ?</span>
                                <Link href="/register" className={styles.registerLink}>
                                    Créer un compte
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}