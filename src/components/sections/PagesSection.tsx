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

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <ScrollAnimation
                            key={service.title}
                            animation="fade"
                            delay={index * 120}
                        >
                            <div className="glass-card group flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--card-hover-border)]">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-color)]">
                                        {service.title}
                                    </h3>
                                    <span className="shrink-0 rounded-full border border-[var(--card-border)] bg-[var(--input-bg)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)]">
                                        {service.buttonType === 'repo' ? '저장소' : '서비스'}
                                    </span>
                                </div>

                                <div className="flex flex-grow flex-col">
                                    <p className="mb-4 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                                        {service.description}
                                    </p>

                                    <div className="mb-6 flex-grow">
                                        <ul className="space-y-2">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
                                                    <svg className="mr-2 h-4 w-4 flex-shrink-0 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto">
                                        {service.status === 'coming_soon' ? (
                                            <span
                                                className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-border)] px-4 py-3 font-semibold text-[var(--text-muted)]"
                                                aria-disabled="true"
                                            >
                                                {service.buttonText}
                                            </span>
                                        ) : (
                                            <Link
                                                href={service.path}
                                                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--button-primary-bg)] px-4 py-3 font-semibold text-[var(--button-primary-text)] transition-all duration-300 hover:bg-[var(--button-primary-hover)] hover:shadow-[0_0_20px_var(--accent-glow)] group-hover:scale-[1.02]"
                                                target={isExternalLink(service.path) ? '_blank' : undefined}
                                                rel={isExternalLink(service.path) ? 'noopener noreferrer' : undefined}
                                            >
                                                {service.buttonText}
                                                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    )
}
