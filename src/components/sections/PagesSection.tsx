import Link from 'next/link'
import DashboardSection from '@/components/layout/DashboardSection'
import { services } from '@/data/portfolio'
import { isExternalLink } from '@/utils/links'

export default function PagesSection() {
    return (
        <DashboardSection
            id="services"
            eyebrow="Experiments & Tools"
            title="Lab"
            description="AI, 자동화, 개발 도구를 직접 실험하며 정리한 개인 프로젝트입니다"
        >
            <div className="grid gap-4 md:grid-cols-2">
                {services.map((service, index) => (
                    <article
                        key={service.title}
                        className="glass-card flex h-full min-w-0 flex-col justify-between rounded-2xl p-5 [overflow-wrap:anywhere] md:p-6"
                    >
                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-xs font-bold tabular-nums text-[var(--text-muted)]">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--text-muted)]">
                                    {service.buttonType === 'repo' ? '저장소' : '서비스'}
                                </span>
                            </div>

                            <h3 className="mt-3 text-lg font-extrabold text-[var(--text-primary)]">
                                {service.title}
                            </h3>

                            <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                                {service.description}
                            </p>

                            <ul className="mt-4 flex flex-wrap gap-1.5">
                                {service.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]"
                                    >
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-5 border-t border-[var(--card-border)] pt-4">
                            {service.status === 'coming_soon' ? (
                                <span
                                    className="inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-border)] px-4 text-sm font-semibold text-[var(--text-muted)]"
                                    aria-disabled="true"
                                >
                                    {service.buttonText}
                                </span>
                            ) : (
                                <Link
                                    href={service.path}
                                    className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl bg-[var(--button-primary-bg)] px-4 text-sm font-semibold text-[var(--button-primary-text)] transition-colors duration-200 hover:bg-[var(--button-primary-hover)]"
                                    target={isExternalLink(service.path) ? '_blank' : undefined}
                                    rel={isExternalLink(service.path) ? 'noopener noreferrer' : undefined}
                                >
                                    {service.buttonText}
                                </Link>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </DashboardSection>
    )
}
