'use client'

import { useCallback, useEffect, useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useUserIdentifier } from '@/hooks/useUserIdentifier'
import { getEnvConfig } from '@/utils/EnvConfig'
import StatusBanner from '@/components/ui/StatusBanner'
import Image from 'next/image'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const RESPONSE_TIMEOUT_MS = 10000
const RESPONSE_SETTLE_DELAY_MS = 1500

const SendIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="h-5 w-5">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
)

const LoadingDots = () => (
    <div className="flex space-x-1 items-center">
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" />
    </div>
)

const TimeoutMessage = ({ onRetry }: { onRetry: () => void }) => (
    <StatusBanner
        tone="warning"
        title="응답이 지연되고 있습니다."
        description="서버가 sleep 상태에서 wake up 중일 수 있습니다. 잠시 후 다시 시도해주세요."
        className="border-[var(--card-border)] bg-[var(--card-bg)]"
    >
        <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-[var(--accent-color)] text-white text-xs font-semibold rounded-xl hover:bg-[var(--accent-secondary)] shadow-sm transition-all duration-300"
        >
            새 연결로 다시 요청하기
        </button>
    </StatusBanner>
)

const ConnectionStatusIcon = ({ readyState }: { readyState: ReadyState }) => {
    const statusInfo = {
        [ReadyState.CONNECTING]: { color: 'bg-amber-400', animate: 'animate-pulse', title: '연결 중' },
        [ReadyState.OPEN]: { color: 'bg-emerald-500', animate: 'animate-pulse', title: '연결됨' },
        [ReadyState.CLOSING]: { color: 'bg-amber-400', animate: '', title: '연결 종료 중' },
        [ReadyState.CLOSED]: { color: 'bg-rose-500', animate: '', title: '연결 끊김' },
        [ReadyState.UNINSTANTIATED]: { color: 'bg-slate-400', animate: '', title: '초기화 안됨' },
    }[readyState]

    if (!statusInfo) return null

    return (
        <span
            title={statusInfo.title}
            className={`h-2 w-2 rounded-full ${statusInfo.color} ${statusInfo.animate} transition-colors`}
        />
    )
}

interface Message {
    id: string
    text: string
    isUser: boolean
}

const INITIAL_MESSAGES: Message[] = [
    { id: 'welcome', text: '안녕하세요! 유인재의 커리어 에이전트입니다 👋\n\n경력, 프로젝트, 기술 스택에 관해 무엇이든 물어보세요.', isUser: false },
]

interface ConfiguredAIChatProps {
    socketUrl: string
    initialPrompt: string | null
    messages: Message[]
    setMessages: Dispatch<SetStateAction<Message[]>>
    createMessageId: () => string
    onRestartSession: (prompt: string) => void
}

const markdownComponents: Components = {
    pre: ({ children }) => (
        <pre className="!text-xs !p-2 !my-2 !bg-slate-800 !text-slate-100 !rounded-md overflow-x-auto">
            {children}
        </pre>
    ),
    code: ({ node, className, children, ...props }) => {
        void node
        const match = /language-(\w+)/.exec(className || '')
        const isInline = !match

        return isInline ? (
            <code className="!text-xs !px-1 !py-0.5 !bg-slate-200 !text-slate-800 !rounded" {...props}>
                {children}
            </code>
        ) : (
            <code className="!text-xs" {...props}>
                {children}
            </code>
        )
    },
    h1: ({ children }) => <h1 className="!text-sm !font-bold !my-2">{children}</h1>,
    h2: ({ children }) => <h2 className="!text-sm !font-semibold !my-1">{children}</h2>,
    h3: ({ children }) => <h3 className="!text-xs !font-medium !my-1">{children}</h3>,
    p: ({ children }) => <p className="!text-sm !my-1 !leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="!text-sm !my-1 !pl-4">{children}</ul>,
    ol: ({ children }) => <ol className="!text-sm !my-1 !pl-4">{children}</ol>,
    li: ({ children }) => <li className="!my-0.5">{children}</li>,
    blockquote: ({ children }) => (
        <blockquote className="!text-sm !my-2 !pl-3 !border-l-2 !border-slate-300 !italic">
            {children}
        </blockquote>
    ),
    table: ({ children }) => (
        <div className="!my-2 overflow-x-auto">
            <table className="!text-xs !min-w-full">{children}</table>
        </div>
    ),
    a: ({ children, href }) => (
        <a href={href} className="!text-[var(--accent-color)] hover:!text-[var(--accent-secondary)] !underline" target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ),
}

function AIChatUnavailable() {
    return (
        <div className="w-full max-w-md mx-auto glass-card flex flex-col h-[36rem] overflow-hidden">
            <div className="p-4 border-b border-[var(--card-border)] bg-[var(--nav-bg)] flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold text-[var(--text-secondary)]">커리어 에이전트 비활성화</h3>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center bg-transparent">
                <StatusBanner
                    tone="info"
                    title="현재 환경에 커리어 에이전트 설정이 없습니다."
                    description="포트폴리오 본문과 프로젝트 섹션은 계속 볼 수 있습니다. 커리어 에이전트는 배포 환경에서만 켜질 수 있습니다."
                    className="max-w-xs text-center border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)]"
                />
            </div>
        </div>
    )
}

function ConfiguredAIChat({
    socketUrl,
    initialPrompt,
    messages,
    setMessages,
    createMessageId,
    onRestartSession,
}: ConfiguredAIChatProps) {
    const userId = useUserIdentifier()
    const [inputValue, setInputValue] = useState('')
    const [isResponding, setIsResponding] = useState(false)
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
            activeAssistantMessageIdRef.current = null
            setIsResponding(false)
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
        setIsResponding(true)
        appendAssistantToken(assistantMessageId, String(lastMessage.data))
        scheduleSettleTimer()
    }, [appendAssistantToken, clearResponseTimer, lastMessage, scheduleSettleTimer])

    const handleRetry = () => {
        if (!lastUserMessage) {
            return
        }

        onRestartSession(lastUserMessage)
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: '연결 중... (Sleep 시 60초)',
        [ReadyState.OPEN]: '연결됨',
        [ReadyState.CLOSING]: '연결 종료 중...',
        [ReadyState.CLOSED]: '연결 끊김',
        [ReadyState.UNINSTANTIATED]: '준비 중',
    }[readyState]

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        const trimmedInputValue = inputValue.trim()
        if (!trimmedInputValue || isResponding) {
            return
        }

        sendChatMessage(trimmedInputValue)
    }

    return (
        <div className="w-full max-w-md mx-auto glass-card flex flex-col h-[36rem] shadow-xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--nav-bg)] px-5">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">커리어 에이전트</span>
                    <span className="text-[10px] bg-[var(--accent-glow)] text-[var(--accent-color)] font-bold px-2 py-0.5 rounded-full">Agent</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1 rounded-full shadow-sm">
                    <ConnectionStatusIcon readyState={readyState} />
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-tight">{connectionStatus}</span>
                </div>
            </div>

            {/* Chat Body */}
            <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto space-y-6 chat-scroll bg-transparent">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-2.5 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        {!msg.isUser && (
                            <div className="w-8 h-8 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center shrink-0 ring-1 ring-[var(--card-border)] shadow-sm overflow-hidden p-0.5">
                                <Image
                                    src="/image/aiimage.png"
                                    alt="커리어 에이전트 프로필"
                                    width={26}
                                    height={26}
                                    className="rounded-full"
                                />
                            </div>
                        )}
                        <div className={`break-words transition-all duration-300 ${
                            msg.isUser
                                ? 'bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] text-white shadow-sm rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[75%] md:max-w-[80%] hover:shadow-md font-medium text-sm leading-relaxed whitespace-pre-wrap'
                                : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] shadow-sm rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] md:max-w-[90%] hover:border-[var(--card-hover-border)]'
                        }`}>
                            {msg.isUser ? (
                                <p>{msg.text}</p>
                            ) : (
                                <div className="prose prose-sm max-w-none text-[var(--text-primary)] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isResponding && !isTimeout && (
                    <div className="flex items-start gap-2.5 justify-start">
                        <div className="w-8 h-8 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center shrink-0 ring-1 ring-[var(--card-border)] shadow-sm overflow-hidden p-0.5">
                            <Image
                                src="/image/aiimage.png"
                                alt="커리어 에이전트 프로필"
                                width={26}
                                height={26}
                                className="rounded-full"
                            />
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-tl-none shadow-sm bg-[var(--card-bg)] border border-[var(--card-border)]">
                            <LoadingDots />
                        </div>
                    </div>
                )}

                {isTimeout && (
                    <div className="flex items-start gap-2.5 justify-start">
                        <div className="w-8 h-8 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center shrink-0 ring-1 ring-[var(--card-border)] shadow-sm overflow-hidden p-0.5">
                            <Image
                                src="/image/aiimage.png"
                                alt="커리어 에이전트 프로필"
                                width={26}
                                height={26}
                                className="rounded-full"
                            />
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-tl-none shadow-sm bg-[var(--card-bg)] border border-[var(--card-border)]">
                            <TimeoutMessage onRetry={handleRetry} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-[var(--card-border)] bg-[var(--nav-bg)]">
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="무엇이든 물어보세요."
                        className="flex-1 px-4 py-2.5 glass-input text-sm placeholder-[var(--text-muted)] focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-9 h-9 flex items-center justify-center bg-[var(--accent-color)] text-white rounded-full hover:bg-[var(--accent-secondary)] focus:outline-none transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-black/[0.04]"
                        disabled={!inputValue.trim() || (isResponding && !isTimeout) || readyState !== ReadyState.OPEN}
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function AIChat() {
    const config = getEnvConfig()
    const socketUrl = config.whoAmAiWs?.baseUrl
    const messageSequenceRef = useRef(0)
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
    const [sessionKey, setSessionKey] = useState(0)
    const [retryPrompt, setRetryPrompt] = useState<string | null>(null)

    const createMessageId = useCallback(() => {
        messageSequenceRef.current += 1
        return `message-${messageSequenceRef.current}`
    }, [])

    if (!socketUrl) {
        return <AIChatUnavailable />
    }

    return (
        <ConfiguredAIChat
            key={sessionKey}
            socketUrl={`${socketUrl}/ws/chat`}
            initialPrompt={retryPrompt}
            messages={messages}
            setMessages={setMessages}
            createMessageId={createMessageId}
            onRestartSession={(prompt) => {
                setRetryPrompt(prompt)
                setSessionKey((currentKey) => currentKey + 1)
            }}
        />
    )
}
