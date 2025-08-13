import { POST } from '@/app/api/stripe/change-subscription/route'
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
        subscriptions: {
            retrieve: jest.fn(),
            update: jest.fn(),
        },
    }
    const mockCtor = jest.fn(() => __stripeInstance)
    return { __esModule: true, default: mockCtor, __stripeInstance }
})

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function jreq(body: any) {
    return new Request('http://localhost/api/stripe/change-subscription', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}
function stripeMock() {
    const m = jest.requireMock('stripe') as any
    return m.__stripeInstance as {
        subscriptions: { retrieve: jest.Mock; update: jest.Mock }
    }
}

describe('POST /api/stripe/change-subscription', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await POST(jreq({ priceId: 'price_1', plan: 'seller_standard', maxProperties: 10 }))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
        expect(prisma.sellerSubscription.findUnique).not.toHaveBeenCalled()
    })

    it("400 si aucun abonnement actif n'est trouvé", async () => {
        setSession('u1')
        ;(prisma.sellerSubscription.findUnique as jest.Mock).mockResolvedValue(null)

        const res = await POST(jreq({ priceId: 'price_1', plan: 'seller_standard', maxProperties: 10 }))
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Aucun abonnement actif' })
    })

    it("400 si l'abonnement Stripe ne contient aucun item", async () => {
        setSession('u1')
        ;(prisma.sellerSubscription.findUnique as jest.Mock).mockResolvedValue({
            userId: 'u1',
            stripeSubscriptionId: 'sub_123',
            status: 'active',
        })
        stripeMock().subscriptions.retrieve.mockResolvedValue({ items: { data: [] } })

        const res = await POST(jreq({ priceId: 'price_2', plan: 'seller_intermediate', maxProperties: 50 }))
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Aucun item trouvé dans la souscription' })
        expect(stripeMock().subscriptions.update).not.toHaveBeenCalled()
    })

    it('200 — met à jour le plan Stripe et la DB', async () => {
        setSession('u1')
        ;(prisma.sellerSubscription.findUnique as jest.Mock).mockResolvedValue({
            userId: 'u1',
            stripeSubscriptionId: 'sub_123',
            status: 'active',
        })
        stripeMock().subscriptions.retrieve.mockResolvedValue({
            items: { data: [{ id: 'si_abc' }] },
        })
        ;(prisma.sellerSubscription.update as jest.Mock).mockResolvedValue({})

        const body = { priceId: 'price_new', plan: 'seller_advanced', maxProperties: 100 }
        const res = await POST(jreq(body))
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ success: true })

        // Stripe: update sur le bon item + proration
        expect(stripeMock().subscriptions.update).toHaveBeenCalledWith('sub_123', {
            items: [{ id: 'si_abc', price: 'price_new' }],
            proration_behavior: 'create_prorations',
        })

        // DB: update plan/priceId/maxProperties
        expect(prisma.sellerSubscription.update).toHaveBeenCalledWith({
            where: { userId: 'u1' },
            data: { plan: 'seller_advanced', priceId: 'price_new', maxProperties: 100 },
        })
    })

    it('500 — si Stripe renvoie une erreur', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
        setSession('u1')
        ;(prisma.sellerSubscription.findUnique as jest.Mock).mockResolvedValue({
            userId: 'u1',
            stripeSubscriptionId: 'sub_123',
            status: 'active',
        })
        stripeMock().subscriptions.retrieve.mockResolvedValue({
            items: { data: [{ id: 'si_abc' }] },
        })
        stripeMock().subscriptions.update.mockRejectedValue(new Error('stripe down'))

        const res = await POST(jreq({ priceId: 'price_new', plan: 'seller_standard', maxProperties: 10 }))
        expect(res.status).toBe(500)
        expect(await readJson(res)).toEqual({ error: 'Erreur serveur Stripe' })

        spy.mockRestore()
    })
})