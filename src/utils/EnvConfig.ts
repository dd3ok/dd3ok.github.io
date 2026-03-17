export interface EnvConfig {
    pagesApi: {
        baseUrl: string
    }
    whoAmAiApi?: {
        baseUrl: string
    }
    whoAmAiWs?: {
        baseUrl: string
    }
    isDevelopment: boolean
}

export const getEnvConfig = (): EnvConfig => {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const whoAmAiApiBaseUrl = process.env.NEXT_PUBLIC_WHO_AM_AI_API || undefined
    const whoAmAiWsBaseUrl = process.env.NEXT_PUBLIC_WHO_AM_AI_WS || undefined

    return {
        pagesApi: {
            baseUrl: process.env.NEXT_PUBLIC_PAGES_KOYEB_API || (isDevelopment ? 'http://localhost:8080' : 'https://extreme-ariela-dd3ok-99cbe6d5.koyeb.app'),
        },
        whoAmAiApi: whoAmAiApiBaseUrl
            ? {
                baseUrl: whoAmAiApiBaseUrl,
            }
            : undefined,
        whoAmAiWs: whoAmAiWsBaseUrl
            ? {
                baseUrl: whoAmAiWsBaseUrl,
            }
            : undefined,
        isDevelopment
    }
}
