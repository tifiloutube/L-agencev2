import { POST } from '@/app/api/favorites/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        favorite: {
            findUnique: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
        },
    },
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function jreq(body: any) {
    return new Request('http://localhost/api/favorites', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('POST /api/favorites', () => {
    beforeEach(() => jest.resetAllMocks())

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await POST(jreq({ propertyId: 'p1' }))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
    })

    it('400 si propertyId manquant', async () => {
        setSession('u1')
        const res = await POST(jreq({}))
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'ID manquant' })
    })

    it('retire des favoris si déjà présent (toggle -> false)', async () => {
        setSession('u1')
        ;(prisma.favorite.findUnique as jest.Mock).mockResolvedValue({
            id: 'fav1',
            userId: 'u1',
            propertyId: 'p1',
        })

        const res = await POST(jreq({ propertyId: 'p1' }))
        expect(res.status).toBe(200)

        expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
            where: { userId_propertyId: { userId: 'u1', propertyId: 'p1' } },
        })
        expect(prisma.favorite.delete).toHaveBeenCalledWith({ where: { id: 'fav1' } })
        expect(prisma.favorite.create).not.toHaveBeenCalled()

        expect(await readJson(res)).toEqual({
            message: 'Bien retiré des favoris',
            isFavorite: false,
        })
    })

    it('ajoute aux favoris si absent (toggle -> true)', async () => {
        setSession('u1')
        ;(prisma.favorite.findUnique as jest.Mock).mockResolvedValue(null)

        const res = await POST(jreq({ propertyId: 'p1' }))
        expect(res.status).toBe(200)

        expect(prisma.favorite.create).toHaveBeenCalledWith({
            data: { userId: 'u1', propertyId: 'p1' },
        })
        expect(prisma.favorite.delete).not.toHaveBeenCalled()

        expect(await readJson(res)).toEqual({
            message: 'Bien ajouté aux favoris',
            isFavorite: true,
        })
    })
})