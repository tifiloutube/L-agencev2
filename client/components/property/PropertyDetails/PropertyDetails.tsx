import styles from './PropertyDetails.module.css'

type Props = {
    surface: number
    rooms: number | null
    bathrooms: number | null
    hasGarage: boolean
    floor: number | null
    address: string
    description: string
}

export default function PropertyDetails({
                                            surface,
                                            rooms,
                                            bathrooms,
                                            hasGarage,
                                            floor,
                                            address,
                                            description,
                                        }: Props) {
    return (
        <section className={styles.section}>
            <div className={styles.infoRow}>
                <span className={styles.label}>Surface :</span>
                <span className={styles.value}>{surface} m²</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.label}>Pièces :</span>
                <span className={styles.value}>{rooms ?? 'N.C'}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.label}>Salles de bain :</span>
                <span className={styles.value}>{bathrooms ?? 'N.C'}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.label}>Garage :</span>
                <span className={styles.value}>{hasGarage ? 'Oui' : 'Non'}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.label}>Étage :</span>
                <span className={styles.value}>{floor ?? 'N.C'}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.label}>Adresse :</span>
                <span className={styles.value}>{address}</span>
            </div>
            <div className={`${styles.infoRow} ${styles.description}`}>
                <span className={styles.label}>Description :</span>
                <p className={styles.value}>{description}</p>
            </div>
        </section>
    )
}