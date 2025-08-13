'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/context/ToastContext'
import styles from './PropertyForm.module.css'

import PropertyBasicInfo from '@/components/property/PropertyForm/PropertyBasicInfo/PropertyBasicInfo'
import PropertyMainDetails from '@/components/property/PropertyForm/PropertyMainDetails/PropertyMainDetails'
import PropertyAdditionalInfo from '@/components/property/PropertyForm/PropertyAdditionalInfo/PropertyAdditionalInfo'
import PropertyOtherInformation from '@/components/property/PropertyForm/PropertyOtherInformation/PropertyOtherInformation'
import PropertyEnergyBalance from '@/components/property/PropertyForm/PropertyEnergyBalance/PropertyEnergyBalance'

type Props = {
    mode?: 'edit' | 'create'
    property?: any
    transactionType: 'vente' | 'location'
}

export default function PropertyForm({ mode = 'create', property, transactionType }: Props) {
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

    const [kitchenEquipped, setKitchenEquipped] = useState(false)
    const [terrace, setTerrace] = useState(false)
    const [balcony, setBalcony] = useState(false)
    const [terraceCount, setTerraceCount] = useState('')
    const [terraceSurface, setTerraceSurface] = useState('')
    const [balconyCount, setBalconyCount] = useState('')
    const [balconySurface, setBalconySurface] = useState('')
    const [garden, setGarden] = useState(false)
    const [pool, setPool] = useState(false)
    const [disabledAccess, setDisabledAccess] = useState(false)
    const [basement, setBasement] = useState(false)

    const [constructionYear, setConstructionYear] = useState('')
    const [landSurface, setLandSurface] = useState('')
    const [condition, setCondition] = useState('')

    const [energyConsumption, setEnergyConsumption] = useState('')
    const [greenhouseGasEmission, setGreenhouseGasEmission] = useState('')
    const [finalEnergyConsumption, setFinalEnergyConsumption] = useState('')
    const [energyCostMin, setEnergyCostMin] = useState('')
    const [energyCostMax, setEnergyCostMax] = useState('')
    const [energyIndexDate, setEnergyIndexDate] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const payload = {
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
            kitchenEquipped,
            terrace,
            balcony,
            terraceCount: terrace ? parseInt(terraceCount) || null : null,
            terraceSurface: terrace ? parseFloat(terraceSurface) || null : null,
            balconyCount: balcony ? parseInt(balconyCount) || null : null,
            balconySurface: balcony ? parseFloat(balconySurface) || null : null,
            garden,
            pool,
            disabledAccess,
            basement,
            constructionYear: constructionYear ? parseInt(constructionYear) : null,
            landSurface: landSurface ? parseFloat(landSurface) : null,
            condition: transactionType === 'vente' ? condition : null,
            transactionType,
            energyConsumption,
            greenhouseGasEmission,
            finalEnergyConsumption: finalEnergyConsumption ? parseFloat(finalEnergyConsumption) : null,
            energyCostMin: energyCostMin ? parseFloat(energyCostMin) : null,
            energyCostMax: energyCostMax ? parseFloat(energyCostMax) : null,
            energyIndexDate: energyIndexDate || null,

        }

        try {
            if (mode === 'edit') {
                const res = await fetch(`/api/properties/${property.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
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
                    body: JSON.stringify(payload),
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
                    surface={surface}
                    setSurface={setSurface}
                    rooms={rooms}
                    setRooms={setRooms}
                    bathrooms={bathrooms}
                    setBathrooms={setBathrooms}
                />

                <PropertyAdditionalInfo
                    hasGarage={hasGarage}
                    setHasGarage={setHasGarage}
                    floor={floor}
                    setFloor={setFloor}
                    images={images}
                    setImages={setImages}
                    mode={mode}
                />

                <PropertyOtherInformation
                    kitchenEquipped={kitchenEquipped}
                    setKitchenEquipped={setKitchenEquipped}
                    terrace={terrace}
                    setTerrace={setTerrace}
                    balcony={balcony}
                    setBalcony={setBalcony}
                    garden={garden}
                    setGarden={setGarden}
                    pool={pool}
                    setPool={setPool}
                    disabledAccess={disabledAccess}
                    setDisabledAccess={setDisabledAccess}
                    basement={basement}
                    setBasement={setBasement}
                    constructionYear={constructionYear}
                    setConstructionYear={setConstructionYear}
                    landSurface={landSurface}
                    setLandSurface={setLandSurface}
                    condition={condition}
                    setCondition={setCondition}
                    transactionType={transactionType}
                    terraceCount={terraceCount}
                    setTerraceCount={setTerraceCount}
                    terraceSurface={terraceSurface}
                    setTerraceSurface={setTerraceSurface}
                    balconyCount={balconyCount}
                    setBalconyCount={setBalconyCount}
                    balconySurface={balconySurface}
                    setBalconySurface={setBalconySurface}
                />

                <PropertyEnergyBalance
                    energyConsumption={energyConsumption}
                    setEnergyConsumption={setEnergyConsumption}
                    greenhouseGasEmission={greenhouseGasEmission}
                    setGreenhouseGasEmission={setGreenhouseGasEmission}
                    finalEnergyConsumption={finalEnergyConsumption}
                    setFinalEnergyConsumption={setFinalEnergyConsumption}
                    energyCostMin={energyCostMin}
                    setEnergyCostMin={setEnergyCostMin}
                    energyCostMax={energyCostMax}
                    setEnergyCostMax={setEnergyCostMax}
                    energyIndexDate={energyIndexDate}
                    setEnergyIndexDate={setEnergyIndexDate}
                />

                <button type="submit" disabled={loading} className={`button`}>
                    {loading ? 'En cours...' : mode === 'edit' ? 'Mettre à jour' : 'Créer le bien'}
                </button>
            </form>
        </section>
    )
}