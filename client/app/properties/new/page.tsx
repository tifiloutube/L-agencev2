import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkUserCanPostProperty } from '@/lib/services/userAccess'
import { redirect } from 'next/navigation'
import PropertyForm from '@/components/property/PropertyForm/PropertyForm'

export default async function CreatePropertyPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    const canPost = await checkUserCanPostProperty(session.user.id)

    if (!canPost.canPost) {
        return (
            <main className="wrapper">
                <h1>Ajouter un bien</h1>
                <p style={{ color: 'red' }}>{canPost.reason}</p>
            </main>
        )
    }

    return (
        <main className="wrapper">
            <h1>Ajouter un bien</h1>
            <PropertyForm />
        </main>
    )
}