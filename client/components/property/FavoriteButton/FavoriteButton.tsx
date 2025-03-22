'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/lib/context/ToastContext'

type Props = {
    propertyId: string
    initialIsFavorite: boolean
}

export default function FavoriteButton({ propertyId, initialIsFavorite }: Props) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

    const toggleFavorite = async () => {
        setLoading(true)
        const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId }),
        })

        const data = await res.json()
        setIsFavorite(data.isFavorite)

        showToast({
            message: data.isFavorite
                ? 'Ajouté aux favoris'
                : 'Retiré des favoris',
        })

        setLoading(false)
    }

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            style={{
                fontSize: 16,
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: 6,
                padding: '6px 12px',
                cursor: 'pointer',
                marginLeft: 10,
            }}
        >
            {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </button>
    )
}