'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PropertyImageUpload from '@/components/property/PropertyImageUpload/PropertyImageUpload'

export default function PropertyForm() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('Maison')
    const [price, setPrice] = useState('')
    const [surface, setSurface] = useState('')
    const [rooms, setRooms] = useState('')
    const [bathrooms, setBathrooms] = useState('')
    const [hasGarage, setHasGarage] = useState(false)
    const [floor, setFloor] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [country, setCountry] = useState('')
    const [images, setImages] = useState<string[]>([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // 1. Crée le bien
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

            // 2. Upload des images
            for (const url of images) {
                await fetch('/api/properties/images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ propertyId, url }),
                })
            }

            router.push('/account')
        } catch (err) {
            console.error(err)
            setError('Erreur inconnue')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Créer un bien</h2>

            {/* Champs standards */}
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

            {/* Upload images */}
            <PropertyImageUpload onImageUploaded={url => setImages(prev => [...prev, url])} />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? 'En cours...' : 'Créer le bien'}
            </button>
        </form>
    )
}