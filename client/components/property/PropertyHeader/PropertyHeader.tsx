'use client'

import styles from './PropertyHeader.module.css'

type Props = {
    title: string
}

export default function PropertyHeader({ title }: Props) {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
        </header>
    )
}