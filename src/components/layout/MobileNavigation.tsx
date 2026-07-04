import Link from 'next/link'
import { sectionNavItems, waitworthyNavItem } from './navigationItems'

interface MobileNavigationProps {
    isOpen: boolean
    isNavLinkActive: (path: string) => boolean
    isSectionActive: (sectionId: string) => boolean
    onCloseMobileMenu: () => void
    onSectionSelect: (sectionId: string) => void
}

export default function MobileNavigation({
    isOpen,
    isNavLinkActive,
    isSectionActive,
    onCloseMobileMenu,
    onSectionSelect,
}: MobileNavigationProps) {
    return (
        <div
            id="mobile-navigation"
            className="md:hidden overflow-y-auto"
            hidden={!isOpen}
        >
            <div className="px-4 py-3 space-y-1 bg-[var(--nav-bg)] backdrop-blur-2xl border-t border-[var(--card-border)] shadow-inner">
                {sectionNavItems.map((item) => (
                    <div key={item.id}>
                        <button
                            type="button"
                            onClick={() => onSectionSelect(item.id)}
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
                    </div>
                ))}
                <div className="my-2 h-px bg-[var(--text-muted)] opacity-35" aria-hidden="true" />
                <Link
                    href={waitworthyNavItem.path}
                    prefetch={false}
                    className={`
                        block w-full text-left px-4 py-2.5 text-base font-semibold rounded-xl transition-all duration-300
                        ${isNavLinkActive(waitworthyNavItem.path)
                            ? 'text-[var(--accent-color)] bg-[var(--accent-glow)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]'
                        }
                    `}
                    onClick={onCloseMobileMenu}
                >
                    {waitworthyNavItem.label}
                </Link>
            </div>
        </div>
    )
}
