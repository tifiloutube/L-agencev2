import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })

    const filename = file.name.replace(/\s+/g, '-').toLowerCase()
    const blob = await put(`temp/${Date.now()}-${filename}`, file, { access: 'public' })

    return NextResponse.json({ url: blob.url })
}