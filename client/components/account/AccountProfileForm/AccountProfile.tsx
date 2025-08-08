'use client'

import { useState } from 'react'
import { useToast } from '@/lib/context/ToastContext'
import styles from './AccountProfile.module.css'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Props = {
    user: {
        id: string
        name: string | null
        email: string
        phone: string | null
    }
}

export default function AccountProfile({ user }: Props) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { showToast } = useToast()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const res = await fetch('/api/account/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name || user.name,
                phone: phone || user.phone,
                email: email || user.email,
                newPassword,
                confirmPassword,
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.error || 'Erreur lors de la mise à jour')
            showToast({ message: data.error || 'Erreur lors de la mise à jour', type: 'error' })
            setLoading(false)
            return
        }

        if (data.logout) {
            showToast({ message: 'Email modifié. Déconnexion en cours...' })
            await signOut({ redirect: false })
            router.push('/login')
            return
        }

        showToast({ message: 'Profil mis à jour' })
        setNewPassword('')
        setConfirmPassword('')
        setName('')
        setPhone('')
        setEmail('')
        setLoading(false)
    }

    return (
        <section className={styles.profile}>
            <h2 className={styles.h2}>Informations personnelles</h2>
            <h3 className={styles.h3}>Modifier vos informations de profil</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.info}>
                    <label>Nom complet</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={name}
                        placeholder={user.name || 'Non renseigné'}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className={styles.info}>
                    <label>Email</label>
                    <input
                        className={styles.input}
                        type="email"
                        value={email}
                        placeholder={user.email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.info}>
                    <label>Téléphone</label>
                    <input
                        className={styles.input}
                        type="tel"
                        value={phone}
                        placeholder={user.phone || 'Non renseigné'}
                        onChange={e => setPhone(e.target.value)}
                    />
                </div>
                <div className={styles.password}>
                    <div className={styles.info}>
                        <label>Nouveau mot de passe</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className={styles.info}>
                        <label>Confirmation du mot de passe</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading} className={`button ${styles.button}`}>
                    {loading ? 'Sauvegarde...' : 'Sauvegarder les informations'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </section>
    )
}