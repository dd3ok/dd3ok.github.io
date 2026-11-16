import type { FormEvent, KeyboardEvent } from 'react'

interface ChatInputProps {
    inputValue: string
    canSend: boolean
    onInputChange: (value: string) => void
    onSend: () => void
}

const SendIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="h-5 w-5">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
)

export default function ChatInput({
    inputValue,
    canSend,
    onInputChange,
    onSend,
}: ChatInputProps) {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!canSend) {
            return
        }

        onSend()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) {
            e.preventDefault()
        }
    }

    return (
        <div className="border-t border-[var(--card-border)] bg-[var(--nav-bg)] px-4 py-3 md:px-8 md:py-4">
            <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl items-center gap-2.5">
                <input
                    type="text"
                    aria-label="커리어 질문"
                    maxLength={4000}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="경력, 프로젝트, 작업물에 대해 물어보세요"
                    className="flex-1 rounded-xl px-4 py-3 glass-input text-sm placeholder-[var(--text-muted)] focus:outline-hidden"
                />
                <button
                    type="submit"
                    aria-label="질문 보내기"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-md shadow-black/[0.04] transition-all duration-300 hover:bg-[var(--button-primary-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!canSend}
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    )
}
