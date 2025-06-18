import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { HealthCheckInitializer } from '@/components/HealthCheckInitializer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'dd3ok',
    description: 'Backend Developer Portfolio',
    icons: {
        icon: [
            { url: '/favicon/icon.ico', sizes: '16x16' },
            { url: '/favicon/icon.png', sizes: '32x32' },
            { url: '/favicon/icon.png', sizes: '512x512' },
        ],
        apple: '/favicon/apple-icon.png',
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
        <body className={inter.className}>
            <HealthCheckInitializer />
            {children}
        </body>
        </html>
    )
}
