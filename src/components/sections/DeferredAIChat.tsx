'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import AIChatFallback from '@/components/sections/AIChatFallback'
import { getEnvConfig } from '@/utils/EnvConfig'
import { prewarmApiHealthcheck } from '@/utils/prewarmApi'

const AIChat = dynamic(() => import('@/components/sections/AIChat'), {
    loading: () => <AIChatFallback />,
})

export default function DeferredAIChat() {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        const config = getEnvConfig()
        const whoAmAiHttpBase = config.whoAmAiApi?.baseUrl ?? config.whoAmAiWs?.baseUrl?.replace(/^ws(s?):/, 'http$1:')
        prewarmApiHealthcheck(whoAmAiHttpBase)

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
