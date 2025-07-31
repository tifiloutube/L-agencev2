'use client'

import styles from './PropertyDetails.module.css'

type Props = {
    surface: number
    rooms: number | null
    bathrooms: number | null
    hasGarage: boolean
    floor: number | null
    address: string
    price: number
    transactionType: 'vente' | 'location' | null

    kitchenEquipped: boolean
    terrace: boolean
    terraceCount: number | null
    terraceSurface: number | null
    balcony: boolean
    balconyCount: number | null
    balconySurface: number | null
    garden: boolean
    pool: boolean
    disabledAccess: boolean
    basement: boolean
    constructionYear: number | null
    landSurface: number | null
    condition: string | null

    energyConsumption: string | null
    greenhouseGasEmission: string | null
    finalEnergyConsumption: number | null
    energyCostMin: number | null
    energyCostMax: number | null
    energyIndexDate: string | null

    latitude: number
    longitude: number
    id: string
    title: string
}

export default function PropertyDetails({
    surface,
    rooms,
    bathrooms,
    hasGarage,
    floor,
    address,
    price,
    transactionType,

    kitchenEquipped,
    terrace,
    terraceCount,
    terraceSurface,
    balcony,
    balconyCount,
    balconySurface,
    garden,
    pool,
    disabledAccess,
    basement,
    constructionYear,
    landSurface,
    condition,

    energyConsumption,
    greenhouseGasEmission,
    finalEnergyConsumption,
    energyCostMin,
    energyCostMax,
    energyIndexDate,
}: Props) {

    const isSale = transactionType === 'vente'
    const isRent = transactionType === 'location'
    const pricePerM2 = isSale && surface ? Math.round(price / surface) : null

    return (
        <section className={styles.section}>
            <h2 className={styles.subTitle}>Informations et caractéristiques</h2>

            <div className={styles.transactionType}>
                {transactionType && (
                    <p className={styles.infoRow}>
                        <span className={styles.value}>
                        {transactionType === 'vente' ? 'Vente' : 'Location'} :
                        </span>
                    </p>
                )}
                <span className={styles.price}>
                    {price.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                    {isRent && ' /mois'}
                </span>
                {pricePerM2 && (
                    <span className={styles.subText}>soit {pricePerM2} €/m²</span>
                )}
            </div>

            <article className={styles.informations}>
                <div>
                    <h2 className={styles.titleInfo}>Informations générales</h2>
                    <div className={styles.infoBien}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Surface : </span>
                            <span className={styles.value}>{surface} m²</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Pièces : </span>
                            <span className={styles.value}>{rooms ?? 'N.C'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Salles de bain : </span>
                            <span className={styles.value}>{bathrooms ?? 'N.C'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Garage : </span>
                            <span className={styles.value}>{hasGarage ? 'Oui' : 'Non'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Étage : </span>
                            <span className={styles.value}>{floor ?? 'N.C'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Adresse : </span>
                            <span className={styles.value}>{address}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className={styles.titleInfo}>Équipements & confort</h2>
                    <div className={styles.infoInterieur}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Cuisine équipée : </span>
                            <span className={styles.value}>{kitchenEquipped ? 'Oui' : 'Non'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Terrasse : </span>
                            <span className={styles.value}>
          {terrace ? `${terraceCount ?? 1} — ${terraceSurface ?? '?'} m²` : 'Non'}
        </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Balcon : </span>
                            <span className={styles.value}>
          {balcony ? `${balconyCount ?? 1} — ${balconySurface ?? '?'} m²` : 'Non'}
        </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Jardin : </span>
                            <span className={styles.value}>{garden ? 'Oui' : 'Non'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Piscine : </span>
                            <span className={styles.value}>{pool ? 'Oui' : 'Non'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Accès handicapé : </span>
                            <span className={styles.value}>{disabledAccess ? 'Oui' : 'Non'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Sous-sol : </span>
                            <span className={styles.value}>{basement ? 'Oui' : 'Non'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className={styles.titleInfo}>Environnement & performance énergétique</h2>
                    <div className={styles.infoEcologie}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Année de construction : </span>
                            <span className={styles.value}>{constructionYear ?? 'N.C'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Surface du terrain : </span>
                            <span className={styles.value}>{landSurface ? `${landSurface} m²` : 'N.C'}</span>
                        </div>
                        {condition && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>État : </span>
                                <span className={styles.value}>{condition}</span>
                            </div>
                        )}

                        {finalEnergyConsumption !== null && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Consommation énergie finale : </span>
                                <span className={styles.value}>{finalEnergyConsumption} kWh</span>
                            </div>
                        )}
                        {(energyCostMin || energyCostMax) && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Estimation coût énergie : </span>
                                <span className={styles.value}>
                                    {energyCostMin ?? '?'} € – {energyCostMax ?? '?'} €
                                </span>
                            </div>
                        )}
                        {energyIndexDate && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Date d’indexation : </span>
                                <span className={styles.value}>{energyIndexDate}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.diagnostics}>
                        {energyConsumption && (
                            <div className={styles.infoRow}>
                              <span className={styles.label}>
                                DPE <span className={styles.signification}>(Diagnostic de Performance Énergétique)</span>
                              </span>
                                <div className={styles.diagnosticScale}>
                                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => (
                                        <span
                                            key={letter}
                                            className={`${styles.scaleItem} ${
                                                energyConsumption === letter ? styles.active : ''
                                            } ${styles[`scale${letter}`]}`}
                                        >
                                            {energyConsumption === letter ? letter : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {greenhouseGasEmission && (
                            <div className={styles.infoRow}>
                              <span className={styles.label}>
                                GES <span className={styles.signification}>(Gaz à Effet de Serre)</span>
                              </span>
                                <div className={styles.diagnosticScale}>
                                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => (
                                        <span
                                            key={letter}
                                            className={`${styles.scaleItem} ${
                                                greenhouseGasEmission === letter ? styles.active : ''
                                            } ${styles[`scale${letter}`]}`}
                                        >
                                            {greenhouseGasEmission === letter ? letter : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </section>
    )
}