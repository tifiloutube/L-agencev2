import styles from './page.module.css'

export default function HomePage() {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={`wrapper ${styles.heroWrapper}`}>
                    <header className={styles.headerContainer}>
                        <h1 className={`h1span ${styles.h1}`}>La Crémaillère</h1>
                        <h2 className={`h2 ${styles.h2}`}>Tous les métiers de l'habitat, réunis sous un même toit.</h2>
                        <p className={styles.heroDescription}>
                            La plateforme qui connecte acheteurs, locataires et propriétaires pour une gestion immobilière simplifiée et efficace.
                        </p>

                        <div className={styles.heroButtons}>
                            <button className={`button ${styles.buttonPrimary} ${styles.buttonLarge}`}>
                                Trouver un bien
                            </button>
                            <button className={`button ${styles.buttonLarge}`}>
                                Gérer mes biens
                            </button>
                        </div>
                    </header>
                </div>
            </section>

            <section className={styles.howItWorks}>
                <div className={`wrapper ${styles.sectionWrapper}`}>
                    <div className={styles.sectionHeader}>
                        <h2 className={`h2 ${styles.sectionTitle}`}>Comment ça marche ?</h2>
                        <p className={styles.sectionDescription}>
                            Une plateforme adaptée à vos besoins, que vous soyez à la recherche d'un bien ou propriétaire
                        </p>
                    </div>

                    <div className={styles.cardsGrid}>
                        <div className={`${styles.card} ${styles.cardBuyers}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>🔍</div>
                                <h3 className={styles.cardTitle}>Acheteurs</h3>
                                <p className={styles.cardSubtitle}>Trouvez la propriété de vos rêves</p>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.stepsList}>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>1</span>
                                        <p>Recherchez parmi des milliers de biens disponibles</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>2</span>
                                        <p>Filtrez selon vos critères (prix, localisation, surface)</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>3</span>
                                        <p>Contactez directement les propriétaires</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>4</span>
                                        <p>Organisez vos visites et finalisez votre achat</p>
                                    </div>
                                </div>
                                <button className={`button ${styles.buttonPrimary} ${styles.cardButton}`}>
                                    Commencer ma recherche
                                </button>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.cardRenters}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>📍</div>
                                <h3 className={styles.cardTitle}>Locataires</h3>
                                <p className={styles.cardSubtitle}>Trouvez votre prochain logement</p>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.stepsList}>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>1</span>
                                        <p>Explorez les locations disponibles dans votre zone</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>2</span>
                                        <p>Comparez les prix et les commodités</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>3</span>
                                        <p>Soumettez votre dossier en ligne</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>4</span>
                                        <p>Signez votre bail et emménagez</p>
                                    </div>
                                </div>
                                <button className={`button ${styles.buttonPrimary} ${styles.cardButton}`}>
                                    Chercher une location
                                </button>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.cardOwners}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>🔑</div>
                                <h3 className={styles.cardTitle}>Propriétaires</h3>
                                <p className={styles.cardSubtitle}>Gérez vos biens efficacement</p>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.stepsList}>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>1</span>
                                        <p>Ajoutez vos biens à vendre ou à louer</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>2</span>
                                        <p>Gérez les visites et les candidatures</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>3</span>
                                        <p>Suivez vos revenus et vos dépenses</p>
                                    </div>
                                    <div className={styles.step}>
                                        <span className={styles.stepNumber}>4</span>
                                        <p>Accédez aux outils de gestion locative</p>
                                    </div>
                                </div>
                                <button className={`button ${styles.buttonPrimary} ${styles.cardButton}`}>
                                    Gérer mes biens
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.advantages}>
                <div className={`wrapper ${styles.sectionWrapper}`}>
                    <div className={styles.sectionHeader}>
                        <h2 className={`h2 ${styles.sectionTitle}`}>Pourquoi choisir La Crémaillère ?</h2>
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

            <section className={styles.cta}>
                <div className={`wrapper ${styles.ctaWrapper}`}>
                    <h2 className={`h2 ${styles.ctaTitle}`}>Prêt à commencer ?</h2>
                    <p className={styles.ctaDescription}>
                        Rejoignez des milliers d'utilisateurs qui font confiance à La Crémaillère
                    </p>
                    <div className={styles.ctaButtons}>
                        <button className={`button ${styles.buttonPrimary} ${styles.buttonLarge}`}>
                            Créer un compte gratuit
                        </button>
                        <button className={`button ${styles.buttonLarge}`}>
                            En savoir plus
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}