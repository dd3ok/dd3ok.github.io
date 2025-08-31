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

export const validateApiKeys = (config: EnvConfig): string[] => {
    const errors: string[] = []

    if (!config.pagesApi.apiKey && !config.isDevelopment) {
        errors.push('백엔드 API 키가 설정되지 않았습니다')
    }

    return errors
}
