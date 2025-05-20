import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ simulation: null }, { status: 200 })
    }

    try {
        const latest = await prisma.simulation.findUnique({
            where: { userId: session.user.id },
        })

        return NextResponse.json({ simulation: latest })
    } catch (error) {
        console.error('[SIMULATION_LATEST_GET]', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}