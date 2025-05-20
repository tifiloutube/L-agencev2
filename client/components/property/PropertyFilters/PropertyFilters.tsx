'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './PropertyFilters.module.css';

interface Props {
    cities: string[];
    types: string[];
    countries: string[];
    className?: string;
}

type Simulation = {
    amount: number
    isEligible: boolean
}

export default function PropertyFilters({ cities, types, countries, className }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [transactionType, setTransactionType] = useState('buy');
    const [city, setCity] = useState('');
    const [type, setType] = useState('');
    const [country, setCountry] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [surfaceMin, setSurfaceMin] = useState('');
    const [rooms, setRooms] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [creditAmount, setCreditAmount] = useState<number | null>(null);

    useEffect(() => {
        setTransactionType(searchParams.get('transactionType') || 'buy');
        setCity(searchParams.get('city') || '');
        setCountry(searchParams.get('country') || '');
        setType(searchParams.get('type') || '');
        setPriceMin(searchParams.get('priceMin') || '');
        setPriceMax(searchParams.get('priceMax') || '');
        setSurfaceMin(searchParams.get('surfaceMin') || '');
        setRooms(searchParams.get('rooms') || '');
        setBedrooms(searchParams.get('bedrooms') || '');
    }, [searchParams]);

    useEffect(() => {
        fetch('/api/simulation/latest')
            .then(res => res.json())
            .then((data: { simulation: Simulation | null }) => {
                if (data.simulation?.isEligible) {
                    setCreditAmount(data.simulation.amount);
                }
            })
            .catch(() => setCreditAmount(null));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (priceMin && priceMax && parseFloat(priceMax) < parseFloat(priceMin)) {
            alert('Le prix maximum ne peut pas être inférieur au prix minimum.');
            return;
        }

        const params = new URLSearchParams();
        params.set('transactionType', transactionType);
        if (city) params.set('city', city);
        if (country) params.set('country', country);
        if (type) params.set('type', type);
        if (priceMin) params.set('priceMin', priceMin);
        if (priceMax) params.set('priceMax', priceMax);
        if (surfaceMin) params.set('surfaceMin', surfaceMin);
        if (rooms) params.set('rooms', rooms);
        if (bedrooms) params.set('bedrooms', bedrooms);

        router.push(`/properties?${params.toString()}`);
    };

    const resetFilters = () => {
        router.push('/properties');
    };

    const applySimulationAmount = () => {
        if (creditAmount) {
            setPriceMax(creditAmount.toString());
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className={styles.phraseWrapper}>
                <p>Je cherche à</p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                        <option value="buy">acheter</option>
                        <option value="rent">louer</option>
                    </select>
                    ]
                </span>

                <p> un(e) </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">type de bien</option>
                        {types.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    ]
                </span>

                <p> situé à </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <select value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="">ville</option>
                        {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    ]
                </span>

                <p> en </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                        <option value="">pays</option>
                        {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    ]
                </span>

                <p>, avec un budget entre </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <input type="number" placeholder="min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                    ]
                </span>

                <p> et </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <input type="number" placeholder="max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
                    ]
                </span>

                <p> euros, une surface habitable minimale de </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <input type="number" placeholder="min m²" value={surfaceMin}
                           onChange={(e) => setSurfaceMin(e.target.value)} />
                    ]
                </span>

                <p> m², de type </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <select value={rooms} onChange={(e) => setRooms(e.target.value)}>
                        <option value="">choix</option>
                        <option value="1">Studio</option>
                        <option value="2">T1</option>
                        <option value="3">T2</option>
                        <option value="4">T3</option>
                        <option value="5">T4</option>
                        <option value="6">T5+</option>
                    </select>
                    ]
                </span>

                <p>, avec au moins </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <input type="number" placeholder="pièces" value={rooms} onChange={(e) => setRooms(e.target.value)} />
                    ]
                </span>

                <p> pièces et </p>
                <span className={styles.phraseWrapper__select}>
                    [
                    <input type="number" placeholder="chambres" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                    ]
                </span>

                <p> chambres.</p>
            </div>

            <div className={styles.buttonContainer}>
                <button type="submit" className="button">Filtrer</button>
                <button type="button" className="button" onClick={resetFilters}>Réinitialiser</button>

                {creditAmount && (
                    <button
                        type="button"
                        className="button"
                        onClick={applySimulationAmount}
                        title="Utiliser le montant de crédit issu de votre simulation"
                    >
                        Utiliser mon budget simulé ({creditAmount.toLocaleString()} €)
                    </button>
                )}
            </div>
        </form>
    );
}