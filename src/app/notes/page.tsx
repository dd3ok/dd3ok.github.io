import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import NotesDirectoryView from './NotesDirectoryView'
import { allNotesCategory, getPublicNotes } from '@/lib/notes'

export const metadata: Metadata = {
    title: 'Notes | dd3ok',
    description: '카테고리별 공개 research notes',
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
