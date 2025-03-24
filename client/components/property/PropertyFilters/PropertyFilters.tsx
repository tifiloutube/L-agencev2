'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {
    cities: string[];
    types: string[];
    countries: string[];
}

export default function PropertyFilters({ cities, types, countries }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [city, setCity] = useState('');
    const [type, setType] = useState('');
    const [country, setCountry] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [surfaceMin, setSurfaceMin] = useState('');
    const [surfaceMax, setSurfaceMax] = useState('');
    const [rooms, setRooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [hasGarage, setHasGarage] = useState('');
    const [floor, setFloor] = useState('');

    useEffect(() => {
        setCity(searchParams.get('city') || '');
        setCountry(searchParams.get('country') || '');
        setType(searchParams.get('type') || '');
        setPriceMin(searchParams.get('priceMin') || '');
        setPriceMax(searchParams.get('priceMax') || '');
        setSurfaceMin(searchParams.get('surfaceMin') || '');
        setSurfaceMax(searchParams.get('surfaceMax') || '');
        setRooms(searchParams.get('rooms') || '');
        setBathrooms(searchParams.get('bathrooms') || '');
        setHasGarage(searchParams.get('hasGarage') || '');
        setFloor(searchParams.get('floor') || '');
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (priceMin && priceMax && parseFloat(priceMax) < parseFloat(priceMin)) {
            alert('Le prix maximum ne peut pas être inférieur au prix minimum.');
            return;
        }

        if (surfaceMin && surfaceMax && parseFloat(surfaceMax) < parseFloat(surfaceMin)) {
            alert('La surface maximale ne peut pas être inférieure à la surface minimale.');
            return;
        }

        const params = new URLSearchParams();

        if (city) params.set('city', city);
        if (country) params.set('country', country);
        if (type) params.set('type', type);
        if (priceMin) params.set('priceMin', priceMin);
        if (priceMax) params.set('priceMax', priceMax);
        if (surfaceMin) params.set('surfaceMin', surfaceMin);
        if (surfaceMax) params.set('surfaceMax', surfaceMax);
        if (rooms) params.set('rooms', rooms);
        if (bathrooms) params.set('bathrooms', bathrooms);
        if (floor) params.set('floor', floor);
        if (hasGarage !== '') params.set('hasGarage', hasGarage);

        router.push(`/properties?${params.toString()}`);
    };

    const resetFilters = () => {
        router.push('/properties');
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">Ville</option>
                    {cities.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="">Pays</option>
                    {countries.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>

                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Type</option>
                    {types.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

                <input placeholder="Prix min" type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                <input placeholder="Prix max" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
                <input placeholder="Surface min" type="number" value={surfaceMin} onChange={(e) => setSurfaceMin(e.target.value)} />
                <input placeholder="Surface max" type="number" value={surfaceMax} onChange={(e) => setSurfaceMax(e.target.value)} />
                <input placeholder="Pièces min" type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} />
                <input placeholder="Salle de bain min" type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
                <input placeholder="Étage min" type="number" value={floor} onChange={(e) => setFloor(e.target.value)} />

                <select value={hasGarage} onChange={(e) => setHasGarage(e.target.value)}>
                    <option value="">Garage</option>
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                </select>

                <button type="submit">Filtrer</button>
                <button type="button" onClick={resetFilters}>
                    Réinitialiser
                </button>
            </div>
        </form>
    );
}