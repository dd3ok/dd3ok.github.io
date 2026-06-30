import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
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
        <main className="min-h-[100dvh] bg-[var(--bg-color)]">
            <Navigation />
            <NotesDirectoryView activeCategory={category} notes={getPublicNotes()} />
        </main>
    )
}
