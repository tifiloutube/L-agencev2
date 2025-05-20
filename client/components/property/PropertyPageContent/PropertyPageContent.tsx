'use client'

import { useState } from 'react'
import PropertyFilters from "@/components/property/PropertyFilters/PropertyFilters";
import PropertyGrid from "@/components/property/PropertyGrid/PropertyGrid";
import PropertyMapView from "@/components/property/PropertyMapView/PropertyMapView";

import styles from './PropertyPageContent.module.css'

type Property = {
    id: string
    title: string
    price: number
    latitude?: number
    longitude?: number
    isFavorite: boolean
    images: { url: string }[]
}

type Props = {
    properties: Property[]
    cities: string[]
    types: string[]
    countries: string[]
}

export default function PropertyPageContent({ properties, cities, types, countries }: Props) {
    const [view, setView] = useState<'grid' | 'map'>('grid')

    return (
        <main className="wrapper">
            <h1 className={styles.h1}>
                Find your <span className={styles.tag}>home</span>
            </h1>

            <PropertyFilters className={styles.filters} cities={cities} types={types} countries={countries} />

            <div className={styles.viewToggle}>

                <div>
                    <h2 className={styles.h2}>Voir les biens sous forme de :</h2>
                </div>
                <div className={styles.buttons}>
                    <button
                        onClick={() => setView('grid')}
                        className={`button ${view === 'grid' ? styles.active : ''}`}
                    >
                        Liste
                    </button>
                    <button
                        onClick={() => setView('map')}
                        className={`button ${view === 'map' ? styles.active : ''}`}
                    >
                        Carte
                    </button>
                </div>
            </div>

            {view === 'grid' ? (
                <PropertyGrid className={styles.cards} properties={properties}/>
            ) : (
                <PropertyMapView
                    properties={properties
                        .filter((p) => p.latitude && p.longitude)
                        .map((p) => ({
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            latitude: p.latitude!,
                            longitude: p.longitude!,
                        }))}
                />
            )}
        </main>
    )
}