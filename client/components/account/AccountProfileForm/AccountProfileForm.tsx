'use client'

import { useState } from 'react'

type Props = {
    user: {
        id: string
        name: string | null
        email: string
        phone: string | null
    }
}

export default function AccountProfileForm({ user }: Props) {
    const [name, setName] = useState(user.name || '')
    const [phone, setPhone] = useState(user.phone || '')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        const res = await fetch('/api/account/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone }),
        })

        if (!res.ok) {
            setError('Erreur lors de la mise à jour')
        } else {
            setSuccess(true)
        }

        setLoading(false)
    }

    return (
        <section style={{ marginTop: 40 }}>
            <h2>Modifier mon profil</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <label>Téléphone</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Sauvegarde...' : 'Mettre à jour'}
                </button>
                {success && <p style={{ color: 'green' }}>Profil mis à jour ✅</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </section>
    )
}