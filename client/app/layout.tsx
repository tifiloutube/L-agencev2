import '@/styles/globals.css'
import { Providers } from './providers'
import Header from '@/components/layout/Header/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body>
        <Providers>
            <Header />
            {children}
        </Providers>
        </body>
        </html>
    )
}