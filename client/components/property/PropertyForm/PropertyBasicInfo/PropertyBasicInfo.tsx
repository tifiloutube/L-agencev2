'use client'

import styles from './PropertyBasicInfo.module.css'

type Props = {
    title: string
    setTitle: (v: string) => void
    description: string
    setDescription: (v: string) => void
    type: string
    setType: (v: string) => void
    price: string
    setPrice: (v: string) => void
    address: string
    setAddress: (v: string) => void
    city: string
    setCity: (v: string) => void
    zipCode: string
    setZipCode: (v: string) => void
    country: string
    setCountry: (v: string) => void
}

export default function PropertyBasicInfo({
                                              title, setTitle,
                                              description, setDescription,
                                              type, setType,
                                              price, setPrice,
                                              address, setAddress,
                                              city, setCity,
                                              zipCode, setZipCode,
                                              country, setCountry,
                                          }: Props) {
    return (
        <section className={styles.container}>
            <div className={`${styles.infos} ${styles.infosTitle}`}>
                <h3 className={styles.h3}>Nommer votre bien :</h3>
                <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} required/>
            </div>

            <div className={`${styles.infos} ${styles.infosType}`}>
                <h3 className={styles.h3}>Quel bien louez-vous ?</h3>
                <div className={styles.infosTypeContainer}>
                    <p>Types de bien :</p>
                    <input placeholder="Type" value={type} onChange={e => setType(e.target.value)} required/>
                </div>
            </div>

            <div>
                <h3>Description :</h3>
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>

            <div>
                <h3>Où se trouve votre bien ?</h3>
                <input placeholder="Adresse" value={address} onChange={e => setAddress(e.target.value)} required />
                <input placeholder="Ville" value={city} onChange={e => setCity(e.target.value)} required />
                <input placeholder="Code postal" value={zipCode} onChange={e => setZipCode(e.target.value)} required />
                <input placeholder="Pays" value={country} onChange={e => setCountry(e.target.value)} required />
            </div>

            <div>
                <h3>Prix :</h3>
                <input type="number" placeholder="Prix" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
        </section>
    )
}