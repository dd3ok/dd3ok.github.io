import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DashboardShell from '@/components/layout/DashboardShell'
import NotesDirectoryView from '../NotesDirectoryView'
import {
    getNoteCategoryById,
    getPublicNotes,
    getStaticNoteCategorySlugs,
} from '@/lib/notes'

export const dynamicParams = false

interface CategoryPageProps {
    params: Promise<{
        category: string
    }>
}

export const generateStaticParams = () => {
    return getStaticNoteCategorySlugs().map((category) => ({ category }))
}

export const generateMetadata = async ({ params }: CategoryPageProps): Promise<Metadata> => {
    const { category: categorySlug } = await params
    const category = getNoteCategoryById(categorySlug)

    if (!category) {
        return {
            title: 'Category not found',
        }
    }

    return {
        title: `${category.title} Notes`,
        description: `${category.title} 카테고리의 공개 노트`,
        alternates: {
            canonical: `/notes/${category.id}/`,
        },
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category: categorySlug } = await params
    const category = getNoteCategoryById(categorySlug)

    if (!category) {
        notFound()
    }

    return (
        <main className="min-h-screen min-h-[100dvh] bg-[var(--bg-color)]">
            <DashboardShell activeNav="notes">
                <div className="dashboard-pane min-h-0 flex-1 overflow-y-auto pt-12 lg:pt-0 chat-scroll">
                    <NotesDirectoryView activeCategoryId={category.id} notes={getPublicNotes()} />
                </div>
            </DashboardShell>
        </main>
    )
}
