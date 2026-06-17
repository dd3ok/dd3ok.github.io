import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import NotesDirectoryView from './NotesDirectoryView'
import { allNotesCategory, getPublicNotes } from '@/lib/notes'

export const metadata: Metadata = {
    title: 'Waitworthy | dd3ok',
    description: '기다릴 가치가 있었던 GPT Pro·Deep Research 등 AI 리서치 결과를 카테고리별 위키로 정리하는 Repository 입니다.',
    alternates: {
        canonical: '/notes/',
    },
}

export default function NotesPage() {
    return (
        <main className="page-enter min-h-screen bg-[var(--bg-color)]">
            <Navigation />
            <NotesDirectoryView activeCategory={allNotesCategory} notes={getPublicNotes()} />
            <Footer />
        </main>
    )
}
