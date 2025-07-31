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
    isFavorite?: boolean | undefined
}

export default function PropertyOwnerContact({ownerName, ownerEmail, userId, currentUserId, propertyId, isFavorite,}: Props) {
    return (
        <div className={styles.section}>
            <h2 className={styles.subTitle}>Contact</h2>

            {currentUserId !== userId && (
                <>
                    <div className={styles.containerButton}>
                        <FavoriteButton propertyId={propertyId} initialIsFavorite={isFavorite}/>
                        <ContactOwnerButton propertyId={propertyId} />
                    </div>

                    <form className={styles.contactForm}>
                        <div className={styles.formGroup}>
                            <input type="text" id="name" name="name" className={styles.input} placeholder={"Nom*"}/>
                        </div>

                        <div className={styles.formGroup}>
                            <input type="tel" id="phone" name="phone" className={styles.input} placeholder={"Numéro de téléphone*"}/>
                        </div>

                        <div className={styles.formGroup}>
                            <input type="email" id="email" name="email" className={styles.input} placeholder={"Email*"}/>
                        </div>

                        <div className={styles.formGroup}>
                            <textarea id="message" name="message" rows={5} className={styles.textarea} placeholder={"Message*"}/>
                        </div>

                        <button type="submit" className={`button ${styles.sendButton}`}>Envoyer</button>
                    </form>
                </>
            )}
        </div>
    )
}