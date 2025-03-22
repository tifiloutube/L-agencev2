'use client'

import { useState } from 'react'

type Props = {
    propertyId: string
    initialImages: { id: string; url: string }[]
}

export default function PropertyImageManager({ propertyId, initialImages }: Props) {
    const [images, setImages] = useState(initialImages)

    const handleDelete = async (imageId: string) => {
        const res = await fetch(`/api/properties/images/${imageId}`, {
            method: 'DELETE',
        })

        if (res.ok) {
            setImages(prev => prev.filter(img => img.id !== imageId))
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        const tempRes = await fetch('/api/upload-temp', {
            method: 'POST',
            body: formData,
        })

        const { url } = await tempRes.json()

        await fetch('/api/properties/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyId, url }),
        })

        setImages(prev => [...prev, { id: `temp-${Date.now()}`, url }])
        e.target.value = ''
    }

    return (
        <section style={{ marginTop: 32 }}>
            <h3>Images du bien</h3>

            <input type="file" accept="image/*" onChange={handleUpload} />

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                {images.map(img => (
                    <div key={img.id} style={{ position: 'relative', width: 120, height: 120 }}>
                        <img
                            src={img.url}
                            alt="Image bien"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                        />
                        <button
                            onClick={() => handleDelete(img.id)}
                            style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: 22,
                                height: 22,
                                fontSize: 12,
                                cursor: 'pointer',
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}