import type { RefObject } from 'react'
import Image from 'next/image'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import StatusBanner from '@/components/ui/StatusBanner'
import type { ChatMessage } from '@/components/sections/ai-chat/useChatSession'

const REMARK_PLUGINS = [remarkGfm]

interface ChatMessagesProps {
    messages: ChatMessage[]
    isAwaitingFirstToken: boolean
    isTimeout: boolean
    error: string | null
    onRetry: () => void
    onSelectPrompt?: (prompt: string) => void
    starterPrompts?: readonly string[]
    followUpPrompts?: readonly string[]
    containerRef: RefObject<HTMLDivElement | null>
}

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
            className="px-4 py-2 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] text-xs font-semibold rounded-xl hover:bg-[var(--button-primary-hover)] shadow-xs transition-all duration-300"
        >
            새 연결로 다시 요청하기
        </button>
    </StatusBanner>
)

const AssistantAvatar = () => (
    <div className="w-8 h-8 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center shrink-0 ring-1 ring-[var(--card-border)] shadow-xs overflow-hidden p-0.5">
        <Image
            src="/logo.png"
            alt="dd3ok 커리어 에이전트"
            width={26}
            height={26}
            className="rounded-full"
        />
    </div>
)

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
            <code className="!text-xs !px-1 !py-0.5 !bg-slate-200 !text-slate-800 !rounded-sm" {...props}>
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

export default function ChatMessages({
    messages,
    isAwaitingFirstToken,
    isTimeout,
    error,
    onRetry,
    onSelectPrompt,
    starterPrompts,
    followUpPrompts,
    containerRef,
}: ChatMessagesProps) {
    const showStarterPrompts = !!starterPrompts?.length && messages.length === 1 && !isAwaitingFirstToken && !isTimeout
    const showFollowUpPrompts = !showStarterPrompts && !!followUpPrompts?.length && !isAwaitingFirstToken && !isTimeout && !error

    return (
        <div ref={containerRef} role="log" aria-label="대화 내용" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-6 md:px-8 chat-scroll bg-transparent">
            <div className="mx-auto w-full max-w-3xl space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        {!msg.isUser && <AssistantAvatar />}
                        <div className={`break-words transition-all duration-300 ${
                            msg.isUser
                                ? 'bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] text-white shadow-xs rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[80%] md:max-w-[75%] hover:shadow-md font-medium text-sm leading-relaxed whitespace-pre-wrap'
                                : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] shadow-xs rounded-2xl rounded-tl-none px-4 py-3 max-w-[88%] md:max-w-[85%] hover:border-[var(--card-hover-border)]'
                        }`}>
                            {msg.isUser ? (
                                <p>{msg.text}</p>
                            ) : (
                                <div className="prose prose-sm max-w-none text-[var(--text-primary)] [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                    <ReactMarkdown
                                        remarkPlugins={REMARK_PLUGINS}
                                        components={markdownComponents}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            )}
                            {msg.status === 'failed' && <p className="mt-2 text-xs text-[var(--text-secondary)]">완료되지 않은 답변</p>}
                        </div>
                    </div>
                ))}

                {showStarterPrompts && (
                    <div className="pl-11">
                        <p className="mb-2 text-xs font-semibold text-[var(--text-muted)]">추천 질문</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {starterPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => onSelectPrompt?.(prompt)}
                                    className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3.5 py-2.5 text-left text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--card-hover-border)] hover:bg-[var(--accent-glow)]/40 hover:text-[var(--text-primary)]"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {showFollowUpPrompts && (
                    <div className="pl-11">
                        <p className="mb-2 text-xs font-semibold text-[var(--text-muted)]">다음 질문 추천</p>
                        <div className="flex flex-wrap gap-2">
                            {followUpPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => onSelectPrompt?.(prompt)}
                                    className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-left text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--card-hover-border)] hover:bg-[var(--accent-glow)]/40 hover:text-[var(--text-primary)]"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isAwaitingFirstToken && !isTimeout && (
                    <div className="flex items-start gap-3 justify-start">
                        <AssistantAvatar />
                        <div className="px-4 py-3 rounded-2xl rounded-tl-none shadow-xs bg-[var(--card-bg)] border border-[var(--card-border)]">
                            <LoadingDots />
                        </div>
                    </div>
                )}

                {isTimeout && (
                    <div className="flex items-start gap-3 justify-start">
                        <AssistantAvatar />
                        <div className="px-4 py-3 rounded-2xl rounded-tl-none shadow-xs bg-[var(--card-bg)] border border-[var(--card-border)]">
                            <TimeoutMessage onRetry={onRetry} />
                        </div>
                    </div>
                )}
                {error && !isTimeout && (
                    <StatusBanner tone="warning" title="대화를 이어가지 못했습니다." description={error}>
                        <button type="button" onClick={onRetry} className="mt-2 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--accent-color)] underline">
                            다시 연결하고 요청하기
                        </button>
                    </StatusBanner>
                )}
            </div>
        </div>
    )
}
