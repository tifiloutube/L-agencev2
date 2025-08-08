import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'

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

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
        }

        let customerId = user.stripeCustomerId

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId: user.id },
            })

            customerId = customer.id

            // ✅ On sauvegarde dans la BDD
            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId },
            })
        }

        const stripeSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${req.nextUrl.origin}/account?success=true`,
            cancel_url: `${req.nextUrl.origin}/account?canceled=true`,
            metadata: {
                plan,
                userId: user.id,
                maxProperties: maxProperties.toString(),
                priceId,
            },
        })

        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.error('❌ Stripe Checkout Error:', error)
        return NextResponse.json({ error: 'Erreur serveur Stripe' }, { status: 500 })
    }
}