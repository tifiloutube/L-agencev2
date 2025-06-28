import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'
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
        transactionType,
        kitchenEquipped,
        terrace,
        balcony,
        terraceCount,
        terraceSurface,
        balconyCount,
        balconySurface,
        garden,
        pool,
        disabledAccess,
        basement,
        constructionYear,
        landSurface,
        condition,
        energyConsumption,
        greenhouseGasEmission,
        finalEnergyConsumption,
        energyCostMin,
        energyCostMax,
        energyIndexDate,
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
            transactionType,
            kitchenEquipped,
            terrace,
            balcony,
            terraceCount,
            terraceSurface,
            balconyCount,
            balconySurface,
            garden,
            pool,
            disabledAccess,
            basement,
            constructionYear,
            landSurface,
            condition,
            energyConsumption,
            greenhouseGasEmission,
            finalEnergyConsumption,
            energyCostMin,
            energyCostMax,
            energyIndexDate,
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

    for (const image of property.images) {
        try {
            const url = new URL(image.url)
            const blobPath = url.pathname.slice(1)
            await del(blobPath)
        } catch (err) {
            console.error(`Erreur suppression blob ${image.url}`, err)
        }
    }
    
    await prisma.property.delete({
        where: { id: params.id },
    })

    return NextResponse.json({ message: 'Bien supprimé' })
}