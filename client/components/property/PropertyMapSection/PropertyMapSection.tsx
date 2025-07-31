'use client'

import dynamic from 'next/dynamic'

const PropertyMapView = dynamic(
    () => import('@/components/property/PropertyMapView/PropertyMapView'),
    { ssr: false }
)

type Props = {
    id: string
    title: string
    price: number
    latitude: number
    longitude: number
}

export default function PropertyMapSection({ id, title, price, latitude, longitude }: Props) {
    return (
        <PropertyMapView
            properties={[
                {
                    id,
                    title,
                    price,
                    latitude,
                    longitude,
                },
            ]}
        />
    )
}