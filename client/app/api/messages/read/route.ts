import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await req.json()

    await prisma.message.updateMany({
        where: {
            conversationId,
            senderId: { not: session.user.id },
            read: false,
        },
        data: {
            read: true,
        },
    })

    return NextResponse.json({ success: true })
}