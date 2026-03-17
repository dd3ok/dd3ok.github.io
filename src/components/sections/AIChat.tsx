'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useUserIdentifier } from '@/hooks/useUserIdentifier'
import { getEnvConfig } from '@/utils/EnvConfig'
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
    <div className="flex flex-col items-center space-y-3 text-center">
        <div className="text-slate-500 text-sm">
            <p>응답이 지연되고 있습니다.</p>
            <p>서버 Sleep시 초기 로딩이 있습니다.</p>
            <p>잠시후 다시 시도해주세요.</p>
        </div>
        <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
            새 연결로 다시 요청하기
        </button>
    </div>
)

const ConnectionStatusIcon = ({ readyState }: { readyState: ReadyState }) => {
    const statusInfo = {
        [ReadyState.CONNECTING]: { color: 'bg-yellow-500', animate: 'animate-pulse', title: '연결 중' },
        [ReadyState.OPEN]: { color: 'bg-green-500', animate: '', title: '연결됨' },
        [ReadyState.CLOSING]: { color: 'bg-yellow-500', animate: '', title: '연결 종료 중' },
        [ReadyState.CLOSED]: { color: 'bg-red-500', animate: '', title: '연결 끊김' },
        [ReadyState.UNINSTANTIATED]: { color: 'bg-gray-400', animate: '', title: '초기화 안됨' },
    }[readyState]

    if (!statusInfo) return null

    return (
        <span
            title={statusInfo.title}
            className={`h-3 w-3 rounded-full ${statusInfo.color} ${statusInfo.animate} transition-colors`}
        />
    )
}

interface Message {
    id: string
    text: string
    isUser: boolean
}

interface ConfiguredAIChatProps {
    socketUrl: string
    initialPrompt: string | null
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
        <a href={href} className="!text-blue-600 hover:!text-blue-800 !underline" target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ),
}

function AIChatUnavailable() {
    return (
        <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 flex flex-col h-[36rem] overflow-hidden">
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <h3 className="text-md font-semibold text-gray-700">AI 소개 비활성화</h3>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-white/40">
                <p className="text-sm leading-6 text-gray-600">
                    현재 환경에서는 AI 소개 기능 설정이 연결되지 않았습니다.
                </p>
                <p className="text-xs leading-5 text-gray-500 max-w-xs">
                    포트폴리오 본문과 프로젝트 섹션은 계속 확인하실 수 있고, AI 소개는 배포 환경에서만 활성화될 수 있습니다.
                </p>
            </div>
        </div>
    )
}

function ConfiguredAIChat({ socketUrl, initialPrompt, onRestartSession }: ConfiguredAIChatProps) {
    const userId = useUserIdentifier()
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', text: '안녕하세요! 인재 AI입니다 👋\n\n경력, 프로젝트, 기술에 관해 무엇이든 물어보세요.', isUser: false },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isResponding, setIsResponding] = useState(false)
    const [isTimeout, setIsTimeout] = useState(false)
    const [lastUserMessage, setLastUserMessage] = useState('')
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const messageSequenceRef = useRef(0)
    const activeAssistantMessageIdRef = useRef<string | null>(null)
    const hasSentInitialPromptRef = useRef(false)
    const responseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)

    const createMessageId = () => {
        messageSequenceRef.current += 1
        return `message-${messageSequenceRef.current}`
    }

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

    const finishResponse = useCallback(() => {
        clearResponseTimer()
        clearSettleTimer()
        activeAssistantMessageIdRef.current = null
        setIsResponding(false)
    }, [clearResponseTimer, clearSettleTimer])

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
            finishResponse()
        }, RESPONSE_SETTLE_DELAY_MS)
    }, [clearSettleTimer, finishResponse])

    const appendAssistantToken = useCallback((token: string) => {
        const assistantMessageId = activeAssistantMessageIdRef.current

        if (!assistantMessageId) {
            return
        }

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
    }, [])

    const sendChatMessage = useCallback((content: string) => {
        if (!userId || readyState !== ReadyState.OPEN) {
            return false
        }

        clearSettleTimer()
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), text: content, isUser: true },
        ])

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
    }, [clearSettleTimer, readyState, scheduleResponseTimeout, sendMessage, userId])

    useEffect(() => {
        if (lastMessage === null) {
            return
        }

        clearResponseTimer()
        setIsTimeout(false)
        setIsResponding(true)
        appendAssistantToken(String(lastMessage.data))
        scheduleSettleTimer()
    }, [appendAssistantToken, clearResponseTimer, lastMessage, scheduleSettleTimer])

    const handleRetry = () => {
        if (!lastUserMessage) {
            return
        }

        onRestartSession(lastUserMessage)
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: '연결 중.. (Sleep 시 60초)',
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

        const sent = sendChatMessage(initialPrompt)

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
        <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 flex flex-col h-[36rem]">
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-center gap-2 bg-primary-500 rounded-t-2xl">
                <ConnectionStatusIcon readyState={readyState} />
                <h3 className="text-md font-semibold text-gray-800">{connectionStatus}</h3>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        {!msg.isUser && (
                            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-xl">
                                <span role="img" aria-label="robot">
                                    <Image src="/image/aiimage.png" alt="AI-Profile" width={28} height={28} />
                                </span>
                            </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-xl max-w-xs md:max-w-sm break-words shadow-md transition-all duration-300 hover:shadow-lg ${msg.isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                            {msg.isUser ? (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                                <div className="prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
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
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 text-xl">
                            <span role="img" aria-label="robot">
                                <Image src="/image/aiimage.png" alt="AI-Profile" width={28} height={28} />
                            </span>
                        </div>
                        <div className="px-4 py-3 rounded-xl shadow-md bg-slate-100">
                            <LoadingDots />
                        </div>
                    </div>
                )}

                {isTimeout && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0 text-xl">
                            <span role="img" aria-label="robot">
                                <Image src="/image/aiimage.png" alt="AI-Profile" width={28} height={28} />
                            </span>
                        </div>
                        <div className="px-4 py-3 rounded-xl shadow-md bg-slate-100">
                            <TimeoutMessage onRetry={handleRetry} />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-gray-200/50 bg-white/50 rounded-b-2xl">
                <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="무엇이든 물어보세요."
                        className="flex-1 px-4 py-2.5 bg-slate-100/80 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    />
                    <button
                        type="submit"
                        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400 shrink-0"
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
    const [sessionKey, setSessionKey] = useState(0)
    const [retryPrompt, setRetryPrompt] = useState<string | null>(null)

    if (!socketUrl) {
        return <AIChatUnavailable />
    }

    return (
        <ConfiguredAIChat
            key={sessionKey}
            socketUrl={`${socketUrl}/ws/chat`}
            initialPrompt={retryPrompt}
            onRestartSession={(prompt) => {
                setRetryPrompt(prompt)
                setSessionKey((currentKey) => currentKey + 1)
            }}
        />
    )
}
