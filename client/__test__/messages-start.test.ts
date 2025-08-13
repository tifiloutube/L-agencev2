import { POST } from '@/app/api/messages/start/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        property: { findUnique: jest.fn() },
        conversation: { findFirst: jest.fn(), create: jest.fn() },
    },
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function jreq(body: any) {
    return new Request('http://localhost/api/messages/start', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('POST /api/messages/start', () => {
    beforeEach(() => jest.resetAllMocks())

    it('401 si non authentifié', async () => {
        setSession(null)

        const res = await POST(jreq({ propertyId: 'p1' }))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Unauthorized' })
    })

    it('404 si propriété introuvable', async () => {
        setSession('u1')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue(null)

        const res = await POST(jreq({ propertyId: 'p1' }))
        expect(res.status).toBe(404)
        expect(await readJson(res)).toEqual({ error: 'Property not found' })
    })

    it('400 si on essaie de se parler à soi-même', async () => {
        setSession('u1')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'p1',
            userId: 'u1',
            user: { id: 'u1' },
        })

        const res = await POST(jreq({ propertyId: 'p1' }))
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'You cannot message yourself' })
    })

    it('200 avec conversation existante (retourne son id, sans créer)', async () => {
        setSession('uA')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'p1',
            userId: 'uB',
            user: { id: 'uB' },
        })
        ;(prisma.conversation.findFirst as jest.Mock).mockResolvedValue({ id: 'conv1' })

        const res = await POST(jreq({ propertyId: 'p1' }))
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ conversationId: 'conv1' })
        expect(prisma.conversation.create).not.toHaveBeenCalled()
    })

    it('200 et crée une nouvelle conversation si aucune existante', async () => {
        setSession('uA')
        ;(prisma.property.findUnique as jest.Mock).mockResolvedValue({
            id: 'p1',
            userId: 'uB',
            user: { id: 'uB' },
        })
        ;(prisma.conversation.findFirst as jest.Mock).mockResolvedValue(null)
        ;(prisma.conversation.create as jest.Mock).mockResolvedValue({ id: 'conv_new' })

        const res = await POST(jreq({ propertyId: 'p1' }))
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ conversationId: 'conv_new' })

        expect(prisma.conversation.create).toHaveBeenCalledWith({
            data: {
                property: { connect: { id: 'p1' } },
                participants: { connect: [{ id: 'uA' }, { id: 'uB' }] },
            },
        })
    })
})