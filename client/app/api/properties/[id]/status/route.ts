import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type Params = {
    params: { id: string }
}

export async function PATCH(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const property = await prisma.property.findUnique({
        where: { id: params.id },
    })

    if (!property || property.userId !== session.user.id) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { status } = await req.json()

    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
        return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    // Si l'utilisateur veut publier ou republier, on check sa limite
    if (status === 'PUBLISHED') {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                properties: true,
                sellerSubscription: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
        }

        const isValidSubscription =
            user.sellerSubscription &&
            (user.sellerSubscription.status === 'active' ||
                (user.sellerSubscription.status === 'canceled' &&
                    user.sellerSubscription.currentPeriodEnd &&
                    new Date(user.sellerSubscription.currentPeriodEnd) > new Date()))

        const planLimits = {
            seller_standard: 10,
            seller_intermediate: 50,
            seller_advanced: 100,
        } as const

        const maxAllowed = isValidSubscription
            ? planLimits[user.sellerSubscription?.plan as keyof typeof planLimits] ?? 1
            : 1

        const activeCount = user.properties.filter(p => p.status !== 'ARCHIVED').length

        if (activeCount >= maxAllowed) {
            return NextResponse.json(
                {
                    error: `Vous avez atteint votre limite de ${maxAllowed} bien${
                        maxAllowed > 1 ? 's' : ''
                    } publiés.`,
                },
                { status: 403 }
            )
        }
    }

    const updated = await prisma.property.update({
        where: { id: params.id },
        data: { status },
    })

    return NextResponse.json({ message: 'Statut mis à jour', updated })
}