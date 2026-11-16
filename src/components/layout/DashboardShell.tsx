'use client'

import { useCallback, useEffect, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from '@/components/layout/ThemeToggle'

export type DashboardViewId = 'chat' | 'about' | 'experience' | 'projects' | 'services' | 'contact'
export type DashboardNavId = DashboardViewId | 'agent-skills' | 'notes'

interface DashboardShellProps {
    activeNav: DashboardNavId
    onSelectHomeView?: (event: MouseEvent<HTMLAnchorElement>, viewId: DashboardViewId, hash: string) => void
    children: ReactNode
}

interface SidebarNavItem {
    id: DashboardViewId
    label: string
    hash: string
    routeHref: string
    description: string
}

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'whoamai-sidebar-collapsed'
const SIDEBAR_COLLAPSED_EVENT = 'whoamai-sidebar-collapsed-changed'

const subscribeToSidebarCollapse = (onStoreChange: () => void) => {
    window.addEventListener('storage', onStoreChange)
    window.addEventListener(SIDEBAR_COLLAPSED_EVENT, onStoreChange)

    return () => {
        window.removeEventListener('storage', onStoreChange)
        window.removeEventListener(SIDEBAR_COLLAPSED_EVENT, onStoreChange)
    }
}

const getSidebarCollapsedSnapshot = () => {
    try {
        return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
    } catch {
        return false
    }
}

const PORTFOLIO_VIEWS: readonly SidebarNavItem[] = [
    { id: 'about', label: 'About', hash: '#about', routeHref: '/#about', description: '소개 · 기술 스택' },
    { id: 'experience', label: 'Experience', hash: '#experience', routeHref: '/#experience', description: '경력 타임라인' },
    { id: 'projects', label: 'Projects', hash: '#projects', routeHref: '/#projects', description: '주요 프로젝트' },
    { id: 'services', label: 'Lab', hash: '#services', routeHref: '/#services', description: '개인 실험 · 저장소' },
]

const AGENT_SKILLS_LINK = {
    id: 'agent-skills',
    label: 'Agent Skills',
    href: '/agent-skills/',
    description: '오픈소스 스킬',
} as const

const CONTACT_VIEW: SidebarNavItem = {
    id: 'contact',
    label: 'Contact',
    hash: '#contact',
    routeHref: '/#contact',
    description: '연락처 · 메시지',
}

const NOTES_LINKS = [
    { id: 'notes', label: 'Waitworthy', href: '/notes/', description: 'AI 리서치 노트' },
] as const

const SOCIAL_LINKS = [
    {
        label: 'GitHub',
        href: 'https://github.com/dd3ok',
        icon: (
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/dd3ok',
        icon: (
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        ),
    },
    {
        label: 'Instagram',
        href: 'https://instagram.com/dd3ok',
        icon: (
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        ),
    },
] as const

function SidebarIcon({ id }: { id: DashboardNavId }) {
    switch (id) {
        case 'chat':
            return (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h8M8 14h5m-9 6l2.2-3.3A8 8 0 1120 12a8 8 0 01-11.2 7.3L4 20z" />
                </svg>
            )
        case 'about':
            return (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        case 'experience':
            return (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        case 'projects':
            return (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                </svg>
            )
        case 'services':
            return (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 3v4.5L5.4 16.2A2.5 2.5 0 007.65 20h8.7a2.5 2.5 0 002.25-3.8L14.25 7.5V3m-5.5 0h6.5" />
                </svg>
            )
        case 'contact':
            return (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        case 'agent-skills':
            return (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        case 'notes':
            return (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
    }
}

export default function DashboardShell({
    activeNav,
    onSelectHomeView,
    children,
}: DashboardShellProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const isCollapsed = useSyncExternalStore(
        subscribeToSidebarCollapse,
        getSidebarCollapsedSnapshot,
        () => false
    )

    useEffect(() => {
        if (!isMobileSidebarOpen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileSidebarOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isMobileSidebarOpen])

    const handleToggleSidebarCollapse = useCallback(() => {
        const nextCollapsed = !getSidebarCollapsedSnapshot()
        try {
            window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(nextCollapsed))
        } catch {
            // Ignore storage errors in private browsing mode.
        }
        window.dispatchEvent(new Event(SIDEBAR_COLLAPSED_EVENT))
    }, [])

    const handleHomeItemClick = useCallback((
        event: MouseEvent<HTMLAnchorElement>,
        viewId: DashboardViewId,
        hash: string
    ) => {
        setIsMobileSidebarOpen(false)
        onSelectHomeView?.(event, viewId, hash)
    }, [onSelectHomeView])

    const renderHomeNavLink = ({
        viewId,
        hash,
        routeHref,
        className,
        title,
        ariaCurrent,
        content,
    }: {
        viewId: DashboardViewId
        hash: string
        routeHref: string
        className: string
        title?: string
        ariaCurrent?: 'page'
        content: ReactNode
    }) => {
        if (onSelectHomeView) {
            return (
                <a
                    href={hash}
                    title={title}
                    aria-label={title}
                    aria-current={ariaCurrent}
                    onClick={(event) => handleHomeItemClick(event, viewId, hash)}
                    className={className}
                >
                    {content}
                </a>
            )
        }

        return (
            <Link
                href={routeHref}
                prefetch={false}
                title={title}
                aria-label={title}
                aria-current={ariaCurrent}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={className}
            >
                {content}
            </Link>
        )
    }

    const sidebarContent = (
        <div className="flex h-full flex-col justify-between p-4">
            <div className="space-y-5 overflow-y-auto pr-0.5 chat-scroll">
                {/* Brand & Sidebar Collapse Toggle */}
                <div className={`flex items-center px-1 ${isCollapsed ? 'justify-between lg:flex-col lg:gap-2.5' : 'justify-between gap-2'}`}>
                    {renderHomeNavLink({
                        viewId: 'chat',
                        hash: '#hero',
                        routeHref: '/',
                        title: 'dd3ok 홈',
                        className: 'flex items-center gap-2.5 rounded-xl py-1 transition-opacity hover:opacity-85',
                        content: (
                            <>
                                <Image
                                    src="/logo.png"
                                    alt="dd3ok 로고"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 shrink-0 rounded-xl shadow-xs"
                                    priority
                                />
                                <div className={isCollapsed ? 'lg:hidden' : undefined}>
                                    <p className="text-sm font-extrabold tracking-tight text-[var(--accent-color)]">dd3ok</p>
                                    <p className="text-[11px] font-semibold text-[var(--text-muted)]">유인재</p>
                                </div>
                            </>
                        ),
                    })}
                    <button
                        type="button"
                        onClick={handleToggleSidebarCollapse}
                        aria-label={isCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
                        aria-expanded={!isCollapsed}
                        title={isCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
                        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)] shadow-xs transition-colors hover:border-[var(--card-hover-border)] hover:text-[var(--text-primary)] lg:flex"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4v16" />
                            {isCollapsed ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14 9 3 3-3 3" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 9-3 3 3 3" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Primary Chat Entry */}
                <div>
                    {renderHomeNavLink({
                        viewId: 'chat',
                        hash: '#hero',
                        routeHref: '/',
                        title: 'Career Agent',
                        ariaCurrent: activeNav === 'chat' ? 'page' : undefined,
                        className: `flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition-colors ${
                            isCollapsed ? 'lg:justify-center lg:px-2' : ''
                        } ${
                            activeNav === 'chat'
                                ? 'border-[var(--accent-color)]/35 bg-[var(--accent-glow)] text-[var(--accent-color)] shadow-xs'
                                : 'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:border-[var(--card-hover-border)]'
                        }`,
                        content: (
                            <>
                                <SidebarIcon id="chat" />
                                <span className={isCollapsed ? 'lg:hidden' : undefined}>Career Agent</span>
                            </>
                        ),
                    })}
                </div>

                {/* Portfolio Views */}
                <div className={isCollapsed ? 'lg:border-t lg:border-[var(--card-border)] lg:pt-3' : undefined}>
                    <p className={`mb-1.5 px-2.5 text-[11px] font-bold tracking-wider text-[var(--text-muted)] uppercase ${isCollapsed ? 'lg:hidden' : ''}`}>
                        Portfolio
                    </p>
                    <nav aria-label="대시보드 섹션 메뉴" className="space-y-1">
                        {PORTFOLIO_VIEWS.map((item) => {
                            const isActive = activeNav === item.id

                            return (
                                <div key={item.id}>
                                    {renderHomeNavLink({
                                        viewId: item.id,
                                        hash: item.hash,
                                        routeHref: item.routeHref,
                                        title: item.label,
                                        ariaCurrent: isActive ? 'page' : undefined,
                                        className: `flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                                            isCollapsed ? 'lg:justify-center lg:px-2' : ''
                                        } ${
                                            isActive
                                                ? 'bg-[var(--accent-glow)] text-[var(--accent-color)]'
                                                : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
                                        }`,
                                        content: (
                                            <>
                                                <span className="flex items-center gap-2.5">
                                                    <SidebarIcon id={item.id} />
                                                    <span className={isCollapsed ? 'lg:hidden' : undefined}>{item.label}</span>
                                                </span>
                                                {!isCollapsed && (
                                                    <span className="hidden text-[11px] font-medium text-[var(--text-muted)] lg:inline">
                                                        {item.description}
                                                    </span>
                                                )}
                                            </>
                                        ),
                                    })}
                                </div>
                            )
                        })}

                        <Link
                            href={AGENT_SKILLS_LINK.href}
                            prefetch={false}
                            title={AGENT_SKILLS_LINK.label}
                            aria-label={AGENT_SKILLS_LINK.label}
                            aria-current={activeNav === 'agent-skills' ? 'page' : undefined}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                                isCollapsed ? 'lg:justify-center lg:px-2' : ''
                            } ${
                                activeNav === 'agent-skills'
                                    ? 'bg-[var(--accent-glow)] text-[var(--accent-color)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            <span className="flex items-center gap-2.5">
                                <SidebarIcon id="agent-skills" />
                                <span className={isCollapsed ? 'lg:hidden' : undefined}>{AGENT_SKILLS_LINK.label}</span>
                            </span>
                            {!isCollapsed && (
                                <span className="hidden text-[11px] font-medium text-[var(--text-muted)] lg:inline">
                                    {AGENT_SKILLS_LINK.description}
                                </span>
                            )}
                        </Link>

                        {renderHomeNavLink({
                            viewId: CONTACT_VIEW.id,
                            hash: CONTACT_VIEW.hash,
                            routeHref: CONTACT_VIEW.routeHref,
                            title: CONTACT_VIEW.label,
                            ariaCurrent: activeNav === CONTACT_VIEW.id ? 'page' : undefined,
                            className: `flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                                isCollapsed ? 'lg:justify-center lg:px-2' : ''
                            } ${
                                activeNav === CONTACT_VIEW.id
                                    ? 'bg-[var(--accent-glow)] text-[var(--accent-color)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
                            }`,
                            content: (
                                <>
                                    <span className="flex items-center gap-2.5">
                                        <SidebarIcon id={CONTACT_VIEW.id} />
                                        <span className={isCollapsed ? 'lg:hidden' : undefined}>{CONTACT_VIEW.label}</span>
                                    </span>
                                    {!isCollapsed && (
                                        <span className="hidden text-[11px] font-medium text-[var(--text-muted)] lg:inline">
                                            {CONTACT_VIEW.description}
                                        </span>
                                    )}
                                </>
                            ),
                        })}
                    </nav>
                </div>

                {/* Notes */}
                <div className={isCollapsed ? 'lg:border-t lg:border-[var(--card-border)] lg:pt-3' : undefined}>
                    <p className={`mb-1.5 px-2.5 text-[11px] font-bold tracking-wider text-[var(--text-muted)] uppercase ${isCollapsed ? 'lg:hidden' : ''}`}>
                        Notes
                    </p>
                    <nav aria-label="노트 페이지" className="space-y-1">
                        {NOTES_LINKS.map((item) => {
                            const isActive = activeNav === item.id

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    prefetch={false}
                                    title={item.label}
                                    aria-label={item.label}
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                                        isCollapsed ? 'lg:justify-center lg:px-2' : ''
                                    } ${
                                        isActive
                                            ? 'bg-[var(--accent-glow)] text-[var(--accent-color)]'
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <SidebarIcon id={item.id} />
                                        <span className={isCollapsed ? 'lg:hidden' : undefined}>{item.label}</span>
                                    </span>
                                    {!isCollapsed && (
                                        <span className="hidden text-[11px] font-medium text-[var(--text-muted)] lg:inline">
                                            {item.description}
                                        </span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Sidebar Footer: 3 Social Links Left-Aligned + Theme Toggle Right-Aligned */}
            <div className="mt-4 border-t border-[var(--card-border)] pt-3">
                <div className={`flex items-center justify-between gap-2 px-1 ${isCollapsed ? 'lg:flex-col lg:items-center lg:gap-1.5' : ''}`}>
                    <div className={`flex items-center gap-1 ${isCollapsed ? 'lg:flex-col' : ''}`}>
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                title={social.label}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-bg)] hover:text-[var(--accent-color)]"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    {social.icon}
                                </svg>
                            </a>
                        ))}
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    )

    return (
        <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[var(--bg-color)] text-[var(--text-primary)] lg:flex-row">
            <a
                href="#dashboard-main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:border focus:border-[var(--accent-color)] focus:bg-[var(--card-bg)] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-[var(--text-primary)] focus:shadow-lg"
            >
                본문으로 건너뛰기
            </a>

            {/* Mobile Floating Controls */}
            <div className="pointer-events-none fixed top-3 left-3 z-30 lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen((open) => !open)}
                    aria-expanded={isMobileSidebarOpen}
                    aria-controls="dashboard-sidebar"
                    aria-label={isMobileSidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
                    className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] shadow-xs backdrop-blur-xl transition-colors hover:border-[var(--card-hover-border)]"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Drawer Backdrop */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Left Sidebar */}
            <aside
                id="dashboard-sidebar"
                aria-label="대시보드 탐색"
                className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-[var(--card-border)] bg-[var(--nav-bg)] backdrop-blur-xl transition-all duration-200 lg:static lg:translate-x-0 ${
                    isCollapsed ? 'lg:w-20' : 'lg:w-72'
                } ${
                    isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebarContent}
            </aside>

            {/* Right Main Workspace */}
            <div id="dashboard-main" tabIndex={-1} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                {children}
            </div>
        </div>
    )
}
