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
    onRetry: () => void
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
            src="/image/aiimage.png"
            alt="커리어 에이전트 프로필"
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
    onRetry,
    containerRef,
}: ChatMessagesProps) {
    return (
        <div ref={containerRef} className="flex-1 p-5 overflow-y-auto space-y-6 chat-scroll bg-transparent">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-2.5 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {!msg.isUser && <AssistantAvatar />}
                    <div className={`break-words transition-all duration-300 ${
                        msg.isUser
                            ? 'bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] text-white shadow-xs rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[75%] md:max-w-[80%] hover:shadow-md font-medium text-sm leading-relaxed whitespace-pre-wrap'
                            : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] shadow-xs rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%] md:max-w-[90%] hover:border-[var(--card-hover-border)]'
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
                    </div>
                </div>
            ))}

            {isAwaitingFirstToken && !isTimeout && (
                <div className="flex items-start gap-2.5 justify-start">
                    <AssistantAvatar />
                    <div className="px-4 py-3 rounded-2xl rounded-tl-none shadow-xs bg-[var(--card-bg)] border border-[var(--card-border)]">
                        <LoadingDots />
                    </div>
                </div>
            )}

            {isTimeout && (
                <div className="flex items-start gap-2.5 justify-start">
                    <AssistantAvatar />
                    <div className="px-4 py-3 rounded-2xl rounded-tl-none shadow-xs bg-[var(--card-bg)] border border-[var(--card-border)]">
                        <TimeoutMessage onRetry={onRetry} />
                    </div>
                </div>
            )}
        </div>
    )
}
