'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState, FocusEvent } from 'react'
import styles from './Header.module.css'

export default function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const isActive = (href: string) => pathname === href

    const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsOpen(false)
    }

    return (
        <div
            className={styles.wrapper}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            onBlur={handleBlur}
        >
            <header
                role="banner"
                className={`${styles.header} ${isOpen ? styles.headerVisible : ''}`}
            >
                <nav className={styles.nav} aria-label="Navigation principale">
                    <ul className={styles.list} role="list">
                        <li>
                            <Link
                                href="/"
                                aria-current={isActive('/') ? 'page' : undefined}
                                className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}
                            >
                                Accueil
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/properties"
                                aria-current={isActive('/properties') ? 'page' : undefined}
                                className={`${styles.navItem} ${isActive('/properties') ? styles.active : ''}`}
                            >
                                Biens
                            </Link>
                        </li>

                        {session?.user ? (
                            <>
                                <li>
                                    <Link
                                        href="/account"
                                        aria-current={isActive('/account') ? 'page' : undefined}
                                        className={`${styles.navItem} ${styles.link} ${isActive('/account') ? styles.active : ''}`}
                                    >
                                        Mon compte
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className={`${styles.navItem} ${styles.logout}`}
                                    >
                                        Déconnexion
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    href="/login"
                                    aria-current={isActive('/login') ? 'page' : undefined}
                                    className={`${styles.navItem} ${isActive('/login') ? styles.active : ''}`}
                                >
                                    Connexion
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <span className={styles.line} aria-hidden="true"></span>
            </header>
        </div>
    )
}