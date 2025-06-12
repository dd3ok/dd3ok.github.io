'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'

// 네비게이션 아이템 구조
const navItems = [
    { id: 'hero', label: 'Home', type: 'section' },
    { id: 'about', label: 'About', type: 'section' },
    { id: 'projects', label: 'Projects', type: 'section' },
    { id: 'experience', label: 'Experience', type: 'section' },
    {
        id: 'services',
        label: 'Services',
        type: 'dropdown',
        dropdown: [
            { id: 'etfs', label: 'Api 비교하기', path: '/etfs', icon: '📈' },
            { id: 'wedding', label: '결혼식 초대장', path: '/wedding', icon: '💒' },
            { id: 'tools', label: '개발 도구', path: '/tools', icon: '🛠️' }
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

    const scrollToSection = (sectionId: string) => {
        // 메인 페이지가 아닌 경우 메인으로 이동 후 스크롤
        if (window.location.pathname !== '/') {
            router.push(`/#${sectionId}`)
            return
        }

        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setIsMobileMenuOpen(false)
            setMobileServicesOpen(false)
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
                        className="font-bold text-xl cursor-pointer hover:scale-105 transition-transform"
                    >
                        <span className="text-blue-600">dd3ok</span>
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
                                            onClick={() => scrollToSection(item.id)}
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
                                                className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                                                onMouseEnter={handleDropdownMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {/* 마우스 이동을 위한 투명 브릿지 */}
                                                <div className="absolute -top-1 left-0 right-0 h-1 bg-transparent" />

                                                {item.dropdown.map((dropdownItem) => (
                                                    <Link
                                                        key={dropdownItem.id}
                                                        href={dropdownItem.path}
                                                        target="_blank"  // 새창으로 열기
                                                        rel="noopener noreferrer"  // 보안 강화
                                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                                                        onClick={() => setActiveDropdown(null)}
                                                    >
                                                        <span className="mr-3 text-lg">{dropdownItem.icon}</span>
                                                        {dropdownItem.label}
                                                        {/* 새창 아이콘 추가 */}
                                                        <svg
                                                            className="w-3 h-3 ml-auto text-gray-400 group-hover:text-blue-500 transition-colors"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 mr-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div className="w-6 h-6 flex flex-col justify-center items-center">
                            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`} />
                            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`} />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="px-4 py-2 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100">
                        {navItems.map((item) => (
                            <div key={item.id}>
                                {item.type === 'section' ? (
                                    <button
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
                                            onClick={() => {
                                                if (mobileServicesOpen) {
                                                    setMobileServicesOpen(false)
                                                    scrollToSection(item.id)
                                                } else {
                                                    setMobileServicesOpen(true)
                                                }
                                            }}
                                            className={`
                                                flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200
                                                ${activeSection === item.id
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
                                            <div className="ml-4 mt-1 space-y-1">
                                                {item.dropdown.map((dropdownItem) => (
                                                    <Link
                                                        key={dropdownItem.id}
                                                        href={dropdownItem.path}
                                                        target="_blank"  // 새창으로 열기
                                                        rel="noopener noreferrer"  // 보안 강화
                                                        className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                                                        onClick={() => {
                                                            setIsMobileMenuOpen(false)
                                                            setMobileServicesOpen(false)
                                                        }}
                                                    >
                                                        <span className="mr-3">{dropdownItem.icon}</span>
                                                        {dropdownItem.label}
                                                        {/* 새창 아이콘 추가 */}
                                                        <svg
                                                            className="w-3 h-3 ml-auto text-gray-400 group-hover:text-blue-500 transition-colors"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </Link>
                                                ))}
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
