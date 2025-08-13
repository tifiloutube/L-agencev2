"use client"

import { useEffect, useState } from "react"
import styles from "./AccountClientView.module.css"
import type { Property, PropertyImage, SellerSubscription, Favorite, Conversation, User } from "@prisma/client"
import AccountProfile from "@/components/account/AccountProfileForm/AccountProfile"
import AccountProperties from "@/components/account/AccountProperties/AccountProperties"
import AccountFavorites from "@/components/account/AccountFavorites/AccountFavorites"
import AccountSubscription from "@/components/account/AccountSubscription/AccountSubscription"
import AccountConversations from "@/components/account/AccountConversations/AccountConversations"
import AccountSimulator from "@/components/account/AccountSimulator/AccountSimulator"

type PropertyWithImage = Property & { images: PropertyImage[] }
type FavoriteWithProperty = Favorite & { property: PropertyWithImage }

type Props = {
    user: Pick<User, "id" | "name" | "email" | "phone">
    properties: PropertyWithImage[]
    favorites: FavoriteWithProperty[]
    subscription: SellerSubscription | null
    conversations: Conversation[]
}

type Tab = "profile" | "properties" | "favorites" | "subscription" | "conversations" | "simulator"

const STORAGE_KEY = "account_active_tab"

const tabs = [
    { id: "profile", label: "Profil", icon: "👤", description: "Informations personnelles" },
    { id: "properties", label: "Biens", icon: "🏠", description: "Mes propriétés" },
    { id: "favorites", label: "Favoris", icon: "❤️", description: "Biens sauvegardés" },
    { id: "subscription", label: "Abonnements", icon: "💎", description: "Plans et facturation" },
    { id: "conversations", label: "Discussions", icon: "💬", description: "Messages et contacts" },
    { id: "simulator", label: "Simulation", icon: "🧮", description: "Calculateur de crédit" },
] as const

export default function AccountClientView({ user, properties, favorites, subscription, conversations }: Props) {
    const [activeTab, setActiveTab] = useState<Tab | null>(null)

    const archivedCount = properties.filter((p) => p.status === "ARCHIVED").length
    const maxProperties = subscription?.status === "active" ? (subscription?.maxProperties ?? 1) : 1

    // Load from sessionStorage once
    useEffect(() => {
        const storedTab = sessionStorage.getItem(STORAGE_KEY) as Tab | null
        setActiveTab(storedTab ?? "profile")
    }, [])

    useEffect(() => {
        if (activeTab) {
            sessionStorage.setItem(STORAGE_KEY, activeTab)
        }
    }, [activeTab])

    if (!activeTab) return null

    const getTabCount = (tabId: string) => {
        switch (tabId) {
            case "properties":
                return properties.length
            case "favorites":
                return favorites.length
            case "conversations":
                return conversations.length
            default:
                return null
        }
    }

    return (
        <div className={styles.accountContainer}>
            <div className={styles.tabsContainer}>
                <div className={styles.tabsHeader}>
                    <h2 className={styles.tabsTitle}>Navigation</h2>
                    <p className={styles.tabsSubtitle}>Accédez à toutes vos fonctionnalités</p>
                </div>

                <div className={styles.tabsList}>
                    {tabs.map((tab) => {
                        const count = getTabCount(tab.id)
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                            >
                                <div className={styles.tabIcon}>{tab.icon}</div>
                                <div className={styles.tabContent}>
                                    <div className={styles.tabHeader}>
                                        <span className={styles.tabLabel}>{tab.label}</span>
                                        {count !== null && <span className={styles.tabCount}>{count}</span>}
                                    </div>
                                    <span className={styles.tabDescription}>{tab.description}</span>
                                </div>
                                <div className={styles.tabArrow}>→</div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className={styles.contentContainer}>
                <div className={styles.contentHeader}>
                    <div className={styles.contentTitle}>
                        <span className={styles.contentIcon}>{tabs.find((tab) => tab.id === activeTab)?.icon}</span>
                        <h2 className={styles.contentHeading}>{tabs.find((tab) => tab.id === activeTab)?.label}</h2>
                    </div>
                    <div className={styles.contentDescription}>{tabs.find((tab) => tab.id === activeTab)?.description}</div>
                </div>

                <div className={styles.contentBody}>
                    {activeTab === "profile" && <AccountProfile user={user} />}
                    {activeTab === "properties" && (<AccountProperties properties={properties} maxProperties={maxProperties} subscriptionStatus={subscription?.status ?? null}/>)}
                    {activeTab === "favorites" && <AccountFavorites favorites={favorites} />}
                    {activeTab === "subscription" && <AccountSubscription subscription={subscription} />}
                    {activeTab === "conversations" && (<AccountConversations conversations={conversations} currentUserId={user.id} />)}
                    {activeTab === "simulator" && <AccountSimulator />}
                </div>
            </div>
        </div>
    )
}