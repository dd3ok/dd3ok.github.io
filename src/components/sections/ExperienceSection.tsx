import DashboardSection from '@/components/layout/DashboardSection'
import { experiences } from '@/data/portfolio'

export default function ExperienceSection() {
    return (
        <DashboardSection
            id="experience"
            eyebrow="Career Timeline"
            title="Experience"
            description="다양한 환경에서 백엔드 설계·연동·운영을 경험했습니다."
            headerExtra={
                <span className="inline-block rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 font-mono text-xs font-bold text-[var(--text-secondary)]">
                    2018.01 — Present
                </span>
            }
        >
            <div className="space-y-4">
                {experiences.map((exp, index) => {
                    const isCurrent = exp.period.includes('Present')

                    return (
                        <article
                            key={exp.company}
                            className="glass-card rounded-2xl p-5 md:p-6"
                        >
                            <div className="flex flex-col gap-3 border-b border-[var(--card-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] font-mono text-xs font-bold tabular-nums text-[var(--text-muted)]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                                                {exp.company}
                                            </h3>
                                            {isCurrent && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-color)]/25 bg-[var(--accent-glow)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent-color)]">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-color)] motion-safe:animate-pulse" />
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-0.5 text-sm font-semibold text-[var(--accent-color)]">
                                            {exp.position}
                                        </p>
                                    </div>
                                </div>

                                <span className="self-start rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-1 font-mono text-xs font-bold text-[var(--text-muted)] sm:self-auto">
                                    {exp.period}
                                </span>
                            </div>

                            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                                {exp.description.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)]/60 px-3.5 py-2.5 text-sm leading-relaxed text-[var(--text-secondary)]"
                                    >
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-color)]" />
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    )
                })}
            </div>
        </DashboardSection>
    )
}
