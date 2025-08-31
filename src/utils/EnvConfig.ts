export interface EnvConfig {
    pagesApi: {
        baseUrl: string
    }
    isDevelopment: boolean
}

export const getEnvConfig = (): EnvConfig => {
    const isDevelopment = process.env.NODE_ENV === 'development'

    return {
        pagesApi: {
            baseUrl: process.env.NEXT_PUBLIC_PAGES_KOYEB_API || (isDevelopment ? 'http://localhost:8080' : 'https://extreme-ariela-dd3ok-99cbe6d5.koyeb.app'),
        },
        isDevelopment
    }
}
