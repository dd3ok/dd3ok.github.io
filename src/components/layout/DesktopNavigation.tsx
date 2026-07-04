import type { FocusEvent, KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react'
import Link from 'next/link'
import { isExternalLink } from '@/utils/links'
import ThemeToggle from './ThemeToggle'
import { sectionNavItems, waitworthyNavItem } from './navigationItems'

interface DesktopNavigationProps {
    activeDropdown: string | null
    desktopServicesButtonRef: RefObject<HTMLButtonElement | null>
    isNavLinkActive: (path: string) => boolean
    isSectionActive: (sectionId: string) => boolean
    onCloseDesktopDropdown: (restoreFocus?: boolean) => void
    onCloseMobileMenu: () => void
    onDesktopDropdownBlur: (event: FocusEvent<HTMLDivElement>) => void
    onDesktopDropdownButtonKeyDown: (
        event: ReactKeyboardEvent<HTMLButtonElement>,
        dropdownLength: number
    ) => void
    onDesktopDropdownKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void
    onDropdownItemRef: (index: number, element: HTMLAnchorElement | null) => void
    onDropdownMouseEnter: () => void
    onMouseEnter: (itemId: string) => void
    onMouseLeave: () => void
    onSectionSelect: (sectionId: string) => void
}

export default function DesktopNavigation({
    activeDropdown,
    desktopServicesButtonRef,
    isNavLinkActive,
    isSectionActive,
    onCloseDesktopDropdown,
    onCloseMobileMenu,
    onDesktopDropdownBlur,
    onDesktopDropdownButtonKeyDown,
    onDesktopDropdownKeyDown,
    onDropdownItemRef,
    onDropdownMouseEnter,
    onMouseEnter,
    onMouseLeave,
    onSectionSelect,
}: DesktopNavigationProps) {
    return (
        <div className="hidden md:flex items-center space-x-3 lg:space-x-5">
            {sectionNavItems.map((item) => (
                <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => item.type === 'dropdown' && onMouseEnter(item.id)}
                    onMouseLeave={() => item.type === 'dropdown' && onMouseLeave()}
                    onBlur={item.type === 'dropdown' ? onDesktopDropdownBlur : undefined}
                >
                    {item.type === 'section' ? (
                        <button
                            type="button"
                            onClick={() => onSectionSelect(item.id)}
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
                                    onCloseDesktopDropdown()
                                    onSectionSelect(item.id)
                                }}
                                onKeyDown={(event) => onDesktopDropdownButtonKeyDown(
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
                                    onMouseEnter={onDropdownMouseEnter}
                                    onMouseLeave={onMouseLeave}
                                    onFocus={onDropdownMouseEnter}
                                    onKeyDown={onDesktopDropdownKeyDown}
                                >
                                    <div className="absolute -top-1.5 left-0 right-0 h-1.5 bg-transparent" />

                                    {item.dropdown.map((dropdownItem, dropdownIndex) => {
                                        const external = isExternalLink(dropdownItem.path)

                                        return (
                                            <Link
                                                key={dropdownItem.id}
                                                ref={(element) => onDropdownItemRef(dropdownIndex, element)}
                                                href={dropdownItem.path}
                                                prefetch={external ? undefined : false}
                                                target={external ? '_blank' : undefined}
                                                rel={external ? 'noopener noreferrer' : undefined}
                                                className="flex items-center px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-glow)] hover:text-[var(--text-primary)] transition-all duration-300 rounded-xl mx-2 my-0.5 group"
                                                onClick={() => onCloseDesktopDropdown()}
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
                prefetch={false}
                className={`
                    relative px-2.5 py-1.5 text-[13px] font-semibold transition-all duration-300
                    ${isNavLinkActive(waitworthyNavItem.path)
                        ? 'text-[var(--accent-color)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }
                `}
                onClick={onCloseMobileMenu}
            >
                {waitworthyNavItem.label}
                {isNavLinkActive(waitworthyNavItem.path) && (
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--accent-color)] rounded-full animate-fadeIn" />
                )}
            </Link>
            <div className="h-5 w-px bg-[var(--text-muted)] opacity-40" aria-hidden="true" />
            <ThemeToggle />
        </div>
    )
}
