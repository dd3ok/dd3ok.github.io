import Button from '@/components/ui/Button'
import DeferredAIChat from '@/components/sections/DeferredAIChat'

function HeroAgentPreview() {
    const quickTopics = ['프로젝트', '기술 스택', '경력']

    return (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/85 p-5 text-left shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur">
            <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--accent-glow)] text-sm font-black text-[var(--accent-color)]">
                    AI
                </div>
                <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                        커리어 에이전트 미리보기
                    </p>
                    <p className="text-xs font-medium text-[var(--text-muted)]">
                        프로젝트와 기술 스택을 빠르게 탐색합니다
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
                {quickTopics.map((topic) => (
                    <span
                        key={topic}
                        className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-2 py-2 text-center text-xs font-bold text-[var(--text-secondary)]"
                    >
                        {topic}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="min-h-[100dvh] flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[var(--bg-grad-start)] to-[var(--bg-grad-end)] section-padding"
        >
            {/* Ambient Aurora Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-20 -right-20 hidden h-[450px] w-[450px] bg-[var(--orb-color-1)] aurora-orb sm:block"
                    style={{ animationDelay: '0s' }}
                />
                <div
                    className="absolute -bottom-20 -left-20 hidden h-[400px] w-[400px] bg-[var(--orb-color-2)] aurora-orb sm:block"
                    style={{ animationDelay: '-7s' }}
                />
            </div>

            <div className="container relative z-10 pt-16 lg:pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">

                    <div className="text-center lg:text-left lg:justify-self-end lg:max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)] mb-6">
                            <span className="block mb-4">안녕하세요,</span>
                            <span className="block text-gradient mb-4 font-black pb-2">Backend Engineer</span>
                            <span className="block">유인재입니다</span>
                        </h1>

                        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            Spring 백엔드와 운영 경험을 바탕으로,<br />
                            서비스 흐름을 안정적으로 설계합니다.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                            <Button
                                variant="primary"
                                size="lg"
                                href="#projects"
                            >
                                프로젝트 보기
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                href="#contact"
                            >
                                연락하기
                            </Button>
                        </div>
                    </div>

                    <div className="w-full max-w-md justify-self-center lg:justify-self-start lg:ml-8">
                        <div className="lg:hidden">
                            <HeroAgentPreview />
                        </div>
                        <div className="hidden lg:block">
                            <DeferredAIChat />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
