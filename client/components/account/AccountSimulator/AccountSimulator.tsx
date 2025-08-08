'use client'

import { useState } from 'react'
import { useToast } from '@/lib/context/ToastContext'
import styles from './AccountSimulator.module.css'

const MAX_DEBT_RATIO = 0.35

export default function AccountSimulator() {
    const { showToast } = useToast()

    const [amount, setAmount] = useState(200000)
    const [rate, setRate] = useState(1.5)
    const [duration, setDuration] = useState(20)
    const [income, setIncome] = useState(3000)
    const [contribution, setContribution] = useState(20000)

    const [monthly, setMonthly] = useState<number | null>(null)
    const [isEligible, setIsEligible] = useState<boolean | null>(null)
    const [maxAllowedMonthly, setMaxAllowedMonthly] = useState(0)
    const [saving, setSaving] = useState(false)

    const simulate = () => {
        const amountToBorrow = amount - contribution
        const monthlyRate = rate / 100 / 12
        const months = duration * 12

        const monthlyPayment =
            monthlyRate === 0
                ? amountToBorrow / months
                : (amountToBorrow * monthlyRate) /
                (1 - Math.pow(1 + monthlyRate, -months))

        const maxMonthly = income * MAX_DEBT_RATIO

        setMonthly(monthlyPayment)
        setMaxAllowedMonthly(maxMonthly)
        setIsEligible(monthlyPayment <= maxMonthly)
    }

    const saveSimulation = async () => {
        if (monthly === null || !isEligible) return

        setSaving(true)

        const res = await fetch('/api/simulation/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount,
                contribution,
                income,
                duration,
                rate,
                monthly,
                isEligible,
            }),
        })

        setSaving(false)

        if (res.ok) {
            showToast({
                message: 'Simulation enregistrée avec succès',
                type: 'success',
            })
        } else {
            showToast({
                message: 'Erreur lors de la sauvegarde',
                type: 'error',
            })
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Simulateur de crédit immobilier</h2>

            <div className={styles.form}>
                <label className={styles.label}>
                    Montant total du bien (€)
                    <input
                        className={styles.input}
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </label>

                <label className={styles.label}>
                    Apport personnel (€)
                    <input
                        className={styles.input}
                        type="number"
                        value={contribution}
                        onChange={(e) => setContribution(Number(e.target.value))}
                    />
                </label>

                <label className={styles.label}>
                    Revenu mensuel net (€)
                    <input
                        className={styles.input}
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                    />
                </label>

                <label className={styles.label}>
                    Taux d’intérêt annuel (%)
                    <input
                        className={styles.input}
                        type="number"
                        step="0.01"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                    />
                </label>

                <label className={styles.label}>
                    Durée du prêt (années)
                    <input
                        className={styles.input}
                        type="number"
                        min={1}
                        max={25}
                        value={duration}
                        onChange={(e) => setDuration(Math.min(Number(e.target.value), 25))}
                    />
                </label>

                <button className={`button ${styles.button}`} onClick={simulate}>
                    Simuler
                </button>
            </div>

            {monthly !== null && (
                <div className={styles.result}>
                    <div className={styles.resultCard}>
                        <p className={styles.resultLabel}>Mensualité</p>
                        <p className={styles.resultValue}>{monthly.toFixed(0)} €</p>
                    </div>
                    <div className={styles.resultCard}>
                        <p className={styles.resultLabel}>Coût total</p>
                        <p className={styles.resultValue}>
                            {(monthly * duration * 12).toLocaleString('fr-FR')} €
                        </p>
                    </div>
                    <div className={styles.resultCard}>
                        <p className={styles.resultLabel}>Taux d'endettement</p>
                        <p className={styles.resultValue}>
                            {Math.round((monthly / income) * 100)}%
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}