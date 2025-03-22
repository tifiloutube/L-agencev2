import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { del, put } from '@vercel/blob'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { propertyId, url } = await req.json()
    if (!propertyId || !url) {
        return NextResponse.json({ error: 'Data incomplète' }, { status: 400 })
    }

    try {
        // 1. Télécharger le fichier temporaire
        const response = await fetch(url)
        const blobBuffer = await response.arrayBuffer()
        const fileName = url.split('/').pop() || `image-${Date.now()}.jpg`
        const fileExt = fileName.split('.').pop() || 'jpg'

        // 2. Re-upload vers le dossier final
        const cleanName = fileName.replace(/^temp-/, '')
        const blob = await put(`properties/${propertyId}/${Date.now()}-${cleanName}`, new Blob([blobBuffer]), {
            access: 'public',
        })

        // 3. Supprimer l'image temporaire
        const tempPath = url.split('/').slice(-2).join('/') // ex: temp/xxx.jpg
        await del(tempPath)

        // 4. Enregistrer la nouvelle URL dans la DB
        await prisma.propertyImage.create({
            data: {
                propertyId,
                url: blob.url,
            },
        })

        return NextResponse.json({ message: 'Image déplacée et enregistrée', url: blob.url })
    } catch (error) {
        console.error('Erreur image blob:', error)
        return NextResponse.json({ error: 'Erreur lors du traitement de l’image' }, { status: 500 })
    }
}