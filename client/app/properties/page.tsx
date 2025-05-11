import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import PropertyGrid from '@/components/property/PropertyGrid/PropertyGrid';
import PropertyFilters from '@/components/property/PropertyFilters/PropertyFilters';
import styles from './page.module.css'

interface SearchParams {
    city?: string;
    country?: string;
    type?: string;
    priceMin?: string;
    priceMax?: string;
    surfaceMin?: string;
    surfaceMax?: string;
    rooms?: string;
    bathrooms?: string;
    floor?: string;
    hasGarage?: string;
}

export default async function PropertiesPage({
                                                 searchParams,
                                             }: {
    searchParams: SearchParams;
}) {
    const session = await getServerSession(authOptions)

    let favoriteIds: Set<string> = new Set()

    if (session?.user?.id) {
        const favorites = await prisma.favorite.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                propertyId: true,
            },
        })

        favoriteIds = new Set(favorites.map((f) => f.propertyId))
    }

    const [cities, types, countries] = await Promise.all([
        prisma.property.findMany({
            where: { status: 'PUBLISHED' },
            select: { city: true },
            distinct: ['city'],
        }),
        prisma.property.findMany({
            where: { status: 'PUBLISHED' },
            select: { type: true },
            distinct: ['type'],
        }),
        prisma.property.findMany({
            where: { status: 'PUBLISHED' },
            select: { country: true },
            distinct: ['country'],
        }),
    ]);

    const properties = await prisma.property.findMany({
        where: {
            status: 'PUBLISHED',
            ...(searchParams.city && { city: { contains: searchParams.city, mode: 'insensitive' } }),
            ...(searchParams.country && { country: { contains: searchParams.country, mode: 'insensitive' } }),
            ...(searchParams.type && { type: { equals: searchParams.type } }),
            ...(searchParams.priceMin && { price: { gte: parseFloat(searchParams.priceMin) } }),
            ...(searchParams.priceMax && { price: { lte: parseFloat(searchParams.priceMax) } }),
            ...(searchParams.surfaceMin && { surface: { gte: parseFloat(searchParams.surfaceMin) } }),
            ...(searchParams.surfaceMax && { surface: { lte: parseFloat(searchParams.surfaceMax) } }),
            ...(searchParams.rooms && { rooms: { gte: parseInt(searchParams.rooms) } }),
            ...(searchParams.bathrooms && { bathrooms: { gte: parseInt(searchParams.bathrooms) } }),
            ...(searchParams.floor && { floor: { gte: parseInt(searchParams.floor) } }),
            ...(searchParams.hasGarage !== undefined &&
                searchParams.hasGarage !== '' && {
                    hasGarage: searchParams.hasGarage === 'true',
                }),
        },
        include: {
            images: {
                take: 1,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const propertiesWithFavorite = properties.map((property) => ({
        ...property,
        isFavorite: favoriteIds.has(property.id),
    }));

    return (
        <main className="wrapper" style={{ paddingBlock: '40px' }}>
            <h1 className={styles.h1}>Find your <span className={styles.tag}>home</span></h1>

            <PropertyFilters
                className={styles.filters}
                cities={cities.map((c) => c.city)}
                types={types.map((t) => t.type)}
                countries={countries.map((c) => c.country)}
            />

            <PropertyGrid
                className={styles.cards}
                properties={propertiesWithFavorite}
            />
        </main>
    );
}