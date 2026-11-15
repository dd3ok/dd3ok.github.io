export interface SessionGrant {
    conversationId: string
    sessionToken: string
    expiresAt: string
}

const pending = new Map<string, Promise<SessionGrant>>()
const memory = new Map<string, SessionGrant>()
const key = (socketUrl: string) => `whoamai-session:${socketUrl}`

function validSession(value: unknown): value is SessionGrant {
    if (!value || typeof value !== 'object') return false
    const session = value as SessionGrant
    return typeof session.conversationId === 'string' && session.conversationId.length > 0 &&
        typeof session.sessionToken === 'string' && /^[A-Za-z0-9_-]{43}$/.test(session.sessionToken) &&
        Date.parse(session.expiresAt) > Date.now() + 5000
}

export function clearChatSession(socketUrl: string) {
    memory.delete(socketUrl)
    try { sessionStorage.removeItem(key(socketUrl)) } catch { /* Storage can be disabled. */ }
}

export async function loadChatSession(socketUrl: string): Promise<SessionGrant> {
    const cached = memory.get(socketUrl)
    if (validSession(cached)) return cached
    try {
        const stored = JSON.parse(sessionStorage.getItem(key(socketUrl)) ?? 'null')
        if (validSession(stored)) {
            memory.set(socketUrl, stored)
            return stored
        }
    } catch { /* Keep an in-memory session if browser storage is unavailable. */ }
    const existing = pending.get(socketUrl)
    if (existing) return existing
    const request = (async () => {
        const url = new URL(socketUrl)
        url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:'
        url.pathname = url.pathname.replace(/\/ws\/chat\/events\/?$/, '/api/chat/sessions')
        url.search = ''
        url.hash = ''
        const response = await fetch(url, { method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(60000) })
        if (!response.ok) throw new Error(response.status === 429
            ? '연결 요청이 많습니다. 1분 뒤 다시 시도해주세요.' : '대화 연결을 준비하지 못했습니다. 잠시 후 다시 시도해주세요.')
        const session: unknown = await response.json()
        if (!validSession(session)) throw new Error('대화 연결 정보를 확인하지 못했습니다.')
        memory.set(socketUrl, session)
        try { sessionStorage.setItem(key(socketUrl), JSON.stringify(session)) } catch { /* In-memory fallback. */ }
        return session
    })()
    pending.set(socketUrl, request)
    try { return await request } finally { pending.delete(socketUrl) }
}
