import type { Metadata } from 'next'
import DashboardShell from '@/components/layout/DashboardShell'
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
            <DashboardShell activeNav="notes">
                <div className="dashboard-pane min-h-0 flex-1 overflow-y-auto pt-12 lg:pt-0 chat-scroll">
                    <NotesDirectoryView activeCategoryId={allNotesCategory.id} notes={getPublicNotes()} />
                </div>
            </DashboardShell>
        </main>
    )
}
