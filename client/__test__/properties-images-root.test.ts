import { POST } from '@/app/api/properties/images/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'
import { put, del } from '@vercel/blob'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))
jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        propertyImage: { create: jest.fn() },
    },
}))
jest.mock('@vercel/blob', () => ({
    put: jest.fn(),
    del: jest.fn(),
}))

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}
function jreq(body: any) {
    return new Request('http://localhost/api/properties/images', {
        method: 'POST',
        body: JSON.stringify(body),
    })
}
async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('POST /api/properties/images', () => {
    beforeEach(() => {
        jest.resetAllMocks()
        global.fetch = jest.fn().mockResolvedValue({
            arrayBuffer: async () => new ArrayBuffer(8),
        }) as any
    })

    it('401 si non authentifié', async () => {
        setSession(null)
        const res = await POST(jreq({ propertyId: 'p1', url: 'https://bucket/temp/temp-abc.jpg' }))
        expect(res.status).toBe(401)
        expect(await readJson(res)).toEqual({ error: 'Non autorisé' })
    })

    it('400 si données incomplètes', async () => {
        setSession('u1')
        const res = await POST(jreq({ url: 'https://bucket/temp/temp-abc.jpg' })) // pas de propertyId
        expect(res.status).toBe(400)
        expect(await readJson(res)).toEqual({ error: 'Data incomplète' })
    })

    it('200 — déplace l’image, supprime la temp et crée la row DB', async () => {
        setSession('u1')

        ;(put as jest.Mock).mockResolvedValue({
            url: 'https://public.bucket/properties/p1/12345-abc.jpg',
        })

        const res = await POST(
            jreq({ propertyId: 'p1', url: 'https://public.bucket/temp/temp-abc.jpg' })
        )
        expect(res.status).toBe(200)
        const data = await readJson(res)
        expect(data).toEqual({
            message: 'Image déplacée et enregistrée',
            url: 'https://public.bucket/properties/p1/12345-abc.jpg',
        })

        const [keyArg, blobArg, optsArg] = (put as jest.Mock).mock.calls[0]
        expect(keyArg).toMatch(/^properties\/p1\/\d+-abc\.jpg$/)
        expect(blobArg).toBeInstanceOf(Blob)
        expect(optsArg).toEqual({ access: 'public' })

        expect(del).toHaveBeenCalledWith('temp/temp-abc.jpg')

        expect(prisma.propertyImage.create).toHaveBeenCalledWith({
            data: { propertyId: 'p1', url: 'https://public.bucket/properties/p1/12345-abc.jpg' },
        })
    })

    it("500 — si l'upload vers le blob échoue", async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
        setSession('u1')

        ;(put as jest.Mock).mockRejectedValue(new Error('Blob fail'))

        const res = await POST(
            jreq({ propertyId: 'p1', url: 'https://public.bucket/temp/temp-abc.jpg' })
        )
        expect(res.status).toBe(500)
        expect(await readJson(res)).toEqual({ error: 'Erreur lors du traitement de l’image' })

        spy.mockRestore()
    })
})