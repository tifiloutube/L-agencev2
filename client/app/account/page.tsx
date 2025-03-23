import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

import AccountProperties from '@/components/account/AccountProperties/AccountProperties'
import AccountProfileForm from '@/components/account/AccountProfileForm/AccountProfileForm'
import AccountFavorites from '@/components/account/AccountFavorites/AccountFavorites'
import AccountSubscription from '@/components/account/AccountSubscription/AccountSubscription'

import { enforceUserPropertyQuota } from '@/lib/services/enforceUserPropertyQuota'

export default async function AccountPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    // 🔒 Appliquer la règle de quota avant de charger les données
    await enforceUserPropertyQuota(session.user.id)

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            sellerSubscription: {
                select: {
                    plan: true,
                    status: true,
                    maxProperties: true,
                    stripeSubscriptionId: true,
                    currentPeriodEnd: true,
                },
            },
            brokerSubscription: true,
            properties: {
                include: {
                    images: {
                        take: 1,
                    },
                },
                orderBy: { createdAt: 'desc' },
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

    const archivedCount = user.properties.filter(p => p.status === 'ARCHIVED').length

    return (
        <main className="wrapper" style={{ paddingBlock: '40px' }}>
            <h1>Mon compte</h1>
            <p><strong>Nom :</strong> {user.name || 'Non renseigné'}</p>
            <p><strong>Email :</strong> {user.email}</p>

            {archivedCount > 0 && (
                <div
                    style={{
                        marginTop: 20,
                        padding: '12px 16px',
                        backgroundColor: '#FFF3CD',
                        border: '1px solid #FFEEBA',
                        borderRadius: 6,
                        color: '#856404',
                    }}
                >
                    ⚠️ Certains de vos biens ont été archivés automatiquement car vous avez dépassé votre quota d'abonnement ({archivedCount} bien{archivedCount > 1 ? 's' : ''}).
                </div>
            )}

            <AccountProperties
                properties={user.properties}
                maxProperties={
                    user.sellerSubscription?.status === 'active' ||
                    (user.sellerSubscription?.status === 'canceled' &&
                        user.sellerSubscription?.currentPeriodEnd &&
                        new Date(user.sellerSubscription.currentPeriodEnd) > new Date())
                        ? user.sellerSubscription?.maxProperties ?? 1
                        : 1
                }
            />
            <AccountProfileForm user={{ id: user.id, name: user.name, email: user.email, phone: user.phone }} />
            <AccountFavorites favorites={user.favorites} />
            <AccountSubscription subscription={user.sellerSubscription} />
        </main>
    )
}