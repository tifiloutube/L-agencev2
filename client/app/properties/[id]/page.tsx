import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import styles from './page.module.css'

import PropertyHeader from "@/components/property/PropertyHeader/PropertyHeader";
import PropertyGalleryAndSummary from '@/components/property/PropertyGalleryAndSummary/PropertyGalleryAndSummary';
import PropertyDetails from "@/components/property/PropertyDetails/PropertyDetails";
import PropertyOwnerContact from '@/components/property/PropertyOwnerContact/PropertyOwnerContact';

type Props = {
    params: { id: string }
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
    })

    if (!property || property.status !== 'PUBLISHED') {
        notFound()
    }

    return (
        <main className="wrapper">
            <PropertyHeader
                title={property.title}
            />

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
                    surface={property.surface}
                    rooms={property.rooms}
                    bathrooms={property.bathrooms}
                    hasGarage={property.hasGarage}
                    floor={property.floor}
                    address={property.address}
                    description={property.description}
                />
            </section>
        </main>
    )
}