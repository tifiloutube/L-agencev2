'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/lib/context/ToastContext'
import SubscriptionExpiredBlock from "@/components/account/AccountSubscription/SubscriptionExpiredBlock/SubscriptionExpiredBlock";
import SubscriptionActiveBlock from "@/components/account/AccountSubscription/SubscriptionActiveBlock/SubscriptionActiveBlock";
import SubscriptionCanceledBlock from "@/components/account/AccountSubscription/SubscriptionCanceledBlock/SubscriptionCanceledBlock";

import styles from './AccountSubscription.module.css'

type Plan = {
    id: string
    name: string
    priceId: string
    maxProperties: number
}

type Props = {
    subscription: {
        plan: string
        status: string
        maxProperties: number
        stripeSubscriptionId: string
        currentPeriodEnd?: Date | null
    } | null
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

    const now = new Date()
    const periodEndDate = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null
    const isFuture = periodEndDate && periodEndDate > now
    const remainingDays = isFuture
        ? Math.ceil((periodEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0

    const showResubscribeUI = !subscription || (
        subscription.status === 'canceled' && (!periodEndDate || periodEndDate < now)
    )

    if (showResubscribeUI) {
        const previousPlan = subscription
            ? plans.find(p => p.id === subscription.plan)
            : null

        return (
            <SubscriptionExpiredBlock
                plans={plans}
                previousPlan={previousPlan}
                onSubscribe={subscribe}
            />
        )
    }

    const { plan, status, maxProperties } = subscription!

    return (
        <section className={styles.container}>
            <h2 className={styles.h2}>
                Abonnement vendeur {status === 'active' ? 'actif' : 'en cours de résiliation'}
            </h2>

            <div>
                {status === 'active' && (
                    <SubscriptionActiveBlock
                        currentPlanId={plan}
                        currentPlanName={plans.find(p => p.id === plan)?.name ?? plan}
                        maxProperties={maxProperties}
                        plans={plans}
                        onChangePlan={changePlan}
                        onCancel={cancelSubscription}
                    />
                )}

                {status === 'canceled' && isFuture && (
                    <SubscriptionCanceledBlock
                        periodEndDate={periodEndDate!}
                        remainingDays={remainingDays}
                        onReactivate={reactivateSubscription}
                    />
                )}
            </div>
        </section>
    )
}