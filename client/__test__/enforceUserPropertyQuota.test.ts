import { enforceUserPropertyQuota } from '@/lib/services/enforceUserPropertyQuota'
import { prisma } from '@/lib/prisma/prisma'

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        user: { findUnique: jest.fn() },
        property: { updateMany: jest.fn() },
    },
}))

const findUnique = prisma.user.findUnique as jest.Mock
const updateMany = prisma.property.updateMany as jest.Mock

function makeProps(n: number) {
    return Array.from({ length: n }, (_, i) => ({
        id: `p${i}`,
        createdAt: new Date(Date.now() - i * 1000).toISOString(),
    }))
}

describe('enforceUserPropertyQuota', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('retourne sans rien faire si user introuvable', async () => {
        findUnique.mockResolvedValue(null)

        await enforceUserPropertyQuota('u1')

        expect(findUnique).toHaveBeenCalledWith({
            where: { id: 'u1' },
            include: {
                properties: {
                    where: { status: { not: 'ARCHIVED' } },
                    orderBy: { createdAt: 'desc' },
                },
                sellerSubscription: true,
            },
        })
        expect(updateMany).not.toHaveBeenCalled()
    })

    it('free tier (pas d’abonnement valide) → max 1 : archive au-delà du 1er', async () => {
        const props = makeProps(3)
        findUnique.mockResolvedValue({
            id: 'u1',
            properties: props,
            sellerSubscription: null,
        })

        await enforceUserPropertyQuota('u1')

        expect(updateMany).toHaveBeenCalledWith({
            where: { id: { in: ['p1', 'p2'] } },
            data: { status: 'ARCHIVED' },
        })
    })

    it('abonnement ACTIVE plan seller_standard → max 10 : archive au-delà de 10', async () => {
        const props = makeProps(12)
        findUnique.mockResolvedValue({
            id: 'u1',
            properties: props,
            sellerSubscription: { status: 'active', plan: 'seller_standard', currentPeriodEnd: null },
        })

        await enforceUserPropertyQuota('u1')

        expect(updateMany).toHaveBeenCalledWith({
            where: { id: { in: ['p10', 'p11'] } },
            data: { status: 'ARCHIVED' },
        })
    })

    it('abonnement CANCELED mais période en cours → considéré valide (seller_intermediate → max 50)', async () => {
        const future = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
        const props = makeProps(52)
        findUnique.mockResolvedValue({
            id: 'u1',
            properties: props,
            sellerSubscription: { status: 'canceled', plan: 'seller_intermediate', currentPeriodEnd: future },
        })

        await enforceUserPropertyQuota('u1')

        expect(updateMany).toHaveBeenCalledWith({
            where: { id: { in: ['p50', 'p51'] } },
            data: { status: 'ARCHIVED' },
        })
    })

    it('abonnement CANCELED mais période expirée → revient au free tier (max 1)', async () => {
        const past = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
        const props = makeProps(2)
        findUnique.mockResolvedValue({
            id: 'u1',
            properties: props,
            sellerSubscription: { status: 'canceled', plan: 'seller_standard', currentPeriodEnd: past },
        })

        await enforceUserPropertyQuota('u1')

        expect(updateMany).toHaveBeenCalledWith({
            where: { id: { in: ['p1'] } },
            data: { status: 'ARCHIVED' },
        })
    })

    it('ne fait rien si le nombre de propriétés est ≤ à la limite', async () => {
        const props = makeProps(100)
        findUnique.mockResolvedValue({
            id: 'u1',
            properties: props,
            sellerSubscription: { status: 'active', plan: 'seller_advanced', currentPeriodEnd: null },
        })

        await enforceUserPropertyQuota('u1')

        expect(updateMany).not.toHaveBeenCalled()
    })
})