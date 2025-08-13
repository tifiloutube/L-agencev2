import { GET } from '@/app/api/stripe/plans/route'
import { getSellerPlans } from '@/lib/stripe/plan'

jest.mock('@/lib/stripe/plan', () => ({
    getSellerPlans: jest.fn(),
}))

async function readJson(res: Response) {
    try { return await res.json() } catch { return null }
}

describe('GET /api/stripe/plans', () => {
    beforeEach(() => jest.resetAllMocks())

    it('200 — renvoie la liste des plans', async () => {
        const plans = [
                { id: 'seller_standard', priceId: 'price_1', amount: 990, currency: 'eur', maxProperties: 10 },
                { id: 'seller_intermediate', priceId: 'price_2', amount: 1990, currency: 'eur', maxProperties: 50 },
            ]
        ;(getSellerPlans as jest.Mock).mockResolvedValue(plans)

        const res = await GET()
        expect(res.status).toBe(200)
        expect(await readJson(res)).toEqual(plans)
        expect(getSellerPlans).toHaveBeenCalled()
    })

    it('propage une erreur si getSellerPlans() jette (pas de try/catch)', async () => {
        ;(getSellerPlans as jest.Mock).mockRejectedValue(new Error('stripe fail'))
        await expect(GET()).rejects.toThrow('stripe fail')
    })
})