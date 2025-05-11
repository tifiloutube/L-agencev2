'use client'

import styles from './ChoosePropertyType.module.css'

type Props = {
    onSelect: (type: 'vente' | 'location') => void
}

export default function ChoosePropertyType({ onSelect }: Props) {
    return (
        <div className={`wrapper ${styles.wrapper}`}>
            <h1 className={`h1 ${styles.h1}`}>Ajouter un bien</h1>
            <div className={styles.buttonsContainer}>
                <button className={`button ${styles.vente}`} onClick={() => onSelect('vente')}>
                    En vente
                </button>
                <h2>ou</h2>
                <button className={`button ${styles.location}`} onClick={() => onSelect('location')}>
                    En location
                </button>
            </div>
        </div>
    )
}