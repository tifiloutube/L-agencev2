'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

export default function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()

    const isActive = (href: string) => pathname === href

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                🏡 MonAgence
            </Link>

            <nav className={styles.nav}>
                <Link href="/properties" className={`${styles.link} ${isActive('/properties') ? styles.active : ''}`}>
                    Biens
                </Link>

                {session?.user && (
                    <>
                        <Link href="/account" className={`${styles.link} ${isActive('/account') ? styles.active : ''}`}>
                            Mon compte
                        </Link>
                        <Link href="/account/messages" className={`${styles.link} ${isActive('/account/messages') ? styles.active : ''}`}>
                            Messagerie
                        </Link>
                        <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logout}>
                            Déconnexion
                        </button>
                    </>
                )}

                {!session?.user && (
                    <Link href="/login" className={`${styles.link} ${isActive('/login') ? styles.active : ''}`}>
                        Connexion
                    </Link>
                )}
            </nav>
        </header>
    )
}