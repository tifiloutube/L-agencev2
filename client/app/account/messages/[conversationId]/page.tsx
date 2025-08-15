import type { Metadata } from 'next'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma/prisma'
import { authOptions } from '@/lib/auth/auth'
import { notFound } from 'next/navigation'
import MessageThread from '@/components/message/MessageThread/MessageThread'
import styles from './page.module.css'

type Props = { params: { conversationId: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const convo = await prisma.conversation.findUnique({
        where: { id: params.conversationId },
        select: { property: { select: { id: true, title: true } } },
    })

    const baseTitle = 'Messages'
    const title = convo?.property
        ? `${baseTitle} — ${convo.property.title} | La Crémaillère`
        : `${baseTitle} — Annonce supprimée | La Crémaillère`

    return {
        title,
        description:
            convo?.property
                ? `Conversation à propos de "${convo.property.title}".`
                : "Conversation liée à une annonce supprimée.",
        robots: { index: false, follow: false },
        alternates: { canonical: `/account/messages/${params.conversationId}` },
    }
}

export default async function ConversationPage({ params }: Props) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return notFound()

    const conversation = await prisma.conversation.findUnique({
        where: { id: params.conversationId },
        include: {
            participants: true,
            messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } },
            property: { select: { title: true, id: true } },
        },
    })

    if (!conversation || !conversation.participants.find(p => p.id === session.user.id)) {
        return notFound()
    }

    return (
        <div className="wrapper" role="region" aria-labelledby="conv-title">
            <div className={styles.container}>
                <h1 id="conv-title" className={styles.h1}>
                    Conversation —{' '}
                    {conversation.property ? (
                        <Link
                            href={`/properties/${conversation.property.id}`}
                            className="link"
                            aria-label={`Voir l'annonce ${conversation.property.title}`}
                        >
                            {conversation.property.title}
                        </Link>
                    ) : (
                        'Annonce supprimée'
                    )}
                </h1>

                <MessageThread
                    conversationId={conversation.id}
                    messages={conversation.messages}
                    currentUserId={session.user.id}
                />
            </div>
        </div>
    )
}