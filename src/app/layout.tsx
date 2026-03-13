import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const siteUrl = 'https://dd3ok.github.io'
const siteTitle = 'dd3ok'
const siteDescription = 'Backend Developer Portfolio'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: siteTitle,
    description: siteDescription,
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: siteTitle,
        description: siteDescription,
        url: siteUrl,
        siteName: 'dd3ok Portfolio',
        locale: 'ko_KR',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 512,
                height: 512,
                alt: 'dd3ok portfolio logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteTitle,
        description: siteDescription,
        images: ['/logo.png'],
    },
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
            {children}
        </body>
        </html>
    )
}
