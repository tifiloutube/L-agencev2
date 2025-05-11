'use client'

type Props = {
    surface: string
    setSurface: (v: string) => void
    rooms: string
    setRooms: (v: string) => void
    bathrooms: string
    setBathrooms: (v: string) => void
    // Ajoute d'autres champs ici si tu veux gérer "meublé" plus tard
}

export default function PropertyMainDetails({
                                                surface,
                                                setSurface,
                                                rooms,
                                                setRooms,
                                                bathrooms,
                                                setBathrooms,
                                            }: Props) {
    return (
        <section>
            <h2>Informations principales</h2>

            <div>
                <h3>Surface habitable</h3>
                <input
                    placeholder="Surface"
                    type="number"
                    value={surface}
                    onChange={(e) => setSurface(e.target.value)}
                    required
                />
                <p>m²</p>
            </div>

            <div>
                <h3>Nombre de pièces</h3>
                <input
                    placeholder="Pièces"
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                />
            </div>

            <div>
                <h3>Nombre de salles de bain</h3>
                <input
                    placeholder="Salles de bain"
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                />
            </div>
        </section>
    )
}