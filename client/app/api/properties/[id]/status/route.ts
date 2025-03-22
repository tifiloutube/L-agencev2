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

    const updated = await prisma.property.update({
        where: { id: params.id },
        data: { status },
    })

    return NextResponse.json({ message: 'Statut mis à jour', updated })
}