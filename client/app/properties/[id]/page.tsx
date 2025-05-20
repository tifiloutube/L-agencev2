import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import styles from './page.module.css'

import PropertyHeader from '@/components/property/PropertyHeader/PropertyHeader'
import PropertyGalleryAndSummary from '@/components/property/PropertyGalleryAndSummary/PropertyGalleryAndSummary'
import PropertyDetails from '@/components/property/PropertyDetails/PropertyDetails'
import PropertyOwnerContact from '@/components/property/PropertyOwnerContact/PropertyOwnerContact'

import type { Property, User, PropertyImage } from '@prisma/client'

type Props = {
    params: { id: string }
}

type FullProperty = Property & {
    user: User
    images: PropertyImage[]
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

    const property = await prisma.property.findUnique({
        where: { id: params.id },
        include: {
            images: true,
            user: true,
        },
    }) as FullProperty

    if (!property || property.status !== 'PUBLISHED') {
        notFound()
    }

    return (
        <main className="wrapper">
            <PropertyHeader title={property.title} />

            <PropertyGalleryAndSummary
                title={property.title}
                images={property.images}
                address={property.address}
                zipCode={property.zipCode}
                city={property.city}
                country={property.country}
                price={property.price}
                description={property.description}
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
                    transactionType={property.transactionType as 'vente' | 'location' }
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
        </main>
    )
}
