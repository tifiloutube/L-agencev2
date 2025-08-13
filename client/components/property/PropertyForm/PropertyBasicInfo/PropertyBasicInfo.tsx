"use client"

import styles from "./PropertyBasicInfo.module.css"

type Props = {
    title: string
    setTitle: (v: string) => void
    description: string
    setDescription: (v: string) => void
    type: string
    setType: (v: string) => void
    price: string
    setPrice: (v: string) => void
    address: string
    setAddress: (v: string) => void
    city: string
    setCity: (v: string) => void
    zipCode: string
    setZipCode: (v: string) => void
    country: string
    setCountry: (v: string) => void
}

const propertyTypes = [
    "Appartement",
    "Maison",
    "Studio",
    "Loft",
    "Villa",
    "Duplex",
    "Triplex",
    "Penthouse",
    "Château",
    "Ferme",
    "Terrain",
    "Local commercial",
    "Bureau",
    "Entrepôt",
    "Garage",
    "Cave",
    "Autre",
]

export default function PropertyBasicInfo({
                                              title,
                                              setTitle,
                                              description,
                                              setDescription,
                                              type,
                                              setType,
                                              price,
                                              setPrice,
                                              address,
                                              setAddress,
                                              city,
                                              setCity,
                                              zipCode,
                                              setZipCode,
                                              country,
                                              setCountry,
                                          }: Props) {
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Informations de base</h2>
                <p className={styles.sectionDescription}>Décrivez votre bien immobilier avec les informations essentielles</p>
            </div>

            {/* Titre du bien */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label htmlFor="property-title" className={styles.label}>
                        <span className={styles.labelIcon}>🏷️</span>
                        Titre de votre bien
                    </label>
                    <span className={styles.required}>*</span>
                </div>
                <input
                    id="property-title"
                    type="text"
                    placeholder="Ex: Magnifique appartement avec vue sur mer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                    required
                    maxLength={100}
                />
                <div className={styles.inputHint}>
                    <span className={styles.hintIcon}>💡</span>
                    <span className={styles.hintText}>Choisissez un titre accrocheur qui met en valeur votre bien</span>
                </div>
            </div>

            {/* Type de bien */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label htmlFor="property-type" className={styles.label}>
                        <span className={styles.labelIcon}>🏠</span>
                        Type de bien
                    </label>
                    <span className={styles.required}>*</span>
                </div>
                <select
                    id="property-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={styles.select}
                    required
                >
                    <option value="">Sélectionnez le type de bien</option>
                    {propertyTypes.map((propertyType) => (
                        <option key={propertyType} value={propertyType}>
                            {propertyType}
                        </option>
                    ))}
                </select>
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label htmlFor="property-description" className={styles.label}>
                        <span className={styles.labelIcon}>📝</span>
                        Description détaillée
                    </label>
                    <span className={styles.required}>*</span>
                </div>
                <textarea
                    id="property-description"
                    placeholder="Décrivez votre bien en détail : caractéristiques, avantages, environnement..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textarea}
                    required
                    rows={6}
                    maxLength={2000}
                />
                <div className={styles.characterCount}>{description.length}/2000 caractères</div>
            </div>

            {/* Localisation */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label className={styles.label}>
                        <span className={styles.labelIcon}>📍</span>
                        Localisation
                    </label>
                    <span className={styles.required}>*</span>
                </div>

                <div className={styles.locationGrid}>
                    <div className={styles.inputWrapper}>
                        <label htmlFor="property-address" className={styles.inputLabel}>
                            Adresse complète
                        </label>
                        <input
                            id="property-address"
                            type="text"
                            placeholder="123 rue de la Paix"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <label htmlFor="property-city" className={styles.inputLabel}>
                            Ville
                        </label>
                        <input
                            id="property-city"
                            type="text"
                            placeholder="Paris"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <label htmlFor="property-zipcode" className={styles.inputLabel}>
                            Code postal
                        </label>
                        <input
                            id="property-zipcode"
                            type="text"
                            placeholder="75001"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className={styles.input}
                            required
                            pattern="[0-9]{5}"
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <label htmlFor="property-country" className={styles.inputLabel}>
                            Pays
                        </label>
                        <select
                            id="property-country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="">Sélectionnez un pays</option>
                            <option value="France">France</option>
                            <option value="Belgique">Belgique</option>
                            <option value="Suisse">Suisse</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Canada">Canada</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Prix */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label htmlFor="property-price" className={styles.label}>
                        <span className={styles.labelIcon}>💰</span>
                        Prix
                    </label>
                    <span className={styles.required}>*</span>
                </div>
                <div className={styles.priceContainer}>
                    <input
                        id="property-price"
                        type="number"
                        placeholder="250000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={styles.priceInput}
                        required
                        min="0"
                        step="1000"
                    />
                    <span className={styles.currency}>€</span>
                </div>
                <div className={styles.inputHint}>
                    <span className={styles.hintIcon}>💡</span>
                    <span className={styles.hintText}>
            Indiquez le prix de vente ou le loyer mensuel selon le type de transaction
          </span>
                </div>
            </div>
        </section>
    )
}