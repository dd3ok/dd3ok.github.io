import { aboutContent, skills } from '@/data/portfolio'

const HIGHLIGHTS = [
    { label: '경력 기간', value: '7년+', detail: '지마켓 · 미라콤아이앤씨' },
    { label: '주력 도메인', value: '인증 · API · 커머스', detail: 'Spring Boot · .NET · MSA' },
    { label: '최근 집중', value: 'AI Backend · Agents', detail: 'Spring AI · RAG · 자동화' },
] as const

export default function AboutSection() {
    return (
        <section
            id="about"
            className="relative z-10 px-4 py-8 md:px-10 md:py-10"
        >
            <div className="mx-auto max-w-5xl space-y-6">
                {/* Dashboard Header */}
                <header className="flex flex-col gap-3 border-b border-[var(--card-border)] pb-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-wider text-[var(--accent-color)] uppercase">
                            Profile &amp; Stack
                        </p>
                        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-3xl">
                            About Me
                        </h2>
                    </div>
                    <ul className="flex flex-wrap gap-1.5" aria-label="핵심 키워드">
                        {aboutContent.summaryTags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]"
                            >
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </header>

                {/* Summary Metrics Strip */}
                <div className="grid gap-3 sm:grid-cols-3">
                    {HIGHLIGHTS.map((item) => (
                        <div
                            key={item.label}
                            className="glass-card rounded-2xl p-4"
                        >
                            <p className="text-xs font-semibold text-[var(--text-muted)]">{item.label}</p>
                            <p className="mt-1 text-base font-extrabold tracking-tight text-[var(--text-primary)]">
                                {item.value}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-[var(--text-secondary)]">
                                {item.detail}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main Bento Grid */}
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                    <article className="glass-card rounded-2xl p-5 md:p-6">
                        <p className="text-xs font-bold tracking-wider text-[var(--accent-color)] uppercase">
                            Overview
                        </p>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-[var(--text-primary)] md:text-xl">
                            {aboutContent.title}
                        </h3>
                        <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {aboutContent.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </article>

                    <article className="glass-card rounded-2xl p-5 md:p-6">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold tracking-wider text-[var(--accent-color)] uppercase">
                                Tech Stack
                            </p>
                            <span className="text-xs font-semibold text-[var(--text-muted)]">
                                {skills.length}개 영역
                            </span>
                        </div>
                        <div className="mt-4 divide-y divide-[var(--card-border)]">
                            {skills.map((skillGroup) => (
                                <div key={skillGroup.category} className="py-3 first:pt-0 last:pb-0">
                                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                                        {skillGroup.category}
                                    </h4>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {skillGroup.items.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--card-hover-border)] hover:text-[var(--text-primary)]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            </div>
        </section>
    )
}
