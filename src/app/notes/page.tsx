import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import NotesDirectoryView from './NotesDirectoryView'
import { allNotesCategory, getPublicNotes } from '@/lib/notes'

export const metadata: Metadata = {
    title: 'Waitworthy',
    description: 'Deep Research처럼 기다릴 가치 있는 AI 보고서를 정리합니다.',
    alternates: {
        canonical: '/notes/',
    },
}

export default function NotesPage() {
    return (
        <main className="min-h-screen min-h-[100dvh] bg-[var(--bg-color)]">
            <Navigation />
            <NotesDirectoryView activeCategory={allNotesCategory} notes={getPublicNotes()} />
        </main>
    )
}
