'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import AIChatFallback from '@/components/sections/AIChatFallback'

const AIChat = dynamic(() => import('@/components/sections/AIChat'), {
    loading: () => <AIChatFallback />,
})

export default function DeferredAIChat() {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        const browserWindow = window as Window & {
            requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
            cancelIdleCallback?: (handle: number) => void
        }

        if (browserWindow.requestIdleCallback) {
            const idleId = browserWindow.requestIdleCallback(() => {
                setShouldRender(true)
            }, { timeout: 1500 })

            return () => browserWindow.cancelIdleCallback?.(idleId)
        }

        const timeoutId = window.setTimeout(() => {
            setShouldRender(true)
        }, 800)

        return () => window.clearTimeout(timeoutId)
    }, [])

    if (!shouldRender) {
        return <AIChatFallback />
    }

    return <AIChat />
}
