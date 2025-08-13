import { POST } from '@/app/api/stripe/reactivate-subscription/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'
import Stripe from 'stripe'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        sellerSubscription: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}))

jest.mock('stripe', () => {
    const __stripeInstance = {
        subscriptions: { update: jest.fn() },
    }
    const mockCtor = jest.fn(() => __stripeInstance)
    return { __esModule: true, default: mockCtor, __stripeInstance }
})

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}
function stripeMock() {
    const m = jest.requireMock('stripe') as any
    return m.__stripeInstance as { subscriptions: { update: jest.Mock } }
}

describe('POST /api/stripe/reactivate-subscription', () => {
    beforeEach(() => jest.resetAllMocks())

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await POST()
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
        expect(stripeMock().subscriptions.update).not.toHaveBeenCalled()
        expect(prisma.sellerSubscription.update).not.toHaveBeenCalled()
    })

    it("400 si aucun abonnement n'est trouvé", async () => {
        setSession('u1')
        ;(prisma.sellerSubscription.findUnique as jest.Mock).mockResolvedValue(null)

        const res = await POST()
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Aucun abonnement trouvé' })
        expect(stripeMock().subscriptions.update).not.toHaveBeenCalled()
    })

    it('200 — réactive la souscription et met le statut à active', async () => {
        setSession('u1')
        ;(prisma.sellerSubscription.findUnique as jest.Mock).mockResolvedValue({
            userId: 'u1',
            stripeSubscriptionId: 'sub_123',
            status: 'canceled',
        })
        ;(prisma.sellerSubscription.update as jest.Mock).mockResolvedValue({})

        const res = await POST()
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ success: true })

        expect(stripeMock().subscriptions.update).toHaveBeenCalledWith('sub_123', {
            cancel_at_period_end: false,
        })
        expect(prisma.sellerSubscription.update).toHaveBeenCalledWith({
            where: { userId: 'u1' },
            data: { status: 'active' },
        })
    })

    it('500 — si Stripe.update lève une erreur', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
        setSession('u1')
        ;(prisma.sellerSubscription.findUnique as jest.Mock).mockResolvedValue({
            userId: 'u1',
            stripeSubscriptionId: 'sub_123',
            status: 'canceled',
        })
        stripeMock().subscriptions.update.mockRejectedValue(new Error('stripe down'))

        const res = await POST()
        expect(res.status).toBe(500)
        expect(await readJson(res)).toEqual({ error: 'Erreur serveur' })

        spy.mockRestore()
    })
})