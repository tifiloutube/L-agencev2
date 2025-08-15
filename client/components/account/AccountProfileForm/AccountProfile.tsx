"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/lib/context/ToastContext"
import styles from "./AccountProfile.module.css"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

type Props = {
    user: {
        id: string
        name: string | null
        email: string
        phone: string | null
    }
}

export default function AccountProfile({ user }: Props) {
    const [name, setName] = useState(user.name || "")
    const [phone, setPhone] = useState(user.phone || "")
    const [email, setEmail] = useState(user.email)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const {showToast} = useToast()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (newPassword && newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.")
            showToast({message: "Les mots de passe ne correspondent pas.", type: "error"})
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/account/update", {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email,
                    newPassword,
                    confirmPassword,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Erreur lors de la mise à jour")
                showToast({message: data.error || "Erreur lors de la mise à jour", type: "error"})
                return
            }

            if (data.logout) {
                showToast({message: "Email modifié. Déconnexion en cours..."})
                await signOut({redirect: false})
                router.push("/login")
                return
            }

            showToast({message: "Profil mis à jour"})
            setNewPassword("")
            setConfirmPassword("")
            // No need to reset name, phone, email as they are bound to state and will reflect the updated user prop on re-render if needed
        } catch (err) {
            console.error(err)
            setError("Une erreur est survenue")
            showToast({message: "Une erreur est survenue", type: "error"})
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Informations personnelles</h2>
                <p className={styles.sectionDescription}>Modifier vos informations de profil</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        <span className={styles.labelIcon}>👤</span>
                        Nom complet
                    </label>
                    <input
                        id="name"
                        className={styles.input}
                        type="text"
                        value={name}
                        placeholder="Votre nom et prénom"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        <span className={styles.labelIcon}>📧</span>
                        Email
                    </label>
                    <input
                        id="email"
                        className={styles.input}
                        type="email"
                        value={email}
                        placeholder="votre@email.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                        <span className={styles.labelIcon}>📞</span>
                        Téléphone
                    </label>
                    <input
                        id="phone"
                        className={styles.input}
                        type="tel"
                        value={phone}
                        placeholder="Ex: 06 12 34 56 78"
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className={styles.passwordGroup}>
                    <div className={styles.formGroup}>
                        <label htmlFor="new-password" className={styles.label}>
                            <span className={styles.labelIcon}>🔒</span>
                            Nouveau mot de passe
                        </label>
                        <input
                            id="new-password"
                            className={styles.input}
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Laissez vide pour ne pas changer"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirm-password" className={styles.label}>
                            <span className={styles.labelIcon}>🔑</span>
                            Confirmation du mot de passe
                        </label>
                        <input
                            id="confirm-password"
                            className={styles.input}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmez votre nouveau mot de passe"
                        />
                    </div>
                </div>

                {error && (
                    <p className={styles.errorMessage}>
                        <span className={styles.errorIcon}>⚠️</span>
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading} className={`button ${styles.submitButton}`}>
                    {loading ? (
                        <>
                            <span className={styles.loadingIcon}>⏳</span>
                            Sauvegarde en cours...
                        </>
                    ) : (
                        <>
                            <span className={styles.buttonIcon}>💾</span>
                            Sauvegarder les informations
                        </>
                    )}
                </button>
            </form>
        </section>
    )
}
