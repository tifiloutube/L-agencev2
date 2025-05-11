'use client'

import { useState } from 'react'
import styles from './CreatePropertyClient.module.css'

import ChoosePropertyType from '@/components/property/ChoosePropertyType/ChoosePropertyType'
import PropertyForm from '@/components/property/PropertyForm/PropertyForm'

export default function CreatePropertyClient() {
    const [transactionType, setTransactionType] = useState<'vente' | 'location ' | null>(null)

    return (
        <main className={`wrapper ${styles.wrapper}`}>
            {!transactionType && (
                <ChoosePropertyType onSelect={setTransactionType} />
            )}

            {transactionType && (
                <>
                    <h1 className={`h1 ${styles.h1}`}>Mise d'un bien en <span className={styles.h1orange}>{transactionType}</span></h1>
                    <PropertyForm transactionType={transactionType} />
                </>
            )}
        </main>
    )
}