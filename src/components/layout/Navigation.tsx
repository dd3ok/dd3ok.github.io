'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { isExternalLink } from '@/utils/links'

// 네비게이션 아이템 구조
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
            { id: 'wedding', label: '모바일 청첩장(작업중)', path: '/wedding', icon: '🧑‍❤️‍👩' },
            { id: 'nopairprgm', label: '코드리뷰 AI', path: 'https://github.com/dd3ok/no-pair-prgm', icon: '🤖' },
            { id: 'fpsxyz', label: '마인크래프트 HUD', path: 'https://github.com/dd3ok/fabric-fpsxyzs', icon: '⛏️' },
            { id: 'oauth', label: 'OAuth/토큰/세션', path: 'https://github.com/dd3ok/auth-service', icon: '🔐' },
            { id: 'whoamai', label: '채팅 AI', path: 'https://github.com/dd3ok/who-am-ai', icon: '🤖' },
            { id: 'repoclip', label: '레포지토리 요약', path: 'https://repoclip.onrender.com/', icon: '📦' },
            { id: 'ai-fitting', label: '입어보기+', path: 'https://dd3ok.github.io/ai-fitting', icon: '👕' }
        ]
    },
    { id: 'contact', label: 'Contact', type: 'section' }
]

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
    const activeSection = useActiveSection()
    const router = useRouter()
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
        // 메인 페이지가 아닌 경우 메인으로 이동 후 스크롤
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

    // 드롭다운 열기 (즉시)
    const handleMouseEnter = (itemId: string) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current)
        }
        setActiveDropdown(itemId)
    }

    // 드롭다운 닫기 (지연)
    const handleMouseLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null)
        }, 150) // 150ms 지연으로 마우스 이동 시간 확보
    }

    // 드롭다운 메뉴에 마우스가 들어가면 닫기 취소
    const handleDropdownMouseEnter = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current)
        }
    }

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current)
            }
        }
    }, [])

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
                    {/* Logo */}
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

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative"
                                onMouseEnter={() => item.type === 'dropdown' && handleMouseEnter(item.id)}
                                onMouseLeave={() => item.type === 'dropdown' && handleMouseLeave()}
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
                                            type="button"
                                            onClick={() => scrollToSection(item.id)}
                                            onFocus={() => handleMouseEnter(item.id)}
                                            aria-haspopup="menu"
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
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {/* Dropdown Menu */}
                                        {activeDropdown === item.id && item.dropdown && (
                                            <div
                                                id={`${item.id}-desktop-menu`}
                                                role="menu"
                                                className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                                onFocus={handleDropdownMouseEnter}
                                            >
                                                {/* 마우스 이동을 위한 투명 브릿지 */}
                                                <div className="absolute -top-1 left-0 right-0 h-1 bg-transparent" />

                                                {item.dropdown.map((dropdownItem) => {
                                                    const external = isExternalLink(dropdownItem.path)

                                                    return (
                                                        <Link
                                                            key={dropdownItem.id}
                                                            href={dropdownItem.path}
                                                            target={external ? '_blank' : undefined}
                                                            rel={external ? 'noopener noreferrer' : undefined}
                                                            role="menuitem"
                                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                                                            onClick={() => setActiveDropdown(null)}
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

                    {/* Mobile Menu Button */}
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

                {/* Mobile Menu */}
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
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Mobile Services Dropdown */}
                                        {mobileServicesOpen && item.dropdown && (
                                            <div id="mobile-services-menu" className="ml-4 mt-1 space-y-1" role="menu">
                                                {item.dropdown.map((dropdownItem) => {
                                                    const external = isExternalLink(dropdownItem.path)

                                                    return (
                                                        <Link
                                                            key={dropdownItem.id}
                                                            href={dropdownItem.path}
                                                            target={external ? '_blank' : undefined}
                                                            rel={external ? 'noopener noreferrer' : undefined}
                                                            role="menuitem"
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
