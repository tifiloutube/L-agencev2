'use client'

import Link from 'next/link'
import styles from './AccountConversations.module.css'

type Props = {
    conversations: {
        id: string
        property: { id: string; title: string } | null
        messages: {
            id: string
            content: string
            createdAt: string | Date
            read: boolean
            sender: { id: string; name: string | null }
        }[]
        participants: {
            id: string
            name: string | null
        }[]
    }[]
    currentUserId: string
}

export default function AccountConversations({ conversations, currentUserId }: Props) {
    if (!conversations.length) return null

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>Mes Discussions</h2>

            <ul className={styles.list}>
                {conversations
                    .sort((a, b) => {
                        const aDate = new Date(a.messages[0]?.createdAt ?? 0).getTime()
                        const bDate = new Date(b.messages[0]?.createdAt ?? 0).getTime()
                        return bDate - aDate
                    })
                    .map((convo) => {
                        const otherUser = convo.participants.find((p) => p.id !== currentUserId)
                        const last = convo.messages[0]
                        const unreadCount = convo.messages.filter(
                            (m) => !m.read && m.sender.id !== currentUserId
                        ).length

                        const initials =
                            otherUser?.name
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase() ?? '??'

                        return (
                            <li key={convo.id}>
                                <Link href={`/account/messages/${convo.id}`} className={styles.link}>
                                    <div className={styles.card}>
                                        <div className={styles.left}>
                                            <div className={styles.avatar}>{initials}</div>
                                            <div className={styles.content}>
                                                <p className={styles.name}>
                                                    {otherUser?.name ?? 'Utilisateur'}
                                                    {unreadCount > 0 && <span className={styles.dot} />}
                                                </p>
                                                <p className={styles.propertyTitle}>
                                                    {convo.property?.title ?? 'Discussion sans annonce'}
                                                </p>
                                                <p className={styles.preview}>
                                                    {last?.sender.id === currentUserId ? 'Vous' : last?.sender.name ?? 'Utilisateur'} :{' '}
                                                    {last?.content.slice(0, 60)}...
                                                </p>
                                            </div>
                                        </div>

                                        {last && (
                                            <span className={styles.date}>
                                                {new Date(last.createdAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                              </span>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
            </ul>
        </section>
    )
}