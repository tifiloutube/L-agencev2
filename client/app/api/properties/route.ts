import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkUserCanPostProperty } from '@/lib/services/userAccess'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
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
        imageUrl,
    } = await req.json()

    const canPost = await checkUserCanPostProperty(session.user.id)
    if (!canPost.canPost) {
        return NextResponse.json({ error: canPost.reason }, { status: 403 })
    }

    try {
        const property = await prisma.property.create({
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
                userId: session.user.id,
            },
        })

        if (imageUrl) {
            await prisma.propertyImage.create({
                data: {
                    url: imageUrl,
                    propertyId: property.id,
                },
            })
        }

        return NextResponse.json({ message: 'Bien ajouté', property })
    } catch (error) {
        console.error('Erreur création bien :', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}