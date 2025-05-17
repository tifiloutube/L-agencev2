'use client'

import styles from './SubscriptionCanceledBlock.module.css'

type Props = {
    periodEndDate: Date
    remainingDays: number
    onReactivate: () => void
}

export default function SubscriptionCanceledBlock({
                                                      periodEndDate,
                                                      remainingDays,
                                                      onReactivate,
                                                  }: Props) {
    return (
        <>
            <p className={styles.warning}>
                ⚠️ Votre abonnement sera résilié à la fin de la période :{' '}
                <strong>{periodEndDate.toLocaleDateString('fr-FR')}</strong>
                {' '}({`jours restants : ${remainingDays} jour${remainingDays > 1 ? 's' : ''}`})
            </p>
            <button onClick={onReactivate} className={`button ${styles.reactivateButton}`}>
                Reprendre mon abonnement
            </button>
        </>
    )
}