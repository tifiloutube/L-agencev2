'use client'

import { Property, PropertyImage, PropertyStatus } from '@prisma/client'
import Link from 'next/link'
import { useState } from 'react'

type PropertyWithImage = Property & { images: PropertyImage[] }

type Props = {
    properties: PropertyWithImage[]
}

export default function AccountProperties({ properties: initialProperties }: Props) {
    const [properties, setProperties] = useState(initialProperties)

    const updateStatus = async (propertyId: string, newStatus: PropertyStatus) => {
        await fetch(`/api/properties/${propertyId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        })

        // Mise à jour locale de l'état
        setProperties(prev =>
            prev.map(p =>
                p.id === propertyId ? { ...p, status: newStatus } : p
            )
        )
    }

    return (
        <section style={{ marginTop: 40 }}>
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
                                    style={{
                                        width: 100,
                                        height: 100,
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                    }}
                                />
                            )}

                            <div style={{ flex: 1 }}>
                                <strong>{property.title}</strong> — {property.status.toLowerCase()}<br />
                                {property.city}, {property.price} €

                                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                    {property.status === 'DRAFT' && (
                                        <button onClick={() => updateStatus(property.id, 'PUBLISHED')}>Publier</button>
                                    )}
                                    {property.status === 'PUBLISHED' && (
                                        <>
                                            <button onClick={() => updateStatus(property.id, 'ARCHIVED')}>Archiver</button>
                                            <button onClick={() => updateStatus(property.id, 'DRAFT')}>Brouillon</button>
                                        </>
                                    )}
                                    {property.status === 'ARCHIVED' && (
                                        <button onClick={() => updateStatus(property.id, 'PUBLISHED')}>Remettre en ligne</button>
                                    )}
                                </div>
                            </div>

                            <Link href={`/properties/${property.id}/edit`}>
                                <button style={{ marginLeft: 20 }}>Modifier</button>
                            </Link>
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