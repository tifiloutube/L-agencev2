import { prisma } from '@/lib/prisma'

export async function checkUserCanPostProperty(userId: string): Promise<{
    canPost: boolean
    reason?: string
    maxAllowed?: number
}> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            properties: true,
            sellerSubscription: true,
        },
    })

    if (!user) {
        return {
            canPost: false,
            reason: 'Utilisateur introuvable',
        }
    }

    const propertyCount = user.properties.length
    const subscription = user.sellerSubscription

    const isValidSubscription =
        subscription &&
        (subscription.status === 'active' ||
            (subscription.status === 'canceled' &&
                subscription.currentPeriodEnd &&
                new Date(subscription.currentPeriodEnd) > new Date()))

    // Pas d'abonnement actif/valide => 1 bien gratuit
    if (!isValidSubscription) {
        if (propertyCount >= 1) {
            return {
                canPost: false,
                reason: 'Limite gratuite atteinte (1 bien maximum)',
                maxAllowed: 1,
            }
        }

        return {
            canPost: true,
            maxAllowed: 1,
        }
    }

    // 💡 Mapping entre plan Stripe et plan logique
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

    const rawPlan = subscription.plan as keyof typeof planMap
    const mappedPlan = planMap[rawPlan] as keyof typeof planLimits
    const maxAllowed = planLimits[mappedPlan]

    if (propertyCount >= maxAllowed) {
        return {
            canPost: false,
            reason: `Limite atteinte pour l'abonnement ${mappedPlan} (${maxAllowed} biens max)`,
            maxAllowed,
        }
    }

    return {
        canPost: true,
        maxAllowed,
    }
}