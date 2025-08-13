import { POST } from '@/app/api/register/route'
import { prisma } from '@/lib/prisma/prisma'
import bcrypt from 'bcryptjs'

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        user: { findUnique: jest.fn(), create: jest.fn() },
    },
}))

jest.mock('bcryptjs', () => ({
    __esModule: true,
    default: { hash: jest.fn() },
}))

function jreq(body: any) {
    return new Request('http://localhost/api/register', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('POST /api/register', () => {
    beforeEach(() => jest.resetAllMocks())

    it('400 si email ou mot de passe manquant', async () => {
        let res = await POST(jreq({ password: 'x' })) // sans email
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Email et mot de passe requis.' })

        res = await POST(jreq({ email: 'a@b.com' })) // sans password
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Email et mot de passe requis.' })

        expect(prisma.user.findUnique).not.toHaveBeenCalled()
        expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it('400 si utilisateur déjà existant', async () => {
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1' })

        const res = await POST(jreq({ email: 'a@b.com', password: 'secret', name: 'Alice' }))
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Utilisateur déjà existant.' })

        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@b.com' } })
        expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it('200 — crée user avec mot de passe hashé', async () => {
        ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
        ;(bcrypt.hash as unknown as jest.Mock).mockResolvedValue('HASHED')
        ;(prisma.user.create as jest.Mock).mockResolvedValue({
            id: 'u2',
            email: 'a@b.com',
            name: 'Alice',
        })

        const res = await POST(jreq({ email: 'a@b.com', password: 'secret', name: 'Alice' }))
        expect(res.status).toBe(200)

        expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10)

        expect(prisma.user.create).toHaveBeenCalledWith({
            data: { email: 'a@b.com', name: 'Alice', password: 'HASHED' },
        })

        expect(await readJson(res)).toEqual({
            message: 'Inscription réussie',
            user: { id: 'u2', email: 'a@b.com', name: 'Alice' },
        })
    })
})