import type { FormEvent } from 'react'

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

    return (
        <div className="p-3 border-t border-[var(--card-border)] bg-[var(--nav-bg)]">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <input
                    type="text"
                    aria-label="커리어 질문"
                    maxLength={4000}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder="무엇이든 물어보세요."
                    className="flex-1 px-4 py-2.5 glass-input text-sm placeholder-[var(--text-muted)] focus:outline-hidden"
                />
                <button
                    type="submit"
                    aria-label="질문 보내기"
                    className="w-9 h-9 flex items-center justify-center bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] rounded-full hover:bg-[var(--button-primary-hover)] focus:outline-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-black/[0.04]"
                    disabled={!canSend}
                >
                    <SendIcon />
                </button>
            </form>
        </div>
    )
}
