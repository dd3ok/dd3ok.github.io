'use client'

import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Mounted on client
        setMounted(true)
        const currentTheme = document.documentElement.getAttribute('data-theme') as Theme || 'light'
        setTheme(currentTheme)
    }, [])

    const toggleTheme = () => {
        const targetTheme: Theme = theme === 'light' ? 'dark' : 'light'

        // Prevent layout transitions on sudden changes if needed
        document.documentElement.setAttribute('data-theme', targetTheme)
        localStorage.setItem('theme', targetTheme)
        setTheme(targetTheme)
    }

    return { theme, toggleTheme, mounted }
}
