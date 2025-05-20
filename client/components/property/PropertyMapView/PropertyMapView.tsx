'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import styles from './PropertyMapView.module.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
if (!MAPBOX_TOKEN) {
    throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is not defined')
}
mapboxgl.accessToken = MAPBOX_TOKEN

type PropertyMarker = {
    id: string
    title: string
    price: number
    latitude: number
    longitude: number
}

type Props = {
    properties: PropertyMarker[]
}

export default function MapView({ properties }: Props) {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const map = useRef<mapboxgl.Map | null>(null)

    useEffect(() => {
        if (!mapContainer.current) return

        const hasOneProperty = properties.length === 1
        const fallbackCenter: [number, number] = [1.4442, 43.6045] // Toulouse
        const center: [number, number] = hasOneProperty
            ? [properties[0].longitude, properties[0].latitude]
            : fallbackCenter

        const currentMap = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center,
            zoom: hasOneProperty ? 13 : 12, // léger zoom initial
            pitch: 60,
            bearing: -17.6,
            antialias: true,
        })

        map.current = currentMap

        currentMap.on('load', () => {
            currentMap.addSource('mapbox-dem', {
                type: 'raster-dem',
                url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                tileSize: 512,
                maxzoom: 14,
            })

            currentMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

            currentMap.addLayer({
                id: 'sky',
                type: 'sky',
                paint: {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15,
                },
            })

            currentMap.addLayer({
                id: '3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 15,
                paint: {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'min_height'],
                    'fill-extrusion-opacity': 0.6,
                },
            })

            properties.forEach((property) => {
                const { latitude, longitude, title, price, id } = property

                if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                    console.warn(`⛔ Invalid coords for property ${id}:`, { latitude, longitude })
                    return
                }

                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<h3>${title}</h3><p>${price.toLocaleString()} €</p>`
                )

                new mapboxgl.Marker({ color: '#e63946' })
                    .setLngLat([longitude, latitude])
                    .setPopup(popup)
                    .addTo(currentMap)
            })

            // 🧭 Zoom smooth si un seul bien
            if (hasOneProperty) {
                const p = properties[0]
                currentMap.flyTo({
                    center: [p.longitude, p.latitude],
                    zoom: 18,
                    speed: 1.2,
                    curve: 1.4,
                    essential: true,
                })
            }

            // 🗺️ Fit bounds si plusieurs
            if (!hasOneProperty && properties.length > 1) {
                const bounds = new mapboxgl.LngLatBounds()
                properties.forEach(({ longitude, latitude }) => {
                    bounds.extend([longitude, latitude])
                })
                currentMap.fitBounds(bounds, { duration: 1000 })
            }
        })

        return () => {
            currentMap.remove()
        }
    }, [properties])

    return <div ref={mapContainer} className={styles.mapContainer} />
}