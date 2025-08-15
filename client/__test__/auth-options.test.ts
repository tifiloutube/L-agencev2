/**
 * __test__/auth-options.test.ts
 * - Vérifie la config NextAuth (providers/session/pages)
 * - Teste la logique d’auth via authorizeCredentials (user introuvable, mauvais mdp, OK)
 * - Mocks de prisma & bcryptjs alignés sur tes imports (default pour bcryptjs)
 */

import { jest } from '@jest/globals'

// Mocks AVANT import des modules testés
jest.mock('@next-auth/prisma-adapter', () => ({
    PrismaAdapter: jest.fn(() => ({})),
}))

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        user: { findUnique: jest.fn() },
    },
}))

jest.mock('bcryptjs', () => ({
    __esModule: true,
    default: { compare: jest.fn() },
}))

// Imports APRES mocks
let authOptions: any
let authorizeCredentials: any
let prismaMock: any
let bcryptMock: any

beforeAll(async () => {
    const authMod = await import('@/lib/auth/auth')
    authOptions = authMod.authOptions
    authorizeCredentials = authMod.authorizeCredentials

    const prismaMod = await import('@/lib/prisma/prisma')
    prismaMock = prismaMod.prisma

    const b = await import('bcryptjs')
    bcryptMock = b.default // <-- default export avec compare()
})

beforeEach(() => {
    jest.clearAllMocks()
})

describe('authOptions — config NextAuth', () => {
    it('expose une config valide', () => {
        expect(authOptions).toBeDefined()
        expect(Array.isArray(authOptions.providers)).toBe(true)
        expect(authOptions.session?.strategy).toBe('jwt')
        expect(authOptions.pages?.signIn).toBe('/login')
    })
})

describe('authorizeCredentials (logique d’auth)', () => {
    it('retourne null si credentials manquants', async () => {
        const r1 = await authorizeCredentials(undefined)
        const r2 = await authorizeCredentials({ email: '', password: '' })
        expect(r1).toBeNull()
        expect(r2).toBeNull()
        expect(prismaMock.user.findUnique).not.toHaveBeenCalled()
        expect(bcryptMock.compare).not.toHaveBeenCalled()
    })

    it('retourne null si user introuvable', async () => {
        prismaMock.user.findUnique.mockResolvedValueOnce(null)

        const res = await authorizeCredentials({ email: 'a@b.com', password: 'x' })
        expect(res).toBeNull()
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@b.com' } })
    })

    it('retourne null si mot de passe invalide', async () => {
        prismaMock.user.findUnique.mockResolvedValueOnce({
            id: 'u1',
            email: 'a@b.com',
            name: 'Alice',
            password: 'HASH',
        })
        bcryptMock.compare.mockResolvedValueOnce(false)

        const res = await authorizeCredentials({ email: 'a@b.com', password: 'wrong' })
        expect(res).toBeNull()
        expect(bcryptMock.compare).toHaveBeenCalledWith('wrong', 'HASH')
    })

    it('retourne (id, email, name) si credentials valides', async () => {
        prismaMock.user.findUnique.mockResolvedValueOnce({
            id: 'u1',
            email: 'a@b.com',
            name: 'Alice',
            password: 'HASH',
        })
        bcryptMock.compare.mockResolvedValueOnce(true)

        const res = await authorizeCredentials({ email: 'a@b.com', password: 'secret' })
        expect(bcryptMock.compare).toHaveBeenCalledWith('secret', 'HASH')
        expect(res).toEqual({ id: 'u1', email: 'a@b.com', name: 'Alice' })
    })
})

describe('callbacks.session', () => {
    it('ajoute user.id lorsque token.sub existe', async () => {
        const out = await authOptions.callbacks.session({
            session: { user: {} },
            token: { sub: 'u1' },
        })
        expect(out.user.id).toBe('u1')
    })

    it("ne crashe pas quand token est absent", async () => {
        const out = await authOptions.callbacks.session({
            session: { user: {} },
            token: undefined,
        })
        expect(out.user).toEqual({})
    })
})