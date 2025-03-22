'use client'

import { Property, PropertyImage } from '@prisma/client'
import Link from 'next/link'

type PropertyWithImage = Property & { images: PropertyImage[] }

type Props = {
    properties: PropertyWithImage[]
}

export default function AccountProperties({ properties }: Props) {
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
                            {/* Miniature si disponible */}
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