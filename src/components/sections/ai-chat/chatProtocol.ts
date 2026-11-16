export interface ChatSource {
    id: string
    title: string
    url?: string
}

export interface ChatEvent {
    type: 'SOURCES' | 'DELTA' | 'DONE' | 'ERROR'
    requestId: string
    content?: string
    sources?: ChatSource[]
    code?: string
}

export interface ChatResponse {
    requestId?: string
    text: string
    sources: ChatSource[]
    status: 'streaming' | 'complete' | 'failed'
    code?: string
}

export interface ChatMessage {
    id: string
    text: string
    isUser: boolean
    sources?: ChatSource[]
    status?: ChatResponse['status']
}

export function updateAssistantMessage(messages: ChatMessage[], id: string, response: ChatResponse): ChatMessage[] {
    // Metadata and whitespace are retained in the response state, not rendered as an answer.
    if (!response.text.trim()) return messages
    const next: ChatMessage = { id, text: response.text, sources: response.sources, status: response.status, isUser: false }
    return messages.some(message => message.id === id)
        ? messages.map(message => message.id === id ? next : message)
        : [...messages, next]
}

export function safeSourceUrl(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined
    try {
        const url = new URL(value)
        return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : undefined
    } catch {
        return undefined
    }
}

export function parseChatEvent(data: unknown): ChatEvent | null {
    if (typeof data !== 'string') return null
    try {
        const event = JSON.parse(data)
        if (!event || typeof event.requestId !== 'string' || !event.requestId) return null
        if (event.type === 'DELTA' && typeof event.content === 'string') {
            return { type: 'DELTA', requestId: event.requestId, content: event.content }
        }
        if (event.type === 'DONE') return { type: 'DONE', requestId: event.requestId }
        if (event.type === 'ERROR' && typeof event.code === 'string') {
            return { type: 'ERROR', requestId: event.requestId, code: event.code }
        }
        if (event.type === 'SOURCES' && Array.isArray(event.sources)) {
            const sources: ChatSource[] = []
            for (const source of event.sources) {
                if (source && typeof source.id === 'string' && typeof source.title === 'string' &&
                    !sources.some(item => item.id === source.id)) {
                    sources.push({ id: source.id, title: source.title, url: safeSourceUrl(source.url) })
                }
            }
            return { type: 'SOURCES', requestId: event.requestId, sources }
        }
        return null
    } catch {
        return null
    }
}

export function applyChatEvent(state: ChatResponse, event: ChatEvent): ChatResponse {
    if (state.status !== 'streaming' || (state.requestId && state.requestId !== event.requestId)) return state
    const next = { ...state, requestId: event.requestId }
    switch (event.type) {
        case 'SOURCES': return { ...next, sources: event.sources ?? [] }
        case 'DELTA': return { ...next, text: state.text + (event.content ?? '') }
        case 'DONE': return state.text.trim()
            ? { ...next, status: 'complete' }
            : { ...next, status: 'failed', code: 'EMPTY_RESPONSE' }
        case 'ERROR': return { ...next, status: 'failed', code: event.code }
    }
}

export function recoverStoredConversation(parsed: unknown): { messages: ChatMessage[]; pendingPrompt: string | null } | null {
    if (!Array.isArray(parsed) || parsed.length === 0) return null

    const restored: ChatMessage[] = []
    for (const item of parsed) {
        if (!item || typeof item !== 'object') return null
        const candidate = item as Record<string, unknown>
        if (typeof candidate.id !== 'string' || typeof candidate.text !== 'string' || typeof candidate.isUser !== 'boolean') {
            return null
        }
        const status = candidate.status === 'streaming' || candidate.status === 'complete' || candidate.status === 'failed'
            ? candidate.status
            : undefined
        restored.push({ id: candidate.id, text: candidate.text, isUser: candidate.isUser, status })
    }

    const tail = restored[restored.length - 1]
    const previous = restored[restored.length - 2]
    if (tail && !tail.isUser && tail.status === 'streaming' && previous?.isUser) {
        restored.pop()
    }

    const messages = restored.map(message =>
        message.status === 'streaming' ? { ...message, status: 'failed' as const } : message
    )
    const last = messages[messages.length - 1]
    const pendingPrompt = last?.isUser && last.text.trim() ? last.text : null

    return { messages, pendingPrompt }
}

export function chatErrorMessage(code?: string): string {
    switch (code) {
        case 'SESSION_REQUIRED': return '대화 세션이 만료되었습니다. 다시 요청하면 새 대화가 시작됩니다.'
        case 'RATE_LIMITED': return '요청이 많습니다. 1분 뒤 다시 시도해주세요.'
        case 'INVALID_MESSAGE': return '질문은 1~4,000자로 입력해주세요.'
        case 'TIMEOUT': return '답변 시간이 초과되었습니다. 잠시 후 다시 요청해주세요.'
        default: return '답변을 완료하지 못했습니다. 잠시 후 다시 요청해주세요.'
    }
}
