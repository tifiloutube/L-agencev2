'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from '@/lib/context/ToastContext'
import styles from './MessageThread.module.css'

type Message = {
    id: string
    content: string
    sender: { id: string; name: string | null }
    createdAt: string | Date
}

type Props = {
    conversationId: string
    messages: Message[]
    currentUserId: string
}

export default function MessageThread({ conversationId, messages, currentUserId }: Props) {
    const { showToast } = useToast()
    const [input, setInput] = useState('')
    const [allMessages, setAllMessages] = useState<Message[]>(messages)
    const [sending, setSending] = useState(false)
    const scrollerRef = useRef<HTMLDivElement | null>(null)

    // Marquer comme lus à l’ouverture
    useEffect(() => {
        fetch('/api/messages/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId }),
        }).catch(() => {})
    }, [conversationId])

    // Auto-scroll vers le bas quand la liste change
    useEffect(() => {
        const el = scrollerRef.current
        if (!el) return
        el.scrollTop = el.scrollHeight
    }, [allMessages])

    const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending])

    const handleSend = async () => {
        if (!canSend) return
        setSending(true)
        try {
            const res = await fetch('/api/messages/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversationId, content: input.trim() }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.error || 'Erreur envoi message')

            setAllMessages(prev => [...prev, data.message])
            setInput('')
        } catch (e: any) {
            showToast({ message: e.message || 'Erreur envoi message', type: 'error' })
        } finally {
            setSending(false)
        }
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className={styles.thread}>
            <div ref={scrollerRef} className={styles.scroller}>
                {allMessages.map(msg => {
                    const mine = msg.sender.id === currentUserId
                    return (
                        <div key={msg.id} className={`${styles.row} ${mine ? styles.rowMine : styles.rowOther}`}>
                            <div className={`${styles.bubble} ${mine ? styles.bubbleMine : styles.bubbleOther}`}>
                                <p className={styles.text}>{msg.content}</p>
                            </div>
                            <div className={styles.meta}>
                                <span className={styles.author}>{mine ? 'Vous' : (msg.sender.name ?? 'Utilisateur')}</span>
                                <span className={styles.dot}>•</span>
                                <span className={styles.time}>
                  {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className={styles.composer}>
        <textarea
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Écrire un message… (Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne)"
            rows={2}
        />
                <button
                    className={`button ${styles.send}`}
                    onClick={handleSend}
                    disabled={!canSend}
                >
                    {sending ? 'Envoi…' : 'Envoyer'}
                </button>
            </div>
        </div>
    )
}