'use client'

import ContactOwnerButton from '@/components/property/ContactOwnerButton/ContactOwnerButton'
import FavoriteButton from '@/components/property/FavoriteButton/FavoriteButton'
import styles from './PropertyOwnerContact.module.css'

type Props = {
    ownerName: string | null
    ownerEmail: string
    userId: string
    currentUserId?: string
    propertyId: string
    isFavorite?: boolean
}

export default function PropertyOwnerContact({
                                                 ownerName,
                                                 ownerEmail,
                                                 userId,
                                                 currentUserId,
                                                 propertyId,
                                                 isFavorite,
                                             }: Props) {
    return (
        <div className={styles.section}>
            <h2 className={styles.subTitle}>Contact</h2>

            <FavoriteButton propertyId={propertyId} initialIsFavorite={isFavorite} />

            {currentUserId !== userId && (
                <>
                    <ContactOwnerButton propertyId={propertyId} />

                    <form className={styles.contactForm}>
                        <div className={styles.formGroup}>
                            <input type="text" id="name" name="name" className={styles.input} placeholder={"nom*"}/>
                        </div>

                        <div className={styles.formGroup}>
                            <input type="tel" id="phone" name="phone" className={styles.input} placeholder={"numéro de téléphone*"}/>
                        </div>

                        <div className={styles.formGroup}>
                            <input type="email" id="email" name="email" className={styles.input} placeholder={"email*"}/>
                        </div>

                        <div className={styles.formGroup}>
                            <textarea id="message" name="message" rows={5} className={styles.textarea} placeholder={"message*"}/>
                        </div>

                        <button type="submit" className={`button ${styles.sendButton}`}>Envoyer</button>
                    </form>
                </>
            )}
        </div>
    )
}