import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { amount, contribution, income, duration, rate, monthly, isEligible } = body

    if (
        typeof amount !== 'number' ||
        typeof contribution !== 'number' ||
        typeof income !== 'number' ||
        typeof duration !== 'number' ||
        typeof rate !== 'number' ||
        typeof monthly !== 'number' ||
        typeof isEligible !== 'boolean'
    ) {
        return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }

    const simulation = await prisma.simulation.upsert({
        where: { userId: session.user.id },
        update: {
            amount,
            contribution,
            income,
            duration,
            rate,
            monthly,
            isEligible,
            createdAt: new Date(),
        },
        create: {
            userId: session.user.id,
            amount,
            contribution,
            income,
            duration,
            rate,
            monthly,
            isEligible,
        },
    })

    return NextResponse.json({ success: true, simulation })
}