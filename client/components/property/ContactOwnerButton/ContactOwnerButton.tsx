'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/context/ToastContext'

export default function ContactOwnerButton({ propertyId }: { propertyId: string }) {
    const router = useRouter()
    const { showToast } = useToast()

    const handleClick = async () => {
        try {
            const res = await fetch('/api/messages/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId }),
            })

            const data = await res.json()

            if (!res.ok) {
                showToast({ message: data.error || 'Erreur lors de la création de la conversation', type: 'error' })
                return
            }

            router.push(`/account/messages/${data.conversationId}`)
        } catch (err) {
            showToast({ message: 'Erreur réseau', type: 'error' })
        }
    }

    return (
        <button onClick={handleClick} className={`button`}>
            Messagerie interne
        </button>
    )
}