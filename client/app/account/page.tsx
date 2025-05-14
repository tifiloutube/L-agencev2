import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AccountClientView from '@/components/account/AccountClientView/AccountClientView'
import styles from './page.module.css'
import { enforceUserPropertyQuota } from '@/lib/services/enforceUserPropertyQuota'

export default async function AccountPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    await enforceUserPropertyQuota(session.user.id)

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            sellerSubscription: true,
            brokerSubscription: true,
            properties: {
                include: { images: { take: 1 } },
                orderBy: { createdAt: 'desc' },
            },
            favorites: {
                include: {
                    property: {
                        include: { images: { take: 1 } },
                    },
                },
            },
            conversations: {
                include: {
                    property: true,
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        include: { sender: true },
                    },
                    participants: true,
                },
            },
        },
    })

    if (!user) redirect('/login')

    return (
        <main className={`wrapper ${styles.wrapper}`}>
            <h1 className={`h1 ${styles.h1}`}>Mon compte</h1>
            <AccountClientView
                user={{ id: user.id, name: user.name, email: user.email, phone: user.phone }}
                properties={user.properties}
                favorites={user.favorites}
                subscription={user.sellerSubscription}
                conversations={user.conversations}
            />
        </main>
    )
}
