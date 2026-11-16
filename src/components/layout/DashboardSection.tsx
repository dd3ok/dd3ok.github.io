import type { ReactNode } from 'react'

interface DashboardSectionProps {
    id?: string
    eyebrow: string
    title: string
    headingTag?: 'h1' | 'h2'
    headingId?: string
    description?: string
    headerExtra?: ReactNode
    children: ReactNode
}

export default function DashboardSection({
    id,
    eyebrow,
    title,
    headingTag = 'h2',
    headingId,
    description,
    headerExtra,
    children,
}: DashboardSectionProps) {
    const Heading = headingTag

    return (
        <section
            id={id}
            aria-labelledby={headingId}
            className="relative z-10 px-4 py-8 md:px-10 md:py-10"
        >
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex flex-col gap-3 border-b border-[var(--card-border)] pb-5 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs font-bold tracking-wider text-[var(--accent-color)] uppercase">
                            {eyebrow}
                        </p>
                        <Heading
                            id={headingId}
                            className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-3xl"
                        >
                            {title}
                        </Heading>
                        {description && (
                            <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                                {description}
                            </p>
                        )}
                    </div>
                    {headerExtra && <div className="shrink-0">{headerExtra}</div>}
                </header>

                {children}
            </div>
        </section>
    )
}
