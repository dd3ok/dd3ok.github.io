import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useUserIdentifier } from '@/hooks/useUserIdentifier'

const RESPONSE_TIMEOUT_MS = 60000
const RESPONSE_SETTLE_DELAY_MS = 1500

export interface ChatMessage {
    id: string
    text: string
    isUser: boolean
}

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

export function useChatSession({
    socketUrl,
    initialPrompt,
    messages,
    setMessages,
    createMessageId,
    onRestartSession,
}: UseChatSessionOptions) {
    const userId = useUserIdentifier()
    const [inputValue, setInputValue] = useState('')
    const [isResponding, setIsResponding] = useState(false)
    const [isAwaitingFirstToken, setIsAwaitingFirstToken] = useState(false)
    const [isTimeout, setIsTimeout] = useState(false)
    const [lastUserMessage, setLastUserMessage] = useState('')
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const activeAssistantMessageIdRef = useRef<string | null>(null)
    const hasSentInitialPromptRef = useRef(false)
    const responseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)

    const clearResponseTimer = useCallback(() => {
        if (responseTimeoutRef.current) {
            clearTimeout(responseTimeoutRef.current)
            responseTimeoutRef.current = null
        }
    }, [])

    const clearSettleTimer = useCallback(() => {
        if (settleTimeoutRef.current) {
            clearTimeout(settleTimeoutRef.current)
            settleTimeoutRef.current = null
        }
    }, [])

    const scheduleResponseTimeout = useCallback(() => {
        clearResponseTimer()
        clearSettleTimer()
        responseTimeoutRef.current = setTimeout(() => {
            setIsAwaitingFirstToken(false)
            setIsTimeout(true)
            responseTimeoutRef.current = null
        }, RESPONSE_TIMEOUT_MS)
    }, [clearResponseTimer, clearSettleTimer])

    const scheduleSettleTimer = useCallback(() => {
        clearSettleTimer()
        settleTimeoutRef.current = setTimeout(() => {
            settleTimeoutRef.current = null
            setIsResponding(false)
        }, RESPONSE_SETTLE_DELAY_MS)
    }, [clearSettleTimer])

    const appendAssistantToken = useCallback((assistantMessageId: string, token: string) => {
        setMessages(prev => {
            const assistantMessageIndex = prev.findIndex((message) => message.id === assistantMessageId)

            if (assistantMessageIndex === -1) {
                return [...prev, { id: assistantMessageId, text: token, isUser: false }]
            }

            const nextMessages = [...prev]
            nextMessages[assistantMessageIndex] = {
                ...nextMessages[assistantMessageIndex],
                text: nextMessages[assistantMessageIndex].text + token,
            }

            return nextMessages
        })
    }, [setMessages])

    const sendChatMessage = useCallback((content: string, appendUserMessage = true) => {
        if (!userId || readyState !== ReadyState.OPEN) {
            return false
        }

        clearSettleTimer()

        if (appendUserMessage) {
            setMessages(prev => [
                ...prev,
                { id: createMessageId(), text: content, isUser: true },
            ])
        }

        activeAssistantMessageIdRef.current = createMessageId()
        setLastUserMessage(content)
        setIsResponding(true)
        setIsAwaitingFirstToken(true)
        setIsTimeout(false)
        setInputValue('')

        sendMessage(JSON.stringify({
            uuid: userId,
            type: 'USER',
            content,
        }))

        scheduleResponseTimeout()
        return true
    }, [clearSettleTimer, createMessageId, readyState, scheduleResponseTimeout, sendMessage, setMessages, userId])

    const retryLastMessage = useCallback(() => {
        if (!lastUserMessage) {
            return
        }

        onRestartSession(lastUserMessage)
    }, [lastUserMessage, onRestartSession])

    const sendCurrentMessage = useCallback(() => {
        const trimmedInputValue = inputValue.trim()
        if (!trimmedInputValue || isResponding) {
            return
        }

        sendChatMessage(trimmedInputValue)
    }, [inputValue, isResponding, sendChatMessage])

    useEffect(() => {
        if (lastMessage === null) {
            return
        }

        const assistantMessageId = activeAssistantMessageIdRef.current

        if (!assistantMessageId) {
            return
        }

        clearResponseTimer()
        setIsTimeout(false)
        setIsAwaitingFirstToken(false)
        setIsResponding(true)
        appendAssistantToken(assistantMessageId, String(lastMessage.data))
        scheduleSettleTimer()
    }, [appendAssistantToken, clearResponseTimer, lastMessage, scheduleSettleTimer])

    useEffect(() => {
        const chatContainer = chatContainerRef.current
        if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' })
        }
    }, [messages, isTimeout])

    useEffect(() => {
        return () => {
            clearResponseTimer()
            clearSettleTimer()
        }
    }, [clearResponseTimer, clearSettleTimer])

    useEffect(() => {
        if (!initialPrompt || hasSentInitialPromptRef.current) {
            return
        }

        const sent = sendChatMessage(initialPrompt, false)

        if (sent) {
            hasSentInitialPromptRef.current = true
        }
    }, [initialPrompt, sendChatMessage])

    const connectionStatus = {
        [ReadyState.CONNECTING]: '연결 중...',
        [ReadyState.OPEN]: '연결됨',
        [ReadyState.CLOSING]: '연결 종료 중...',
        [ReadyState.CLOSED]: '연결 끊김',
        [ReadyState.UNINSTANTIATED]: '준비 중',
    }[readyState]

    const connectionStatusInfo: ConnectionStatusInfo | null = {
        [ReadyState.CONNECTING]: { color: 'bg-amber-400', animate: 'animate-pulse', title: '연결 중' },
        [ReadyState.OPEN]: { color: 'bg-emerald-500', animate: 'animate-pulse', title: '연결됨' },
        [ReadyState.CLOSING]: { color: 'bg-amber-400', animate: '', title: '연결 종료 중' },
        [ReadyState.CLOSED]: { color: 'bg-rose-500', animate: '', title: '연결 끊김' },
        [ReadyState.UNINSTANTIATED]: { color: 'bg-slate-400', animate: '', title: '초기화 안됨' },
    }[readyState] ?? null

    const canSend = inputValue.trim().length > 0 && !isResponding && readyState === ReadyState.OPEN

    return {
        inputValue,
        setInputValue,
        canSend,
        isAwaitingFirstToken,
        isTimeout,
        chatContainerRef,
        connectionStatus,
        connectionStatusInfo,
        retryLastMessage,
        sendCurrentMessage,
    }
}
