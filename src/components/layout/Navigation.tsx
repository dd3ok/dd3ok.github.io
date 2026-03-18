'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { services } from '@/data/portfolio'
import { isExternalLink } from '@/utils/links'

const servicesSectionPath = '/#services'
const navigableServices = services.filter((service) => service.status !== 'coming_soon')

const navItems = [
    { id: 'hero', label: 'Home', type: 'section' },
    { id: 'about', label: 'About', type: 'section' },
    { id: 'experience', label: 'Experience', type: 'section' },
    { id: 'projects', label: 'Projects', type: 'section' },
    {
        id: 'services',
        label: 'Toys',
        type: 'dropdown',
        dropdown: [
            {
                id: 'services-overview',
                label: 'Toys 섹션 보기',
                path: servicesSectionPath,
                icon: '↘️',
            },
            ...navigableServices.map((service) => ({
                id: service.id,
                label: service.navLabel ?? service.title,
                path: service.path,
                icon: service.icon,
            })),
        ],
    },
    { id: 'contact', label: 'Contact', type: 'section' },
] as const

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
    const activeSection = useActiveSection()
    const router = useRouter()
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const desktopServicesButtonRef = useRef<HTMLButtonElement | null>(null)
    const desktopDropdownItemRefs = useRef<Array<HTMLAnchorElement | null>>([])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false)
        setMobileServicesOpen(false)
    }, [])

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

    const toggleDesktopDropdown = useCallback((itemId: string) => {
        clearDropdownCloseTimer()
        setActiveDropdown((currentDropdown) => (
            currentDropdown === itemId ? null : itemId
        ))
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

            if (activeDropdown === 'services') {
                closeDesktopDropdown()
            } else {
                openDesktopDropdown('services')
            }
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
                fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-sm
                ${isScrolled
                    ? 'shadow-sm border-b border-gray-100'
                    : 'shadow-sm border-b border-gray-50'
                }
            `}
        >
            <div className="container">
                <div className="flex items-center justify-between h-16 px-6">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:scale-105 transition-transform"
                        onClick={closeMobileMenu}
                    >
                        <Image
                            src="/logo.png"
                            alt="dd3ok 로고"
                            width={32}
                            height={32}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg"
                            priority
                        />
                        <span className="font-bold text-lg md:text-xl text-blue-600">dd3ok</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
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
                                            relative px-3 py-2 text-sm font-medium transition-colors duration-200
                                            ${activeSection === item.id
                                                ? 'text-blue-600'
                                                : 'text-gray-700 hover:text-blue-600'
                                            }
                                        `}
                                    >
                                        {item.label}
                                        {activeSection === item.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                                        )}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            ref={item.id === 'services' ? desktopServicesButtonRef : undefined}
                                            type="button"
                                            onClick={() => toggleDesktopDropdown(item.id)}
                                            onKeyDown={(event) => handleDesktopDropdownButtonKeyDown(event, item.dropdown?.length ?? 0)}
                                            aria-expanded={activeDropdown === item.id}
                                            aria-controls={`${item.id}-desktop-menu`}
                                            className={`
                                                relative px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center
                                                ${activeSection === item.id
                                                    ? 'text-blue-600'
                                                    : 'text-gray-700 hover:text-blue-600'
                                                }
                                            `}
                                        >
                                            {item.label}
                                            {activeSection === item.id && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                                            )}
                                            <svg
                                                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                                    activeDropdown === item.id ? 'rotate-180' : ''
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
                                                className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                                onFocus={handleDropdownMouseEnter}
                                                onKeyDown={handleDesktopDropdownKeyDown}
                                            >
                                                <div className="absolute -top-1 left-0 right-0 h-1 bg-transparent" />

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
                                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                                                            onClick={() => closeDesktopDropdown()}
                                                        >
                                                            <span className="mr-3 text-lg">{dropdownItem.icon}</span>
                                                            {dropdownItem.label}
                                                            {external && (
                                                                <svg
                                                                    className="w-3 h-3 ml-auto text-gray-400 group-hover:text-blue-500 transition-colors"
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
                    </div>

                    <button
                        type="button"
                        className="md:hidden p-2 mr-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-navigation"
                        aria-label={isMobileMenuOpen ? '모바일 메뉴 닫기' : '모바일 메뉴 열기'}
                    >
                        <div className="w-6 h-6 flex flex-col justify-center items-center">
                            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`} />
                            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`} />
                        </div>
                    </button>
                </div>

                <div
                    id="mobile-navigation"
                    className="md:hidden overflow-y-auto"
                    hidden={!isMobileMenuOpen}
                >
                    <div className="px-4 py-2 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100">
                        {navItems.map((item) => (
                            <div key={item.id}>
                                {item.type === 'section' ? (
                                    <button
                                        type="button"
                                        onClick={() => scrollToSection(item.id)}
                                        className={`
                                            block w-full text-left px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200
                                            ${activeSection === item.id
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {item.label}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                            aria-expanded={mobileServicesOpen}
                                            aria-controls="mobile-services-menu"
                                            className={`
                                                flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200
                                                ${activeSection === item.id || mobileServicesOpen
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <span>{item.label}</span>
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-200 ${
                                                    mobileServicesOpen ? 'rotate-180' : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {mobileServicesOpen && item.dropdown && (
                                            <div id="mobile-services-menu" className="ml-4 mt-1 space-y-1" aria-label="Toys 링크">
                                                {item.dropdown.map((dropdownItem) => {
                                                    const external = isExternalLink(dropdownItem.path)

                                                    return (
                                                        <Link
                                                            key={dropdownItem.id}
                                                            href={dropdownItem.path}
                                                            target={external ? '_blank' : undefined}
                                                            rel={external ? 'noopener noreferrer' : undefined}
                                                            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                                                            onClick={closeMobileMenu}
                                                        >
                                                            <span className="mr-3">{dropdownItem.icon}</span>
                                                            {dropdownItem.label}
                                                            {external && (
                                                                <svg
                                                                    className="w-3 h-3 ml-auto text-gray-400 group-hover:text-blue-500 transition-colors"
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
                    </div>
                </div>
            </div>
        </nav>
    )
}
