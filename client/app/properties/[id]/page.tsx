import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

type Props = {
    params: { id: string }
}

export default async function PropertyDetailPage({ params }: Props) {
    const property = await prisma.property.findUnique({
        where: { id: params.id },
        include: {
            images: true,
            user: true,
        },
    })

    if (!property || property.status !== 'PUBLISHED') {
        notFound()
    }

    return (
        <main className="wrapper" style={{ paddingBlock: '40px' }}>
            <h1>{property.title}</h1>
            <p><strong>Ville :</strong> {property.city} — {property.zipCode} — {property.country}</p>
            <p><strong>Prix :</strong> {property.price} €</p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
                {property.images.map(img => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt={property.title}
                        style={{ width: 200, height: 140, objectFit: 'cover', borderRadius: 8 }}
                    />
                ))}
            </div>

            <section style={{ marginTop: 30 }}>
                <p><strong>Surface :</strong> {property.surface} m²</p>
                <p><strong>Pièces :</strong> {property.rooms ?? 'N.C'}</p>
                <p><strong>Salles de bain :</strong> {property.bathrooms ?? 'N.C'}</p>
                <p><strong>Garage :</strong> {property.hasGarage ? 'Oui' : 'Non'}</p>
                <p><strong>Étage :</strong> {property.floor ?? 'N.C'}</p>
                <p><strong>Adresse :</strong> {property.address}</p>
                <p style={{ marginTop: 20 }}><strong>Description :</strong><br />{property.description}</p>
            </section>

            <section>
                <h2>Contacter le propriétaire</h2>
                <p><strong>Nom :</strong> {property.user.name ?? 'Non renseigné'}</p>
                <p><strong>Email :</strong> {property.user.email}</p>
            </section>
        </main>
    )
}