export default function AIChatFallback() {
    return (
        <div className="w-full max-w-md mx-auto glass-card flex flex-col h-[36rem] shadow-xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--nav-bg)] px-5">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">커리어 에이전트</span>
                    <span className="text-[10px] bg-[var(--accent-glow)] text-[var(--accent-color)] font-bold px-2 py-0.5 rounded-full">Agent</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1 rounded-full shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-tight">연결 준비 중</span>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 space-y-6 bg-transparent overflow-hidden">
                <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center shrink-0 ring-1 ring-[var(--card-border)] shadow-sm overflow-hidden p-0.5 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-[var(--card-border)] animate-pulse" />
                        <div className="h-4 w-5/6 rounded bg-[var(--card-border)] opacity-60 animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-[var(--card-border)] opacity-30 animate-pulse" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="w-32 h-10 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent-color)]/10 animate-pulse" />
                </div>
            </div>

            {/* Input area fallback */}
            <div className="p-4 border-t border-[var(--card-border)] bg-[var(--nav-bg)] px-5">
                <div className="h-10 rounded-full bg-[var(--input-bg)] border border-[var(--input-border)] animate-pulse" />
            </div>
        </div>
    )
}
