'use client'

import { useRef } from 'react'

type Props = {
    onImageUploaded: (url: string) => void
}

export default function PropertyImageUpload({ onImageUploaded }: Props) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload-temp', {
            method: 'POST',
            body: formData,
        })

        const data = await res.json()
        if (data?.url) {
            onImageUploaded(data.url)
        }

        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div>
            <label>Images (1 par 1)</label>
            <input type="file" ref={inputRef} accept="image/*" onChange={handleUpload} />
        </div>
    )
}