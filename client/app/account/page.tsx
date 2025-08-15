import type { Metadata } from 'next'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma/prisma"
import { redirect } from "next/navigation"
import { enforceUserPropertyQuota } from "@/lib/services/enforceUserPropertyQuota"
import styles from "./page.module.css"
import AccountClientView from "@/components/account/AccountClientView/AccountClientView"

export const metadata: Metadata = {
    title: 'Mon compte | La Crémaillère',
    description: 'Gérez votre profil, vos favoris, vos discussions et vos biens immobiliers.',
    robots: { index: false, follow: false },
    alternates: { canonical: '/account' },
}

export default async function AccountPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect("/login")

    await enforceUserPropertyQuota(session.user.id)

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            sellerSubscription: true,
            brokerSubscription: true,
            properties: {
                include: {
                    images: { take: 1 },
                },
                orderBy: { createdAt: "desc" },
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
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        include: { sender: true },
                    },
                    participants: true,
                },
            },
        },
    })

    if (!user) redirect("/login")

    const properties = user.properties.map((p) => ({
        ...p,
        transactionType: p.transactionType || null,
    }))

    return (
        <div className={styles.pageContainer}>
            <main className={`wrapper ${styles.mainContent}`}>
                <section className={styles.welcomeSection}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.avatar}>
                            <span className={styles.avatarIcon}>👤</span>
                        </div>
                    </div>
                    <div className={styles.welcomeText}>
                        <h1 className={styles.welcomeTitle}>
                            Bonjour, <span className={styles.userName}>{user.name}</span> !
                        </h1>
                        <p className={styles.welcomeSubtitle}>Gérez votre profil et vos biens immobiliers</p>
                    </div>
                </section>

                <section className={styles.quickStats}>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>🏠</span>
                        <div className={styles.statContent}>
                            <div className={styles.statNumber}>{user.properties.length}</div>
                            <div className={styles.statLabel}>Biens</div>
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>❤️</span>
                        <div className={styles.statContent}>
                            <div className={styles.statNumber}>{user.favorites.length}</div>
                            <div className={styles.statLabel}>Favoris</div>
                        </div>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>💬</span>
                        <div className={styles.statContent}>
                            <div className={styles.statNumber}>{user.conversations.length}</div>
                            <div className={styles.statLabel}>Discussions</div>
                        </div>
                    </div>
                </section>

                <div className={styles.accountClientViewWrapper}>
                    <AccountClientView
                        user={{ id: user.id, name: user.name, email: user.email, phone: user.phone }}
                        properties={properties}
                        favorites={user.favorites}
                        subscription={user.sellerSubscription}
                        conversations={user.conversations}
                    />
                </div>
            </main>
        </div>
    )
}