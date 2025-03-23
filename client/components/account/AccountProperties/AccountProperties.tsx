'use client'

import { Property, PropertyImage, PropertyStatus } from '@prisma/client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { useToast } from '@/lib/context/ToastContext'

type PropertyWithImage = Property & { images: PropertyImage[] }

type Props = {
    properties: PropertyWithImage[]
    maxProperties: number
}

export default function AccountProperties({ properties: initialProperties, maxProperties }: Props) {
    const [properties, setProperties] = useState(initialProperties)
    const { showToast } = useToast()

    const activeCount = useMemo(
        () => properties.filter(p => p.status !== 'ARCHIVED').length,
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

    return (
        <section style={{ marginTop: 40, position: 'relative' }}>
            <h2>Mes biens</h2>
            {properties.length === 0 ? (
                <p>Vous n'avez encore ajouté aucun bien.</p>
            ) : (
                <ul style={{ paddingLeft: 0 }}>
                    {properties.map(property => (
                        <li
                            key={property.id}
                            style={{
                                marginBottom: 20,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                            }}
                        >
                            {property.images[0] && (
                                <img
                                    src={property.images[0].url}
                                    alt={property.title}
                                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                                />
                            )}

                            <div style={{ flex: 1 }}>
                                <strong>{property.title}</strong> — {property.status.toLowerCase()}<br />
                                {property.city}, {property.price} €

                                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                    {property.status === 'DRAFT' && (
                                        <button
                                            onClick={() => updateStatus(property.id, 'PUBLISHED')}
                                            disabled={atQuotaLimit}
                                            title={
                                                atQuotaLimit
                                                    ? `Vous avez atteint votre quota de ${maxProperties} bien${maxProperties > 1 ? 's' : ''}`
                                                    : ''
                                            }
                                        >
                                            📢 Publier
                                        </button>
                                    )}
                                    {property.status === 'PUBLISHED' && (
                                        <>
                                            <button onClick={() => updateStatus(property.id, 'ARCHIVED')}>Archiver</button>
                                            <button onClick={() => updateStatus(property.id, 'DRAFT')}>Brouillon</button>
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
                                        >
                                            Remettre en ligne
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <Link href={`/properties/${property.id}/edit`}>
                                    <button style={{ marginLeft: 8 }}>Modifier</button>
                                </Link>
                                <button onClick={() => handleDelete(property.id)}>
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Link href="/properties/new">
                <button>Ajouter un nouveau bien</button>
            </Link>
        </section>
    )
}