import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'

type Params = { params: { id: string } }

export async function PATCH(req: Request, { params }: Params) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const property = await prisma.property.findUnique({
        where: { id: params.id },
    })

    if (!property || property.userId !== session.user.id) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const {
        title,
        description,
        type,
        price,
        surface,
        rooms,
        bathrooms,
        hasGarage,
        floor,
        address,
        city,
        zipCode,
        country,
    } = await req.json()

    const updated = await prisma.property.update({
        where: { id: params.id },
        data: {
            title,
            description,
            type,
            price,
            surface,
            rooms,
            bathrooms,
            hasGarage,
            floor,
            address,
            city,
            zipCode,
            country,
        },
    })

    return NextResponse.json({ message: 'Bien mis à jour', updated })
}

export async function DELETE(_: Request, { params }: Params) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const property = await prisma.property.findUnique({
        where: { id: params.id },
        include: { images: true },
    })

    if (!property || property.userId !== session.user.id) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    // 1. Supprimer toutes les images du blob
    for (const image of property.images) {
        try {
            const url = new URL(image.url)
            const blobPath = url.pathname.slice(1)
            await del(blobPath)
        } catch (err) {
            console.error(`Erreur suppression blob ${image.url}`, err)
        }
    }

    // 2. Supprimer la propriété
    await prisma.property.delete({
        where: { id: params.id },
    })

    return NextResponse.json({ message: 'Bien supprimé' })
}