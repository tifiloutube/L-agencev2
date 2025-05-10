'use client';

import Link from 'next/link';
import Styles from './PropertyGrid.module.css';

interface Property {
    id: string;
    title: string;
    city: string;
    price: number;
    images: { url: string }[];
}

interface Props {
    properties: Property[];
}

export default function PropertyGrid({ properties }: Props) {
    if (properties.length === 0) {
        return <p>Aucun bien publié pour le moment.</p>;
    }

    return (
        <div className={Styles.container}>
            {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`} className={Styles.link}>
                    <div className={Styles.content}>
                        {property.images[0] && (
                            <img src={property.images[0].url} alt={property.title}/>
                        )}
                        <div style={{padding: 12}}>
                            <strong>{property.title}</strong>
                            <br/>
                            {property.city}, {property.price} €
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}