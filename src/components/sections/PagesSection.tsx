import ScrollAnimation from '@/components/animations/ScrollAnimations'
import Link from 'next/link'
import { services } from '@/data/portfolio'
import { isExternalLink } from '@/utils/links'

export default function PagesSection() {
    return (
        <section
            id="services"
            className="section-padding bg-transparent relative z-10"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--accent-color)] tracking-tight mb-4">
                        Lab
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
                        AI, 자동화, 개발 도구를 직접 실험하며 정리한 개인 프로젝트입니다
                    </p>
                </ScrollAnimation>

                <div className="mx-auto max-w-5xl divide-y divide-[var(--card-border)] border-y border-[var(--card-border)]">
                    {services.map((service, index) => (
                        <ScrollAnimation
                            key={service.title}
                            animation="fade"
                            delay={index * 80}
                        >
                            <article className="group grid gap-4 py-5 transition-colors duration-300 hover:bg-[var(--accent-glow)]/40 md:grid-cols-[3.5rem_minmax(0,1fr)_auto] md:items-center md:px-3">
                                <div className="flex items-center">
                                    <span className="font-mono text-xs font-bold tabular-nums text-[var(--text-muted)]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-extrabold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-color)]">
                                            {service.title}
                                        </h3>
                                        <span className="rounded-md border border-[var(--card-border)] bg-[var(--input-bg)] px-2 py-1 text-[10px] font-bold text-[var(--text-muted)]">
                                            {service.buttonType === 'repo' ? '저장소' : '서비스'}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                                        {service.description}
                                    </p>

                                    <ul className="mt-3 flex flex-wrap gap-2">
                                        {service.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="rounded-md border border-[var(--card-border)] bg-[var(--input-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]"
                                            >
                                                    {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="md:justify-self-end">
                                    {service.status === 'coming_soon' ? (
                                        <span
                                            className="inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-border)] px-4 text-sm font-semibold text-[var(--text-muted)] md:w-auto md:min-w-[8.5rem]"
                                            aria-disabled="true"
                                        >
                                            {service.buttonText}
                                        </span>
                                    ) : (
                                        <Link
                                            href={service.path}
                                            className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-xl bg-[var(--button-primary-bg)] px-4 text-sm font-semibold text-[var(--button-primary-text)] transition-all duration-300 hover:bg-[var(--button-primary-hover)] active:translate-y-px md:w-auto md:min-w-[8.5rem]"
                                            target={isExternalLink(service.path) ? '_blank' : undefined}
                                            rel={isExternalLink(service.path) ? 'noopener noreferrer' : undefined}
                                        >
                                            {service.buttonText}
                                        </Link>
                                    )}
                                </div>
                            </article>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    )
}
