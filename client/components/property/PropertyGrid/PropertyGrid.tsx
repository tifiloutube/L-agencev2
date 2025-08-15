'use client'

import Link from 'next/link'
import Image from 'next/image'
import Styles from './PropertyGrid.module.css'
import FavoriteButton from '@/components/property/FavoriteButton/FavoriteButton'

interface Property {
    id: string; title: string; description: string; city: string; price: number;
    images: { url: string }[]; isFavorite?: boolean;
}

export default function PropertyGrid({ properties, className }: { properties: Property[]; className?: string; }) {
    if (properties.length === 0) return <p>Aucun bien publié pour le moment.</p>

    return (
        <section className={`${Styles.propertyGrid} ${className || ''}`} aria-label="Liste des biens">
            <div className={Styles.container}>
                {properties.map((p) => (
                    <article key={p.id} className={Styles.card} aria-labelledby={`title-${p.id}`}>
                        <div className={Styles.imageContainer}>
                            {p.images[0] ? (
                                <Link href={`/properties/${p.id}`} aria-label={`Voir le bien ${p.title}`}>
                                    <Image
                                        src={p.images[0].url}
                                        alt={p.title}
                                        className={Styles.image}
                                        width={800}
                                        height={600}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </Link>
                            ) : (
                                <div className={Styles.imagePlaceholder} aria-hidden="true" />
                            )}
                        </div>

                        <div className={Styles.detailsContainer}>
                            <div className={Styles.details}>
                                <h2 id={`title-${p.id}`} className={Styles.title}>{p.title}</h2>
                                <p className={Styles.description}>{p.description}</p>
                                <p className={Styles.meta}>{p.city}</p>
                                <p className={Styles.meta}>{p.price.toLocaleString('fr-FR')} €</p>
                            </div>
                            <div className={Styles.actions}>
                                <Link href={`/properties/${p.id}`} className="button">Voir le bien</Link>
                                <FavoriteButton propertyId={p.id} initialIsFavorite={p.isFavorite ?? false} />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}