'use client'

import { useState } from 'react'

import styles from './AccountClientView.module.css'
import type { Property, SellerSubscription, Favorite, Conversation, User } from '@prisma/client'
import AccountProfile from "@/components/account/AccountProfileForm/AccountProfile";
import AccountProperties from "@/components/account/AccountProperties/AccountProperties";
import AccountFavorites from "@/components/account/AccountFavorites/AccountFavorites";
import AccountSubscription from "@/components/account/AccountSubscription/AccountSubscription";
import AccountConversations from "@/components/account/AccountConversations/AccountConversations";

type Props = {
    user: Pick<User, 'id' | 'name' | 'email' | 'phone'>
    properties: Property[]
    favorites: Favorite[]
    subscription: SellerSubscription | null
    conversations: Conversation[]
}

export default function AccountClientView({
                                              user,
                                              properties,
                                              favorites,
                                              subscription,
                                              conversations,
                                          }: Props) {
    const [activeTab, setActiveTab] = useState<'profile' | 'properties' | 'favorites' | 'subscription' | 'conversations'>('profile')

    const archivedCount = properties.filter(p => p.status === 'ARCHIVED').length
    const maxProperties = subscription?.status === 'active' ? subscription?.maxProperties ?? 1 : 1

    return (
        <>
            <div className={styles.buttonsContainer}>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`button ${activeTab === 'profile' ? styles.active : ''}`}
                >
                    Profil
                </button>

                <button
                    onClick={() => setActiveTab('properties')}
                    className={`button ${activeTab === 'properties' ? styles.active : ''}`}
                >
                    Biens
                </button>

                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`button ${activeTab === 'favorites' ? styles.active : ''}`}
                >
                    Favoris
                </button>

                <button
                    onClick={() => setActiveTab('subscription')}
                    className={`button ${activeTab === 'subscription' ? styles.active : ''}`}
                >
                    Abonnements
                </button>

                <button
                    onClick={() => setActiveTab('conversations')}
                    className={`button ${activeTab === 'conversations' ? styles.active : ''}`}
                >
                    Conversations
                </button>
            </div>

            {activeTab === 'profile' && (<AccountProfile user={user}/>)}
            {activeTab === 'properties' && (<AccountProperties properties={properties} maxProperties={maxProperties}/>)}
            {activeTab === 'favorites' && <AccountFavorites favorites={favorites}/>}
            {activeTab === 'subscription' && <AccountSubscription subscription={subscription}/>}
            {activeTab === 'conversations' && <AccountConversations conversations={conversations} currentUserId={user.id}/>}
        </>
    )
}
