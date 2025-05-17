'use client'

import styles from './SubscriptionExpiredBlock.module.css'

type Plan = {
    id: string
    name: string
    priceId: string
    maxProperties: number
}

type Props = {
    plans: Plan[]
    previousPlan?: Plan | null
    onSubscribe: (priceId: string, planId: string, max: number) => void
}

export default function SubscriptionExpiredBlock({ plans, previousPlan, onSubscribe }: Props) {
    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>Votre abonnement a expiré</h2>
            <p className={styles.warning}>
                Votre période d’abonnement est terminée. Choisissez un nouveau plan pour continuer à publier des biens.
            </p>

            {previousPlan && (
                <div className={styles.previousPlanContainer}>
                    <p className={styles.recommendation}>
                        Vous étiez précédemment abonné au plan <strong>{previousPlan.name}</strong>.
                    </p>
                    <button
                        className={`button ${styles.reactivateButton}`}
                        onClick={() => onSubscribe(previousPlan.priceId, previousPlan.id, previousPlan.maxProperties)}
                    >
                        Reprendre mon abonnement {previousPlan.name}
                    </button>
                </div>
            )}

            <div className={styles.planList}>
                <h3 className={styles.subheading}>Choisir un nouveau plan</h3>
                {plans.map(plan => (
                    <button
                        key={plan.id}
                        onClick={() => onSubscribe(plan.priceId, plan.id, plan.maxProperties)}
                        className={`button ${styles.planButton}`}
                    >
                        {plan.name} – {plan.maxProperties} biens
                    </button>
                ))}
            </div>
        </section>
    )
}