'use client'

import Link from 'next/link'

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
    if (conversations.length === 0) return null

    return (
        <section style={{ marginTop: 40 }}>
            <h2>💬 Mes discussions</h2>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {conversations.map(convo => {
                    const otherUser = convo.participants.find(p => p.id !== currentUserId)
                    const last = convo.messages[0]

                    const unreadCount = convo.messages.filter(
                        m => !m.read && m.sender.id !== currentUserId
                    ).length

                    return (
                        <li key={convo.id}>
                            <Link href={`/account/messages/${convo.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div
                                    style={{
                                        border: '1px solid #ccc',
                                        borderRadius: 8,
                                        padding: 12,
                                        background: '#fff',
                                    }}
                                >
                                    <p style={{ fontWeight: 'bold' }}>
                                        {convo.property?.title ?? 'Discussion sans annonce'}

                                        {unreadCount > 0 && (
                                            <span style={{ marginLeft: 8, color: 'red', fontSize: 13, fontWeight: 600 }}>
                        • {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
                      </span>
                                        )}
                                    </p>

                                    <p style={{ color: '#555' }}>
                                        Avec : {otherUser?.name ?? 'Utilisateur'}
                                    </p>

                                    {last && (
                                        <p style={{ fontSize: 14, marginTop: 4 }}>
                                            {last.sender.id === currentUserId ? 'Vous :' : `${last.sender.name ?? 'Utilisateur'} :`} {last.content.slice(0, 60)}...
                                            <br />
                                            <span style={{ fontSize: 12, color: '#999' }}>
                                                {new Date(last.createdAt).toLocaleString('fr-FR')}
                                            </span>
                                        </p>
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