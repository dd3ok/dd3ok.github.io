export default function AIChatFallback() {
    return (
        <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 flex flex-col h-[36rem] overflow-hidden">
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-300 animate-pulse" />
                <h3 className="text-md font-semibold text-gray-700">AI 소개 준비 중</h3>
            </div>

            <div className="flex-1 p-5 space-y-6 bg-white/40">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-slate-200" />
                        <div className="h-4 w-5/6 rounded bg-slate-100" />
                        <div className="h-4 w-2/3 rounded bg-slate-100" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="w-32 h-10 rounded-2xl bg-blue-100" />
                </div>
            </div>

            <div className="p-3 border-t border-gray-200/50 bg-white/50">
                <div className="h-11 rounded-full bg-slate-100" />
            </div>
        </div>
    )
}
