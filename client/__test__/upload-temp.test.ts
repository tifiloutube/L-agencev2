import { POST } from '@/app/api/upload-temp/route'
import { getServerSession } from 'next-auth'
import { put } from '@vercel/blob'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@vercel/blob', () => ({
    put: jest.fn(),
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('POST /api/upload-temp', () => {
    beforeEach(() => jest.resetAllMocks())

    it('401 si non authentifié', async () => {
        setSession(null)
        const req = { formData: async () => ({ get: () => null }) } as any

        const res = await POST(req)
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
        expect(put).not.toHaveBeenCalled()
    })

    it('400 si fichier manquant', async () => {
        setSession('u1')
        const req = { formData: async () => ({ get: () => null }) } as any

        const res = await POST(req)
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Fichier manquant' })
        expect(put).not.toHaveBeenCalled()
    })

    it('200 — upload temp OK (nom normalisé + chemin temp/<timestamp>-filename)', async () => {
        setSession('u1')

        const fakeFile = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' }) as any
        fakeFile.name = 'My File.JPG'

        ;(put as jest.Mock).mockResolvedValue({
            url: 'https://public.bucket/temp/1712345678901-my-file.jpg',
        })

        const req = {
            formData: async () => ({
                get: (k: string) => (k === 'file' ? fakeFile : null),
            }),
        } as any

        const res = await POST(req)
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual({
            url: 'https://public.bucket/temp/1712345678901-my-file.jpg',
        })

        const [key, fileArg, opts] = (put as jest.Mock).mock.calls[0]
        expect(key).toMatch(/^temp\/\d+-my-file\.jpg$/)
        expect(fileArg).toBe(fakeFile)
        expect(opts).toEqual({ access: 'public' })
    })
})