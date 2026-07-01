import Button from '@/components/ui/Button'
import DeferredAIChat from '@/components/sections/DeferredAIChat'

function HeroAgentPreview() {
    const quickTopics = ['프로젝트', '기술 스택', '경력']

    return (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/85 p-4 text-left shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur md:p-5">
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

            <div className="mt-3 grid grid-cols-3 gap-2 md:mt-4">
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
            className="relative flex min-h-[auto] flex-col justify-center overflow-hidden bg-gradient-to-br from-[var(--bg-grad-start)] to-[var(--bg-grad-end)] px-6 py-20 md:min-h-[100dvh] md:px-12 md:py-24 lg:px-16 lg:py-32"
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

            <div className="container relative z-10 pt-12 lg:pt-0">
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">

                    <div className="text-center lg:text-left lg:justify-self-end lg:max-w-xl">
                        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] md:mb-6 md:text-5xl">
                            <span className="mb-2 block md:mb-4">안녕하세요,</span>
                            <span className="text-gradient mb-2 block pb-2 font-black md:mb-4">Backend Engineer</span>
                            <span className="block">유인재입니다</span>
                        </h1>

                        <p className="mx-auto mb-8 max-w-2xl text-base font-medium leading-relaxed text-[var(--text-secondary)] md:mb-12 md:text-xl lg:mx-0">
                            Spring 백엔드와 운영 경험을 바탕으로,<br />
                            서비스 흐름을 안정적으로 설계합니다.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
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
