import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { clearChatSession, loadChatSession, type SessionGrant } from './chatSession'
import { applyChatEvent, chatErrorMessage, parseChatEvent, updateAssistantMessage, type ChatMessage, type ChatResponse } from './chatProtocol'

const RESPONSE_TIMEOUT_MS = 150000

export type { ChatMessage } from './chatProtocol'

export interface ConnectionStatusInfo {
    color: string
    animate: string
    title: string
}

interface UseChatSessionOptions {
    socketUrl: string
    initialPrompt: string | null
    messages: ChatMessage[]
    setMessages: Dispatch<SetStateAction<ChatMessage[]>>
    createMessageId: () => string
    onRestartSession: (prompt: string) => void
}

export function useChatSession({ socketUrl, initialPrompt, messages, setMessages, createMessageId, onRestartSession }: UseChatSessionOptions) {
    const [session, setSession] = useState<SessionGrant | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [isResponding, setIsResponding] = useState(Boolean(initialPrompt))
    const [isAwaitingFirstToken, setIsAwaitingFirstToken] = useState(Boolean(initialPrompt))
    const [isTimeout, setIsTimeout] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastUserMessage, setLastUserMessage] = useState(initialPrompt ?? '')
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const activeAssistantMessageIdRef = useRef<string | null>(null)
    const responseRef = useRef<ChatResponse>({ text: '', sources: [], status: 'streaming' })
    const hasSentInitialPromptRef = useRef(false)
    const responseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearResponseTimer = useCallback(() => {
        if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current)
        responseTimeoutRef.current = null
    }, [])

    const showResponse = useCallback((id: string, response: ChatResponse) => {
        setMessages(previous => updateAssistantMessage(previous, id, response))
    }, [setMessages])

    const failResponse = useCallback((message: string) => {
        clearResponseTimer()
        const id = activeAssistantMessageIdRef.current
        if (id) showResponse(id, { ...responseRef.current, status: 'failed' })
        activeAssistantMessageIdRef.current = null
        setIsResponding(false)
        setIsAwaitingFirstToken(false)
        setError(previous => previous ?? message)
    }, [clearResponseTimer, showResponse])

    const scheduleResponseTimeout = useCallback(() => {
        clearResponseTimer()
        responseTimeoutRef.current = setTimeout(() => {
            setIsTimeout(true)
            failResponse('응답 시간이 초과되었습니다.')
        }, RESPONSE_TIMEOUT_MS)
    }, [clearResponseTimer, failResponse])

    const onMessage = useCallback((message: MessageEvent) => {
        const id = activeAssistantMessageIdRef.current
        if (!id) return
        const event = parseChatEvent(message.data)
        if (!event) {
            failResponse('응답 형식을 확인하지 못했습니다. 다시 연결해주세요.')
            return
        }
        const next = applyChatEvent(responseRef.current, event)
        if (next === responseRef.current) return
        responseRef.current = next
        showResponse(id, next)
        if (next.text.trim()) setIsAwaitingFirstToken(false)
        if (next.status === 'complete' || next.status === 'failed') {
            clearResponseTimer()
            activeAssistantMessageIdRef.current = null
            setIsResponding(false)
            setIsAwaitingFirstToken(false)
            if (next.status === 'complete') setLastUserMessage('')
            if (next.status === 'failed') {
                if (next.code === 'SESSION_REQUIRED') clearChatSession(socketUrl)
                setError(chatErrorMessage(next.code))
            }
        }
    }, [clearResponseTimer, failResponse, showResponse, socketUrl])

    const { sendMessage, readyState } = useWebSocket(session ? socketUrl : null, {
        onMessage,
        onClose: () => failResponse('연결이 종료되었습니다. 다시 연결해주세요.'),
        onError: () => failResponse('연결하지 못했습니다. 잠시 후 다시 시도해주세요.'),
        shouldReconnect: () => false,
        retryOnError: false,
    })

    const sendChatMessage = useCallback((content: string, appendUserMessage = true) => {
        if (!session || readyState !== ReadyState.OPEN || error || activeAssistantMessageIdRef.current) return false
        if (appendUserMessage) {
            setMessages(previous => [...previous, { id: createMessageId(), text: content, isUser: true }])
        }
        activeAssistantMessageIdRef.current = createMessageId()
        responseRef.current = { text: '', sources: [], status: 'streaming' }
        setLastUserMessage(content)
        setIsResponding(true)
        setIsAwaitingFirstToken(true)
        setIsTimeout(false)
        setInputValue('')
        sendMessage(JSON.stringify({ uuid: session.conversationId, sessionToken: session.sessionToken, type: 'USER', content }), false)
        scheduleResponseTimeout()
        return true
    }, [createMessageId, error, readyState, scheduleResponseTimeout, sendMessage, session, setMessages])

    const retryLastMessage = useCallback(() => {
        onRestartSession(lastUserMessage || (!hasSentInitialPromptRef.current ? initialPrompt : '') || '')
    }, [initialPrompt, lastUserMessage, onRestartSession])

    const sendCurrentMessage = useCallback(() => {
        const content = inputValue.trim()
        if (content && content.length <= 4000 && !isResponding) sendChatMessage(content)
    }, [inputValue, isResponding, sendChatMessage])

    const sendPrompt = useCallback((prompt: string) => {
        const content = prompt.trim()
        if (!content || content.length > 4000 || isResponding) return
        if (!sendChatMessage(content)) setInputValue(content)
    }, [isResponding, sendChatMessage])

    useEffect(() => {
        let disposed = false
        loadChatSession(socketUrl).then(grant => { if (!disposed) setSession(grant) })
            .catch(reason => { if (!disposed) setError(reason instanceof Error ? reason.message : '연결을 준비하지 못했습니다.') })
        return () => { disposed = true; clearResponseTimer() }
    }, [clearResponseTimer, socketUrl])

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' })
    }, [messages, error, isTimeout])

    useEffect(() => {
        if (initialPrompt && !hasSentInitialPromptRef.current && sendChatMessage(initialPrompt, false)) {
            hasSentInitialPromptRef.current = true
        }
    }, [initialPrompt, sendChatMessage])

    const connectionStatus = {
        [ReadyState.CONNECTING]: '연결 중...',
        [ReadyState.OPEN]: '연결됨',
        [ReadyState.CLOSING]: '연결 종료 중...',
        [ReadyState.CLOSED]: '연결 끊김',
        [ReadyState.UNINSTANTIATED]: error ? '연결 오류' : '준비 중',
    }[readyState]

    const connectionStatusInfo: ConnectionStatusInfo | null = {
        [ReadyState.CONNECTING]: { color: 'bg-amber-400', animate: 'animate-pulse', title: '연결 중' },
        [ReadyState.OPEN]: { color: 'bg-emerald-500', animate: '', title: '연결됨' },
        [ReadyState.CLOSING]: { color: 'bg-amber-400', animate: '', title: '연결 종료 중' },
        [ReadyState.CLOSED]: { color: 'bg-rose-500', animate: '', title: '연결 끊김' },
        [ReadyState.UNINSTANTIATED]: { color: 'bg-slate-400', animate: '', title: '준비 중' },
    }[readyState] ?? null

    const canSend = inputValue.trim().length > 0 && inputValue.trim().length <= 4000 && !isResponding && !error && readyState === ReadyState.OPEN && !!session

    return { inputValue, setInputValue, canSend, isAwaitingFirstToken, isTimeout, error, chatContainerRef,
        connectionStatus, connectionStatusInfo, retryLastMessage, sendCurrentMessage, sendPrompt }
}
