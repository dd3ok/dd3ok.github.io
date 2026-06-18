import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navigation from '@/components/layout/Navigation'
import {
    getNoteCategoryById,
    getPublicNoteBySlug,
    getStaticNotePostSlugs,
} from '@/lib/notes'

export const dynamicParams = false
export const dynamic = 'force-static'

const emptyPostSlug = '__empty__'

interface NotePostPageProps {
    params: Promise<{
        slug: string
    }>
}

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(`${date}T00:00:00+09:00`))
}

export function generateStaticParams() {
    const slugs = getStaticNotePostSlugs()
    return (slugs.length > 0 ? slugs : [emptyPostSlug]).map((slug) => ({ slug }))
}

export const generateMetadata = async ({ params }: NotePostPageProps): Promise<Metadata> => {
    const { slug } = await params
    const note = getPublicNoteBySlug(slug)

    if (!note) {
        if (slug === emptyPostSlug) {
            return {
                title: 'No public notes yet | dd3ok',
                robots: {
                    index: false,
                    follow: false,
                },
            }
        }

        return {
            title: 'Note not found | dd3ok',
        }
    }

    return {
        title: `${note.title} | dd3ok`,
        description: note.summary,
        alternates: {
            canonical: `/notes/post/${note.slug}/`,
        },
    }
}

export default async function NotePostPage({ params }: NotePostPageProps) {
    const { slug } = await params
    const note = getPublicNoteBySlug(slug)

    if (!note) {
        if (slug === emptyPostSlug) {
            return (
                <main className="page-enter min-h-screen bg-[var(--bg-color)]">
                    <Navigation />
                    <section className="section-padding pt-28 md:pt-32">
                        <div className="container max-w-3xl">
                            <Link
                                href="/notes/"
                                className="text-sm font-bold text-[var(--accent-color)] transition-colors hover:text-[var(--accent-secondary)]"
                            >
                                Notes
                            </Link>
                            <div className="glass-card mt-6 p-6">
                                <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
                                    No public notes yet
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                                    Public notes will appear here after reviewed Markdown notes are added.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>
            )
        }

        notFound()
    }

    const category = getNoteCategoryById(note.category)

    return (
        <main className="page-enter min-h-screen bg-[var(--bg-color)]">
            <Navigation />
            <article className="section-padding pt-28 md:pt-32">
                <div className="container max-w-3xl">
                    <Link
                        href="/notes/"
                        className="text-sm font-bold text-[var(--accent-color)] transition-colors hover:text-[var(--accent-secondary)]"
                    >
                        Notes
                    </Link>

                    <header className="mt-5 border-b border-[var(--card-border)] pb-8">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                            <time dateTime={note.date}>{formatDate(note.date)}</time>
                            <span aria-hidden="true">·</span>
                            <span>{note.readingTimeMinutes}분 읽기</span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{note.status}</span>
                            {category && (
                                <>
                                    <span aria-hidden="true">·</span>
                                    <Link
                                        href={`/notes/${category.id}/`}
                                        className="text-[var(--accent-color)] transition-colors hover:text-[var(--accent-secondary)]"
                                    >
                                        {category.title}
                                    </Link>
                                </>
                            )}
                        </div>

                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
                            {note.title}
                        </h1>
                        <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
                            {note.summary}
                        </p>
                    </header>

                    <div className="prose prose-neutral mt-8 max-w-none text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-[var(--accent-color)] prose-strong:text-[var(--text-primary)] prose-li:text-[var(--text-secondary)] prose-blockquote:text-[var(--text-secondary)] prose-code:text-[var(--text-primary)] prose-pre:border prose-pre:border-[var(--card-border)] prose-pre:bg-[var(--card-bg)] prose-pre:text-[var(--text-primary)] prose-th:text-[var(--text-primary)] prose-td:text-[var(--text-secondary)] [&_pre_code]:text-[var(--text-primary)]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {note.body}
                        </ReactMarkdown>
                    </div>

                    <footer className="mt-10 flex flex-wrap gap-2 border-t border-[var(--card-border)] pt-6">
                        {note.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 text-xs font-bold text-[var(--text-muted)]"
                            >
                                {tag}
                            </span>
                        ))}
                    </footer>
                </div>
            </article>
        </main>
    )
}
