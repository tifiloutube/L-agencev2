import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function PropertiesPage() {
    const properties = await prisma.property.findMany({
        where: { status: 'PUBLISHED' },
        include: {
            images: {
                take: 1,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return (
        <main className="wrapper" style={{ paddingBlock: '40px' }}>
            <h1>Biens disponibles</h1>

            {properties.length === 0 ? (
                <p>Aucun bien publié pour le moment.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    {properties.map(property => (
                        <Link key={property.id} href={`/properties/${property.id}`}>
                            <div style={{
                                border: '1px solid #ccc',
                                borderRadius: 8,
                                overflow: 'hidden',
                                textDecoration: 'none',
                                color: 'inherit',
                                background: '#fff'
                            }}>
                                {property.images[0] && (
                                    <img
                                        src={property.images[0].url}
                                        alt={property.title}
                                        style={{ width: '100%', height: 180, objectFit: 'cover' }}
                                    />
                                )}
                                <div style={{ padding: 12 }}>
                                    <strong>{property.title}</strong><br />
                                    {property.city}, {property.price} €
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    )
}