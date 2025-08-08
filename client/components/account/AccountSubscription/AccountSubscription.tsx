'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/lib/context/ToastContext'
import SubscriptionPlans from './SubscriptionPlans/SubscriptionPlans'

import styles from './AccountSubscription.module.css'

type Plan = {
    id: string
    name: string
    priceId: string
    maxProperties: number
    unitAmount: number
    currency: string
}

type Props = {
    subscription: {
        plan: string
    } | null
}

export default function AccountSubscription({ subscription }: Props) {
    const { showToast } = useToast()
    const [plans, setPlans] = useState<Plan[]>([])

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch('/api/stripe/plans')
                const data = await res.json()
                setPlans(data)
            } catch (err) {
                showToast({ message: 'Erreur lors du chargement des plans', type: 'error' })
            }
        }

        fetchPlans()
    }, [])

    const subscribe = async (priceId: string, planId: string, maxProperties: number) => {

        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId, plan: planId, maxProperties }),
        })

        const data = await res.json()
        if (data.url) {
            window.location.href = data.url
        } else {
            showToast({ message: 'Erreur lors de la redirection vers Stripe', type: 'error' })
        }
    }

    return (
        <section className={styles.container}>
            <h2 className={styles.h2}>Abonnements</h2>
            <h3 className={styles.h3}>Choisissez l’abonnement qui vous convient</h3>

            <SubscriptionPlans
                plans={plans}
                currentPlanId={subscription?.plan ?? null}
                onSubscribe={subscribe}
            />
        </section>
    )
}