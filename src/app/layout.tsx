import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'  // 이 줄이 있는지 확인!

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'dd3ok',
    description: 'Backend Developer Portfolio',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
        <body className={inter.className}>{children}</body>
        </html>
    )
}
