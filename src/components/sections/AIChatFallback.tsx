export default function AIChatFallback() {
    return (
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-transparent animate-fadeIn">
            <div className="flex shrink-0 items-center justify-center gap-2 px-16 pt-3.5 pb-2 lg:justify-end lg:px-8 lg:pt-4 lg:pb-1">
                <h1 className="sr-only">유인재 포트폴리오 커리어 에이전트</h1>
                <div className="flex items-center space-x-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-1 shadow-xs backdrop-blur-xl">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-tight text-[var(--text-secondary)]">연결 준비 중</span>
                </div>
            </div>

            <div className="flex-1 overflow-hidden px-4 py-6 md:px-8">
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] p-0.5 shadow-xs ring-1 ring-[var(--card-border)] animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 rounded-sm bg-[var(--card-border)] animate-pulse" />
                            <div className="h-4 w-5/6 rounded-sm bg-[var(--card-border)] opacity-60 animate-pulse" />
                            <div className="h-4 w-2/3 rounded-sm bg-[var(--card-border)] opacity-30 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-[var(--card-border)] bg-[var(--nav-bg)] px-4 py-3 md:px-8 md:py-4">
                <div className="mx-auto h-11 w-full max-w-3xl rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] animate-pulse" />
            </div>
        </div>
    )
}
