export interface EnvConfig {
    etfApi: {
        baseUrl: string
        apiKey: string
    }
    pagesApi: {
        baseUrl: string
        apiKey: string
    }
    isDevelopment: boolean
}

export const getEnvConfig = (): EnvConfig => {
    const isDevelopment = process.env.NODE_ENV === 'development'

    return {
        etfApi: {
            baseUrl: process.env.NEXT_PUBLIC_DATA_ETF_API || 'https://apis.data.go.kr/1160100/service/GetSecuritiesProductInfoService',
            apiKey: process.env.NEXT_PUBLIC_DATA_ETF_API_KEY || ''
        },
        pagesApi: {
            baseUrl: process.env.NEXT_PUBLIC_PAGES_KOYEB_API || (isDevelopment ? 'http://localhost:8080' : 'https://extreme-ariela-dd3ok-99cbe6d5.koyeb.app'),
            apiKey: process.env.NEXT_PUBLIC_PAGES_KOYEB_API_KEY || ''
        },
        isDevelopment
    }
}

export const validateApiKeys = (config: EnvConfig): string[] => {
    const errors: string[] = []

    if (!config.etfApi.apiKey) {
        errors.push('ETF API 키가 설정되지 않았습니다')
    }

    if (!config.pagesApi.apiKey && !config.isDevelopment) {
        errors.push('백엔드 API 키가 설정되지 않았습니다')
    }

    return errors
}
