import styles from './PropertyGalleryAndSummary.module.css'

type Props = {
    title: string
    images: { id: string; url: string }[]
    address: string
    zipCode: string
    city: string
    price: number
    surface: number
    description: string
    transactionType: 'vente' | 'location'
}

export default function PropertyGalleryAndSummary({images, address, zipCode, city, price, surface, description, transactionType,}: Props) {
    const isLocation = transactionType === 'location'
    const priceFormatted = price.toLocaleString('fr-FR')

    return (
        <section className={styles.container}>
            <div className={styles.gallery}>
                {images.map(img => (
                    <img
                        key={img.id}
                        src={img.url}
                        alt=""
                        className={styles.galleryImage}
                    />
                ))}
            </div>

            <article className={styles.summaryContainer}>
                <div className={styles.summary}>
                    <div className={styles.infoRow}>
                        <span className={styles.address}>
                            {address}, {zipCode} {city}
                        </span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.price}>
                            {priceFormatted} €
                        </span>

                        {isLocation ? (
                            <span className={styles.priceDetail}>/ mois</span>
                        ) : (
                            <span className={styles.priceDetail}>
                                ({Math.round(price / surface).toLocaleString('fr-FR')} € / m²)
                            </span>
                        )}
                    </div>

                    <div className={`${styles.infoRow} ${styles.description}`}>
                        <p className={styles.description}>{description}</p>
                    </div>
                </div>
            </article>
        </section>
    )
}