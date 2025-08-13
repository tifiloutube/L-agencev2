import { POST } from '@/app/api/messages/read/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        message: { updateMany: jest.fn() },
    },
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function jreq(body: any) {
    return new Request('http://localhost/api/messages/read', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('POST /api/messages/read', () => {
    beforeEach(() => jest.resetAllMocks())

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await POST(jreq({ conversationId: 'c1' }))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Unauthorized' })
        expect(prisma.message.updateMany).not.toHaveBeenCalled()
    })

    it('200 — marque comme lus les messages des autres participants', async () => {
        setSession('u1')
        ;(prisma.message.updateMany as jest.Mock).mockResolvedValue({ count: 3 })

        const res = await POST(jreq({ conversationId: 'c1' }))
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({ success: true })

        expect(prisma.message.updateMany).toHaveBeenCalledWith({
            where: {
                conversationId: 'c1',
                senderId: { not: 'u1' },
                read: false,
            },
            data: { read: true },
        })
    })
})