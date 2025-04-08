import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, content } = await req.json()

    if (!content || !conversationId) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true },
    })

    if (!conversation || !conversation.participants.find(p => p.id === session.user.id)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const message = await prisma.message.create({
        data: {
            conversationId,
            content,
            senderId: session.user.id,
        },
        include: {
            sender: true,
        },
    })

    return NextResponse.json({ message })
}