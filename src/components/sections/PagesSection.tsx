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
                        AI, 자동화, 개발 도구를 실험한 개인 프로젝트입니다
                    </p>
                </ScrollAnimation>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ScrollAnimation
                            key={service.title}
                            animation="fade"
                            delay={index * 120}
                        >
                            <div className="glass-card group hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full rounded-2xl">
                                {/* 은은한 테마 그라데이션 헤더 */}
                                <div className="h-32 bg-gradient-to-br from-[var(--accent-glow)] to-[var(--card-border)] border-b border-[var(--card-border)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/[0.02]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center shadow-md shadow-black/[0.02] group-hover:scale-110 transition-transform duration-500">
                                            <span className="text-3xl filter drop-shadow-sm select-none">
                                                {service.icon}
                                            </span>
                                        </div>
                                    </div>
                                    {/* 장식 요소 (오로라 역광 구체) */}
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-[var(--accent-color)]/10 rounded-full blur-xl" />
                                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[var(--accent-secondary)]/10 rounded-full blur-xl" />
                                </div>

                                {/* 컨텐츠 영역 - flex-grow로 공간 확장 */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-color)] transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-[var(--text-secondary)] mb-4 leading-relaxed text-sm font-medium">
                                        {service.description}
                                    </p>

                                    {/* 기능 목록 - flex-grow로 남은 공간 차지 */}
                                    <div className="mb-6 flex-grow">
                                        <ul className="space-y-2">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-sm text-[var(--text-secondary)] font-medium">
                                                    <svg className="w-4 h-4 text-[var(--accent-color)] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl font-semibold bg-[var(--card-border)] border border-[var(--card-border)] text-[var(--text-muted)] cursor-not-allowed"
                                                aria-disabled="true"
                                            >
                                                {service.buttonText}
                                            </span>
                                        ) : (
                                            <Link
                                                href={service.path}
                                                className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl transition-all duration-300 group-hover:scale-105 font-semibold bg-[var(--accent-color)] hover:bg-[var(--accent-secondary)] text-white hover:shadow-[0_0_20px_var(--accent-glow)]"
                                                target={isExternalLink(service.path) ? '_blank' : undefined}
                                                rel={isExternalLink(service.path) ? 'noopener noreferrer' : undefined}
                                            >
                                                {service.buttonText}
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
