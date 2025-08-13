import { POST } from '@/app/api/simulation/save/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'

// ---- Mocks ----
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        simulation: { upsert: jest.fn() },
    },
}))

// ---- Helpers ----
function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function jreq(body: any) {
    return new Request('http://localhost/api/simulation/save', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('POST /api/simulation/save', () => {
    beforeEach(() => jest.resetAllMocks())

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await POST(jreq({}))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
        expect(prisma.simulation.upsert).not.toHaveBeenCalled()
    })

    it('400 si paramètres invalides (types incorrects ou manquants)', async () => {
        setSession('u1')
        // amount ok, le reste manquant/incorrect -> doit retourner 400
        const res = await POST(jreq({ amount: 200000, isEligible: 'yes' }))
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Paramètres invalides' })
        expect(prisma.simulation.upsert).not.toHaveBeenCalled()
    })

    it('200 — upsert avec payload valide', async () => {
        setSession('u1')
        const payload = {
                amount: 250000,
                contribution: 40000,
                income: 4500,
                duration: 300,
                rate: 3.2,
                monthly: 1200,
                isEligible: true,
            }

        ;(prisma.simulation.upsert as jest.Mock).mockResolvedValue({
            userId: 'u1',
            ...payload,
        })

        const res = await POST(jreq(payload))
        expect(res.status).toBe(200)

        // Vérifie l’appel upsert avec where/update/create corrects
        expect(prisma.simulation.upsert).toHaveBeenCalledWith({
            where: { userId: 'u1' },
            update: expect.objectContaining({
                ...payload,
                createdAt: expect.any(Date),
            }),
            create: { userId: 'u1', ...payload },
        })

        expect(await readJson(res)).toEqual({
            success: true,
            simulation: { userId: 'u1', ...payload },
        })
    })
})