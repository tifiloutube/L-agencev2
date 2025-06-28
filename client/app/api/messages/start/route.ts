import { prisma } from '@/lib/prisma/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { propertyId } = await req.json()

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { user: true },
    })

    if (!property || !property.userId) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const currentUserId = session.user.id
    const otherUserId = property.userId

    if (currentUserId === otherUserId) {
        return NextResponse.json({ error: 'You cannot message yourself' }, { status: 400 })
    }
    
    const existingConversation = await prisma.conversation.findFirst({
        where: {
            propertyId,
            participants: {
                every: {
                    id: {
                        in: [currentUserId, otherUserId],
                    },
                },
            },
        },
    })

    if (existingConversation) {
        return NextResponse.json({ conversationId: existingConversation.id })
    }

    const conversation = await prisma.conversation.create({
        data: {
            property: { connect: { id: propertyId } },
            participants: {
                connect: [
                    { id: currentUserId },
                    { id: otherUserId },
                ],
            },
        },
    })

    return NextResponse.json({ conversationId: conversation.id })
}