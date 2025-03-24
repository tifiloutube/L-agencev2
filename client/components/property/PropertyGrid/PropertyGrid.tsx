'use client';

import Link from 'next/link';

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
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
            }}
        >
            {properties.map((property) => (
                <Link key={property.id} href={`/properties/${property.id}`}>
                    <div
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: 8,
                            overflow: 'hidden',
                            textDecoration: 'none',
                            color: 'inherit',
                            background: '#fff',
                        }}
                    >
                        {property.images[0] && (
                            <img
                                src={property.images[0].url}
                                alt={property.title}
                                style={{ width: '100%', height: 180, objectFit: 'cover' }}
                            />
                        )}
                        <div style={{ padding: 12 }}>
                            <strong>{property.title}</strong>
                            <br />
                            {property.city}, {property.price} €
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}