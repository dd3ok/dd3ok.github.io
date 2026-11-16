'use client'

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { getEnvConfig } from '@/utils/EnvConfig'
import StatusBanner from '@/components/ui/StatusBanner'
import ChatInput from '@/components/sections/ai-chat/ChatInput'
import ChatMessages from '@/components/sections/ai-chat/ChatMessages'
import { recoverStoredConversation } from '@/components/sections/ai-chat/chatProtocol'
import { buildAnswerFollowUpPrompts, STARTER_PROMPTS } from '@/components/sections/ai-chat/followUpPrompts'
import {
    useChatSession,
    type ChatMessage,
    type ConnectionStatusInfo,
} from '@/components/sections/ai-chat/useChatSession'

const CHAT_HISTORY_STORAGE_KEY = 'whoamai-chat-messages'

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: 'welcome', text: '안녕하세요! 유인재의 커리어 에이전트입니다 👋\n\n경력, 프로젝트, 작업물에 대해 물어보세요.', isUser: false },
]

function loadStoredConversation(): { messages: ChatMessage[]; pendingPrompt: string | null } | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = window.sessionStorage.getItem(CHAT_HISTORY_STORAGE_KEY)
        if (!raw) return null
        return recoverStoredConversation(JSON.parse(raw))
    } catch {
        return null
    }
}

function saveStoredMessages(messages: ChatMessage[]) {
    try {
        if (messages.length <= 1) {
            window.sessionStorage.removeItem(CHAT_HISTORY_STORAGE_KEY)
            return
        }
        const serializable = messages.map(({ id, text, isUser, status }) => ({ id, text, isUser, status }))
        window.sessionStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(serializable))
    } catch {
        // Ignore storage quota or privacy mode errors.
    }
}

interface ConfiguredAIChatProps {
    socketUrl: string
    initialPrompt: string | null
    messages: ChatMessage[]
    setMessages: Dispatch<SetStateAction<ChatMessage[]>>
    createMessageId: () => string
    onNewChat: () => void
    onRestartSession: (prompt: string) => void
}

const ConnectionStatusIcon = ({ statusInfo }: { statusInfo: ConnectionStatusInfo | null }) => {
    if (!statusInfo) return null

    return (
        <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${statusInfo.color} ${statusInfo.animate} transition-colors`}
        />
    )
}

function WorkspaceFloatingControls({
    statusBadge,
    showNewChat = false,
    onNewChat,
}: {
    statusBadge: React.ReactNode
    showNewChat?: boolean
    onNewChat?: () => void
}) {
    return (
        <div className="pointer-events-none flex shrink-0 items-center justify-end gap-2 pl-14 pr-4 pt-3.5 pb-2 lg:px-8 lg:pt-4 lg:pb-1">
            <h1 className="sr-only">유인재 포트폴리오 커리어 에이전트</h1>
            <div className="pointer-events-auto flex items-center gap-2">
                {showNewChat && onNewChat && (
                    <button
                        type="button"
                        onClick={onNewChat}
                        className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] shadow-xs backdrop-blur-xl transition-colors hover:border-[var(--card-hover-border)] hover:text-[var(--text-primary)]"
                    >
                        새 대화
                    </button>
                )}
                {statusBadge}
            </div>
        </div>
    )
}

function AIChatUnavailable() {
    return (
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-transparent">
            <WorkspaceFloatingControls
                statusBadge={
                    <div role="status" className="flex items-center space-x-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 shadow-xs backdrop-blur-xl">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[11px] font-bold tracking-tight text-[var(--text-secondary)]">오프라인 모드</span>
                    </div>
                }
            />
            <div className="flex flex-1 items-center justify-center p-6">
                <StatusBanner
                    tone="info"
                    title="현재 환경에 커리어 에이전트 설정이 없습니다."
                    description="사이드바에서 소개, 경력, 프로젝트, Lab, Contact 메뉴를 바로 탐색할 수 있습니다. 실시간 채팅은 배포 환경에서 활성화됩니다."
                    className="max-w-md border-[var(--card-border)] bg-[var(--card-bg)] text-center text-[var(--text-secondary)]"
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
    onNewChat,
    onRestartSession,
}: ConfiguredAIChatProps) {
    const {
        inputValue,
        setInputValue,
        canSend,
        isAwaitingFirstToken,
        isTimeout,
        error,
        chatContainerRef,
        connectionStatus,
        connectionStatusInfo,
        retryLastMessage,
        sendCurrentMessage,
        sendPrompt,
    } = useChatSession({
        socketUrl,
        initialPrompt,
        messages,
        setMessages,
        createMessageId,
        onRestartSession,
    })

    return (
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-transparent animate-fadeIn">
            <WorkspaceFloatingControls
                showNewChat={messages.length > 1}
                onNewChat={onNewChat}
                statusBadge={
                    <div role="status" className="flex items-center space-x-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 shadow-xs backdrop-blur-xl">
                        <ConnectionStatusIcon statusInfo={connectionStatusInfo} />
                        <span className="text-[11px] font-bold tracking-tight text-[var(--text-secondary)]">{connectionStatus}</span>
                    </div>
                }
            />

            <ChatMessages
                messages={messages}
                isAwaitingFirstToken={isAwaitingFirstToken}
                isTimeout={isTimeout}
                error={error}
                onRetry={retryLastMessage}
                onSelectPrompt={sendPrompt}
                starterPrompts={STARTER_PROMPTS}
                followUpPrompts={buildAnswerFollowUpPrompts(messages)}
                containerRef={chatContainerRef}
            />

            <ChatInput
                inputValue={inputValue}
                canSend={canSend}
                onInputChange={setInputValue}
                onSend={sendCurrentMessage}
            />
        </div>
    )
}

export default function AIChat() {
    const config = getEnvConfig()
    const socketUrl = config.whoAmAiWs?.baseUrl
    const [initialConversation] = useState(() => loadStoredConversation())
    const [messages, setMessages] = useState<ChatMessage[]>(() => initialConversation?.messages ?? INITIAL_MESSAGES)
    const messageSequenceRef = useRef(
        messages.reduce((maxId, message) => {
            const numericId = Number(message.id.replace('message-', ''))
            return Number.isFinite(numericId) ? Math.max(maxId, numericId) : maxId
        }, messages.length)
    )
    const [sessionKey, setSessionKey] = useState(0)
    const [retryPrompt, setRetryPrompt] = useState<string | null>(() => initialConversation?.pendingPrompt ?? null)

    useEffect(() => {
        saveStoredMessages(messages)
    }, [messages])

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
            socketUrl={`${socketUrl.replace(/\/$/, '')}/ws/chat/events`}
            initialPrompt={retryPrompt}
            messages={messages}
            setMessages={setMessages}
            createMessageId={createMessageId}
            onNewChat={() => {
                setMessages(INITIAL_MESSAGES)
                setRetryPrompt(null)
                setSessionKey((currentKey) => currentKey + 1)
            }}
            onRestartSession={(prompt) => {
                setRetryPrompt(prompt)
                setSessionKey((currentKey) => currentKey + 1)
            }}
        />
    )
}
