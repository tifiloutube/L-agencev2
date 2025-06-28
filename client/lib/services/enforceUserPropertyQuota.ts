import { prisma } from '@/lib/prisma/prisma'

export async function enforceUserPropertyQuota(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            properties: {
                where: { status: { not: 'ARCHIVED' } },
                orderBy: { createdAt: 'desc' }, // Archiver les + récents
            },
            sellerSubscription: true,
        },
    })

    if (!user) return

    const { sellerSubscription, properties } = user

    const isValidSubscription =
        sellerSubscription &&
        (sellerSubscription.status === 'active' ||
            (sellerSubscription.status === 'canceled' &&
                sellerSubscription.currentPeriodEnd &&
                new Date(sellerSubscription.currentPeriodEnd) > new Date()))

    const planMap = {
        seller_standard: 'STANDARD',
        seller_intermediate: 'INTERMEDIATE',
        seller_advanced: 'ADVANCED',
    } as const

    const planLimits = {
        STANDARD: 10,
        INTERMEDIATE: 50,
        ADVANCED: 100,
    } as const

    const maxAllowed = isValidSubscription
        ? planLimits[planMap[sellerSubscription.plan as keyof typeof planMap]]
        : 1

    if (properties.length > maxAllowed) {
        const toArchive = properties.slice(maxAllowed)

        await prisma.property.updateMany({
            where: {
                id: { in: toArchive.map(p => p.id) },
            },
            data: { status: 'ARCHIVED' },
        })
    }
}