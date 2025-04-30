'use client'

import {useEffect, useState} from 'react'
import { useToast } from '@/lib/context/ToastContext'

type Message = {
    id: string
    content: string
    sender: {
        id: string
        name: string | null
    }
    createdAt: string | Date
}

type Props = {
    conversationId: string
    messages: Message[]
    currentUserId: string
}

export default function MessageThread({ conversationId, messages, currentUserId }: Props) {
    const [input, setInput] = useState('')
    const [allMessages, setAllMessages] = useState<Message[]>(messages)
    const { showToast } = useToast()

    useEffect(() => {
        fetch('/api/messages/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId }),
        })
    }, [conversationId])


    const handleSend = async () => {
        if (!input.trim()) return

        const res = await fetch('/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId, content: input }),
        })

        const data = await res.json()

        if (!res.ok) {
            showToast({ message: data.error || 'Erreur envoi message', type: 'error' })
            return
        }

        setAllMessages(prev => [...prev, data.message])
        setInput('')
    }

    return (
        <div style={{ marginTop: 30 }}>
            <div
                style={{
                    border: '1px solid #ddd',
                    padding: 16,
                    borderRadius: 8,
                    maxHeight: 400,
                    overflowY: 'auto',
                    background: '#f9f9f9',
                }}
            >
                {allMessages.map(msg => (
                    <div
                        key={msg.id}
                        style={{
                            marginBottom: 12,
                            textAlign: msg.sender.id === currentUserId ? 'right' : 'left',
                        }}
                    >
                        <p
                            style={{
                                display: 'inline-block',
                                background: msg.sender.id === currentUserId ? '#D1E7DD' : '#E2E3E5',
                                padding: '8px 12px',
                                borderRadius: 8,
                            }}
                        >
                            {msg.content}
                        </p>
                        <div style={{ fontSize: 12, color: '#777', marginTop: 2 }}>
                            {msg.sender.name ?? 'Utilisateur'} – {new Date(msg.createdAt).toLocaleTimeString('fr-FR')}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écrire un message..."
                    style={{ flex: 1 }}
                />
                <button onClick={handleSend}>Envoyer</button>
            </div>
        </div>
    )
}