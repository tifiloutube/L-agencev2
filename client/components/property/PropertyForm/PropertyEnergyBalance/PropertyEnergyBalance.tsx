'use client'

import styles from './PropertyEnergyBalance.module.css'

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
        <section className={styles.section}>
            <h2 className={styles.h2}>Résultats du DPE</h2>

            <div className={styles.group}>
                <label>
                    Consommation en énergie primaire :
                    <select value={energyConsumption} onChange={e => setEnergyConsumption(e.target.value)}>
                        <option value="">Sélectionnez une classe</option>
                        <option value="A">A - Logement économe</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G - Logement énergivore</option>
                    </select>
                </label>
            </div>

            <div className={styles.group}>
                <label>
                    Émissions de gaz à effet de serre :
                    <select value={greenhouseGasEmission} onChange={e => setGreenhouseGasEmission(e.target.value)}>
                        <option value="">Sélectionnez une classe</option>
                        <option value="A">A - Peu d’émissions</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G - Fortes émissions</option>
                    </select>
                </label>
            </div>

            <div className={styles.group}>
                <label>
                    Consommation en énergie finale (kWh/m²/an) :
                    <input
                        type="number"
                        placeholder="0"
                        value={finalEnergyConsumption}
                        onChange={e => setFinalEnergyConsumption(e.target.value)}
                    />
                </label>
            </div>

            <div className={styles.group}>
                <label>
                    Estimation des coûts d'énergie (min) :
                    <input
                        type="number"
                        placeholder="0"
                        value={energyCostMin}
                        onChange={e => setEnergyCostMin(e.target.value)}
                    />
                </label>
                <label>
                    Estimation des coûts d'énergie (max) :
                    <input
                        type="number"
                        placeholder="0"
                        value={energyCostMax}
                        onChange={e => setEnergyCostMax(e.target.value)}
                    />
                </label>
            </div>

            <div className={styles.group}>
                <label>
                    Date d'indexation du prix des énergies :
                    <input
                        type="date"
                        value={energyIndexDate}
                        onChange={e => setEnergyIndexDate(e.target.value)}
                    />
                </label>
            </div>
        </section>
    )
}