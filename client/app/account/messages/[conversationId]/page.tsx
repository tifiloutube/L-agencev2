import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'
import { authOptions } from '@/lib/auth/auth'
import { notFound } from 'next/navigation'
import MessageThread from '@/components/message/MessageThread/MessageThread'

type Props = {
    params: { conversationId: string }
}

export default async function ConversationPage({ params }: Props) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return notFound()

    const conversation = await prisma.conversation.findUnique({
        where: { id: params.conversationId },
        include: {
            participants: true,
            messages: {
                include: { sender: true },
                orderBy: { createdAt: 'asc' },
            },
            property: {
                select: {
                    title: true,
                    id: true,
                },
            },
        },
    })

    if (!conversation || !conversation.participants.find(p => p.id === session.user.id)) {
        return notFound()
    }

    return (
        <main className="wrapper" style={{ paddingBlock: '40px' }}>
            <h1>
                Conversation –&nbsp;
                {conversation.property ? (
                    <a href={`/properties/${conversation.property.id}`} style={{ textDecoration: 'underline' }}>
                        {conversation.property.title}
                    </a>
                ) : 'Annonce supprimée'}

            </h1>

            <MessageThread
                conversationId={conversation.id}
                messages={conversation.messages}
                currentUserId={session.user.id}
            />
        </main>
    )
}