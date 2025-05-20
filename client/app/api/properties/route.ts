import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkUserCanPostProperty } from '@/lib/services/userAccess'

const MAPBOX_TOKEN = process.env.MAPBOX_API_TOKEN!

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
        imageUrl,
    } = await req.json()

    const canPost = await checkUserCanPostProperty(session.user.id)
    if (!canPost.canPost) {
        return NextResponse.json({ error: canPost.reason }, { status: 403 })
    }
    
    const fullAddress = `${address}, ${zipCode} ${city}, ${country}`

    let latitude: number | null = null
    let longitude: number | null = null

    try {
        const geoRes = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                fullAddress
            )}.json?access_token=${MAPBOX_TOKEN}`
        )

        const geoData = await geoRes.json()
        const [lng, lat] = geoData?.features?.[0]?.center || []

        if (lat && lng) {
            latitude = lat
            longitude = lng
        }
    } catch (err) {
        console.error('Erreur géocodage Mapbox', err)
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
                transactionType,
                latitude,
                longitude,

                userId: session.user.id,
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