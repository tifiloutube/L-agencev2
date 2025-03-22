'use client'

import { Property } from '@prisma/client'
import Link from 'next/link'

type Props = {
    properties: Property[]
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
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
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