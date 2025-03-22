import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AccountProperties from '@/components/account/AccountProperties/AccountProperties'
import AccountProfileForm from '@/components/account/AccountProfileForm/AccountProfileForm'
import AccountFavorites from '@/components/account/AccountFavorites/AccountFavorites'

export default async function AccountPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            sellerSubscription: true,
            brokerSubscription: true,
            properties: {
                include: {
                    images: {
                        take: 1,
                    },
                },
            },
            favorites: {
                include: {
                    property: {
                        include: {
                            images: {
                                take: 1,
                            },
                        },
                    },
                },
            },
        },
    })

    if (!user) redirect('/login')

    return (
        <main className="wrapper" style={{ paddingBlock: '40px' }}>
            <h1>Mon compte</h1>
            <p><strong>Nom :</strong> {user.name || 'Non renseigné'}</p>
            <p><strong>Email :</strong> {user.email}</p>

            <AccountProperties properties={user.properties} />
            <AccountProfileForm user={{ id: user.id, name: user.name, email: user.email, phone: user.phone }} />
            <AccountFavorites favorites={user.favorites} />
        </main>
    )
}