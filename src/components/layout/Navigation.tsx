'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import ThemeToggle from './ThemeToggle'

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

    const setDesktopDropdownItemRef = useCallback((index: number, element: HTMLAnchorElement | null) => {
        desktopDropdownItemRefs.current[index] = element
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
                            className="w-7 h-7 md:w-8 md:h-8 rounded-xl shadow-xs"
                            priority
                        />
                        <span className="font-extrabold text-base md:text-lg tracking-tight text-[var(--accent-color)]">dd3ok</span>
                    </Link>

                    <DesktopNavigation
                        activeDropdown={activeDropdown}
                        desktopServicesButtonRef={desktopServicesButtonRef}
                        isNavLinkActive={isNavLinkActive}
                        isSectionActive={isSectionActive}
                        onCloseDesktopDropdown={closeDesktopDropdown}
                        onCloseMobileMenu={closeMobileMenu}
                        onDesktopDropdownBlur={handleDesktopDropdownBlur}
                        onDesktopDropdownButtonKeyDown={handleDesktopDropdownButtonKeyDown}
                        onDesktopDropdownKeyDown={handleDesktopDropdownKeyDown}
                        onDropdownItemRef={setDesktopDropdownItemRef}
                        onDropdownMouseEnter={handleDropdownMouseEnter}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onSectionSelect={scrollToSection}
                    />

                    <div className="flex items-center space-x-2.5 md:hidden">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="p-1.5 text-[var(--text-primary)] hover:bg-[var(--card-border)] rounded-xl transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-navigation"
                            aria-label={isMobileMenuOpen ? '모바일 메뉴 닫기' : '모바일 메뉴 열기'}
                        >
                            <div className="w-5 h-5 flex flex-col justify-center items-center">
                                <span className={`bg-[var(--text-primary)] block transition-all duration-300 ease-out h-0.5 w-5 rounded-xs ${isMobileMenuOpen ? 'rotate-45 translate-y-[3px]' : '-translate-y-1'}`} />
                                <span className={`bg-[var(--text-primary)] block transition-all duration-300 ease-out h-0.5 w-5 rounded-xs my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                <span className={`bg-[var(--text-primary)] block transition-all duration-300 ease-out h-0.5 w-5 rounded-xs ${isMobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : 'translate-y-1'}`} />
                            </div>
                        </button>
                    </div>
                </div>

                <MobileNavigation
                    isOpen={isMobileMenuOpen}
                    isNavLinkActive={isNavLinkActive}
                    isSectionActive={isSectionActive}
                    onCloseMobileMenu={closeMobileMenu}
                    onSectionSelect={scrollToSection}
                />
            </div>
        </nav>
    )
}
