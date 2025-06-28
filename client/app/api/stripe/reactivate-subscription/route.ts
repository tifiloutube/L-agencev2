import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
})

export async function POST() {
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

    try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: false,
        })

        await prisma.sellerSubscription.update({
            where: { userId: session.user.id },
            data: {
                status: 'active',
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[REACTIVATE ERROR]', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}