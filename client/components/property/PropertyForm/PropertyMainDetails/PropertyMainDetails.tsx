"use client"
import styles from "./PropertyMainDetails.module.css"

type Props = {
    surface: string
    setSurface: (v: string) => void
    rooms: string
    setRooms: (v: string) => void
    bathrooms: string
    setBathrooms: (v: string) => void
    bedrooms?: string
    setBedrooms?: (v: string) => void
    waterRooms?: string
    setWaterRooms?: (v: string) => void
    furnished?: boolean
    setFurnished?: (v: boolean) => void
    balcony?: boolean
    setBalcony?: (v: boolean) => void
    parking?: boolean
    setParking?: (v: boolean) => void
    garden?: boolean
    setGarden?: (v: boolean) => void
}

export default function PropertyMainDetails({
                                                surface,
                                                setSurface,
                                                rooms,
                                                setRooms,
                                                bathrooms,
                                                setBathrooms,
                                                bedrooms = "0",
                                                setBedrooms = () => {},
                                                waterRooms = "0",
                                                setWaterRooms = () => {},
                                                furnished = false,
                                                setFurnished = () => {},
                                                balcony = false,
                                                setBalcony = () => {},
                                                parking = false,
                                                setParking = () => {},
                                                garden = false,
                                                setGarden = () => {},
                                            }: Props) {
    const handleIncrement = (value: string, setter: (v: string) => void, max = 20) => {
        const current = Number.parseInt(value) || 0
        if (current < max) {
            setter((current + 1).toString())
        }
    }

    const handleDecrement = (value: string, setter: (v: string) => void, min = 0) => {
        const current = Number.parseInt(value) || 0
        if (current > min) {
            setter((current - 1).toString())
        }
    }

    const handleInputChange = (value: string, setter: (v: string) => void, max = 20) => {
        const numValue = Number.parseInt(value) || 0
        if (numValue >= 0 && numValue <= max) {
            setter(numValue.toString())
        }
    }

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Caractéristiques principales</h2>
                <p className={styles.sectionDescription}>Précisez les détails techniques de votre bien immobilier</p>
            </div>

            {/* Surface habitable */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label htmlFor="property-surface" className={styles.label}>
                        <span className={styles.labelIcon}>📐</span>
                        Surface habitable
                    </label>
                    <span className={styles.required}>*</span>
                </div>
                <div className={styles.surfaceContainer}>
                    <input
                        id="property-surface"
                        type="number"
                        placeholder="85"
                        value={surface}
                        onChange={(e) => setSurface(e.target.value)}
                        className={styles.surfaceInput}
                        required
                        min="1"
                        max="10000"
                        step="1"
                    />
                    <span className={styles.unit}>m²</span>
                </div>
                <div className={styles.inputHint}>
                    <span className={styles.hintIcon}>💡</span>
                    <span className={styles.hintText}>
            Surface habitable selon la loi Carrez (hors balcons, terrasses, caves)
          </span>
                </div>
            </div>

            {/* Grille des compteurs */}
            <div className={styles.countersGrid}>
                {/* Nombre de pièces */}
                <div className={styles.counterGroup}>
                    <label className={styles.counterLabel}>
                        <span className={styles.labelIcon}>🏠</span>
                        Pièces principales
                    </label>
                    <div className={styles.counter}>
                        <button
                            type="button"
                            onClick={() => handleDecrement(rooms, setRooms, 1)}
                            className={styles.counterButton}
                            disabled={Number.parseInt(rooms) <= 1}
                            aria-label="Diminuer le nombre de pièces"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={rooms}
                            onChange={(e) => handleInputChange(e.target.value, setRooms)}
                            className={styles.counterInput}
                            min="1"
                            max="20"
                            aria-label="Nombre de pièces principales"
                        />
                        <button
                            type="button"
                            onClick={() => handleIncrement(rooms, setRooms)}
                            className={styles.counterButton}
                            disabled={Number.parseInt(rooms) >= 20}
                            aria-label="Augmenter le nombre de pièces"
                        >
                            +
                        </button>
                    </div>
                    <span className={styles.counterHint}>Salon, chambres, bureau...</span>
                </div>

                {/* Nombre de chambres */}
                <div className={styles.counterGroup}>
                    <label className={styles.counterLabel}>
                        <span className={styles.labelIcon}>🛏️</span>
                        Chambres
                    </label>
                    <div className={styles.counter}>
                        <button
                            type="button"
                            onClick={() => handleDecrement(bedrooms, setBedrooms)}
                            className={styles.counterButton}
                            disabled={Number.parseInt(bedrooms) <= 0}
                            aria-label="Diminuer le nombre de chambres"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={bedrooms}
                            onChange={(e) => handleInputChange(e.target.value, setBedrooms)}
                            className={styles.counterInput}
                            min="0"
                            max="15"
                            aria-label="Nombre de chambres"
                        />
                        <button
                            type="button"
                            onClick={() => handleIncrement(bedrooms, setBedrooms, 15)}
                            className={styles.counterButton}
                            disabled={Number.parseInt(bedrooms) >= 15}
                            aria-label="Augmenter le nombre de chambres"
                        >
                            +
                        </button>
                    </div>
                    <span className={styles.counterHint}>Chambres à coucher</span>
                </div>

                {/* Salles de bain */}
                <div className={styles.counterGroup}>
                    <label className={styles.counterLabel}>
                        <span className={styles.labelIcon}>🛁</span>
                        Salles de bain
                    </label>
                    <div className={styles.counter}>
                        <button
                            type="button"
                            onClick={() => handleDecrement(bathrooms, setBathrooms)}
                            className={styles.counterButton}
                            disabled={Number.parseInt(bathrooms) <= 0}
                            aria-label="Diminuer le nombre de salles de bain"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={bathrooms}
                            onChange={(e) => handleInputChange(e.target.value, setBathrooms)}
                            className={styles.counterInput}
                            min="0"
                            max="10"
                            aria-label="Nombre de salles de bain"
                        />
                        <button
                            type="button"
                            onClick={() => handleIncrement(bathrooms, setBathrooms, 10)}
                            className={styles.counterButton}
                            disabled={Number.parseInt(bathrooms) >= 10}
                            aria-label="Augmenter le nombre de salles de bain"
                        >
                            +
                        </button>
                    </div>
                    <span className={styles.counterHint}>Avec baignoire ou douche</span>
                </div>

                {/* Salles d'eau */}
                <div className={styles.counterGroup}>
                    <label className={styles.counterLabel}>
                        <span className={styles.labelIcon}>🚿</span>
                        Salles d'eau
                    </label>
                    <div className={styles.counter}>
                        <button
                            type="button"
                            onClick={() => handleDecrement(waterRooms, setWaterRooms)}
                            className={styles.counterButton}
                            disabled={Number.parseInt(waterRooms) <= 0}
                            aria-label="Diminuer le nombre de salles d'eau"
                        >
                            −
                        </button>
                        <input
                            type="number"
                            value={waterRooms}
                            onChange={(e) => handleInputChange(e.target.value, setWaterRooms)}
                            className={styles.counterInput}
                            min="0"
                            max="10"
                            aria-label="Nombre de salles d'eau"
                        />
                        <button
                            type="button"
                            onClick={() => handleIncrement(waterRooms, setWaterRooms, 10)}
                            className={styles.counterButton}
                            disabled={Number.parseInt(waterRooms) >= 10}
                            aria-label="Augmenter le nombre de salles d'eau"
                        >
                            +
                        </button>
                    </div>
                    <span className={styles.counterHint}>Douche uniquement</span>
                </div>
            </div>

            {/* Équipements et options */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label className={styles.label}>
                        <span className={styles.labelIcon}>⚙️</span>
                        Équipements et options
                    </label>
                </div>

                <div className={styles.optionsGrid}>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="furnished"
                            checked={furnished}
                            onChange={(e) => setFurnished(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="furnished" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}>🪑</span>
                            Meublé
                        </label>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="balcony"
                            checked={balcony}
                            onChange={(e) => setBalcony(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="balcony" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}>🌅</span>
                            Balcon/Terrasse
                        </label>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="parking"
                            checked={parking}
                            onChange={(e) => setParking(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="parking" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}>🚗</span>
                            Parking/Garage
                        </label>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="garden"
                            checked={garden}
                            onChange={(e) => setGarden(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="garden" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}>🌳</span>
                            Jardin
                        </label>
                    </div>
                </div>
            </div>
        </section>
    )
}