import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma/prisma'
import { redirect } from 'next/navigation'
import PropertyForm from '@/components/property/PropertyForm/PropertyForm'
import PropertyImageManager from '@/components/property/PropertyImageManager/PropertyImageManager'


type Props = {
    params: { id: string }
}

export default async function EditPropertyPage({ params }: Props) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    const property = await prisma.property.findUnique({
        where: { id: params.id },
        include: {
            images: true,
        },
    })

    if (!property || property.userId !== session.user.id) {
        redirect('/account') // interdit si pas le bon owner
    }

    return (
        <main className="wrapper">
            <h1>Modifier le bien</h1>
            <PropertyForm mode="edit" property={property} />
            <PropertyImageManager propertyId={property.id} initialImages={property.images} />
        </main>
    )
}