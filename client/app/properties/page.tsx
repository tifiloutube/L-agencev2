import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import PropertyPageContent from '@/components/property/PropertyPageContent/PropertyPageContent'

export function generateMetadata(
    { searchParams }: { searchParams: Record<string, string | string[] | undefined> }
): Metadata {
    const tx =
        typeof searchParams.transactionType === 'string' &&
        ['vente', 'location'].includes(searchParams.transactionType)
            ? (searchParams.transactionType as 'vente' | 'location')
            : undefined

    const city = typeof searchParams.city === 'string' ? searchParams.city : undefined
    const country = typeof searchParams.country === 'string' ? searchParams.country : undefined
    const type = typeof searchParams.type === 'string' ? searchParams.type : undefined

    const parts: string[] = []
    if (type) parts.push(type)
    parts.push('Biens')
    if (tx === 'vente') parts.push('à vendre')
    if (tx === 'location') parts.push('à louer')
    if (city) parts.push(`à ${city}`)
    else if (country) parts.push(`en ${country}`)

    const title = `${parts.join(' ')} | La Crémaillère`
    const desc = `Explorez ${
        type ? `${type.toLowerCase()} ` : 'les biens '
    }${tx === 'vente' ? 'à vendre' : tx === 'location' ? 'à louer' : ''}${
        city ? ` à ${city}` : country ? ` en ${country}` : ''
    }. Filtrez par prix, surface, pièces et plus.`.replace(/\s+/g, ' ').trim()

    return {
        title,
        description: desc,
        alternates: { canonical: '/properties' },
        openGraph: {
            title,
            description: desc,
            url: '/properties',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: desc,
        },
    }
}

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

    const transactionType =
        typeof searchParams.transactionType === 'string' &&
        ['vente', 'location'].includes(searchParams.transactionType)
            ? (searchParams.transactionType as 'vente' | 'location')
            : undefined

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
    const hasGarage = typeof searchParams.hasGarage === 'string' ? searchParams.hasGarage === 'true' : undefined

    const [cities, types, countries] = await Promise.all([
        prisma.property.findMany({ where: { status: 'PUBLISHED' }, select: { city: true }, distinct: ['city'] }),
        prisma.property.findMany({ where: { status: 'PUBLISHED' }, select: { type: true }, distinct: ['type'] }),
        prisma.property.findMany({ where: { status: 'PUBLISHED' }, select: { country: true }, distinct: ['country'] }),
    ])

    const properties = await prisma.property.findMany({
        where: {
            status: 'PUBLISHED',
            ...(transactionType && { transactionType }),
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
        include: { images: { take: 1 } },
        orderBy: { createdAt: 'desc' },
    })

    const propertiesWithFavorite = properties.map((property) => ({
        ...property,
        isFavorite: favoriteIds.has(property.id),
    }))

    return (
        <PropertyPageContent
            properties={propertiesWithFavorite}
            cities={cities.map((c) => c.city)}
            types={types.map((t) => t.type)}
            countries={countries.map((c) => c.country)}
        />
    )
}