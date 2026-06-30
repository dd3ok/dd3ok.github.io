'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import Link from 'next/link'
import {
    allNotesCategory,
    getNoteCategoryById,
    getNotesForCategory,
    noteFilterCategories,
    type NoteCategory,
} from '@/lib/note-categories'
import type { PublicNote } from '@/lib/notes'

interface NotesDirectoryViewProps {
    activeCategory: NoteCategory
    notes: PublicNote[]
}

const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(`${date}T00:00:00+09:00`))
}

const getCategoryHref = (category: NoteCategory) => {
    if (category.id === allNotesCategory.id) {
        return '/notes/'
    }

    return `/notes/${category.id}/`
}

const getCategoryFromPathname = (pathname: string) => {
    const normalizedPathname = pathname.replace(/\/+$/, '')

    if (normalizedPathname === '/notes') {
        return allNotesCategory
    }

    const categoryMatch = normalizedPathname.match(/^\/notes\/([^/]+)$/)

    if (!categoryMatch) {
        return undefined
    }

    try {
        return getNoteCategoryById(decodeURIComponent(categoryMatch[1]))
    } catch {
        return undefined
    }
}

export default function NotesDirectoryView({ activeCategory, notes }: NotesDirectoryViewProps) {
    const [activeCategoryId, setActiveCategoryId] = useState(activeCategory.id)
    const currentCategory = useMemo(() => (
        noteFilterCategories.find((category) => category.id === activeCategoryId) ?? activeCategory
    ), [activeCategory, activeCategoryId])
    const activeNotes = useMemo(() => (
        getNotesForCategory(notes, currentCategory)
    ), [currentCategory, notes])
    const categoryTabs = useMemo(() => (
        noteFilterCategories.map((category) => ({
            ...category,
            count: getNotesForCategory(notes, category).length,
        }))
    ), [notes])
    const title = currentCategory.id === allNotesCategory.id
        ? 'Waitworthy'
        : `${currentCategory.title} Notes`
    const eyebrow = currentCategory.id === allNotesCategory.id
        ? 'AI Research Wiki'
        : 'Waitworthy'

    useEffect(() => {
        setActiveCategoryId(activeCategory.id)
    }, [activeCategory.id])

    useEffect(() => {
        const handlePopState = () => {
            const nextCategory = getCategoryFromPathname(window.location.pathname)

            if (nextCategory) {
                setActiveCategoryId(nextCategory.id)
            }
        }

        window.addEventListener('popstate', handlePopState)

        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    useEffect(() => {
        document.title = currentCategory.id === allNotesCategory.id
            ? 'Notes | dd3ok'
            : `${currentCategory.title} Notes | dd3ok`
    }, [currentCategory])

    const handleCategoryClick = useCallback((
        event: MouseEvent<HTMLAnchorElement>,
        category: NoteCategory
    ) => {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.altKey ||
            event.shiftKey
        ) {
            return
        }

        event.preventDefault()

        const nextHref = getCategoryHref(category)

        if (window.location.pathname === nextHref) {
            return
        }

        setActiveCategoryId(category.id)
        window.history.pushState({ notesCategory: category.id }, '', nextHref)
    }, [])

    return (
        <section className="section-padding pt-28 md:pt-32">
            <div className="container">
                <div className="border-b border-[var(--card-border)] pb-6">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent-color)]">
                        {eyebrow}
                    </p>
                    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
                            {title}
                        </h1>
                        <p className="max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
                            ChatGPT Deep Research, GPT Pro 워크플로, Gemini Deep Research 등 기다릴 가치가 있었던 AI 심층 리서치 보고서를 위키로 정리합니다.
                        </p>
                        <p className="text-sm font-semibold text-[var(--text-muted)]">
                            공개 노트 {activeNotes.length}개
                        </p>
                    </div>
                </div>

                <nav className="mt-6 flex flex-wrap gap-2" aria-label="노트 카테고리">
                    {categoryTabs.map((category) => {
                        const isActiveCategory = category.id === currentCategory.id

                        return (
                            <Link
                                key={category.id}
                                href={getCategoryHref(category)}
                                scroll={false}
                                aria-current={isActiveCategory ? 'page' : undefined}
                                onClick={(event) => handleCategoryClick(event, category)}
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                                    isActiveCategory
                                        ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                                        : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]'
                                }`}
                            >
                                <span>{category.title}</span>
                                <span className={isActiveCategory ? 'text-white/80' : 'text-[var(--text-muted)]'}>
                                    {category.count}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-10">
                    {activeNotes.length === 0 ? (
                        <div className="glass-card p-6">
                            <p className="text-sm text-[var(--text-muted)]">
                                아직 공개 노트가 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {activeNotes.map((note) => (
                                <article key={note.slug} className="glass-card p-5">
                                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                                        <time dateTime={note.date}>{formatDate(note.date)}</time>
                                        <span aria-hidden="true">·</span>
                                        <span>{note.readingTimeMinutes}분 읽기</span>
                                        <span aria-hidden="true">·</span>
                                        <span className="capitalize">{note.status}</span>
                                    </div>

                                    <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)]">
                                        <Link
                                            href={`/notes/post/${note.slug}/`}
                                            className="transition-colors hover:text-[var(--accent-color)]"
                                        >
                                            {note.title}
                                        </Link>
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                                        {note.summary}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
