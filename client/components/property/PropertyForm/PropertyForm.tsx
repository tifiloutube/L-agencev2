'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/context/ToastContext'
import styles from './PropertyForm.module.css'

import PropertyBasicInfo from "@/components/property/PropertyForm/PropertyBasicInfo/PropertyBasicInfo";
import PropertyMainDetails from "@/components/property/PropertyForm/PropertyMainDetails/PropertyMainDetails";
import PropertyAdditionalInfo from "@/components/property/PropertyForm/PropertyAdditionalInfo/PropertyAdditionalInfo";

type Props = {
    mode?: 'edit' | 'create'
    property?: any
    transactionType: 'vente' | 'location'
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
        <section className={styles.container}>
            <form onSubmit={handleSubmit}>
                <h2 className={styles.h2}>{mode === 'edit' ? 'Modifier le bien' : 'Créer votre bien'}</h2>

                <PropertyBasicInfo
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    type={type}
                    setType={setType}
                    price={price}
                    setPrice={setPrice}
                    address={address}
                    setAddress={setAddress}
                    city={city}
                    setCity={setCity}
                    zipCode={zipCode}
                    setZipCode={setZipCode}
                    country={country}
                    setCountry={setCountry}
                />

                <PropertyMainDetails
                    surface={surface} setSurface={setSurface}
                    rooms={rooms} setRooms={setRooms}
                    bathrooms={bathrooms} setBathrooms={setBathrooms}
                />

                <PropertyAdditionalInfo
                    hasGarage={hasGarage} setHasGarage={setHasGarage}
                    floor={floor} setFloor={setFloor}
                    images={images} setImages={setImages}
                    mode={mode}
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'En cours...' : mode === 'edit' ? 'Mettre à jour' : 'Créer le bien'}
                </button>
            </form>
        </section>
    )
}