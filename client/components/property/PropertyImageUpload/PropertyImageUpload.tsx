'use client'

type Props = {
    onImageUploaded: (url: string) => void
}

export default function PropertyImageUpload({ onImageUploaded }: Props) {
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        for (const file of Array.from(files)) {
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
        }

        // Reset input value
        e.target.value = ''
    }

    return (
        <div style={{ marginBlock: 20 }}>
            <label>Images (plusieurs autorisées)</label>
            <input type="file" accept="image/*" multiple onChange={handleUpload} />
        </div>
    )
}