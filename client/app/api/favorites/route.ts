import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { propertyId } = await req.json()
    if (!propertyId) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

    const existing = await prisma.favorite.findUnique({
        where: {
            userId_propertyId: {
                userId: session.user.id,
                propertyId,
            },
        },
    })

    if (existing) {
        await prisma.favorite.delete({
            where: { id: existing.id },
        })
        return NextResponse.json({ message: 'Bien retiré des favoris', isFavorite: false })
    } else {
        await prisma.favorite.create({
            data: {
                userId: session.user.id,
                propertyId,
            },
        })
        return NextResponse.json({ message: 'Bien ajouté aux favoris', isFavorite: true })
    }
}