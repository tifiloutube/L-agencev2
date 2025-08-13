import { POST } from '@/app/api/stripe/webhook/route'
import { prisma } from '@/lib/prisma/prisma'
import Stripe from 'stripe'

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        sellerSubscription: { upsert: jest.fn() },
    },
}))

jest.mock('stripe', () => {
    const __stripeInstance = {
        webhooks: { constructEvent: jest.fn() },
        subscriptions: { retrieve: jest.fn() },
    }
    const mockCtor = jest.fn(() => __stripeInstance)
    return { __esModule: true, default: mockCtor, __stripeInstance }
})

function stripeMock() {
    const m = jest.requireMock('stripe') as any
    return m.__stripeInstance as {
        webhooks: { constructEvent: jest.Mock }
        subscriptions: { retrieve: jest.Mock }
    }
}

function makeReq(body: Uint8Array, headers: Record<string, string> = {}) {
    return new Request('http://localhost/api/stripe/webhook', {
        method: 'POST',
        body,
        headers: {
            'stripe-signature': 't=123,v1=abc',
            ...headers,
        },
    })
}

async function readText(res: Response) {
    try { return await res.text() } catch { return '' }
}

describe('POST /api/stripe/webhook', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('400 — signature Stripe invalide', async () => {
        stripeMock().webhooks.constructEvent.mockImplementation(() => {
            throw new Error('bad sig')
        })

        const res = await POST(makeReq(new TextEncoder().encode('x')))
        expect(res.status).toBe(400)
        expect(await readText(res)).toBe('Webhook error')
        expect(prisma.sellerSubscription.upsert).not.toHaveBeenCalled()
    })

    it('200 — ignore les événements non ciblés', async () => {
        stripeMock().webhooks.constructEvent.mockReturnValue({
            type: 'invoice.paid',
            data: { object: {} },
        } as Stripe.Event)

        const res = await POST(makeReq(new TextEncoder().encode('payload')))
        expect(res.status).toBe(200)
        expect(await readText(res)).toBe('OK')
        expect(prisma.sellerSubscription.upsert).not.toHaveBeenCalled()
    })

    it('400 — metadata manquante pour checkout.session.completed', async () => {
        stripeMock().webhooks.constructEvent.mockReturnValue({
            type: 'checkout.session.completed',
            data: { object: {
                    customer: 'cus_123',
                    subscription: 'sub_123',
                    metadata: {},
                } },
        } as unknown as Stripe.Event)

        const res = await POST(makeReq(new TextEncoder().encode('payload')))
        expect(res.status).toBe(400)
        expect(await readText(res)).toBe('Missing data')
        expect(prisma.sellerSubscription.upsert).not.toHaveBeenCalled()
    })

    it('200 — enregistre/maj la souscription en DB (happy path)', async () => {
        const epoch = 1_700_000_000 // secondes
        stripeMock().webhooks.constructEvent.mockReturnValue({
            type: 'checkout.session.completed',
            data: { object: {
                    customer: 'cus_123',
                    subscription: 'sub_123',
                    metadata: {
                        userId: 'u1',
                        plan: 'seller_standard',
                        maxProperties: '10',
                        priceId: 'price_1',
                    },
                } },
        } as unknown as Stripe.Event)

        stripeMock().subscriptions.retrieve.mockResolvedValue({
            current_period_end: epoch,
        })

        const res = await POST(makeReq(new TextEncoder().encode('payload')))
        expect(res.status).toBe(200)
        expect(await readText(res)).toBe('OK')

        expect(stripeMock().subscriptions.retrieve).toHaveBeenCalledWith('sub_123')

        expect(prisma.sellerSubscription.upsert).toHaveBeenCalledWith({
            where: { userId: 'u1' },
            update: expect.objectContaining({
                plan: 'seller_standard',
                stripeSubscriptionId: 'sub_123',
                stripeCustomerId: 'cus_123',
                maxProperties: 10,
                priceId: 'price_1',
                status: 'active',
                currentPeriodEnd: new Date(epoch * 1000),
            }),
            create: expect.objectContaining({
                userId: 'u1',
                plan: 'seller_standard',
                stripeSubscriptionId: 'sub_123',
                stripeCustomerId: 'cus_123',
                maxProperties: 10,
                priceId: 'price_1',
                status: 'active',
                currentPeriodEnd: new Date(epoch * 1000),
            }),
        })
    })
})