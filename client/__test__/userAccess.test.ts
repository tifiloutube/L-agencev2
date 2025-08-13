import { checkUserCanPostProperty } from '@/lib/services/userAccess'
import { prisma } from '@/lib/prisma/prisma'

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        user: { findUnique: jest.fn() },
    },
}))

describe('checkUserCanPostProperty', () => {
    const findUnique = prisma.user.findUnique as jest.Mock

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('retourne canPost:false si utilisateur introuvable', async () => {
        findUnique.mockResolvedValue(null)

        const res = await checkUserCanPostProperty('u1')
        expect(res).toEqual({
            canPost: false,
            reason: 'Utilisateur introuvable',
        })
        expect(findUnique).toHaveBeenCalledWith({
            where: { id: 'u1' },
            include: { properties: true, sellerSubscription: true },
        })
    })

    describe('sans abonnement valide → palier gratuit (1 bien)', () => {
        it('canPost:true si 0 bien', async () => {
            findUnique.mockResolvedValue({
                id: 'u1',
                properties: [],
                sellerSubscription: null,
            })

            const res = await checkUserCanPostProperty('u1')
            expect(res).toEqual({ canPost: true, maxAllowed: 1 })
        })

        it('canPost:false si déjà 1 bien', async () => {
            findUnique.mockResolvedValue({
                id: 'u1',
                properties: [{ id: 'p1' }],
                sellerSubscription: null,
            })

            const res = await checkUserCanPostProperty('u1')
            expect(res.canPost).toBe(false)
            expect(res.maxAllowed).toBe(1)
            expect(res.reason).toContain('Limite gratuite atteinte')
        })

        it('“canceled” avec période expirée → considéré invalide (retour palier gratuit)', async () => {
            const past = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
            findUnique.mockResolvedValue({
                id: 'u1',
                properties: [{ id: 'p1' }],
                sellerSubscription: {
                    status: 'canceled',
                    currentPeriodEnd: past,
                    plan: 'seller_standard',
                },
            })

            const res = await checkUserCanPostProperty('u1')
            expect(res.canPost).toBe(false)
            expect(res.maxAllowed).toBe(1)
        })
    })

    describe('abonnement valide (active)', () => {
        it('STANDARD (seller_standard) → max 10 : OK si < 10', async () => {
            findUnique.mockResolvedValue({
                id: 'u1',
                properties: Array.from({ length: 9 }, (_, i) => ({ id: `p${i}` })),
                sellerSubscription: {
                    status: 'active',
                    currentPeriodEnd: null,
                    plan: 'seller_standard',
                },
            })

            const res = await checkUserCanPostProperty('u1')
            expect(res).toEqual({ canPost: true, maxAllowed: 10 })
        })

        it('STANDARD → refus si = 10', async () => {
            findUnique.mockResolvedValue({
                id: 'u1',
                properties: Array.from({ length: 10 }, (_, i) => ({ id: `p${i}` })),
                sellerSubscription: {
                    status: 'active',
                    currentPeriodEnd: null,
                    plan: 'seller_standard',
                },
            })

            const res = await checkUserCanPostProperty('u1')
            expect(res.canPost).toBe(false)
            expect(res.maxAllowed).toBe(10)
            expect(res.reason).toContain('Limite atteinte')
            expect(res.reason).toContain('STANDARD')
        })

        it('INTERMEDIATE (seller_intermediate) → max 50', async () => {
            findUnique.mockResolvedValue({
                id: 'u1',
                properties: Array.from({ length: 49 }, (_, i) => ({ id: `p${i}` })),
                sellerSubscription: {
                    status: 'active',
                    currentPeriodEnd: null,
                    plan: 'seller_intermediate',
                },
            })

            const res = await checkUserCanPostProperty('u1')
            expect(res).toEqual({ canPost: true, maxAllowed: 50 })
        })

        it('ADVANCED (seller_advanced) → max 100', async () => {
            findUnique.mockResolvedValue({
                id: 'u1',
                properties: Array.from({ length: 100 }, (_, i) => ({ id: `p${i}` })), // pile la limite → refus
                sellerSubscription: {
                    status: 'active',
                    currentPeriodEnd: null,
                    plan: 'seller_advanced',
                },
            })

            const res = await checkUserCanPostProperty('u1')
            expect(res.canPost).toBe(false)
            expect(res.maxAllowed).toBe(100)
            expect(res.reason).toContain('ADVANCED')
        })
    })

    describe('abonnement canceled encore valable (période en cours)', () => {
        it('canceled + currentPeriodEnd futur → traité comme valide', async () => {
            const future = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString()
            findUnique.mockResolvedValue({
                id: 'u1',
                properties: Array.from({ length: 49 }, (_, i) => ({ id: `p${i}` })), // < 50
                sellerSubscription: {
                    status: 'canceled',
                    currentPeriodEnd: future,
                    plan: 'seller_intermediate',
                },
            })

            const res = await checkUserCanPostProperty('u1')
            expect(res).toEqual({ canPost: true, maxAllowed: 50 })
        })
    })
})