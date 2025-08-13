import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'
import bcrypt from 'bcryptjs'

// Neutralise l'adapter (pas d'I/O)
jest.mock('@next-auth/prisma-adapter', () => ({
    PrismaAdapter: jest.fn(() => ({})),
}))

// Mock léger de bcrypt
jest.mock('bcryptjs', () => ({
    __esModule: true,
    default: { compare: jest.fn() },
}))

function getCredentialsProvider(): any {
    const providers = (authOptions as any).providers as any[]
    const cred = providers[0]
    if (!cred || cred.id !== 'credentials') throw new Error('Credentials provider non trouvé')
    return cred
}

describe('lib/auth/auth.ts — authOptions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('expose une config NextAuth valide', () => {
        expect(authOptions).toBeDefined()
        expect(Array.isArray((authOptions as any).providers)).toBe(true)
        expect((authOptions as any).session?.strategy).toBe('jwt')
        expect((authOptions as any).pages?.signIn).toBe('/login')
    })

    describe('CredentialsProvider.authorize', () => {
        it('retourne null si credentials manquants', async () => {
            const cred = getCredentialsProvider()

            const r1 = await cred.authorize?.(undefined)
            expect(r1).toBeNull()

            const r2 = await cred.authorize?.({ email: '', password: '' })
            expect(r2).toBeNull()
        })

        it('retourne null si user introuvable', async () => {
            const cred = getCredentialsProvider()
                // Remplace directement la méthode par un jest.fn()
            ;(prisma.user as any).findUnique = jest.fn().mockResolvedValue(null)

            const res = await cred.authorize?.({ email: 'a@b.com', password: 'x' })
            expect(res).toBeNull()

            // On peut vérifier l'appel sur NOTRE fn mockée (pas un spy sur une autre instance)
            expect((prisma.user as any).findUnique).toHaveBeenCalledWith({
                where: { email: 'a@b.com' },
            })
        })

        it('retourne null si mot de passe invalide', async () => {
            const cred = getCredentialsProvider()
            ;(prisma.user as any).findUnique = jest.fn().mockResolvedValue({
                id: 'u1',
                email: 'a@b.com',
                name: 'Alice',
                password: 'HASH',
            })
            ;(bcrypt as any).compare.mockResolvedValue(false)

            const res = await cred.authorize?.({ email: 'a@b.com', password: 'wrong' })
            expect(res).toBeNull()
            expect((bcrypt as any).compare).toHaveBeenCalledWith('wrong', 'HASH')
        })

        it('retourne (id, email, name) si credentials valides', async () => {
            const cred = getCredentialsProvider()
            ;(prisma.user as any).findUnique = jest.fn().mockResolvedValue({
                id: 'u1',
                email: 'a@b.com',
                name: 'Alice',
                password: 'HASH',
            })
            ;(bcrypt as any).compare.mockResolvedValue(true)

            const res = await cred.authorize?.({ email: 'a@b.com', password: 'secret' })
            expect(res).toEqual({ id: 'u1', email: 'a@b.com', name: 'Alice' })
            expect((bcrypt as any).compare).toHaveBeenCalledWith('secret', 'HASH')
        })
    })

    describe('callbacks.session', () => {
        it('ajoute user.id à la session quand token.sub existe', async () => {
            const out = await (authOptions as any).callbacks.session({
                session: { user: {} },
                token: { sub: 'u1' },
            })
            expect(out.user.id).toBe('u1')
        })

        it('ne crashe pas quand token est absent', async () => {
            const out = await (authOptions as any).callbacks.session({
                session: { user: {} },
                token: undefined,
            })
            expect(out.user).toEqual({})
        })
    })
})