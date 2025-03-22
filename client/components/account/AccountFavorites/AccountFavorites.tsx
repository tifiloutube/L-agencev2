'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Favorite, PropertyImage } from '@prisma/client'

type PropertyWithImages = {
    id: string
    title: string
    city: string
    price: number
    images: PropertyImage[]
}

type FavoriteWithProperty = Favorite & { property: PropertyWithImages }

type Props = {
    favorites: FavoriteWithProperty[]
}

export default function AccountFavorites({ favorites: initialFavorites }: Props) {
    const [favorites, setFavorites] = useState(initialFavorites)

    const handleRemove = async (propertyId: string) => {
        const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId }),
        })

        if (res.ok) {
            setFavorites(prev => prev.filter(f => f.property.id !== propertyId))
        }
    }

    return (
        <section style={{ marginTop: 60 }}>
            <h2>Biens en favoris</h2>

            {favorites.length === 0 ? (
                <p>Vous n'avez encore aucun bien en favori.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {favorites.map(fav => (
                        <div key={fav.id} style={{ position: 'relative' }}>
                            <Link href={`/properties/${fav.property.id}`}>
                                <div
                                    style={{
                                        border: '1px solid #ccc',
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        background: '#fff',
                                    }}
                                >
                                    {fav.property.images[0] && (
                                        <img
                                            src={fav.property.images[0].url}
                                            alt={fav.property.title}
                                            style={{ width: '100%', height: 180, objectFit: 'cover' }}
                                        />
                                    )}
                                    <div style={{ padding: 12 }}>
                                        <strong>{fav.property.title}</strong><br />
                                        {fav.property.city}, {fav.property.price} €
                                    </div>
                                </div>
                            </Link>

                            {/* ❌ Bouton retirer */}
                            <button
                                onClick={() => handleRemove(fav.property.id)}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    background: 'rgba(0,0,0,0.6)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 24,
                                    height: 24,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                }}
                                title="Retirer des favoris"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}