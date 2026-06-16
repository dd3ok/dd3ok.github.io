import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap',
})
const siteUrl = 'https://dd3ok.github.io'
const siteTitle = 'dd3ok — Backend Developer Portfolio'
const siteDescription =
    'Backend Developer dd3ok의 포트폴리오. Spring Boot, 분산 시스템, AI Agent Skill 오픈소스 프로젝트 — 네이버증권 API, 토스증권 API, 바이낸스 API, 야후 파이낸스 스킬 등.'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: siteTitle,
        template: '%s | dd3ok',
    },
    description: siteDescription,
    keywords: [
        'dd3ok',
        'backend developer',
        'portfolio',
        'agent skill',
        'codex skill',
        'openai skill',
        '네이버증권 API',
        '토스증권 API',
        'Binance API',
        'Yahoo Finance',
        'Python',
        'Spring Boot',
        'open source',
    ],
    authors: [{ name: 'dd3ok', url: 'https://github.com/dd3ok' }],
    creator: 'dd3ok',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
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

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'dd3ok',
    url: 'https://dd3ok.github.io',
    jobTitle: 'Backend Developer',
    sameAs: [
        'https://github.com/dd3ok',
        'https://linkedin.com/in/dd3ok',
    ],
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                var saved = localStorage.getItem('theme');
                                if (saved === 'dark') {
                                    document.documentElement.setAttribute('data-theme', 'dark');
                                } else {
                                    document.documentElement.setAttribute('data-theme', 'light');
                                }
                            } catch (e) {}
                        })();
                    `
                }}
            />
        </head>
        <body className={notoSansKR.className}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </body>
        </html>
    )
}
