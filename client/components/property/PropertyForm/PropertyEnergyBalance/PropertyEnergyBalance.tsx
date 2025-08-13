"use client"
import styles from "./PropertyEnergyBalance.module.css"

type Props = {
    energyConsumption: string
    setEnergyConsumption: (v: string) => void
    greenhouseGasEmission: string
    setGreenhouseGasEmission: (v: string) => void
    finalEnergyConsumption: string
    setFinalEnergyConsumption: (v: string) => void
    energyCostMin: string
    setEnergyCostMin: (v: string) => void
    energyCostMax: string
    setEnergyCostMax: (v: string) => void
    energyIndexDate: string
    setEnergyIndexDate: (v: string) => void
}

const energyClasses = [
    { value: "A", label: "A - Logement très économe" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "G", label: "G - Logement très énergivore" },
]

const emissionClasses = [
    { value: "A", label: "A - Très faibles émissions" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "G", label: "G - Très fortes émissions" },
]

export default function PropertyEnergyBalance({
                                                  energyConsumption,
                                                  setEnergyConsumption,
                                                  greenhouseGasEmission,
                                                  setGreenhouseGasEmission,
                                                  finalEnergyConsumption,
                                                  setFinalEnergyConsumption,
                                                  energyCostMin,
                                                  setEnergyCostMin,
                                                  energyCostMax,
                                                  setEnergyCostMax,
                                                  energyIndexDate,
                                                  setEnergyIndexDate,
                                              }: Props) {
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Bilan Énergétique (DPE)</h2>
                <p className={styles.sectionDescription}>
                    Informations sur la performance énergétique et les émissions de gaz à effet de serre
                </p>
            </div>

            <div className={styles.formGrid}>
                {/* Consommation en énergie primaire */}
                <div className={styles.formGroup}>
                    <div className={styles.labelContainer}>
                        <label htmlFor="energy-consumption" className={styles.label}>
                            <span className={styles.labelIcon}>⚡</span>
                            Consommation en énergie primaire
                        </label>
                    </div>
                    <select
                        id="energy-consumption"
                        value={energyConsumption}
                        onChange={(e) => setEnergyConsumption(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Sélectionnez une classe</option>
                        {energyClasses.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className={styles.inputHint}>
                        <span className={styles.hintIcon}>💡</span>
                        <span className={styles.hintText}>Classe énergétique du logement (A à G)</span>
                    </div>
                </div>

                {/* Émissions de gaz à effet de serre */}
                <div className={styles.formGroup}>
                    <div className={styles.labelContainer}>
                        <label htmlFor="greenhouse-gas-emission" className={styles.label}>
                            <span className={styles.labelIcon}>💨</span>
                            Émissions de gaz à effet de serre
                        </label>
                    </div>
                    <select
                        id="greenhouse-gas-emission"
                        value={greenhouseGasEmission}
                        onChange={(e) => setGreenhouseGasEmission(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Sélectionnez une classe</option>
                        {emissionClasses.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className={styles.inputHint}>
                        <span className={styles.hintIcon}>💡</span>
                        <span className={styles.hintText}>Classe d'émissions de GES (A à G)</span>
                    </div>
                </div>

                {/* Consommation en énergie finale */}
                <div className={styles.formGroup}>
                    <div className={styles.labelContainer}>
                        <label htmlFor="final-energy-consumption" className={styles.label}>
                            <span className={styles.labelIcon}>📊</span>
                            Consommation en énergie finale
                        </label>
                    </div>
                    <div className={styles.inputWithUnit}>
                        <input
                            id="final-energy-consumption"
                            type="number"
                            placeholder="0"
                            value={finalEnergyConsumption}
                            onChange={(e) => setFinalEnergyConsumption(e.target.value)}
                            className={styles.input}
                            min="0"
                        />
                        <span className={styles.unit}>kWh/m²/an</span>
                    </div>
                    <div className={styles.inputHint}>
                        <span className={styles.hintIcon}>💡</span>
                        <span className={styles.hintText}>Consommation annuelle d'énergie finale</span>
                    </div>
                </div>

                {/* Estimation des coûts d'énergie */}
                <div className={styles.formGroup}>
                    <div className={styles.labelContainer}>
                        <label className={styles.label}>
                            <span className={styles.labelIcon}>💰</span>
                            Estimation des coûts d'énergie
                        </label>
                    </div>
                    <div className={styles.costInputs}>
                        <div className={styles.inputWithUnit}>
                            <input
                                type="number"
                                placeholder="Min"
                                value={energyCostMin}
                                onChange={(e) => setEnergyCostMin(e.target.value)}
                                className={styles.input}
                                min="0"
                            />
                            <span className={styles.unit}>€</span>
                        </div>
                        <div className={styles.inputWithUnit}>
                            <input
                                type="number"
                                placeholder="Max"
                                value={energyCostMax}
                                onChange={(e) => setEnergyCostMax(e.target.value)}
                                className={styles.input}
                                min="0"
                            />
                            <span className={styles.unit}>€</span>
                        </div>
                    </div>
                    <div className={styles.inputHint}>
                        <span className={styles.hintIcon}>💡</span>
                        <span className={styles.hintText}>Fourchette annuelle estimée des dépenses énergétiques</span>
                    </div>
                </div>

                {/* Date d'indexation */}
                <div className={styles.formGroup}>
                    <div className={styles.labelContainer}>
                        <label htmlFor="energy-index-date" className={styles.label}>
                            <span className={styles.labelIcon}>📅</span>
                            Date d'indexation du prix des énergies
                        </label>
                    </div>
                    <input
                        id="energy-index-date"
                        type="date"
                        value={energyIndexDate}
                        onChange={(e) => setEnergyIndexDate(e.target.value)}
                        className={styles.input}
                    />
                    <div className={styles.inputHint}>
                        <span className={styles.hintIcon}>💡</span>
                        <span className={styles.hintText}>Date de référence pour les prix de l'énergie</span>
                    </div>
                </div>
            </div>
        </section>
    )
}