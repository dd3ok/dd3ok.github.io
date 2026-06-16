'use client'

import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme()

    if (!mounted) {
        // Render a silent placeholder during hydration
        return (
            <div className="w-9 h-9 rounded-lg bg-transparent border border-transparent" aria-hidden="true" />
        )
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="relative p-2 w-9 h-9 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--card-hover-border)] hover:bg-white/[0.05] focus:outline-none transition-all duration-300 flex items-center justify-center overflow-hidden group shadow-sm hover:shadow-[0_0_15px_-3px_var(--accent-glow)]"
            aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
        >
            <div className="relative w-5 h-5 transition-transform duration-500 ease-out group-hover:rotate-[20deg]">
                {/* Sun icon */}
                <svg
                    className={`absolute inset-0 w-full h-full text-amber-500 transition-all duration-500 transform ${
                        theme === 'dark'
                            ? 'translate-y-8 opacity-0 scale-50 rotate-90'
                            : 'translate-y-0 opacity-100 scale-100 rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>

                {/* Moon icon */}
                <svg
                    className={`absolute inset-0 w-full h-full text-indigo-400 transition-all duration-500 transform ${
                        theme === 'light'
                            ? '-translate-y-8 opacity-0 scale-50 -rotate-90'
                            : 'translate-y-0 opacity-100 scale-100 rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            </div>
        </button>
    )
}
