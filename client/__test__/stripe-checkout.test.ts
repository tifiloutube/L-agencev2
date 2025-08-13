import { POST } from '@/app/api/stripe/checkout/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'
import Stripe from 'stripe'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        user: { findUnique: jest.fn(), update: jest.fn() },
    },
}))

jest.mock('stripe', () => {
    const __stripeInstance = {
        customers: { create: jest.fn() },
        checkout: { sessions: { create: jest.fn() } },
    }
    const mockCtor = jest.fn(() => __stripeInstance)
    return { __esModule: true, default: mockCtor, __stripeInstance }
})

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}

function nreq(origin: string, body: any) {
    const req = new Request(`${origin}/api/stripe/checkout`, {
        method: 'POST',
        body: JSON.stringify(body),
    }) as any
    req.nextUrl = { origin }
    return req as Request & { nextUrl: { origin: string } }
}

async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

function stripeMock() {
    const m = jest.requireMock('stripe') as any
    return m.__stripeInstance as {
        customers: { create: jest.Mock }
        checkout: { sessions: { create: jest.Mock } }
    }
}

describe('POST /api/stripe/checkout', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('401 si non authentifié', async () => {
        setSession(null)

        const res = await POST(nreq('http://localhost', { priceId: 'price_1', plan: 'seller_standard', maxProperties: 10 }))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })

        expect(prisma.user.findUnique).not.toHaveBeenCalled()
        expect(stripeMock().customers.create).not.toHaveBeenCalled()
        expect(stripeMock().checkout.sessions.create).not.toHaveBeenCalled()
    })

    it('404 si utilisateur introuvable', async () => {
        setSession('u1')
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

        const res = await POST(nreq('http://localhost', { priceId: 'price_1', plan: 'seller_standard', maxProperties: 10 }))
        expect(res.status).toBe(404)
        expect(await readJson(res)).toEqual({ error: 'Utilisateur non trouvé' })
    })

    it('200 — client Stripe déjà existant (pas de customers.create)', async () => {
        setSession('u1')
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            stripeCustomerId: 'cus_123',
        })
        stripeMock().checkout.sessions.create.mockResolvedValue({ url: 'https://stripe.session/abc' })

        const body = { priceId: 'price_x', plan: 'seller_standard', maxProperties: 10 }
        const res = await POST(nreq('http://localhost', body))
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ url: 'https://stripe.session/abc' })

        expect(stripeMock().customers.create).not.toHaveBeenCalled()

        expect(stripeMock().checkout.sessions.create).toHaveBeenCalledWith({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: 'cus_123',
            line_items: [{ price: 'price_x', quantity: 1 }],
            success_url: 'http://localhost/account?success=true',
            cancel_url: 'http://localhost/account?canceled=true',
            metadata: {
                plan: 'seller_standard',
                userId: 'u1',
                maxProperties: '10',
                priceId: 'price_x',
            },
        })
        expect(prisma.user.update).not.toHaveBeenCalled()
    })

    it('200 — crée un client Stripe si absent puis la session (update DB)', async () => {
        setSession('u1')
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            stripeCustomerId: null,
        })
        stripeMock().customers.create.mockResolvedValue({ id: 'cus_new' })
        ;(prisma.user.update as jest.Mock).mockResolvedValue({})
        stripeMock().checkout.sessions.create.mockResolvedValue({ url: 'https://stripe.session/new' })

        const body = { priceId: 'price_new', plan: 'seller_intermediate', maxProperties: 50 }
        const res = await POST(nreq('http://localhost', body))
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ url: 'https://stripe.session/new' })

        expect(stripeMock().customers.create).toHaveBeenCalledWith({
            email: 'a@b.com',
            metadata: { userId: 'u1' },
        })

        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 'u1' },
            data: { stripeCustomerId: 'cus_new' },
        })

        expect(stripeMock().checkout.sessions.create).toHaveBeenCalledWith({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: 'cus_new',
            line_items: [{ price: 'price_new', quantity: 1 }],
            success_url: 'http://localhost/account?success=true',
            cancel_url: 'http://localhost/account?canceled=true',
            metadata: {
                plan: 'seller_intermediate',
                userId: 'u1',
                maxProperties: '50',
                priceId: 'price_new',
            },
        })
    })

    it('500 — si Stripe.sessions.create lève une erreur', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
        setSession('u1')
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            stripeCustomerId: 'cus_123',
        })
        stripeMock().checkout.sessions.create.mockRejectedValue(new Error('stripe down'))

        const res = await POST(nreq('http://localhost', { priceId: 'price_x', plan: 'seller_standard', maxProperties: 10 }))
        expect(res.status).toBe(500)
        expect(await readJson(res)).toEqual({ error: 'Erreur serveur Stripe' })

        spy.mockRestore()
    })
})