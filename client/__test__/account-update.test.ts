import { PATCH } from '@/app/api/account/update/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'
import bcrypt from 'bcryptjs'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        user: { update: jest.fn() },
    },
}))

jest.mock('bcryptjs', () => ({
    __esModule: true,
    default: { hash: jest.fn() },
}))

function setSession(user: { id: string; email: string } | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(user ? { user } : null)
}
function jreq(body: any) {
    return new Request('http://localhost/api/account/update', {
        method: 'PATCH',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('PATCH /api/account/update', () => {
    beforeEach(() => jest.resetAllMocks())

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await PATCH(jreq({ name: 'A' }))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
    })

    it('400 si newPassword !== confirmPassword', async () => {
        setSession({ id: 'u1', email: 'old@mail.com' })
        const res = await PATCH(
            jreq({ name: 'A', phone: '0600000000', email: 'old@mail.com', newPassword: 'secret', confirmPassword: 'nope' })
        )
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Les mots de passe ne correspondent pas.' })
        expect(prisma.user.update).not.toHaveBeenCalled()
    })

    it('400 si newPassword < 6 chars', async () => {
        setSession({ id: 'u1', email: 'old@mail.com' })
        const res = await PATCH(
            jreq({ name: 'A', phone: '0600000000', email: 'old@mail.com', newPassword: '123', confirmPassword: '123' })
        )
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Le mot de passe doit faire au moins 6 caractères.' })
        expect(prisma.user.update).not.toHaveBeenCalled()
    })

    it('200 — update name/phone sans changement email (logout=false)', async () => {
        setSession({ id: 'u1', email: 'old@mail.com' })
        ;(prisma.user.update as jest.Mock).mockResolvedValue({ id: 'u1' })

        const payload = { name: 'Alice', phone: '0612345678', email: 'old@mail.com' }
        const res = await PATCH(jreq(payload))

        expect(res.status).toBe(200)
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 'u1' },
            data: { name: 'Alice', phone: '0612345678' }, // email identique → non mis à jour
        })
        expect(await readJson(res)).toEqual({ message: 'Profil mis à jour', logout: false })
    })

    it('200 — update email différent (logout=true)', async () => {
        setSession({ id: 'u1', email: 'old@mail.com' })
        ;(prisma.user.update as jest.Mock).mockResolvedValue({ id: 'u1' })

        const payload = { name: 'Alice', phone: '0612345678', email: 'new@mail.com' }
        const res = await PATCH(jreq(payload))

        expect(res.status).toBe(200)
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 'u1' },
            data: { name: 'Alice', phone: '0612345678', email: 'new@mail.com' },
        })
        expect(await readJson(res)).toEqual({ message: 'Profil mis à jour', logout: true })
    })

    it('200 — update avec nouveau mot de passe (hash appliqué)', async () => {
        setSession({ id: 'u1', email: 'user@mail.com' })
        ;(prisma.user.update as jest.Mock).mockResolvedValue({ id: 'u1' })
        ;(bcrypt.hash as unknown as jest.Mock).mockResolvedValue('HASHED_PW')

        const payload = {
            name: 'Bob',
            phone: '0699999999',
            email: 'user@mail.com',
            newPassword: 'secr3t!',
            confirmPassword: 'secr3t!',
        }

        const res = await PATCH(jreq(payload))
        expect(res.status).toBe(200)

        expect(bcrypt.hash).toHaveBeenCalledWith('secr3t!', 10)

        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 'u1' },
            data: { name: 'Bob', phone: '0699999999', password: 'HASHED_PW' },
        })

        expect(await readJson(res)).toEqual({ message: 'Profil mis à jour', logout: false })
    })
})