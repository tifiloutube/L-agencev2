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
}

export default function AccountProperties({ properties: initialProperties, maxProperties }: Props) {
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

            {archivedCount > 0 && (
                <div className="account-properties__alert">
                    ⚠️ Certains de vos biens ont été archivés automatiquement car vous avez dépassé votre quota d'abonnement ({archivedCount} bien{archivedCount > 1 ? 's' : ''}).
                </div>
            )}

            {properties.length === 0 ? (
                <p className="account-properties__empty">Vous n'avez encore ajouté aucun bien.</p>
            ) : (
                <ul className={styles.accountPropertiesList}>
                    {properties.map(property => (
                        <li key={property.id} className={styles.accountPpropertiesItem}>
                            <div className={styles.containerImage}>
                                {property.images[0] && (
                                    <img
                                        src={property.images[0].url}
                                        alt={property.title}
                                        className={styles.accountPropertiesImage}
                                    />
                                )}
                            </div>

                            <div className="account-properties__content">
                                <div className="account-properties__info">
                                    <strong>{property.title}</strong> — {property.status.toLowerCase()}<br />
                                    {property.city}, {property.price} €
                                </div>

                                <div className="account-properties__actions">
                                    {property.status === 'DRAFT' && (
                                        <button
                                            onClick={() => updateStatus(property.id, 'PUBLISHED')}
                                            disabled={atQuotaLimit}
                                            title={
                                                atQuotaLimit
                                                    ? `Vous avez atteint votre quota de ${maxProperties} bien${maxProperties > 1 ? 's' : ''}`
                                                    : ''
                                            }
                                            className="account-properties__button"
                                        >
                                            📢 Publier
                                        </button>
                                    )}
                                    {property.status === 'PUBLISHED' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(property.id, 'ARCHIVED')}
                                                className="account-properties__button"
                                            >
                                                Archiver
                                            </button>
                                            <button
                                                onClick={() => updateStatus(property.id, 'DRAFT')}
                                                className="account-properties__button"
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
                                            className="account-properties__button"
                                        >
                                            Remettre en ligne
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="account-properties__actions-column">
                                <Link href={`/properties/${property.id}/edit`}>
                                    <button className="account-properties__edit-button">Modifier</button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(property.id)}
                                    className="account-properties__delete-button"
                                >
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
