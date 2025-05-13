'use client'

import PropertyImageUpload from '@/components/property/PropertyImageUpload/PropertyImageUpload'

type Props = {
    hasGarage: boolean
    setHasGarage: (v: boolean) => void
    floor: string
    setFloor: (v: string) => void
    images: string[]
    setImages: (v: string[]) => void
    mode: 'create' | 'edit'
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
    return (
        <section>
            <h2>Informations supplémentaires</h2>

            <div>
                <h3>Garage ou place de parking :</h3>
                <label>
                    Garage
                    <input
                        type="checkbox"
                        checked={hasGarage}
                        onChange={(e) => setHasGarage(e.target.checked)}
                    />
                    <button className={`button`}>Oui</button>
                    <button className={`button`}>Non</button>
                </label>
            </div>

            <div>
                <h3>Combien d'étage votre bien possède t'il ? :</h3>
                <button className={`button`}>-</button>
                <input
                    placeholder="Étage"
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                />
                <button className={`button`}>+</button>
            </div>

            <div>
                <h3>Ajouter des photos :</h3>

                {mode === 'create' && (
                    <>
                        <PropertyImageUpload onImageUploaded={(url) => setImages((prev) => [...prev, url])} />

                        {images.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
                                {images.map((url, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            position: 'relative',
                                            width: 100,
                                            height: 100,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            border: '1px solid #ccc',
                                        }}
                                    >
                                        <img
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setImages((prev) => prev.filter((img) => img !== url))
                                            }
                                            style={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                background: 'rgba(0,0,0,0.6)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                fontSize: 12,
                                                cursor: 'pointer',
                                                lineHeight: '20px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}