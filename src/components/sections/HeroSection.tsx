import Button from '@/components/ui/Button'
import DeferredAIChat from '@/components/sections/DeferredAIChat'

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
                            인증, API, 업무 시스템을 만들며<br />
                            백엔드의 기본기를 다져왔습니다.
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
                        <DeferredAIChat />
                    </div>
                </div>
            </div>
        </section>
    )
}
