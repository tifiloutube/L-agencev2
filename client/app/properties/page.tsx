import { prisma } from '@/lib/prisma';
import PropertyGrid from '@/components/property/PropertyGrid/PropertyGrid';
import PropertyFilters from '@/components/property/PropertyFilters/PropertyFilters';

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
    const {
        city,
        country,
        type,
        priceMin,
        priceMax,
        surfaceMin,
        surfaceMax,
        rooms,
        bathrooms,
        floor,
        hasGarage,
    } = searchParams;

    // 🔄 Get unique values for dynamic filters
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
            ...(city && { city: { contains: city, mode: 'insensitive' } }),
            ...(country && { country: { contains: country, mode: 'insensitive' } }),
            ...(type && { type: { equals: type } }),
            ...(priceMin && { price: { gte: parseFloat(priceMin) } }),
            ...(priceMax && { price: { lte: parseFloat(priceMax) } }),
            ...(surfaceMin && { surface: { gte: parseFloat(surfaceMin) } }),
            ...(surfaceMax && { surface: { lte: parseFloat(surfaceMax) } }),
            ...(rooms && { rooms: { gte: parseInt(rooms) } }),
            ...(bathrooms && { bathrooms: { gte: parseInt(bathrooms) } }),
            ...(floor && { floor: { gte: parseInt(floor) } }),
            ...(hasGarage !== undefined &&
                hasGarage !== '' && {
                    hasGarage: hasGarage === 'true',
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

    return (
        <main className="wrapper" style={{ paddingBlock: '40px' }}>
            <h1>Biens disponibles</h1>
            <PropertyFilters
                cities={cities.map((c) => c.city)}
                types={types.map((t) => t.type)}
                countries={countries.map((c) => c.country)}
            />
            <PropertyGrid properties={properties} />
        </main>
    );
}