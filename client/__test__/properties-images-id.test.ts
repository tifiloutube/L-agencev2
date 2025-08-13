import { DELETE } from '@/app/api/properties/images/[id]/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'
import { del } from '@vercel/blob'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        propertyImage: {
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
    },
}))

jest.mock('@vercel/blob', () => ({
    del: jest.fn(),
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function reqDel(url: string) {
    return new Request(url, { method: 'DELETE' })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('DELETE /api/properties/images/[id]', () => {
    const params = { id: 'img_1' }

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await DELETE(reqDel('http://localhost/api/properties/images/img_1'), { params })
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
    })

    it('403 si image introuvable', async () => {
        setSession('u1')
        ;(prisma.propertyImage.findUnique as jest.Mock).mockResolvedValue(null)

        const res = await DELETE(reqDel('http://localhost/api/properties/images/img_1'), { params })
        expect(res.status).toBe(403)
        expect(await readJson(res)).toEqual({ error: 'Accès refusé' })
    })

    it('403 si non propriétaire', async () => {
        setSession('u1')
        ;(prisma.propertyImage.findUnique as jest.Mock).mockResolvedValue({
            id: 'img_1',
            url: 'https://pub.vercel-storage.com/v1/bucket/properties/p1/abc.jpg',
            property: { id: 'p1', userId: 'other_user' },
        })

        const res = await DELETE(reqDel('http://localhost/api/properties/images/img_1'), { params })
        expect(res.status).toBe(403)
        expect(await readJson(res)).toEqual({ error: 'Accès refusé' })
    })

    it('200 — supprime le blob et la row DB', async () => {
        setSession('u1')
        ;(prisma.propertyImage.findUnique as jest.Mock).mockResolvedValue({
            id: 'img_1',
            url: 'https://pub.vercel-storage.com/v1/bucket/properties/p1/abc.jpg',
            property: { id: 'p1', userId: 'u1' },
        })
        ;(prisma.propertyImage.delete as jest.Mock).mockResolvedValue({ id: 'img_1' })

        const res = await DELETE(reqDel('http://localhost/api/properties/images/img_1'), { params })
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ message: 'Image supprimée du blob et de la base' })

        expect(del).toHaveBeenCalledWith('v1/bucket/properties/p1/abc.jpg')
        expect(prisma.propertyImage.delete).toHaveBeenCalledWith({ where: { id: 'img_1' } })
    })

    it('500 — si la suppression blob échoue', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
        setSession('u1')
        ;(prisma.propertyImage.findUnique as jest.Mock).mockResolvedValue({
            id: 'img_1',
            url: 'https://pub.vercel-storage.com/v1/bucket/properties/p1/abc.jpg',
            property: { id: 'p1', userId: 'u1' },
        })
        ;(del as jest.Mock).mockRejectedValue(new Error('blob error'))

        const res = await DELETE(reqDel('http://localhost/api/properties/images/img_1'), { params })
        expect(res.status).toBe(500)
        expect(await readJson(res)).toEqual({ error: 'Erreur lors de la suppression' })

        spy.mockRestore()
    })
})