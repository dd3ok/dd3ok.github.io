const prewarmedBaseUrls = new Set<string>()

export function prewarmApiHealthcheck(baseUrl?: string) {
    const normalized = baseUrl?.trim().replace(/\/$/, '')
    if (!normalized || prewarmedBaseUrls.has(normalized)) {
        return
    }
    prewarmedBaseUrls.add(normalized)
    void fetch(`${normalized}/api/healthcheck`, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(30000),
    }).catch(() => {
        // Silent background warmup; active requests handle visible errors.
    })
}
