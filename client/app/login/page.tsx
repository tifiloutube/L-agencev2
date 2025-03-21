'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError('Email ou mot de passe incorrect')
        } else {
            router.push('/') // Redirige vers la home ou dashboard
        }
    }

    return (
        <main className="wrapper">
            <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
                <h1>Connexion</h1>
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
                <button type="submit">Se connecter</button>
            </form>
        </main>
    )
}