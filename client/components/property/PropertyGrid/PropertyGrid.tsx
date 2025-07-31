'use client';

import Link from 'next/link';
import Styles from './PropertyGrid.module.css';
import FavoriteButton from '@/components/property/FavoriteButton/FavoriteButton';

interface Property {
    id: string;
    title: string;
    description: string;
    city: string;
    price: number;
    images: { url: string }[];
    isFavorite?: boolean;
}

interface Props {
    properties: Property[];
    className?: string;
}

export default function PropertyGrid({ properties, className }: Props) {
    if (properties.length === 0) {
        return <p>Aucun bien publié pour le moment.</p>;
    }

    return (
        <section className={`${Styles.propertyGrid} ${className || ''}`}>
            <div className={Styles.container}>
                {properties.map((property) => (
                    <div key={property.id} className={Styles.card}>
                        <div className={Styles.imageContainer}>
                            {property.images[0] && (
                                <img
                                    src={property.images[0].url}
                                    alt={property.title}
                                    className={Styles.image}
                                />
                            )}
                        </div>
                        <div className={Styles.detailsContainer}>
                            <div className={Styles.details}>
                                <h2 className={Styles.title}>{property.title}</h2>
                                <p className={Styles.description}>{property.description}</p>
                                <p className={Styles.meta}>{property.city}</p>
                                <p className={Styles.meta}>
                                    {property.price.toLocaleString('fr-FR')} €
                                </p>
                            </div>
                            <div className={Styles.actions}>
                                <Link href={`/properties/${property.id}`} className="button">
                                    Voir le bien
                                </Link>
                                <FavoriteButton
                                    propertyId={property.id}
                                    initialIsFavorite={property.isFavorite ?? false}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}