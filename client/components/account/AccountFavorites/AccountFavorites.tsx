'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Favorite, PropertyImage } from '@prisma/client'
import { useToast } from '@/lib/context/ToastContext'
import styles from './AccountFavorites.module.css'

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
    const { showToast } = useToast()

    const handleRemove = async (propertyId: string) => {
        const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId }),
        })

        if (res.ok) {
            setFavorites(prev => prev.filter(f => f.property.id !== propertyId))
            showToast({ message: 'Retiré des favoris' })
        } else {
            showToast({ message: 'Erreur lors du retrait du favori', type: 'error' })
        }
    }

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.h2}>Biens en favoris</h2>
                <h3 className={styles.h3}>Suivez vos favoris</h3>
            </div>

            {favorites.length === 0 ? (
                <p className={styles.empty}>Vous n'avez encore aucun bien en favori.</p>
            ) : (
                <div className={styles.favoritesGrid}>
                    {favorites.map(fav => (
                        <div key={fav.id} className={styles.favoriteCard}>
                            <Link href={`/properties/${fav.property.id}`} className={styles.link}>
                                <div className={styles.imageWrapper}>
                                    {fav.property.images[0] && (
                                        <img
                                            src={fav.property.images[0].url}
                                            alt={fav.property.title}
                                            className={styles.image}
                                        />
                                    )}
                                </div>
                                <div className={styles.info}>
                                    <strong>{fav.property.title}</strong>
                                    <p>{fav.property.city}, {fav.property.price} €</p>
                                </div>
                            </Link>

                            <button
                                onClick={() => handleRemove(fav.property.id)}
                                className={`button ${styles.button}`}
                                title="Retirer des favoris"
                            >
                                Retirer
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}