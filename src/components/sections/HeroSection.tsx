import DeferredAIChat from '@/components/sections/DeferredAIChat'

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-br from-[var(--bg-grad-start)] to-[var(--bg-grad-end)] lg:min-h-[100dvh]"
        >
            {/* Ambient Aurora Orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="aurora-orb hidden h-[420px] w-[420px] -top-24 -right-24 bg-[var(--orb-color-1)] sm:block"
                    style={{ animationDelay: '0s' }}
                />
                <div
                    className="aurora-orb hidden h-[360px] w-[360px] -bottom-24 -left-24 bg-[var(--orb-color-2)] sm:block"
                    style={{ animationDelay: '-7s' }}
                />
            </div>

            <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
                <DeferredAIChat />
            </div>
        </section>
    )
}
