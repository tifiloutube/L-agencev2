import { GET } from '@/app/api/simulation/latest/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        simulation: { findUnique: jest.fn() },
    },
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('GET /api/simulation/latest', () => {
    beforeEach(() => jest.resetAllMocks())

    it('200 — non authentifié → simulation:null', async () => {
        setSession(null)

        const res = await GET()
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ simulation: null })
        expect(prisma.simulation.findUnique).not.toHaveBeenCalled()
    })

    it('200 — authentifié → renvoie la simulation', async () => {
        setSession('u1')
        ;(prisma.simulation.findUnique as jest.Mock).mockResolvedValue({
            userId: 'u1',
            amount: 250000,
            rate: 3.2,
        })

        const res = await GET()
        expect(res.status).toBe(200)
        expect(prisma.simulation.findUnique).toHaveBeenCalledWith({
            where: { userId: 'u1' },
        })
        expect(await readJson(res)).toEqual({
            simulation: { userId: 'u1', amount: 250000, rate: 3.2 },
        })
    })

    it('500 — si erreur DB', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
        setSession('u1')
        ;(prisma.simulation.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'))

        const res = await GET()
        expect(res.status).toBe(500)
        expect(await readJson(res)).toEqual({ error: 'Erreur serveur' })
        spy.mockRestore()
    })
})