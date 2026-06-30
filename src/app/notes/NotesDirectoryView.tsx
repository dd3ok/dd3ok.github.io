import Link from 'next/link'
import {
    allNotesCategory,
    getNotesForCategory,
    noteFilterCategories,
    type NoteCategory,
    type PublicNote,
    type PublicNoteStatus,
} from '@/lib/notes'

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

const statusLabelByStatus: Record<PublicNoteStatus, string> = {
    draft: '초안',
    reviewed: '검토 완료',
    evergreen: '계속 업데이트',
    archived: '보관됨',
}

export default function NotesDirectoryView({ activeCategory, notes }: NotesDirectoryViewProps) {
    const activeNotes = getNotesForCategory(notes, activeCategory)
    const categoryTabs = noteFilterCategories.map((category) => ({
        ...category,
        count: getNotesForCategory(notes, category).length,
    }))
    const visibleCategoryTabs = categoryTabs.filter((category) => (
        category.id === allNotesCategory.id || category.count > 0
    ))
    const activeCategoryLabel = activeCategory.id === allNotesCategory.id
        ? '최근 노트'
        : activeCategory.title
    const activeCategoryDescription = activeCategory.description
    const showSectionCount = activeCategory.id !== allNotesCategory.id

    return (
        <section className="section-padding pt-28 md:pt-32">
            <div className="container">
                <div className="border-b border-[var(--card-border)] pb-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--accent-color)]">
                                AI Research Wiki
                            </p>
                            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
                                Waitworthy
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)]">
                                Deep Research처럼 기다릴 가치 있는 AI 보고서를 정리합니다.
                            </p>
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-muted)]">
                            공개 노트 {notes.length}개
                        </p>
                    </div>
                </div>

                <nav className="mt-6 flex flex-wrap gap-2" aria-label="노트 카테고리">
                    {visibleCategoryTabs.map((category) => {
                        const isActiveCategory = category.id === activeCategory.id

                        return (
                            <Link
                                key={category.id}
                                href={getCategoryHref(category)}
                                aria-current={isActiveCategory ? 'page' : undefined}
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
                    <div className="mb-5 flex flex-col gap-3 border-b border-[var(--card-border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                {activeCategoryLabel}
                            </h2>
                            <p className="mt-1 text-sm font-medium leading-6 text-[var(--text-secondary)]">
                                {activeCategoryDescription}
                            </p>
                        </div>
                        {showSectionCount && (
                            <p className="text-sm font-semibold text-[var(--text-muted)]">
                                {activeNotes.length}개 공개 노트
                            </p>
                        )}
                    </div>

                    {activeNotes.length === 0 ? (
                        <div className="glass-card p-6">
                            <p className="text-sm text-[var(--text-muted)]">
                                아직 공개 노트가 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {activeNotes.map((note) => {
                                const visibleTags = note.tags.slice(0, 4)
                                const remainingTagCount = note.tags.length - visibleTags.length

                                return (
                                    <article key={note.slug} className="glass-card p-5">
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
                                            <time dateTime={note.date}>{formatDate(note.date)}</time>
                                            <span aria-hidden="true">·</span>
                                            <span>{note.readingTimeMinutes}분 읽기</span>
                                            <span aria-hidden="true">·</span>
                                            <span className="rounded-full border border-[var(--card-border)] px-2 py-0.5">
                                                {statusLabelByStatus[note.status]}
                                            </span>
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
                                        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${note.title} 태그`}>
                                            {visibleTags.map((tag) => (
                                                <li
                                                    key={tag}
                                                    className="rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]"
                                                >
                                                    {tag}
                                                </li>
                                            ))}
                                            {remainingTagCount > 0 && (
                                                <li className="rounded-full border border-[var(--card-border)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]">
                                                    +{remainingTagCount}
                                                </li>
                                            )}
                                        </ul>
                                        <div className="mt-4 flex justify-end">
                                            <Link
                                                href={`/notes/post/${note.slug}/`}
                                                aria-label={`${note.title} 계속 읽기`}
                                                className="text-sm font-bold text-[var(--accent-color)] transition-colors hover:text-[var(--accent-secondary)]"
                                            >
                                                계속 읽기
                                            </Link>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
