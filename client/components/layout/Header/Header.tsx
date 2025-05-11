'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [isHovered, setIsHovered] = useState(false)

    const isActive = (href: string) => pathname === href

    return (
        <div
            className={styles.wrapper}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <header className={`${styles.header} ${isHovered ? styles.headerVisible : ''}`}>
                <nav className={styles.nav}>
                    <Link href="/" className={`${styles.logo} ${isActive('/') ? styles.active : ''}`}>
                        Acceuil
                    </Link>

                    <Link href="/properties" className={`${styles.logo} ${isActive('/properties') ? styles.active : ''}`}>
                        Biens
                    </Link>

                    {session?.user && (
                        <>
                            <Link
                                href="/account"
                                className={`${styles.link} ${isActive('/account') ? styles.active : ''}`}
                            >
                                Mon compte
                            </Link>
                            <button onClick={() => signOut({callbackUrl: '/'})} className={styles.logout}>
                                Déconnexion
                            </button>
                        </>
                    )}

                    {!session?.user && (
                        <Link
                            href="/login"
                            className={`${styles.link} ${isActive('/login') ? styles.active : ''}`}
                        >
                            Connexion
                        </Link>
                    )}
                </nav>
                <span className={styles.line}></span>
            </header>
        </div>
    )
}