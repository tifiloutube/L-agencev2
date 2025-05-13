'use client'

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
    transactionType: 'vente' | 'location'
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
    return (
        <section>
            <h2>Autres informations</h2>

            <label>
                <input type="checkbox" checked={kitchenEquipped} onChange={e => setKitchenEquipped(e.target.checked)} />
                Cuisine équipée
            </label>

            <label>
                <input type="checkbox" checked={terrace} onChange={e => setTerrace(e.target.checked)} />
                Terrasse
            </label>

            {terrace && (
                <div>
                    <label>
                        Nombre de terrasses :
                        <input
                            type="number"
                            value={terraceCount}
                            onChange={e => setTerraceCount(e.target.value)}
                            placeholder="ex: 1"
                        />
                    </label>
                    <label>
                        Surface totale des terrasses (m²) :
                        <input
                            type="number"
                            value={terraceSurface}
                            onChange={e => setTerraceSurface(e.target.value)}
                            placeholder="ex: 20"
                        />
                    </label>
                </div>
            )}

            <label>
                <input type="checkbox" checked={balcony} onChange={e => setBalcony(e.target.checked)} />
                Balcon
            </label>

            {balcony && (
                <div>
                    <label>
                        Nombre de balcons :
                        <input
                            type="number"
                            value={balconyCount}
                            onChange={e => setBalconyCount(e.target.value)}
                            placeholder="ex: 2"
                        />
                    </label>
                    <label>
                        Surface totale des balcons (m²) :
                        <input
                            type="number"
                            value={balconySurface}
                            onChange={e => setBalconySurface(e.target.value)}
                            placeholder="ex: 6"
                        />
                    </label>
                </div>
            )}

            <label>
                <input type="checkbox" checked={garden} onChange={e => setGarden(e.target.checked)} />
                Jardin
            </label>

            <label>
                <input type="checkbox" checked={pool} onChange={e => setPool(e.target.checked)} />
                Piscine
            </label>

            <label>
                <input type="checkbox" checked={disabledAccess} onChange={e => setDisabledAccess(e.target.checked)} />
                Accessible aux personnes handicapées
            </label>

            <label>
                <input type="checkbox" checked={basement} onChange={e => setBasement(e.target.checked)} />
                Sous-sol
            </label>

            <div>
                <label>
                    Année de construction :
                    <input
                        type="number"
                        placeholder="Ex: 1998"
                        value={constructionYear}
                        onChange={e => setConstructionYear(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    Surface du terrain (si maison) :
                    <input
                        type="number"
                        placeholder="en m²"
                        value={landSurface}
                        onChange={e => setLandSurface(e.target.value)}
                    />
                </label>
            </div>

            {transactionType === 'vente' && (
                <div>
                    <label>
                        État du bien :
                        <select value={condition} onChange={e => setCondition(e.target.value)}>
                            <option value="">Sélectionnez un état</option>
                            <option value="neuf">Neuf</option>
                            <option value="bon">Bon</option>
                            <option value="partiellement_renove">Partiellement rénové</option>
                            <option value="renovation_necessaire">Rénovation nécessaire</option>
                        </select>
                    </label>
                </div>
            )}
        </section>
    )
}