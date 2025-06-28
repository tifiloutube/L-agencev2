import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { name, phone } = await req.json()

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name,
            phone,
        },
    })

    return NextResponse.json({ message: 'Profil mis à jour' })
}