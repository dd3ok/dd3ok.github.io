'use client'

import { useCallback, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { getEnvConfig } from '@/utils/EnvConfig'
import StatusBanner from '@/components/ui/StatusBanner'
import ChatInput from '@/components/sections/ai-chat/ChatInput'
import ChatMessages from '@/components/sections/ai-chat/ChatMessages'
import {
    useChatSession,
    type ChatMessage,
    type ConnectionStatusInfo,
} from '@/components/sections/ai-chat/useChatSession'

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: 'welcome', text: '안녕하세요! 유인재의 커리어 에이전트입니다 👋\n\n경력, 프로젝트, 기술 스택에 관해 무엇이든 물어보세요.', isUser: false },
]

interface ConfiguredAIChatProps {
    socketUrl: string
    initialPrompt: string | null
    messages: ChatMessage[]
    setMessages: Dispatch<SetStateAction<ChatMessage[]>>
    createMessageId: () => string
    onRestartSession: (prompt: string) => void
}

const ConnectionStatusIcon = ({ statusInfo }: { statusInfo: ConnectionStatusInfo | null }) => {
    if (!statusInfo) return null

    return (
        <span
            title={statusInfo.title}
            className={`h-2 w-2 rounded-full ${statusInfo.color} ${statusInfo.animate} transition-colors`}
        />
    )
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
    const {
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
    } = useChatSession({
        socketUrl,
        initialPrompt,
        messages,
        setMessages,
        createMessageId,
        onRestartSession,
    })

    return (
        <div className="w-full max-w-md mx-auto glass-card flex flex-col h-[36rem] shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--nav-bg)] px-5">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">커리어 에이전트</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1 rounded-full shadow-xs">
                    <ConnectionStatusIcon statusInfo={connectionStatusInfo} />
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-tight">{connectionStatus}</span>
                </div>
            </div>

            <ChatMessages
                messages={messages}
                isAwaitingFirstToken={isAwaitingFirstToken}
                isTimeout={isTimeout}
                onRetry={retryLastMessage}
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
    const messageSequenceRef = useRef(0)
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
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
