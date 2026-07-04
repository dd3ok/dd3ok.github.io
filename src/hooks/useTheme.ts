'use client'

import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const THEME_CHANGE_EVENT = 'portfolio-theme-change'

function readTheme(): Theme {
    if (typeof document === 'undefined') {
        return 'light'
    }

    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

function subscribeTheme(onStoreChange: () => void) {
    if (typeof window === 'undefined') {
        return () => {}
    }

    const handleStorage = (event: StorageEvent) => {
        if (event.key === 'theme') {
            onStoreChange()
        }
    }

    window.addEventListener(THEME_CHANGE_EVENT, onStoreChange)
    window.addEventListener('storage', handleStorage)

    return () => {
        window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange)
        window.removeEventListener('storage', handleStorage)
    }
}

export function useTheme() {
    const theme = useSyncExternalStore<Theme | null>(
        subscribeTheme,
        readTheme,
        () => null
    )
    const currentTheme = theme ?? 'light'

    const toggleTheme = useCallback(() => {
        const targetTheme: Theme = currentTheme === 'light' ? 'dark' : 'light'

        document.documentElement.setAttribute('data-theme', targetTheme)
        localStorage.setItem('theme', targetTheme)
        window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
    }, [currentTheme])

    return { theme: currentTheme, toggleTheme, mounted: theme !== null }
}
