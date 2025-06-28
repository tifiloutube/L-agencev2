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

        const subscription = await prisma.sellerSubscription.findUnique({
            where: { userId: session.user.id },
        })

        if (!subscription?.stripeSubscriptionId) {
            return NextResponse.json({ error: 'Aucun abonnement trouvé' }, { status: 400 })
        }

        // Stripe : annule à la fin de la période actuelle
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true,
        })

        await prisma.sellerSubscription.update({
            where: { userId: session.user.id },
            data: {
                status: 'canceled',
            },
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('❌ Erreur annulation Stripe :', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
