'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

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

        if (!res.ok) {
            const data = await res.json()
            setError(data.error || 'Erreur lors de la création')
        } else {
            router.push('/account')
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <div>
                <label>Titre</label>
                <input type="text" value={title} required onChange={e => setTitle(e.target.value)} />
            </div>

            <div>
                <label>Description</label>
                <textarea value={description} required onChange={e => setDescription(e.target.value)} />
            </div>

            <div>
                <label>Type</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                    <option>Maison</option>
                    <option>Appartement</option>
                    <option>Terrain</option>
                    <option>Garage</option>
                </select>
            </div>

            <div>
                <label>Prix (€)</label>
                <input type="number" value={price} required onChange={e => setPrice(e.target.value)} />
            </div>

            <div>
                <label>Surface (m²)</label>
                <input type="number" value={surface} required onChange={e => setSurface(e.target.value)} />
            </div>

            <div>
                <label>Nombre de pièces</label>
                <input type="number" value={rooms} onChange={e => setRooms(e.target.value)} />
            </div>

            <div>
                <label>Salles de bain</label>
                <input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} />
            </div>

            <div>
                <label>Garage</label>
                <input type="checkbox" checked={hasGarage} onChange={e => setHasGarage(e.target.checked)} />
            </div>

            <div>
                <label>Étage</label>
                <input type="number" value={floor} onChange={e => setFloor(e.target.value)} />
            </div>

            <div>
                <label>Adresse</label>
                <input type="text" value={address} required onChange={e => setAddress(e.target.value)} />
            </div>

            <div>
                <label>Ville</label>
                <input type="text" value={city} required onChange={e => setCity(e.target.value)} />
            </div>

            <div>
                <label>Code postal</label>
                <input type="text" value={zipCode} required onChange={e => setZipCode(e.target.value)} />
            </div>

            <div>
                <label>Pays</label>
                <input type="text" value={country} required onChange={e => setCountry(e.target.value)} />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter le bien'}
            </button>
        </form>
    )
}