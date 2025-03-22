'use client'

import { useState, useEffect } from 'react'

type Props = {
    propertyId: string
    initialIsFavorite: boolean
}

export default function FavoriteButton({ propertyId, initialIsFavorite }: Props) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [loading, setLoading] = useState(false)

    const toggleFavorite = async () => {
        setLoading(true)
        const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId }),
        })
        const data = await res.json()
        setIsFavorite(data.isFavorite)
        setLoading(false)
    }

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            style={{
                fontSize: 24,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginLeft: 10,
            }}
        >
            {isFavorite ? 'Retirer ce bien des favoris' : 'Ajouter ce bien aux favoris'}
        </button>
    )
}