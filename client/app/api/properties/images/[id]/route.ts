import { prisma } from '@/lib/prisma/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'

type Params = { params: { id: string } }

export async function DELETE(_: Request, { params }: Params) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const image = await prisma.propertyImage.findUnique({
        where: { id: params.id },
        include: { property: true },
    })

    if (!image || image.property.userId !== session.user.id) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    try {
        // 1. Supprimer l'image du Blob
        const url = new URL(image.url)
        const blobPath = url.pathname.slice(1)

        await del(blobPath)

        // 2. Supprimer l'image de la base
        await prisma.propertyImage.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Image supprimée du blob et de la base' })
    } catch (error) {
        console.error('Erreur suppression blob:', error)
        return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
    }
}