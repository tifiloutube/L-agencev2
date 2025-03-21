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

    // Aucun abonnement : 1 bien autorisé
    if (!user.sellerSubscription) {
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

    const planLimits = {
        STANDARD: 10,
        INTERMEDIATE: 50,
        ADVANCED: 100,
    } as const

    const plan = user.sellerSubscription.plan as keyof typeof planLimits
    const maxAllowed = planLimits[plan]

    if (propertyCount >= maxAllowed) {
        return {
            canPost: false,
            reason: `Limite atteinte pour l'abonnement ${plan} (${maxAllowed} biens max)`,
            maxAllowed,
        }
    }

    return {
        canPost: true,
        maxAllowed,
    }
}