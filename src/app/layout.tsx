import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const siteUrl = 'https://dd3ok.github.io'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'dd3ok',
    description: 'Backend Developer Portfolio',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'dd3ok',
        description: 'Backend Developer Portfolio',
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
        title: 'dd3ok',
        description: 'Backend Developer Portfolio',
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
