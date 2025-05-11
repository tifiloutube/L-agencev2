import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkUserCanPostProperty } from '@/lib/services/userAccess'
import { redirect } from 'next/navigation'
import styles from './page.module.css'

import CreatePropertyClient from '@/components/property/CreatePropertyClient/CreatePropertyClient'

export default async function CreatePropertyPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    const canPost = await checkUserCanPostProperty(session.user.id)

    if (!canPost.canPost) {
        return (
            <main className="wrapper">
                <h1 className={`h1 ${styles.h1}`}>Ajouter un bien</h1>
                <p className={styles.reason}>{canPost.reason}</p>
            </main>
        )
    }

    return <CreatePropertyClient />
}