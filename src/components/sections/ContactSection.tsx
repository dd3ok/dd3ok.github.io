import DashboardSection from '@/components/layout/DashboardSection'
import ContactForm from '@/components/sections/ContactForm'

export default function ContactSection() {
    return (
        <DashboardSection
            id="contact"
            eyebrow="Direct Message"
            title="Contact"
            description="새로운 기회나 협업이 있다면 편하게 연락해 주세요"
            headerExtra={
                <span className="inline-block rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1.5 font-mono text-xs font-bold text-[var(--text-secondary)]">
                    hwick@kakao.com
                </span>
            }
        >
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                {/* 왼쪽: 소개 및 연락처 정보 */}
                <article className="glass-card rounded-2xl p-5 md:p-6">
                    <p className="text-xs font-bold tracking-wider text-[var(--accent-color)] uppercase">
                        Channels
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-[var(--text-primary)] md:text-xl">
                        함께 일해요
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        흥미로운 프로젝트나 새로운 기회가 있다면 편하게 이야기해 주세요.
                        AI를 활용한 백엔드, 분산 시스템 등 스터디도 환영합니다.
                    </p>

                    <div className="mt-5 space-y-2.5">
                        <a
                            href="mailto:hwick@kakao.com"
                            className="flex items-center gap-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)]/60 p-3.5 transition-colors hover:border-[var(--card-hover-border)] hover:bg-[var(--accent-glow)]/40"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)]">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-[var(--text-primary)]">Email</p>
                                <p className="truncate text-xs font-medium text-[var(--text-secondary)]">hwick@kakao.com</p>
                            </div>
                        </a>

                        <a
                            href="https://github.com/dd3ok"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)]/60 p-3.5 transition-colors hover:border-[var(--card-hover-border)] hover:bg-[var(--accent-glow)]/40"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)]">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-[var(--text-primary)]">GitHub</p>
                                <p className="truncate text-xs font-medium text-[var(--text-secondary)]">github.com/dd3ok</p>
                            </div>
                        </a>

                        <a
                            href="https://linkedin.com/in/dd3ok"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)]/60 p-3.5 transition-colors hover:border-[var(--card-hover-border)] hover:bg-[var(--accent-glow)]/40"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--accent-color)]">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-[var(--text-primary)]">LinkedIn</p>
                                <p className="truncate text-xs font-medium text-[var(--text-secondary)]">linkedin.com/in/dd3ok</p>
                            </div>
                        </a>
                    </div>
                </article>

                {/* 오른쪽: 연락 폼 */}
                <article className="glass-card rounded-2xl p-5 md:p-6">
                    <ContactForm />
                </article>
            </div>
        </DashboardSection>
    )
}
