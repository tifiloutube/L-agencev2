"use client"
import PropertyImageUpload from "@/components/property/PropertyImageUpload/PropertyImageUpload"
import styles from "./PropertyAdditionalInfo.module.css"

type Props = {
    hasGarage: boolean
    setHasGarage: (v: boolean) => void
    floor: string
    setFloor: (v: string) => void
    images: string[]
    setImages: (v: string[]) => void
    mode: "create" | "edit"
}

export default function PropertyAdditionalInfo({
                                                   hasGarage,
                                                   setHasGarage,
                                                   floor,
                                                   setFloor,
                                                   images,
                                                   setImages,
                                                   mode,
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

    const handleRemoveImage = (urlToRemove: string) => {
        setImages((prev) => prev.filter((imgUrl) => imgUrl !== urlToRemove))
    }

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Informations supplémentaires</h2>
                <p className={styles.sectionDescription}>
                    Ajoutez des détails complémentaires et des photos pour valoriser votre bien
                </p>
            </div>

            {/* Garage ou parking */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label className={styles.label}>
                        <span className={styles.labelIcon}>🅿️</span>
                        Garage ou place de parking
                    </label>
                </div>
                <div className={styles.toggleSwitch}>
                    <button
                        type="button"
                        className={`${styles.toggleButton} ${hasGarage ? styles.active : ""}`}
                        onClick={() => setHasGarage(true)}
                        aria-pressed={hasGarage}
                    >
                        Oui
                    </button>
                    <button
                        type="button"
                        className={`${styles.toggleButton} ${!hasGarage ? styles.active : ""}`}
                        onClick={() => setHasGarage(false)}
                        aria-pressed={!hasGarage}
                    >
                        Non
                    </button>
                </div>
            </div>

            {/* Nombre d'étages */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label htmlFor="property-floor" className={styles.label}>
                        <span className={styles.labelIcon}>🪜</span>
                        Étage du bien
                    </label>
                </div>
                <div className={styles.counter}>
                    <button
                        type="button"
                        onClick={() => handleDecrement(floor, setFloor, 0)}
                        className={styles.counterButton}
                        disabled={Number.parseInt(floor) <= 0}
                        aria-label="Diminuer le nombre d'étages"
                    >
                        −
                    </button>
                    <input
                        id="property-floor"
                        type="number"
                        placeholder="0"
                        value={floor}
                        onChange={(e) => handleInputChange(e.target.value, setFloor, 50)}
                        className={styles.counterInput}
                        min="0"
                        max="50"
                        aria-label="Étage du bien"
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement(floor, setFloor, 50)}
                        className={styles.counterButton}
                        disabled={Number.parseInt(floor) >= 50}
                        aria-label="Augmenter le nombre d'étages"
                    >
                        +
                    </button>
                </div>
                <div className={styles.inputHint}>
                    <span className={styles.hintIcon}>💡</span>
                    <span className={styles.hintText}>Indiquez l'étage où se situe le bien (0 pour rez-de-chaussée)</span>
                </div>
            </div>

            {/* Ajout de photos */}
            <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                    <label className={styles.label}>
                        <span className={styles.labelIcon}>📸</span>
                        Photos du bien
                    </label>
                </div>
                {mode === "create" && (
                    <>
                        <PropertyImageUpload onImageUploaded={(url) => setImages((prev) => [...prev, url])} />
                        {images.length > 0 && (
                            <div className={styles.imagePreviewGrid}>
                                {images.map((url, index) => (
                                    <div key={index} className={styles.imagePreviewCard}>
                                        <img src={url || "/placeholder.svg"} alt={`Image ${index + 1}`} className={styles.previewImage} />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(url)}
                                            className={styles.removeImageButton}
                                            aria-label={`Supprimer l'image ${index + 1}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {images.length === 0 && (
                            <div className={styles.noImagesHint}>
                                <span className={styles.hintIcon}>💡</span>
                                <span className={styles.hintText}>Ajoutez au moins une photo pour que votre bien soit visible.</span>
                            </div>
                        )}
                    </>
                )}
                {mode === "edit" && (
                    <div className={styles.editModeMessage}>
                        <span className={styles.hintIcon}>ℹ️</span>
                        <span className={styles.hintText}>
              La gestion des images en mode édition se fait via une section dédiée.
            </span>
                    </div>
                )}
            </div>
        </section>
    )
}