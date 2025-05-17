'use client'

import styles from './SubscriptionActiveBlock.module.css'

type Plan = {
    id: string
    name: string
    priceId: string
    maxProperties: number
}

type Props = {
    currentPlanId: string
    currentPlanName: string
    maxProperties: number
    onChangePlan: (plan: Plan) => void
    onCancel: () => void
    plans: Plan[]
}

export default function SubscriptionActiveBlock({
                                                    currentPlanId,
                                                    currentPlanName,
                                                    maxProperties,
                                                    onChangePlan,
                                                    onCancel,
                                                    plans,
                                                }: Props) {
    return (
        <>
            <p><strong>Plan :</strong> {currentPlanName}</p>
            <p><strong>Biens max :</strong> {maxProperties}</p>
            <p><strong>Status :</strong> actif</p>

            <div className={styles.planList}>
                <h2 className={`h2 ${styles.h2}`}>Changer d’abonnement</h2>
                {plans
                    .filter(p => p.id !== currentPlanId)
                    .map(plan => (
                        <button
                            key={plan.id}
                            onClick={() => onChangePlan(plan)}
                            className={`button ${styles.planButton}`}
                        >
                            Passer à {plan.name} – {plan.maxProperties} biens
                        </button>
                    ))}
            </div>

            <button onClick={onCancel} className={`button ${styles.cancelButton}`}>
                Résilier mon abonnement
            </button>
        </>
    )
}