import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
})

const basePlans = [
    {
        id: 'seller_standard',
        name: 'Standard',
        priceId: process.env.STRIPE_PRICE_STANDARD!,
        maxProperties: 10,
    },
    {
        id: 'seller_intermediate',
        name: 'Intermédiaire',
        priceId: process.env.STRIPE_PRICE_INTERMEDIATE!,
        maxProperties: 50,
    },
    {
        id: 'seller_advanced',
        name: 'Avancé',
        priceId: process.env.STRIPE_PRICE_ADVANCED!,
        maxProperties: 100,
    },
]

export async function getSellerPlans() {
    const prices = await Promise.all(
        basePlans.map(async (plan) => {
            const stripePrice = await stripe.prices.retrieve(plan.priceId)
            return {
                ...plan,
                unitAmount: stripePrice.unit_amount || 0,
                currency: stripePrice.currency || 'eur',
            }
        })
    )

    return prices
}