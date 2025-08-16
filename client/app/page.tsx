import Link from 'next/link'
import styles from './page.module.css'

export default function HomePage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero} aria-labelledby="hero-title">
                <div className={`wrapper ${styles.heroWrapper}`}>
                    <header className={styles.headerContainer}>
                        <h1 id="hero-title" className={`h1span ${styles.h1}`}>La Crémaillère</h1>
                        <p className={styles.heroDescription}>
                            La plateforme qui connecte acheteurs, locataires et propriétaires pour une gestion immobilière simplifiée et efficace.
                        </p>

                        <div className={styles.heroButtons}>
                            <Link
                                href="/properties"
                                className={`button ${styles.buttonPrimary} ${styles.buttonLarge}`}
                                aria-label="Trouver un bien à partir de la page des propriétés"
                            >
                                Trouver un bien
                            </Link>
                            <Link
                                href="/account"
                                className={`button ${styles.buttonLarge}`}
                                aria-label="Accéder à l’espace de gestion de mes biens"
                            >
                                Gérer mes biens
                            </Link>
                        </div>
                    </header>
                </div>
            </section>

            <section className={styles.howItWorks} aria-labelledby="how-title">
                <div className={`wrapper ${styles.sectionWrapper}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="how-title" className={`h2 ${styles.sectionTitle}`}>Comment ça marche ?</h2>
                        <p className={styles.sectionDescription}>
                            Une plateforme adaptée à vos besoins, que vous soyez à la recherche d'un bien ou propriétaire
                        </p>
                    </div>

                    <div className={styles.cardsGrid}>
                        <article className={`${styles.card} ${styles.cardBuyers}`} aria-labelledby="buyers-title">
                            <div className={styles.cardHeader}>
                                <span className={styles.cardIcon} aria-hidden="true" role="img">🔍</span>
                                <h3 id="buyers-title" className={styles.cardTitle}>Acheteurs</h3>
                                <p className={styles.cardSubtitle}>Trouvez la propriété de vos rêves</p>
                            </div>
                            <div className={styles.cardContent}>
                                <ol className={styles.stepsList}>
                                    <li className={styles.step}><span className={styles.stepNumber}>1</span><p>Recherchez parmi des milliers de biens</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>2</span><p>Filtrez selon vos critères (prix, localisation, surface)</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>3</span><p>Contactez directement les propriétaires</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>4</span><p>Organisez vos visites et finalisez votre achat</p></li>
                                </ol>
                                <Link href="/properties" className={`button ${styles.buttonPrimary} ${styles.cardButton}`}>
                                    Commencer ma recherche
                                </Link>
                            </div>
                        </article>

                        <article className={`${styles.card} ${styles.cardRenters}`} aria-labelledby="renters-title">
                            <div className={styles.cardHeader}>
                                <span className={styles.cardIcon} aria-hidden="true" role="img">📍</span>
                                <h3 id="renters-title" className={styles.cardTitle}>Locataires</h3>
                                <p className={styles.cardSubtitle}>Trouvez votre prochain logement</p>
                            </div>
                            <div className={styles.cardContent}>
                                <ol className={styles.stepsList}>
                                    <li className={styles.step}><span className={styles.stepNumber}>1</span><p>Explorez les locations disponibles dans votre zone</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>2</span><p>Comparez les prix et les commodités</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>3</span><p>Soumettez votre dossier en ligne</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>4</span><p>Signez votre bail et emménagez</p></li>
                                </ol>
                                <Link href="/properties?type=rent" className={`button ${styles.buttonPrimary} ${styles.cardButton}`}>
                                    Chercher une location
                                </Link>
                            </div>
                        </article>

                        <article className={`${styles.card} ${styles.cardOwners}`} aria-labelledby="owners-title">
                            <div className={styles.cardHeader}>
                                <span className={styles.cardIcon} aria-hidden="true" role="img">🔑</span>
                                <h3 id="owners-title" className={styles.cardTitle}>Propriétaires</h3>
                                <p className={styles.cardSubtitle}>Gérez vos biens efficacement</p>
                            </div>
                            <div className={styles.cardContent}>
                                <ol className={styles.stepsList}>
                                    <li className={styles.step}><span className={styles.stepNumber}>1</span><p>Ajoutez vos biens à vendre ou à louer</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>2</span><p>Gérez les visites et les candidatures</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>3</span><p>Suivez vos revenus et vos dépenses</p></li>
                                    <li className={styles.step}><span className={styles.stepNumber}>4</span><p>Accédez aux outils de gestion locative</p></li>
                                </ol>
                                <Link href="/account" className={`button ${styles.buttonPrimary} ${styles.cardButton}`}>
                                    Gérer mes biens
                                </Link>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section className={styles.advantages} aria-labelledby="why-title">
                <div className={`wrapper ${styles.sectionWrapper}`}>
                    <div className={styles.sectionHeader}>
                        <h2 id="why-title" className={`h2 ${styles.sectionTitle}`}>Pourquoi choisir La Crémaillère ?</h2>
                    </div>

                    <div className={styles.advantagesGrid}>
                        <div className={styles.advantage}>
                            <h3 className={styles.advantageTitle}>Gain de temps</h3>
                            <p className={styles.advantageText}>Trouvez rapidement ce que vous cherchez grâce à nos filtres avancés</p>
                        </div>
                        <div className={styles.advantage}>
                            <h3 className={styles.advantageTitle}>Sécurisé</h3>
                            <p className={styles.advantageText}>Tous les profils sont vérifiés pour votre sécurité</p>
                        </div>
                        <div className={styles.advantage}>
                            <h3 className={styles.advantageTitle}>Communauté</h3>
                            <p className={styles.advantageText}>Rejoignez une communauté active de professionnels de l'immobilier</p>
                        </div>
                        <div className={styles.advantage}>
                            <h3 className={styles.advantageTitle}>Performance</h3>
                            <p className={styles.advantageText}>Outils d'analyse pour optimiser vos investissements</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta} aria-labelledby="cta-title">
                <div className={`wrapper ${styles.ctaWrapper}`}>
                    <h2 id="cta-title" className={`h2 ${styles.ctaTitle}`}>Prêt à commencer ?</h2>
                    <p className={styles.ctaDescription}>
                        Rejoignez des milliers d'utilisateurs qui font confiance à La Crémaillère
                    </p>
                    <div className={styles.ctaButtons}>
                        <Link href="/signup" className={`button ${styles.buttonPrimary} ${styles.buttonLarge}`}>
                            Créer un compte gratuit
                        </Link>
                        <Link href="/about" className={`button ${styles.buttonLarge}`}>
                            En savoir plus
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}