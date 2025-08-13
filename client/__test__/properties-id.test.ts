import { PATCH, DELETE } from '@/app/api/properties/[id]/route'
import { prisma } from '@/lib/prisma/prisma'
import { del } from '@vercel/blob'
import { getServerSession } from 'next-auth'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        property: {
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}))

jest.mock('@vercel/blob', () => ({
    del: jest.fn(),
}))

function setSession(userId: string | null) {
    if (userId) {
        ;(getServerSession as jest.Mock).mockResolvedValue({ user: { id: userId } })
    } else {
        ;(getServerSession as jest.Mock).mockResolvedValue(null)
    }
}

describe('/api/properties/[id] PATCH', () => {
    const params = { id: 'prop_123' }

    it('401 si non authentifié', async () => {
        setSession(null)
        const req = new Request('http://localhost/api/properties/prop_123', {
            method: 'PATCH',
            body: JSON.stringify({ title: 'New title' }),
        })

        const res = await PATCH(req, { params })
        expect(res.status).toBe(401)
        const json = await res.json()
        expect(json).toEqual({ error: 'Non autorisé' })
    })

    it('403 si non propriétaire', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_123',
            userId: 'user_B',
        })

        const req = new Request('http://localhost/api/properties/prop_123', {
            method: 'PATCH',
            body: JSON.stringify({ title: 'New title' }),
        })

        const res = await PATCH(req, { params })
        expect(res.status).toBe(403)
        const json = await res.json()
        expect(json).toEqual({ error: 'Accès refusé' })
    })

    it('200 + payload updated si propriétaire', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_123',
            userId: 'user_A',
        })
        ;(prisma.property.update as jest.Mock).mockResolvedValue({
            id: 'prop_123',
            title: 'New title',
            price: 250000,
        })

        const req = new Request('http://localhost/api/properties/prop_123', {
            method: 'PATCH',
            body: JSON.stringify({
                title: 'New title',
                price: 250000,
            }),
        })

        const res = await PATCH(req, { params })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json).toEqual({
            message: 'Bien mis à jour',
            updated: { id: 'prop_123', title: 'New title', price: 250000 },
        })

        expect(prisma.property.update).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: 'prop_123' } })
        )
    })
})

describe('/api/properties/[id] DELETE', () => {
    const params = { id: 'prop_456' }

    it('401 si non authentifié', async () => {
        setSession(null)
        const req = new Request('http://localhost/api/properties/prop_456', { method: 'DELETE' })
        const res = await DELETE(req, { params })
        expect(res.status).toBe(401)
        const json = await res.json()
        expect(json).toEqual({ error: 'Non autorisé' })
    })

    it('403 si non propriétaire', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_456',
            userId: 'user_B',
            images: [],
        })

        const req = new Request('http://localhost/api/properties/prop_456', { method: 'DELETE' })
        const res = await DELETE(req, { params })
        expect(res.status).toBe(403)
        const json = await res.json()
        expect(json).toEqual({ error: 'Accès refusé' })
    })

    it('200 + supprime les blobs + la propriété', async () => {
        setSession('user_A')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'prop_456',
            userId: 'user_A',
            images: [
                { id: 'img1', url: 'https://pub-xxx.vercel-storage.com/v1/bucket/path/one.jpg' },
                { id: 'img2', url: 'https://pub-xxx.vercel-storage.com/v1/bucket/path/two.png' },
            ],
        })

        ;(prisma.property.delete as jest.Mock).mockResolvedValue({ id: 'prop_456' })

        const req = new Request('http://localhost/api/properties/prop_456', { method: 'DELETE' })
        const res = await DELETE(req, { params })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json).toEqual({ message: 'Bien supprimé' })

        expect(del).toHaveBeenCalledTimes(2)
        expect((del as jest.Mock).mock.calls[0][0]).toBe('v1/bucket/path/one.jpg')
        expect((del as jest.Mock).mock.calls[1][0]).toBe('v1/bucket/path/two.png')

        expect(prisma.property.delete).toHaveBeenCalledWith({ where: { id: 'prop_456' } })
    })
})