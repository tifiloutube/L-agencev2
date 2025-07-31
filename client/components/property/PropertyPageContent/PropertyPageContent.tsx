'use client'

import PropertyFilters from "@/components/property/PropertyFilters/PropertyFilters";
import PropertyGrid from "@/components/property/PropertyGrid/PropertyGrid";

import styles from './PropertyPageContent.module.css'

type Property = {
    id: string
    title: string
    description: string
    type: string
    city: string
    country: string
    price: number
    latitude?: number | null
    longitude?: number | null
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
    return (
        <main className="wrapper">
            <h1 className={styles.h1}>
                Trouvez votre <br />
                <span className={styles.tag}>chez vous</span>
            </h1>

            <p className={styles.count}>
                {properties.length > 0
                    ? `${properties.length} bien${properties.length > 1 ? 's' : ''} trouvé${properties.length > 1 ? 's' : ''}`
                    : 'Aucun bien trouvé'}
            </p>

            <PropertyFilters
                className={styles.filters}
                cities={cities}
                types={types}
                countries={countries}
            />

            <PropertyGrid className={styles.cards} properties={properties} />
        </main>
    )
}