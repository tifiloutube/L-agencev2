'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/lib/context/ToastContext'

type Props = {
    subscription: {
        plan: string
        status: string
        maxProperties: number
        stripeSubscriptionId: string
        currentPeriodEnd?: Date | null
    } | null
}

type Plan = {
    id: string
    name: string
    priceId: string
    maxProperties: number
}

export default function AccountSubscription({ subscription }: Props) {
    const { showToast } = useToast()
    const [plans, setPlans] = useState<Plan[]>([])

    useEffect(() => {
        const fetchPlans = async () => {
            const res = await fetch('/api/stripe/plans')
            const data = await res.json()
            setPlans(data)
        }

        fetchPlans()
    }, [])

    const subscribe = async (priceId: string, plan: string, maxProperties: number) => {
        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, plan, maxProperties }),
        })

        const data = await res.json()
        if (data.url) {
            window.location.href = data.url
        } else {
            showToast({ message: 'Erreur lors de la redirection vers Stripe', type: 'error' })
        }
    }

    const changePlan = async (plan: Plan) => {
        const res = await fetch('/api/stripe/change-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId: plan.priceId,
                plan: plan.id,
                maxProperties: plan.maxProperties,
            }),
        })

        const data = await res.json()
        if (data.success) {
            showToast({ message: 'Abonnement mis à jour ✅' })
        } else {
            showToast({ message: data.error || 'Erreur changement abonnement', type: 'error' })
        }
    }

    const cancelSubscription = async () => {
        const confirmed = window.confirm('Souhaitez-vous vraiment résilier votre abonnement ?')
        if (!confirmed) return

        const res = await fetch('/api/stripe/cancel-subscription', { method: 'POST' })
        const data = await res.json()

        if (data.success) {
            showToast({ message: 'Abonnement résilié ✅' })
        } else {
            showToast({ message: data.error || 'Erreur lors de la résiliation', type: 'error' })
        }
    }

    const reactivateSubscription = async () => {
        const confirmed = window.confirm('Souhaitez-vous reprendre votre abonnement ?')
        if (!confirmed) return

        const res = await fetch('/api/stripe/reactivate-subscription', { method: 'POST' })
        const data = await res.json()

        if (data.success) {
            showToast({ message: 'Abonnement réactivé ✅' })
        } else {
            showToast({ message: data.error || 'Erreur réactivation abonnement', type: 'error' })
        }
    }

    if (subscription) {
        const { plan, status, maxProperties, currentPeriodEnd } = subscription

        return (
            <section style={{ marginTop: 60 }}>
                <h2>
                    Abonnement vendeur{' '}
                    {status === 'active' ? 'actif' : 'en cours de résiliation'}
                </h2>
                <p><strong>Plan :</strong> {plan}</p>
                <p><strong>Biens max :</strong> {maxProperties}</p>
                <p><strong>Status :</strong> {status}</p>

                {currentPeriodEnd && (
                    <p style={{ marginTop: 8 }}>
                        ✅ Abonnement actif jusqu’au{' '}
                        <strong>{new Date(currentPeriodEnd).toLocaleDateString('fr-FR')}</strong>
                    </p>
                )}

                {status === 'canceled' && (
                    <>
                        <p style={{ marginTop: 8, color: 'orange' }}>
                            ⚠️ Votre abonnement sera résilié à la fin de la période.
                        </p>
                        <button onClick={reactivateSubscription} style={{ marginTop: 12 }}>
                            🔁 Reprendre mon abonnement
                        </button>
                    </>
                )}

                {status === 'active' && (
                    <>
                        <div style={{ marginTop: 20 }}>
                            <h3>Changer d’abonnement</h3>
                            {plans
                                .filter(p => p.id !== plan)
                                .map(plan => (
                                    <button
                                        key={plan.id}
                                        onClick={() => changePlan(plan)}
                                        style={{ display: 'block', marginBottom: 10 }}
                                    >
                                        Passer à {plan.name} – {plan.maxProperties} biens
                                    </button>
                                ))}
                        </div>

                        <button onClick={cancelSubscription} style={{ marginTop: 20 }}>
                            Résilier mon abonnement
                        </button>
                    </>
                )}
            </section>
        )
    }

    return (
        <section style={{ marginTop: 60 }}>
            <h2>Souscrire à un abonnement vendeur</h2>

            {plans.map(plan => (
                <button
                    key={plan.id}
                    onClick={() => subscribe(plan.priceId, plan.id, plan.maxProperties)}
                    style={{ display: 'block', marginBottom: 10 }}
                >
                    {plan.name} – {plan.maxProperties} biens
                </button>
            ))}
        </section>
    )
}