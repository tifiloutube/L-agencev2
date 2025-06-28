import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
})

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const { priceId, plan, maxProperties } = await req.json()

        const subscription = await prisma.sellerSubscription.findUnique({
            where: { userId: session.user.id },
        })

        if (!subscription || subscription.status !== 'active') {
            return NextResponse.json({ error: 'Aucun abonnement actif' }, { status: 400 })
        }

        // Récupère l’abonnement Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
            subscription.stripeSubscriptionId
        )

        const currentItemId = stripeSubscription.items.data[0]?.id

        if (!currentItemId) {
            return NextResponse.json({ error: 'Aucun item trouvé dans la souscription' }, { status: 400 })
        }

        // Change le plan
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            items: [
                {
                    id: currentItemId,
                    price: priceId,
                },
            ],
            proration_behavior: 'create_prorations',
        })

        // Mets à jour notre BDD
        await prisma.sellerSubscription.update({
            where: { userId: session.user.id },
            data: {
                plan,
                priceId,
                maxProperties,
            },
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('❌ Erreur changement abonnement :', err)
        return NextResponse.json({ error: 'Erreur serveur Stripe' }, { status: 500 })
    }
}