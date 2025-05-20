import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import PropertyGrid from '@/components/property/PropertyGrid/PropertyGrid'
import PropertyFilters from '@/components/property/PropertyFilters/PropertyFilters'
import styles from './page.module.css'

export default async function PropertiesPage({
                                                 searchParams,
                                             }: {
    searchParams: Record<string, string | string[] | undefined>
}) {
    const session = await getServerSession(authOptions)

    let favoriteIds: Set<string> = new Set()

    if (session?.user?.id) {
        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            select: { propertyId: true },
        })

        favoriteIds = new Set(favorites.map((f) => f.propertyId))
    }

    // ✅ Safe parsing des query params
    const city = typeof searchParams.city === 'string' ? searchParams.city : undefined
    const country = typeof searchParams.country === 'string' ? searchParams.country : undefined
    const type = typeof searchParams.type === 'string' ? searchParams.type : undefined
    const priceMin = searchParams.priceMin ? parseFloat(searchParams.priceMin as string) : undefined
    const priceMax = searchParams.priceMax ? parseFloat(searchParams.priceMax as string) : undefined
    const surfaceMin = searchParams.surfaceMin ? parseFloat(searchParams.surfaceMin as string) : undefined
    const surfaceMax = searchParams.surfaceMax ? parseFloat(searchParams.surfaceMax as string) : undefined
    const rooms = searchParams.rooms ? parseInt(searchParams.rooms as string) : undefined
    const bathrooms = searchParams.bathrooms ? parseInt(searchParams.bathrooms as string) : undefined
    const floor = searchParams.floor ? parseInt(searchParams.floor as string) : undefined
    const hasGarage =
        typeof searchParams.hasGarage === 'string' ? searchParams.hasGarage === 'true' : undefined

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
    ])

    const properties = await prisma.property.findMany({
        where: {
            status: 'PUBLISHED',
            ...(city && { city: { contains: city, mode: 'insensitive' } }),
            ...(country && { country: { contains: country, mode: 'insensitive' } }),
            ...(type && { type: { equals: type } }),
            ...(priceMin && { price: { gte: priceMin } }),
            ...(priceMax && { price: { lte: priceMax } }),
            ...(surfaceMin && { surface: { gte: surfaceMin } }),
            ...(surfaceMax && { surface: { lte: surfaceMax } }),
            ...(rooms && { rooms: { gte: rooms } }),
            ...(bathrooms && { bathrooms: { gte: bathrooms } }),
            ...(floor && { floor: { gte: floor } }),
            ...(hasGarage !== undefined && { hasGarage }),
        },
        include: {
            images: { take: 1 },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    const propertiesWithFavorite = properties.map((property) => ({
        ...property,
        isFavorite: favoriteIds.has(property.id),
    }))

    return (
        <main className="wrapper">
            <h1 className={styles.h1}>
                Find your <span className={styles.tag}>home</span>
            </h1>

            <PropertyFilters
                className={styles.filters}
                cities={cities.map((c) => c.city)}
                types={types.map((t) => t.type)}
                countries={countries.map((c) => c.country)}
            />

            <PropertyGrid className={styles.cards} properties={propertiesWithFavorite} />
        </main>
    )
}