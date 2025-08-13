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

    const [transactionType, setTransactionType] = useState('vente');
    const [city, setCity] = useState('');
    const [type, setType] = useState('');
    const [country, setCountry] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [surfaceMin, setSurfaceMin] = useState('');
    const [layoutType, setLayoutType] = useState(''); // Studio, T1...
    const [minRooms, setMinRooms] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [creditAmount, setCreditAmount] = useState<number | null>(null);

    useEffect(() => {
        setTransactionType(searchParams.get('transactionType') || 'vente');
        setCity(searchParams.get('city') || '');
        setCountry(searchParams.get('country') || '');
        setType(searchParams.get('type') || '');
        setPriceMin(searchParams.get('priceMin') || '');
        setPriceMax(searchParams.get('priceMax') || '');
        setSurfaceMin(searchParams.get('surfaceMin') || '');
        setLayoutType(searchParams.get('layoutType') || '');
        setMinRooms(searchParams.get('rooms') || '');
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
        if (layoutType) params.set('layoutType', layoutType);
        if (minRooms) params.set('rooms', minRooms);
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
        <div className={`${styles.filterContainer} ${className || ''}`}>
            <div className={styles.filterHeader}>
                <h2 className={styles.filterTitle}>Trouvez votre bien idéal</h2>
                <p className={styles.filterSubtitle}>Affinez votre recherche selon vos critères</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.filterForm}>
                {/* Section principale */}
                <div className={styles.mainFilters}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Type de transaction</label>
                        <div className={styles.transactionToggle}>
                            <button
                                type="button"
                                className={`${styles.toggleButton} ${transactionType === 'vente' ? styles.active : ''}`}
                                onClick={() => setTransactionType('vente')}
                            >
                                🏠 Acheter
                            </button>
                            <button
                                type="button"
                                className={`${styles.toggleButton} ${transactionType === 'location' ? styles.active : ''}`}
                                onClick={() => setTransactionType('location')}
                            >
                                🔑 Louer
                            </button>
                        </div>
                    </div>

                    <div className={styles.filterRow}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Type de bien</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Tous les types</option>
                                {types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Ville</label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Toutes les villes</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Pays</label>
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Tous les pays</option>
                                {countries.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section budget */}
                <div className={styles.budgetSection}>
                    <h3 className={styles.sectionTitle}>💰 Budget</h3>
                    <div className={styles.filterRow}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Prix minimum</label>
                            <input
                                type="number"
                                placeholder="Ex: 100000"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Prix maximum</label>
                            <input
                                type="number"
                                placeholder="Ex: 500000"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>
                        {creditAmount && (
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Budget simulé</label>
                                <button
                                    type="button"
                                    className={styles.simulationButton}
                                    onClick={applySimulationAmount}
                                    title="Utiliser le montant de crédit issu de votre simulation"
                                >
                                    Utiliser {creditAmount.toLocaleString()} €
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section caractéristiques */}
                <div className={styles.characteristicsSection}>
                    <h3 className={styles.sectionTitle}>📐 Caractéristiques</h3>
                    <div className={styles.filterRow}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Surface min. (m²)</label>
                            <input
                                type="number"
                                placeholder="Ex: 50"
                                value={surfaceMin}
                                onChange={(e) => setSurfaceMin(e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Type de logement</label>
                            <select
                                value={layoutType}
                                onChange={(e) => setLayoutType(e.target.value)}
                                className={styles.filterSelect}
                            >
                                <option value="">Indifférent</option>
                                <option value="1">Studio</option>
                                <option value="2">T1</option>
                                <option value="3">T2</option>
                                <option value="4">T3</option>
                                <option value="5">T4</option>
                                <option value="6">T5+</option>
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Pièces min.</label>
                            <input
                                type="number"
                                placeholder="Ex: 3"
                                value={minRooms}
                                onChange={(e) => setMinRooms(e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Chambres min.</label>
                            <input
                                type="number"
                                placeholder="Ex: 2"
                                value={bedrooms}
                                onChange={(e) => setBedrooms(e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className={styles.actionButtons}>
                    <button type="submit" className={`button ${styles.searchButton}`}>
                        🔍 Rechercher
                    </button>
                    <button type="button" className="button" onClick={resetFilters}>
                        🔄 Réinitialiser
                    </button>
                </div>
            </form>
        </div>
    );
}