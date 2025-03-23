export const sellerPlans = [
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