'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PropertyImageUpload from '@/components/property/PropertyImageUpload/PropertyImageUpload'
import { useToast } from '@/lib/context/ToastContext'

type Props = {
    mode?: 'edit' | 'create'
    property?: any
}

export default function PropertyForm({ mode = 'create', property }: Props) {
    const { showToast } = useToast()
    const router = useRouter()

    const [title, setTitle] = useState(property?.title || '')
    const [description, setDescription] = useState(property?.description || '')
    const [type, setType] = useState(property?.type || 'Maison')
    const [price, setPrice] = useState(property?.price?.toString() || '')
    const [surface, setSurface] = useState(property?.surface?.toString() || '')
    const [rooms, setRooms] = useState(property?.rooms?.toString() || '')
    const [bathrooms, setBathrooms] = useState(property?.bathrooms?.toString() || '')
    const [hasGarage, setHasGarage] = useState(property?.hasGarage || false)
    const [floor, setFloor] = useState(property?.floor?.toString() || '')
    const [address, setAddress] = useState(property?.address || '')
    const [city, setCity] = useState(property?.city || '')
    const [zipCode, setZipCode] = useState(property?.zipCode || '')
    const [country, setCountry] = useState(property?.country || '')
    const [images, setImages] = useState<string[]>([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (mode === 'edit') {
                const res = await fetch(`/api/properties/${property.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        description,
                        type,
                        price: parseFloat(price),
                        surface: parseFloat(surface),
                        rooms: rooms ? parseInt(rooms) : null,
                        bathrooms: bathrooms ? parseInt(bathrooms) : null,
                        hasGarage,
                        floor: floor ? parseInt(floor) : null,
                        address,
                        city,
                        zipCode,
                        country,
                    }),
                })

                if (!res.ok) {
                    const data = await res.json()
                    setError(data.error || 'Erreur lors de la mise à jour')
                    return
                }

                showToast({ message: 'Bien mis à jour ✅' })
                router.push('/account')
            } else {
                const res = await fetch('/api/properties', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        description,
                        type,
                        price: parseFloat(price),
                        surface: parseFloat(surface),
                        rooms: rooms ? parseInt(rooms) : null,
                        bathrooms: bathrooms ? parseInt(bathrooms) : null,
                        hasGarage,
                        floor: floor ? parseInt(floor) : null,
                        address,
                        city,
                        zipCode,
                        country,
                    }),
                })

                const data = await res.json()
                if (!res.ok) {
                    setError(data.error || 'Erreur lors de la création du bien')
                    return
                }

                const propertyId = data.property.id

                for (const url of images) {
                    await fetch('/api/properties/images', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ propertyId, url }),
                    })
                }

                showToast({ message: 'Bien créé avec succès ✅' })
                router.push('/account')
            }
        } catch (err) {
            console.error(err)
            setError('Erreur inconnue')
            showToast({ message: 'Erreur serveur ❌', type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{mode === 'edit' ? 'Modifier le bien' : 'Créer un bien'}</h2>

            <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
            />
            <input placeholder="Type" value={type} onChange={e => setType(e.target.value)} required />
            <input
                placeholder="Prix"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
            />
            <input
                placeholder="Surface"
                type="number"
                value={surface}
                onChange={e => setSurface(e.target.value)}
                required
            />
            <input
                placeholder="Pièces"
                type="number"
                value={rooms}
                onChange={e => setRooms(e.target.value)}
            />
            <input
                placeholder="Salles de bain"
                type="number"
                value={bathrooms}
                onChange={e => setBathrooms(e.target.value)}
            />
            <label>
                Garage
                <input type="checkbox" checked={hasGarage} onChange={e => setHasGarage(e.target.checked)} />
            </label>
            <input
                placeholder="Étage"
                type="number"
                value={floor}
                onChange={e => setFloor(e.target.value)}
            />
            <input
                placeholder="Adresse"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
            />
            <input placeholder="Ville" value={city} onChange={e => setCity(e.target.value)} required />
            <input
                placeholder="Code postal"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                required
            />
            <input
                placeholder="Pays"
                value={country}
                onChange={e => setCountry(e.target.value)}
                required
            />

            {mode === 'create' && (
                <>
                    <PropertyImageUpload onImageUploaded={url => setImages(prev => [...prev, url])} />

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
                                            setImages(prev => prev.filter(img => img !== url))
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

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? 'En cours...' : mode === 'edit' ? 'Mettre à jour' : 'Créer le bien'}
            </button>
        </form>
    )
}