import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from './providers'
import Header from '@/components/layout/Header/Header'

export const metadata: Metadata = {
    title: { default: 'La Crémaillère', template: '%s | La Crémaillère' },
    description:
        "La plateforme qui connecte acheteurs, locataires et propriétaires pour une gestion immobilière simplifiée et efficace.",
    alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
        <a className="skip-link" href="#main">Aller au contenu</a>
        <Providers>
            <Header />
            <main id="main" tabIndex={-1}>{children}</main>
        </Providers>
        </body>
        </html>
    )
}