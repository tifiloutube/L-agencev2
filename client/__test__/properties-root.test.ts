import { POST } from '@/app/api/properties/route'
import { prisma } from '@/lib/prisma/prisma'
import { getServerSession } from 'next-auth'
import { checkUserCanPostProperty } from '@/lib/services/userAccess'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('@/lib/prisma/prisma', () => ({
    prisma: {
        property: {
            create: jest.fn(),
        },
        propertyImage: {
            create: jest.fn(),
        },
    },
}))

jest.mock('@/lib/services/userAccess', () => ({
    checkUserCanPostProperty: jest.fn(),
}))

const bodyBase = {
    title: 'Maison T4',
    description: 'Superbe maison',
    type: 'HOUSE',
    price: 250000,
    surface: 120,
    rooms: 5,
    bathrooms: 2,
    hasGarage: true,
    floor: 0,
    address: '10 rue des Fleurs',
    city: 'Toulouse',
    zipCode: '31000',
    country: 'France',
    transactionType: 'SALE',
    kitchenEquipped: true,
    terrace: true,
    balcony: false,
    terraceCount: 1,
    terraceSurface: 15,
    balconyCount: null,
    balconySurface: null,
    garden: true,
    pool: false,
    disabledAccess: false,
    basement: false,
    constructionYear: 1998,
    landSurface: 350,
    condition: 'GOOD',
    energyConsumption: 'D',
    greenhouseGasEmission: 'E',
    finalEnergyConsumption: 220,
    energyCostMin: 1000,
    energyCostMax: 1500,
    energyIndexDate: '2023-06-01',
}

function jreq(method: string, body: any) {
    return new Request('http://localhost/api/properties', {
        method,
        body: JSON.stringify(body),
    })
}

function setSession(userId: string | null) {
    ;(getServerSession as jest.Mock).mockResolvedValue(
        userId ? { user: { id: userId } } : null
    )
}

describe('POST /api/properties', () => {
    beforeEach(() => {
        jest.resetAllMocks()
        global.fetch = jest.fn()
    })

    it('401 si non authentifié', async () => {
        setSession(null)

        const res = await POST(jreq('POST', bodyBase))
        expect(res.status).toBe(401)
        expect(await res.json()).toEqual({ error: 'Non autorisé' })
    })

    it('403 si quota/refus (checkUserCanPostProperty)', async () => {
        setSession('user_1')
        ;(checkUserCanPostProperty as jest.Mock).mockResolvedValue({
            canPost: false,
            reason: 'Quota atteint',
        })

        const res = await POST(jreq('POST', bodyBase))
        expect(res.status).toBe(403)
        expect(await res.json()).toEqual({ error: 'Quota atteint' })
    })

    it('200 — crée un bien sans image et sans coords (Mapbox sans résultats)', async () => {
        setSession('user_1')
        ;(checkUserCanPostProperty as jest.Mock).mockResolvedValue({ canPost: true })

        ;(global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({ features: [] }),
        })

        ;(prisma.property.create as jest.Mock).mockResolvedValue({
            id: 'prop_1',
            title: bodyBase.title,
            price: bodyBase.price,
            latitude: null,
            longitude: null,
        })

        const res = await POST(jreq('POST', bodyBase))
        expect(res.status).toBe(200)
        const data = await res.json()

        expect(data).toEqual({
            message: 'Bien ajouté',
            property: {
                id: 'prop_1',
                title: bodyBase.title,
                price: bodyBase.price,
                latitude: null,
                longitude: null,
            },
        })

        expect(prisma.property.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    title: bodyBase.title,
                    userId: 'user_1',
                    latitude: null,
                    longitude: null,
                }),
            })
        )
        expect(prisma.propertyImage.create).not.toHaveBeenCalled()
    })

    it('200 — crée un bien avec image + coords Mapbox', async () => {
        setSession('user_1')
        ;(checkUserCanPostProperty as jest.Mock).mockResolvedValue({ canPost: true })

        ;(global.fetch as jest.Mock).mockResolvedValue({
            json: async () => ({
                features: [{ center: [1.444, 43.604] }],
            }),
        })

        ;(prisma.property.create as jest.Mock).mockResolvedValue({
            id: 'prop_2',
            title: bodyBase.title,
            price: bodyBase.price,
            latitude: 43.604,
            longitude: 1.444,
        })

        const res = await POST(
            jreq('POST', { ...bodyBase, imageUrl: 'https://cdn/x.jpg' })
        )
        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data.message).toBe('Bien ajouté')
        expect(data.property).toMatchObject({
            id: 'prop_2',
            latitude: 43.604,
            longitude: 1.444,
        })

        expect(prisma.property.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    latitude: 43.604,
                    longitude: 1.444,
                }),
            })
        )

        expect(prisma.propertyImage.create).toHaveBeenCalledWith({
            data: { url: 'https://cdn/x.jpg', propertyId: 'prop_2' },
        })
    })

    it('500 — si erreur DB lors de la création', async () => {
        setSession('user_1')
        ;(checkUserCanPostProperty as jest.Mock).mockResolvedValue({ canPost: true })
        ;(global.fetch as jest.Mock).mockResolvedValue({ json: async () => ({ features: [] }) })
        ;(prisma.property.create as jest.Mock).mockRejectedValue(new Error('DB down'))

        const res = await POST(jreq('POST', bodyBase))
        expect(res.status).toBe(500)
        expect(await res.json()).toEqual({ error: 'Erreur serveur' })
    })
})