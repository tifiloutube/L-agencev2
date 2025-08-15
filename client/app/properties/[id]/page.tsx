import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import styles from './page.module.css'

import PropertyHeader from '@/components/property/PropertyHeader/PropertyHeader'
import PropertyGalleryAndSummary from '@/components/property/PropertyGalleryAndSummary/PropertyGalleryAndSummary'
import PropertyDetails from '@/components/property/PropertyDetails/PropertyDetails'
import PropertyOwnerContact from '@/components/property/PropertyOwnerContact/PropertyOwnerContact'
import PropertyMapSection from '@/components/property/PropertyMapSection/PropertyMapSection'

import type { Property, User, PropertyImage } from '@prisma/client'

type Props = { params: { id: string } }

type FullProperty = Property & {
    user: User
    images: PropertyImage[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const prop = await prisma.property.findUnique({
        where: { id: params.id },
        select: { id: true, title: true, city: true, country: true, description: true, price: true, status: true, transactionType: true, images: { select: { url: true }, take: 1 } },
    })

    if (!prop || prop.status !== 'PUBLISHED') {
        return { title: 'Bien non trouvé | La Crémaillère', description: "Ce bien n'est plus disponible." }
    }

    const txLabel = prop.transactionType === 'vente' ? 'À vendre' : prop.transactionType === 'location' ? 'À louer' : ''
    const where = prop.city ? ` à ${prop.city}` : prop.country ? ` en ${prop.country}` : ''
    const title = `${prop.title} — ${txLabel}${where} | La Crémaillère`
    const desc =
        (prop.description?.slice(0, 155) ?? `${txLabel}${where}.`) +
        (prop.price ? ` Prix : ${prop.price.toLocaleString('fr-FR')} €.` : '')
    const ogImg = prop.images[0]?.url || '/og-default.jpg'

    return {
        title,
        description: desc.trim(),
        alternates: { canonical: `/properties/${prop.id}` },
        openGraph: {
            type: 'article',
            url: `/properties/${prop.id}`,
            title,
            description: desc.trim(),
            images: [{ url: ogImg }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: desc.trim(),
            images: [ogImg],
        },
    }
}

export default async function PropertyDetailPage({ params }: Props) {
    const session = await getServerSession(authOptions)

    let isFavorite = false
    if (session?.user?.id) {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_propertyId: {
                    userId: session.user.id,
                    propertyId: params.id,
                },
            },
        })
        isFavorite = !!favorite
    }

    const property = (await prisma.property.findUnique({
        where: { id: params.id },
        include: { images: true, user: true },
    })) as FullProperty | null

    if (!property || property.status !== 'PUBLISHED') {
        notFound()
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.title,
        description: property.description,
        url: `/properties/${property.id}`,
        image: property.images?.map((i) => i.url) ?? [],
        address: {
            '@type': 'PostalAddress',
            streetAddress: property.address ?? undefined,
            addressLocality: property.city ?? undefined,
            postalCode: property.zipCode ?? undefined,
            addressCountry: property.country ?? undefined,
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: property.price,
            availability: 'https://schema.org/InStock',
        },
        areaServed: property.city ?? property.country ?? undefined,
    }

    return (
        <div className="wrapper" role="region">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <PropertyHeader title={property.title} />

            <PropertyGalleryAndSummary
                title={property.title}
                images={property.images}
                address={property.address}
                zipCode={property.zipCode}
                city={property.city}
                price={property.price}
                surface={property.surface}
                description={property.description}
                transactionType={property.transactionType as 'vente' | 'location'}
            />

            <section className={styles.container}>
                <PropertyOwnerContact
                    ownerName={property.user.name}
                    ownerEmail={property.user.email}
                    userId={property.user.id}
                    currentUserId={session?.user?.id}
                    propertyId={property.id}
                    isFavorite={isFavorite}
                />

                <PropertyDetails
                    id={property.id}
                    title={property.title}
                    latitude={property.latitude!}
                    longitude={property.longitude!}
                    transactionType={property.transactionType as 'vente' | 'location'}
                    price={property.price}
                    surface={property.surface}
                    rooms={property.rooms}
                    bathrooms={property.bathrooms}
                    hasGarage={property.hasGarage}
                    floor={property.floor}
                    address={property.address}
                    kitchenEquipped={property.kitchenEquipped}
                    terrace={property.terrace}
                    terraceCount={property.terraceCount}
                    terraceSurface={property.terraceSurface}
                    balcony={property.balcony}
                    balconyCount={property.balconyCount}
                    balconySurface={property.balconySurface}
                    garden={property.garden}
                    pool={property.pool}
                    disabledAccess={property.disabledAccess}
                    basement={property.basement}
                    constructionYear={property.constructionYear}
                    landSurface={property.landSurface}
                    condition={property.condition}
                    energyConsumption={property.energyConsumption}
                    greenhouseGasEmission={property.greenhouseGasEmission}
                    finalEnergyConsumption={property.finalEnergyConsumption}
                    energyCostMin={property.energyCostMin}
                    energyCostMax={property.energyCostMax}
                    energyIndexDate={property.energyIndexDate}
                />
            </section>

            {property.latitude !== null && property.longitude !== null && (
                <section className={styles.map} aria-label="Localisation du bien">
                    <PropertyMapSection
                        id={property.id}
                        title={property.title}
                        price={property.price}
                        latitude={property.latitude}
                        longitude={property.longitude}
                    />
                </section>
            )}
        </div>
    )
}