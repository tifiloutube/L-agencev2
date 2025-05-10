import styles from './PropertyGalleryAndSummary.module.css'

type Props = {
    title: string
    images: { id: string; url: string }[]
    address: string
    zipCode: string
    city: string
    country: string
    price: number
    description: string
}

export default function PropertyGalleryAndSummary({
                                                      images,
                                                      address,
                                                      zipCode,
                                                      city,
                                                      country,
                                                      price,
                                                      description,
                                                  }: Props) {
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
                            {address}, {zipCode} {city}, {country}
                        </span>
                    </div>

                    <div className={styles.infoRow}>
                        <span className={styles.price}>{price} €</span>
                    </div>

                    <div className={`${styles.infoRow} ${styles.description}`}>
                        <p className={styles.description}>{description}</p>
                    </div>
                </div>
            </article>
        </section>
    )
}
