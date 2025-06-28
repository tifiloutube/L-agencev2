import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { Readable } from 'stream'
import { prisma } from '@/lib/prisma/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
})

export const config = {
    api: {
        bodyParser: false,
    },
}

// Convertir ReadableStream vers Buffer
async function buffer(readable: ReadableStream<Uint8Array>) {
    const reader = readable.getReader()
    const chunks: Uint8Array[] = []
    let result = await reader.read()
    while (!result.done) {
        chunks.push(result.value)
        result = await reader.read()
    }
    return Buffer.concat(chunks)
}

export async function POST(req: NextRequest) {
    const rawBody = await buffer(req.body!)
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('❌ Signature Stripe invalide :', err)
        return new Response('Webhook error', { status: 400 })
    }

    // Log de l’event entier pour inspecter
    console.log('📦 EVENT TYPE:', event.type)
    console.log('📦 EVENT OBJECT:', JSON.stringify(event.data.object, null, 2))

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        console.log('🔍 session.customer:', customerId)
        console.log('🔍 session.subscription:', subscriptionId)
        console.log('🔍 session.metadata:', session.metadata)

        const stripeSub = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan
        const maxProperties = parseInt(session.metadata?.maxProperties || '0')
        const priceId = session.metadata?.priceId || ''

        if (!userId || !plan || !subscriptionId || !customerId) {
            console.error('❌ Données manquantes dans metadata Stripe')
            return new Response('Missing data', { status: 400 })
        }

        // Log final avant insertion
        console.log('📥 Sauvegarde dans la BDD :', {
            userId,
            plan,
            subscriptionId,
            customerId,
            priceId,
            maxProperties,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
        })

        await prisma.sellerSubscription.upsert({
            where: { userId },
            update: {
                plan,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId,
                maxProperties,
                priceId,
                status: 'active',
                currentPeriodEnd: stripeSub.current_period_end
                    ? new Date(stripeSub.current_period_end * 1000)
                    : null,
            },
            create: {
                userId,
                plan,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: customerId,
                maxProperties,
                priceId,
                status: 'active',
                currentPeriodEnd: stripeSub.current_period_end
                    ? new Date(stripeSub.current_period_end * 1000)
                    : null,
            },
        })

        console.log(`✅ Abonnement Stripe enregistré pour l'utilisateur ${userId}`)
    }

    return new Response('OK', { status: 200 })
}
