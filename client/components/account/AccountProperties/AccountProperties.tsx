'use client'

import { Property, PropertyImage, PropertyStatus } from '@prisma/client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useToast } from '@/lib/context/ToastContext'

import styles from './AccountProperties.module.css'

type PropertyWithImage = Property & { images: PropertyImage[] }

type Props = {
    properties: PropertyWithImage[]
    maxProperties: number
    subscriptionStatus: string | null
}

export default function AccountProperties({ properties: initialProperties, maxProperties, subscriptionStatus }: Props) {
    const [properties, setProperties] = useState(initialProperties)
    const { showToast } = useToast()

    const activeCount = useMemo(
        () => properties.filter(p => p.status === 'PUBLISHED').length,
        [properties]
    )

    const atQuotaLimit = activeCount >= maxProperties

    const updateStatus = async (propertyId: string, newStatus: PropertyStatus) => {
        const res = await fetch(`/api/properties/${propertyId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        })

        const data = await res.json()

        if (!res.ok) {
            return showToast({ message: data.error || 'Erreur', type: 'error' })
        }

        setProperties(prev =>
            prev.map(p => (p.id === propertyId ? { ...p, status: newStatus } : p))
        )

        showToast({
            message:
                newStatus === 'PUBLISHED'
                    ? 'Bien publié'
                    : newStatus === 'DRAFT'
                        ? 'Mis en brouillon'
                        : 'Archivé',
        })
    }

    const handleDelete = async (propertyId: string) => {
        const confirm = window.confirm('Supprimer ce bien ? Cette action est irréversible.')
        if (!confirm) return

        const res = await fetch(`/api/properties/${propertyId}`, {
            method: 'DELETE',
        })

        if (res.ok) {
            setProperties(prev => prev.filter(p => p.id !== propertyId))
            showToast({ message: 'Bien supprimé avec succès' })
        } else {
            showToast({ message: 'Erreur lors de la suppression', type: 'error' })
        }
    }

    const archivedCount = properties.filter(p => p.status === 'ARCHIVED').length

    return (
        <section className={styles.container}>
            <h2 className={`h2 ${styles.h2}`}>Mes biens</h2>

            <Link href="/properties/new">
                <button className={`button ${styles.button}`}>Ajouter un nouveau bien</button>
            </Link>

            {archivedCount > 0 && subscriptionStatus !== 'active' && (
                <div className={`${styles.alert}`}>
                    ⚠️ Certains de vos biens ont été archivés automatiquement car votre abonnement est inactif. Vous ne pouvez publier que {maxProperties} bien{maxProperties > 1 ? 's' : ''}.
                </div>
            )}

            {properties.length === 0 ? (
                <p className={`${styles.empty}`}>Vous n'avez encore ajouté aucun bien.</p>
            ) : (
                <ul className={styles.accountPropertiesList}>
                    {properties.map(property => (
                        <li key={property.id} className={styles.accountPropertiesItem}>
                            <div className={styles.containerImage}>
                                {property.images[0] && (
                                    <img
                                        src={property.images[0].url}
                                        alt={property.title}
                                        className={styles.accountPropertiesImage}
                                    />
                                )}
                            </div>

                            <div className={styles.content}>
                                <div>
                                    <strong>{property.title}</strong> — {property.status.toLowerCase()}<br />
                                    {property.city}, {property.price} €
                                </div>
                                <div className={styles.statusActions}>
                                    {property.status === 'DRAFT' && (
                                        <button
                                            onClick={() => updateStatus(property.id, 'PUBLISHED')}
                                            disabled={atQuotaLimit}
                                            title={
                                                atQuotaLimit
                                                    ? `Vous avez atteint votre quota de ${maxProperties} bien${maxProperties > 1 ? 's' : ''}`
                                                    : ''
                                            }
                                            className="button"
                                        >
                                            Publier
                                        </button>
                                    )}
                                    {property.status === 'PUBLISHED' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(property.id, 'ARCHIVED')}
                                                className="button"
                                            >
                                                Archiver
                                            </button>
                                            <button
                                                onClick={() => updateStatus(property.id, 'DRAFT')}
                                                className="button"
                                            >
                                                Brouillon
                                            </button>
                                        </>
                                    )}
                                    {property.status === 'ARCHIVED' && (
                                        <button
                                            onClick={() => updateStatus(property.id, 'PUBLISHED')}
                                            disabled={atQuotaLimit}
                                            title={
                                                atQuotaLimit
                                                    ? `Vous avez atteint votre quota de ${maxProperties} bien${maxProperties > 1 ? 's' : ''}`
                                                    : ''
                                            }
                                            className="button"
                                        >
                                            Remettre en ligne
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className={styles.actionsColumn}>
                                <Link href={`/properties/${property.id}/edit`}>
                                    <button className="button">Modifier</button>
                                </Link>
                                <button onClick={() => handleDelete(property.id)} className="button">
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}