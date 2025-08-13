import { POST } from '@/app/api/messages/send/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        conversation: { findUnique: jest.fn() },
        message: { create: jest.fn() },
    },
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function jreq(body: any) {
    return new Request('http://localhost/api/messages/send', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('POST /api/messages/send', () => {
    beforeEach(() => jest.resetAllMocks())

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await POST(jreq({ conversationId: 'c1', content: 'yo' }))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Unauthorized' })
    })

    it('400 si payload invalide (manque content)', async () => {
        setSession('u1')
        const res = await POST(jreq({ conversationId: 'c1' })) // pas de content
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Invalid payload' })
    })

    it('403 si user non participant à la conversation', async () => {
        setSession('u1')
        ;(prisma.conversation.findUnique as jest.Mock).mockResolvedValue({
            id: 'c1',
            participants: [{ id: 'other' }],
        })

        const res = await POST(jreq({ conversationId: 'c1', content: 'yo' }))
        expect(res.status).toBe(403)
        expect(await readJson(res)).toEqual({ error: 'Unauthorized' })
    })

    it('200 et crée le message si participant', async () => {
        setSession('u1')
        ;(prisma.conversation.findUnique as jest.Mock).mockResolvedValue({
            id: 'c1',
            participants: [{ id: 'u1' }, { id: 'u2' }],
        })
        ;(prisma.message.create as jest.Mock).mockResolvedValue({
            id: 'm1',
            content: 'yo',
            senderId: 'u1',
            conversationId: 'c1',
            sender: { id: 'u1', name: 'Alice' },
        })

        const res = await POST(jreq({ conversationId: 'c1', content: 'yo' }))
        expect(res.status).toBe(200)

        expect(prisma.conversation.findUnique).toHaveBeenCalledWith({
            where: { id: 'c1' },
            include: { participants: true },
        })

        expect(prisma.message.create).toHaveBeenCalledWith({
            data: { conversationId: 'c1', content: 'yo', senderId: 'u1' },
            include: { sender: true },
        })

        expect(await readJson(res)).toEqual({
            message: {
                id: 'm1',
                content: 'yo',
                senderId: 'u1',
                conversationId: 'c1',
                sender: { id: 'u1', name: 'Alice' },
            },
        })
    })
})