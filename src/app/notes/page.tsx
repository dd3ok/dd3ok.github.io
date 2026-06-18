import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import NotesDirectoryView from './NotesDirectoryView'
import { allNotesCategory, getPublicNotes } from '@/lib/notes'

export const metadata: Metadata = {
    title: 'Waitworthy | dd3ok',
    description: 'GPT Pro·Deep Research 등 기다릴 가치가 있었던 AI 리서치를 위키로 정리합니다.',
    alternates: {
        canonical: '/notes/',
    },
}

export default function NotesPage() {
    return (
        <main className="page-enter min-h-screen bg-[var(--bg-color)]">
            <Navigation />
            <NotesDirectoryView activeCategory={allNotesCategory} notes={getPublicNotes()} />
        </main>
    )
}
