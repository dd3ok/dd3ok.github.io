'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { services } from '@/data/portfolio'
import { isExternalLink } from '@/utils/links'
import ThemeToggle from './ThemeToggle'

const navigableServices = services.filter((service) => (
    service.status !== 'coming_soon' &&
    service.id !== 'waitworthy'
))

const sectionNavItems = [
    { id: 'hero', label: 'Home', type: 'section' },
    { id: 'about', label: 'About', type: 'section' },
    { id: 'experience', label: 'Experience', type: 'section' },
    { id: 'projects', label: 'Projects', type: 'section' },
    {
        id: 'services',
        label: 'Lab',
        type: 'dropdown',
        dropdown: [
            ...navigableServices.map((service) => ({
                id: service.id,
                label: service.navLabel ?? service.title,
                path: service.path,
            })),
        ],
    },
    { id: 'contact', label: 'Contact', type: 'section' },
] as const

const waitworthyNavItem = { id: 'notes', label: 'Waitworthy', path: '/notes/' } as const

export default function Navigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const activeSection = useActiveSection()
    const router = useRouter()
    const pathname = usePathname()
    const isHomePath = pathname === '/'
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const desktopServicesButtonRef = useRef<HTMLButtonElement | null>(null)
    const desktopDropdownItemRefs = useRef<Array<HTMLAnchorElement | null>>([])

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false)
    }, [])

    const isNavLinkActive = useCallback((path: string) => {
        const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path
        return pathname === normalizedPath || pathname.startsWith(`${normalizedPath}/`)
    }, [pathname])

    const isSectionActive = useCallback((sectionId: string) => (
        isHomePath && activeSection === sectionId
    ), [activeSection, isHomePath])

    const clearDropdownCloseTimer = useCallback(() => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current)
            dropdownTimeoutRef.current = null
        }
    }, [])

    const closeDesktopDropdown = useCallback((restoreFocus = false) => {
        clearDropdownCloseTimer()
        setActiveDropdown(null)

        if (restoreFocus) {
            desktopServicesButtonRef.current?.focus()
        }
    }, [clearDropdownCloseTimer])

    const focusDesktopDropdownItem = useCallback((index: number) => {
        desktopDropdownItemRefs.current[index]?.focus()
    }, [])

    useEffect(() => {
        if (!isMobileMenuOpen) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMobileMenu()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [closeMobileMenu, isMobileMenuOpen])

    const scrollToSection = (sectionId: string) => {
        if (window.location.pathname !== '/') {
            closeMobileMenu()
            router.push(`/#${sectionId}`)
            return
        }

        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            closeMobileMenu()
        }
    }

    const openDesktopDropdown = useCallback((itemId: string) => {
        clearDropdownCloseTimer()
        setActiveDropdown(itemId)
    }, [clearDropdownCloseTimer])

    const handleMouseEnter = (itemId: string) => {
        openDesktopDropdown(itemId)
    }

    const handleMouseLeave = () => {
        clearDropdownCloseTimer()
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null)
        }, 150)
    }

    const handleDropdownMouseEnter = () => {
        clearDropdownCloseTimer()
    }

    const handleDesktopDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
        const nextTarget = event.relatedTarget as Node | null

        if (nextTarget && event.currentTarget.contains(nextTarget)) {
            return
        }

        closeDesktopDropdown()
    }

    const handleDesktopDropdownButtonKeyDown = (
        event: ReactKeyboardEvent<HTMLButtonElement>,
        dropdownLength: number
    ) => {
        if (dropdownLength === 0) {
            return
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            openDesktopDropdown('services')
            window.requestAnimationFrame(() => focusDesktopDropdownItem(0))
            return
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault()
            openDesktopDropdown('services')
            window.requestAnimationFrame(() => focusDesktopDropdownItem(dropdownLength - 1))
            return
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            closeDesktopDropdown()
            scrollToSection('services')
            return
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            closeDesktopDropdown()
        }
    }

    const handleDesktopDropdownKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (!desktopDropdownItemRefs.current.length) {
            return
        }

        const currentIndex = desktopDropdownItemRefs.current.findIndex(
            (item) => item === document.activeElement
        )

        if (event.key === 'Escape') {
            event.preventDefault()
            closeDesktopDropdown(true)
            return
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            const nextIndex = currentIndex >= 0
                ? (currentIndex + 1) % desktopDropdownItemRefs.current.length
                : 0
            focusDesktopDropdownItem(nextIndex)
            return
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault()
            const previousIndex = currentIndex >= 0
                ? (currentIndex - 1 + desktopDropdownItemRefs.current.length) % desktopDropdownItemRefs.current.length
                : desktopDropdownItemRefs.current.length - 1
            focusDesktopDropdownItem(previousIndex)
            return
        }

        if (event.key === 'Home') {
            event.preventDefault()
            focusDesktopDropdownItem(0)
            return
        }

        if (event.key === 'End') {
            event.preventDefault()
            focusDesktopDropdownItem(desktopDropdownItemRefs.current.length - 1)
        }
    }

    useEffect(() => {
        return () => {
            clearDropdownCloseTimer()
        }
    }, [clearDropdownCloseTimer])

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--card-border)] shadow-[0_1px_10px_-8px_rgba(15,23,42,0.28)]
            `}
        >
            <div className="container">
                <div className="flex items-center justify-between h-[52px] px-4 md:px-5">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 cursor-pointer hover:scale-[1.03] transition-transform duration-300"
                        onClick={closeMobileMenu}
                    >
                        <Image
                            src="/logo.png"
                            alt="dd3ok 로고"
                            width={32}
                            height={32}
                            className="w-7 h-7 md:w-8 md:h-8 rounded-lg shadow-sm"
                            priority
                        />
                        <span className="font-extrabold text-base md:text-lg tracking-tight text-[var(--accent-color)]">dd3ok</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-3 lg:space-x-5">
                        {sectionNavItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative"
                                onMouseEnter={() => item.type === 'dropdown' && handleMouseEnter(item.id)}
                                onMouseLeave={() => item.type === 'dropdown' && handleMouseLeave()}
                                onBlur={item.type === 'dropdown' ? handleDesktopDropdownBlur : undefined}
                            >
                                {item.type === 'section' ? (
                                    <button
                                        type="button"
                                        onClick={() => scrollToSection(item.id)}
                                        className={`
                                            relative px-2.5 py-1.5 text-[13px] font-semibold transition-all duration-300
                                            ${isSectionActive(item.id)
                                                ? 'text-[var(--accent-color)]'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                            }
                                        `}
                                    >
                                        {item.label}
                                        {isSectionActive(item.id) && (
                                            <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent-color)] rounded-full animate-fadeIn" />
                                        )}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            ref={item.id === 'services' ? desktopServicesButtonRef : undefined}
                                            type="button"
                                            onClick={() => {
                                                closeDesktopDropdown()
                                                scrollToSection(item.id)
                                            }}
                                            onKeyDown={(event) => handleDesktopDropdownButtonKeyDown(
                                                event,
                                                item.dropdown?.length ?? 0
                                            )}
                                            aria-expanded={activeDropdown === item.id}
                                            aria-controls={`${item.id}-desktop-menu`}
                                            className={`
                                                relative px-2.5 py-1.5 text-[13px] font-semibold transition-all duration-300 flex items-center
                                                ${isSectionActive(item.id)
                                                    ? 'text-[var(--accent-color)]'
                                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                }
                                            `}
                                        >
                                            {item.label}
                                            {isSectionActive(item.id) && (
                                                <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent-color)] rounded-full animate-fadeIn" />
                                            )}
                                            <svg
                                                className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                                                    activeDropdown === item.id ? 'rotate-180 text-[var(--accent-color)]' : 'text-[var(--text-muted)]'
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {activeDropdown === item.id && item.dropdown && (
                                            <div
                                                id={`${item.id}-desktop-menu`}
                                                aria-label={`${item.label} 링크`}
                                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[var(--dropdown-bg)] backdrop-blur-2xl rounded-2xl shadow-xl border border-[var(--card-border)] py-2 z-50 animate-dropdownEnter"
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                                onFocus={handleDropdownMouseEnter}
                                                onKeyDown={handleDesktopDropdownKeyDown}
                                            >
                                                <div className="absolute -top-1.5 left-0 right-0 h-1.5 bg-transparent" />

                                                {item.dropdown.map((dropdownItem, dropdownIndex) => {
                                                    const external = isExternalLink(dropdownItem.path)

                                                    return (
                                                        <Link
                                                            key={dropdownItem.id}
                                                            ref={(element) => {
                                                                desktopDropdownItemRefs.current[dropdownIndex] = element
                                                            }}
                                                            href={dropdownItem.path}
                                                            target={external ? '_blank' : undefined}
                                                            rel={external ? 'noopener noreferrer' : undefined}
                                                            className="flex items-center px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-glow)] hover:text-[var(--text-primary)] transition-all duration-300 rounded-xl mx-2 my-0.5 group"
                                                            onClick={() => closeDesktopDropdown()}
                                                        >
                                                            <span className="mr-3 w-5 font-mono text-xs font-bold tabular-nums text-[var(--text-muted)]">
                                                                {String(dropdownIndex + 1).padStart(2, '0')}
                                                            </span>
                                                            <span className="font-medium">{dropdownItem.label}</span>
                                                            {external && (
                                                                <svg
                                                                    className="w-3 h-3 ml-auto text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    aria-hidden="true"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            )}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                        <div className="h-5 w-px bg-[var(--text-muted)] opacity-40" aria-hidden="true" />
                        <Link
                            href={waitworthyNavItem.path}
                            className={`
                                relative px-2.5 py-1.5 text-[13px] font-semibold transition-all duration-300
                                ${isNavLinkActive(waitworthyNavItem.path)
                                    ? 'text-[var(--accent-color)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }
                            `}
                            onClick={closeMobileMenu}
                        >
                            {waitworthyNavItem.label}
                            {isNavLinkActive(waitworthyNavItem.path) && (
                                <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent-color)] rounded-full animate-fadeIn" />
                            )}
                        </Link>
                        <div className="h-5 w-px bg-[var(--text-muted)] opacity-40" aria-hidden="true" />
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center space-x-2.5 md:hidden">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="p-1.5 text-[var(--text-primary)] hover:bg-[var(--card-border)] rounded-lg transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-navigation"
                            aria-label={isMobileMenuOpen ? '모바일 메뉴 닫기' : '모바일 메뉴 열기'}
                        >
                            <div className="w-5 h-5 flex flex-col justify-center items-center">
                                <span className={`bg-[var(--text-primary)] block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-[3px]' : '-translate-y-1'}`} />
                                <span className={`bg-[var(--text-primary)] block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                <span className={`bg-[var(--text-primary)] block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : 'translate-y-1'}`} />
                            </div>
                        </button>
                    </div>
                </div>

                <div
                    id="mobile-navigation"
                    className="md:hidden overflow-y-auto"
                    hidden={!isMobileMenuOpen}
                >
                    <div className="px-4 py-3 space-y-1 bg-[var(--nav-bg)] backdrop-blur-2xl border-t border-[var(--card-border)] shadow-inner">
                        {sectionNavItems.map((item) => (
                            <div key={item.id}>
                                {item.type === 'section' ? (
                                    <button
                                        type="button"
                                        onClick={() => scrollToSection(item.id)}
                                        className={`
                                            block w-full text-left px-4 py-2.5 text-base font-semibold rounded-xl transition-all duration-300
                                            ${isSectionActive(item.id)
                                                ? 'text-[var(--accent-color)] bg-[var(--accent-glow)]'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                                            }
                                        `}
                                    >
                                        {item.label}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => scrollToSection(item.id)}
                                        className={`
                                            block w-full text-left px-4 py-2.5 text-base font-semibold rounded-xl transition-all duration-300
                                            ${isSectionActive(item.id)
                                                ? 'text-[var(--accent-color)] bg-[var(--accent-glow)]'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                                            }
                                        `}
                                    >
                                        {item.label}
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="my-2 h-px bg-[var(--text-muted)] opacity-35" aria-hidden="true" />
                        <Link
                            href={waitworthyNavItem.path}
                            className={`
                                block w-full text-left px-4 py-2.5 text-base font-semibold rounded-xl transition-all duration-300
                                ${isNavLinkActive(waitworthyNavItem.path)
                                    ? 'text-[var(--accent-color)] bg-[var(--accent-glow)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                                }
                            `}
                            onClick={closeMobileMenu}
                        >
                            {waitworthyNavItem.label}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
