'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Erreur lors de l’inscription')
                return
            }

            // Redirection vers login après succès
            router.push('/login')
        } catch (err) {
            console.error(err)
            setError('Une erreur est survenue')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="wrapper">
            <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
                <h1>Créer un compte</h1>
                <div>
                    <label>Nom</label>
                    <input
                        type="text"
                        value={name}
                        required
                        onChange={e => setName(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={e => setEmail(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Création en cours...' : 'Créer mon compte'}
                </button>
            </form>
        </main>
    )
}