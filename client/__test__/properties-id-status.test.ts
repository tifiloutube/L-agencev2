import { PATCH } from '@/app/api/properties/[id]/status/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        property: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
        },
    },
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function jreq(url: string, method: string, body: any) {
    return new Request(url, { method, body: JSON.stringify(body) })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('PATCH /api/properties/[id]/status', () => {
    const params = { id: 'prop_1' }

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('401 si non authentifié', async () => {
        setSession(null)

        const res = await PATCH(
            jreq('http://localhost/api/properties/prop_1/status', 'PATCH', { status: 'PUBLISHED' }),
            { params }
        )
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
    })

    it('403 si non propriétaire', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            userId: 'user_B',
        })

        const res = await PATCH(
            jreq('http://localhost/api/properties/prop_1/status', 'PATCH', { status: 'PUBLISHED' }),
            { params }
        )
        expect(res.status).toBe(403)
        expect(await readJson(res)).toEqual({ error: 'Accès refusé' })
    })

    it('400 si statut invalide', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            userId: 'user_A',
        })

        const res = await PATCH(
            jreq('http://localhost/api/properties/prop_1/status', 'PATCH', { status: 'INVALID' }),
            { params }
        )
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Statut invalide' })
        expect(prisma.property.update).not.toHaveBeenCalled()
    })

    it('404 si user introuvable en publication', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            userId: 'user_A',
        })
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

        const res = await PATCH(
            jreq('http://localhost/api/properties/prop_1/status', 'PATCH', { status: 'PUBLISHED' }),
            { params }
        )
        expect(res.status).toBe(404)
        expect(await readJson(res)).toEqual({ error: 'Utilisateur introuvable' })
        expect(prisma.property.update).not.toHaveBeenCalled()
    })

    it('403 si quota atteint (abonnement actif, limite standard)', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            userId: 'user_A',
        })
        // Abonnement actif plan "seller_standard" => 10 max, déjà 10 publiés
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 'user_A',
            sellerSubscription: { status: 'active', plan: 'seller_standard', currentPeriodEnd: null },
            properties: Array.from({ length: 10 }, (_, i) => ({ id: `p${i}`, status: 'PUBLISHED' })),
        })

        const res = await PATCH(
            jreq('http://localhost/api/properties/prop_1/status', 'PATCH', { status: 'PUBLISHED' }),
            { params }
        )
        expect(res.status).toBe(403)
        const json = await readJson(res)
        expect(json.error).toMatch(/atteint votre limite de 10/)
        expect(prisma.property.update).not.toHaveBeenCalled()
    })

    it('200 pour ARCHIVED (pas de contrôle de quota) + update appelé', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            userId: 'user_A',
        })
        ;(prisma.property.update as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            status: 'ARCHIVED',
        })

        const res = await PATCH(
            jreq('http://localhost/api/properties/prop_1/status', 'PATCH', { status: 'ARCHIVED' }),
            { params }
        )
        expect(res.status).toBe(200)
        expect(prisma.user.findUnique).not.toHaveBeenCalled()
        expect(prisma.property.update).toHaveBeenCalledWith({
            where: { id: 'prop_1' },
            data: { status: 'ARCHIVED' },
        })
        expect(await readJson(res)).toEqual({
            message: 'Statut mis à jour',
            updated: { id: 'prop_1', status: 'ARCHIVED' },
        })
    })

    it('200 pour PUBLISHED si sous la limite', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            userId: 'user_A',
        })
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 'user_A',
            sellerSubscription: { status: 'active', plan: 'seller_standard', currentPeriodEnd: null },
            properties: [
                { id: 'a', status: 'PUBLISHED' },
                { id: 'b', status: 'PUBLISHED' },
                { id: 'c', status: 'PUBLISHED' },
            ],
        })
        ;(prisma.property.update as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            status: 'PUBLISHED',
        })

        const res = await PATCH(
            jreq('http://localhost/api/properties/prop_1/status', 'PATCH', { status: 'PUBLISHED' }),
            { params }
        )
        expect(res.status).toBe(200)
        expect(prisma.property.update).toHaveBeenCalledWith({
            where: { id: 'prop_1' },
            data: { status: 'PUBLISHED' },
        })
        expect(await readJson(res)).toEqual({
            message: 'Statut mis à jour',
            updated: { id: 'prop_1', status: 'PUBLISHED' },
        })
    })
})