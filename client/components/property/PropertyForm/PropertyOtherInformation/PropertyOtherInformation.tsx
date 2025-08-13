"use client"
import styles from "./PropertyOtherInformation.module.css"

type Props = {
    kitchenEquipped: boolean
    setKitchenEquipped: (v: boolean) => void
    terrace: boolean
    setTerrace: (v: boolean) => void
    balcony: boolean
    setBalcony: (v: boolean) => void
    terraceCount: string
    setTerraceCount: (v: string) => void
    terraceSurface: string
    setTerraceSurface: (v: string) => void
    balconyCount: string
    setBalconyCount: (v: string) => void
    balconySurface: string
    setBalconySurface: (v: string) => void
    garden: boolean
    setGarden: (v: boolean) => void
    pool: boolean
    setPool: (v: boolean) => void
    disabledAccess: boolean
    setDisabledAccess: (v: boolean) => void
    basement: boolean
    setBasement: (v: boolean) => void
    constructionYear: string
    setConstructionYear: (v: string) => void
    landSurface: string
    setLandSurface: (v: string) => void
    condition: string
    setCondition: (v: string) => void
    transactionType: "vente" | "location"
}

export default function PropertyOtherInformation({
                                                     kitchenEquipped,
                                                     setKitchenEquipped,
                                                     terrace,
                                                     setTerrace,
                                                     balcony,
                                                     setBalcony,
                                                     terraceCount,
                                                     setTerraceCount,
                                                     terraceSurface,
                                                     setTerraceSurface,
                                                     balconyCount,
                                                     setBalconyCount,
                                                     balconySurface,
                                                     setBalconySurface,
                                                     garden,
                                                     setGarden,
                                                     pool,
                                                     setPool,
                                                     disabledAccess,
                                                     setDisabledAccess,
                                                     basement,
                                                     setBasement,
                                                     constructionYear,
                                                     setConstructionYear,
                                                     landSurface,
                                                     setLandSurface,
                                                     condition,
                                                     setCondition,
                                                     transactionType,
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

    const currentYear = new Date().getFullYear()

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Autres informations</h2>
                <p className={styles.sectionDescription}>
                    Détails complémentaires sur les équipements, l'extérieur et l'état du bien
                </p>
            </div>

            {/* Équipements intérieurs */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label className={styles.label}>
                        <span className={styles.labelIcon}>🛋️</span>
                        Équipements intérieurs
                    </label>
                </div>
                <div className={styles.checkboxGrid}>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="kitchenEquipped"
                            checked={kitchenEquipped}
                            onChange={(e) => setKitchenEquipped(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="kitchenEquipped" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}>🍳</span>
                            Cuisine équipée
                        </label>
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="disabledAccess"
                            checked={disabledAccess}
                            onChange={(e) => setDisabledAccess(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="disabledAccess" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}>♿</span>
                            Accessible PMR
                        </label>
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="basement"
                            checked={basement}
                            onChange={(e) => setBasement(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="basement" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}> cellar</span>
                            Sous-sol / Cave
                        </label>
                    </div>
                </div>
            </div>

            {/* Extérieurs */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label className={styles.label}>
                        <span className={styles.labelIcon}>🌳</span>
                        Extérieurs
                    </label>
                </div>
                <div className={styles.checkboxGrid}>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="terrace"
                            checked={terrace}
                            onChange={(e) => setTerrace(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="terrace" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}>🌅</span>
                            Terrasse
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
                            <span className={styles.checkboxIcon}> balcon</span>
                            Balcon
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
                            <span className={styles.checkboxIcon}>🏡</span>
                            Jardin
                        </label>
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="pool"
                            checked={pool}
                            onChange={(e) => setPool(e.target.checked)}
                            className={styles.checkbox}
                        />
                        <label htmlFor="pool" className={styles.checkboxLabel}>
                            <span className={styles.checkboxIcon}>🏊</span>
                            Piscine
                        </label>
                    </div>
                </div>

                {terrace && (
                    <div className={styles.nestedInputs}>
                        <div className={styles.inputWrapper}>
                            <label htmlFor="terrace-count" className={styles.inputLabel}>
                                Nombre de terrasses
                            </label>
                            <div className={styles.counter}>
                                <button
                                    type="button"
                                    onClick={() => handleDecrement(terraceCount, setTerraceCount, 1)}
                                    className={styles.counterButton}
                                    disabled={Number.parseInt(terraceCount) <= 1}
                                    aria-label="Diminuer le nombre de terrasses"
                                >
                                    −
                                </button>
                                <input
                                    id="terrace-count"
                                    type="number"
                                    value={terraceCount}
                                    onChange={(e) => handleInputChange(e.target.value, setTerraceCount, 10)}
                                    className={styles.counterInput}
                                    min="1"
                                    max="10"
                                    aria-label="Nombre de terrasses"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleIncrement(terraceCount, setTerraceCount, 10)}
                                    className={styles.counterButton}
                                    disabled={Number.parseInt(terraceCount) >= 10}
                                    aria-label="Augmenter le nombre de terrasses"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className={styles.inputWrapper}>
                            <label htmlFor="terrace-surface" className={styles.inputLabel}>
                                Surface totale des terrasses
                            </label>
                            <div className={styles.inputWithUnit}>
                                <input
                                    id="terrace-surface"
                                    type="number"
                                    placeholder="20"
                                    value={terraceSurface}
                                    onChange={(e) => setTerraceSurface(e.target.value)}
                                    className={styles.input}
                                    min="0"
                                    max="1000"
                                />
                                <span className={styles.unit}>m²</span>
                            </div>
                        </div>
                    </div>
                )}

                {balcony && (
                    <div className={styles.nestedInputs}>
                        <div className={styles.inputWrapper}>
                            <label htmlFor="balcony-count" className={styles.inputLabel}>
                                Nombre de balcons
                            </label>
                            <div className={styles.counter}>
                                <button
                                    type="button"
                                    onClick={() => handleDecrement(balconyCount, setBalconyCount, 1)}
                                    className={styles.counterButton}
                                    disabled={Number.parseInt(balconyCount) <= 1}
                                    aria-label="Diminuer le nombre de balcons"
                                >
                                    −
                                </button>
                                <input
                                    id="balcony-count"
                                    type="number"
                                    value={balconyCount}
                                    onChange={(e) => handleInputChange(e.target.value, setBalconyCount, 10)}
                                    className={styles.counterInput}
                                    min="1"
                                    max="10"
                                    aria-label="Nombre de balcons"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleIncrement(balconyCount, setBalconyCount, 10)}
                                    className={styles.counterButton}
                                    disabled={Number.parseInt(balconyCount) >= 10}
                                    aria-label="Augmenter le nombre de balcons"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className={styles.inputWrapper}>
                            <label htmlFor="balcony-surface" className={styles.inputLabel}>
                                Surface totale des balcons
                            </label>
                            <div className={styles.inputWithUnit}>
                                <input
                                    id="balcony-surface"
                                    type="number"
                                    placeholder="6"
                                    value={balconySurface}
                                    onChange={(e) => setBalconySurface(e.target.value)}
                                    className={styles.input}
                                    min="0"
                                    max="500"
                                />
                                <span className={styles.unit}>m²</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Informations générales */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label className={styles.label}>
                        <span className={styles.labelIcon}>ℹ️</span>
                        Informations générales
                    </label>
                </div>
                <div className={styles.generalInfoGrid}>
                    <div className={styles.inputWrapper}>
                        <label htmlFor="construction-year" className={styles.inputLabel}>
                            Année de construction
                        </label>
                        <input
                            id="construction-year"
                            type="number"
                            placeholder="Ex: 1998"
                            value={constructionYear}
                            onChange={(e) => handleInputChange(e.target.value, setConstructionYear, currentYear)}
                            className={styles.input}
                            min="1800"
                            max={currentYear}
                        />
                    </div>
                    <div className={styles.inputWrapper}>
                        <label htmlFor="land-surface" className={styles.inputLabel}>
                            Surface du terrain (si maison)
                        </label>
                        <div className={styles.inputWithUnit}>
                            <input
                                id="land-surface"
                                type="number"
                                placeholder="500"
                                value={landSurface}
                                onChange={(e) => setLandSurface(e.target.value)}
                                className={styles.input}
                                min="0"
                                max="100000"
                            />
                            <span className={styles.unit}>m²</span>
                        </div>
                    </div>
                    {transactionType === "vente" && (
                        <div className={styles.inputWrapper}>
                            <label htmlFor="property-condition" className={styles.inputLabel}>
                                État du bien
                            </label>
                            <select
                                id="property-condition"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">Sélectionnez un état</option>
                                <option value="neuf">Neuf</option>
                                <option value="excellent">Excellent</option>
                                <option value="bon">Bon</option>
                                <option value="partiellement_renove">Partiellement rénové</option>
                                <option value="renovation_necessaire">Rénovation nécessaire</option>
                                <option value="a_renover">À rénover entièrement</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}