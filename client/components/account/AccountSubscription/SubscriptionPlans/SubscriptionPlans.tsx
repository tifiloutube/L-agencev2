'use client'

import styles from './SubscriptionPlans.module.css'

type Plan = {
    id: string
    name: string
    priceId: string
    maxProperties: number
    unitAmount: number
    currency: string
}

type Props = {
    plans: Plan[]
    currentPlanId: string | null
    onSubscribe: (priceId: string, planId: string, maxProperties: number) => void
}

const getPlanFeatures = (plan: Plan): string[] => {
    return [`${plan.maxProperties} annonces / mois`]
}

export default function SubscriptionPlans({ plans, currentPlanId, onSubscribe }: Props) {
    return (
        <div className={styles.grid}>
            {plans.map((plan) => {
                const isCurrent = plan.id === currentPlanId

                return (
                    <div
                        key={plan.id}
                        className={`${styles.card} ${isCurrent ? styles.active : ''}`}
                    >
                        <div className={styles.header}>
                            <h3 className={styles.name}>{plan.name}</h3>
                            <p className={styles.price}>
                                {(plan.unitAmount / 100).toFixed(2)} {plan.currency.toUpperCase()}
                                <span className={styles.perMonth}>/mois</span>
                            </p>
                        </div>

                        <ul className={styles.features}>
                            {getPlanFeatures(plan).map((feature, index) => (
                                <li key={index}>✓ {feature}</li>
                            ))}
                        </ul>

                        <button
                            className={`button ${isCurrent ? styles.buttonDisabled : styles.button}`}
                            disabled={isCurrent}
                            onClick={() =>
                                !isCurrent &&
                                onSubscribe(plan.priceId, plan.id, plan.maxProperties)
                            }
                        >
                            {isCurrent ? 'Abonnement actuel' : 'S’abonner'}
                        </button>
                    </div>
                )
            })}
        </div>
    )
}