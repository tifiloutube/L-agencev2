import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const body = await req.json().catch(() => ({} as any))
        const {
            name,
            phone,
            email,
            newPassword,
            confirmPassword,
        }: {
            name?: string
            phone?: string
            email?: string
            newPassword?: string
            confirmPassword?: string
        } = body

        const updates: {
            name?: string
            phone?: string
            email?: string
            password?: string
        } = {}

        if (typeof name === 'string') updates.name = name
        if (typeof phone === 'string') updates.phone = phone

        // Update email si différent de l'email courant
        if (typeof email === 'string' && email && email !== session.user.email) {
            updates.email = email
        }

        // Gestion du mot de passe
        if (typeof newPassword === 'string' && newPassword.length > 0) {
            if (newPassword !== confirmPassword) {
                return NextResponse.json({ error: 'Les mots de passe ne correspondent pas.' }, { status: 400 })
            }
            if (newPassword.length < 6) {
                return NextResponse.json({ error: 'Le mot de passe doit faire au moins 6 caractères.' }, { status: 400 })
            }
            updates.password = await bcrypt.hash(newPassword, 10)
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'Aucune donnée à mettre à jour.' }, { status: 400 })
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: updates,
        })

        const shouldLogout = !!updates.email

        return NextResponse.json({
            message: 'Profil mis à jour',
            logout: shouldLogout,
        })
    } catch (err) {
        console.error('Erreur update profil:', err)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}