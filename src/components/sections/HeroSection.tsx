import Button from '@/components/ui/Button'
import DeferredAIChat from '@/components/sections/DeferredAIChat'

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="min-h-screen flex flex-col justify-center lg:justify-start relative overflow-hidden bg-gradient-to-br from-[var(--bg-grad-start)] to-[var(--bg-grad-end)] section-padding"
        >
            {/* Ambient Aurora Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-[var(--orb-color-1)] aurora-orb"
                    style={{ animationDelay: '0s' }}
                />
                <div
                    className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[var(--orb-color-2)] aurora-orb"
                    style={{ animationDelay: '-7s' }}
                />
            </div>

            <div className="container relative z-10 pt-16 lg:pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">

                    <div className="text-center lg:text-left lg:justify-self-end lg:max-w-xl">
                        <div className="enter-up enter-delay-100">
                            <div className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)] mb-6">
                                <div className="mb-4">안녕하세요,</div>
                                <div className="text-gradient mb-4 font-black pb-2">Backend Engineer</div>
                                <div>유인재입니다</div>
                            </div>
                        </div>

                        <div className="enter-up enter-delay-300">
                            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                스프링 기반 백엔드 경험을 바탕으로,<br />
                                확장성·안정성을 갖춘 서비스를 설계하고 개발합니다.
                            </p>
                        </div>

                        <div className="enter-up enter-delay-500">
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
                    </div>

                    <div className="w-full max-w-md justify-self-start lg:ml-8 enter-up enter-delay-200">
                        <DeferredAIChat />
                    </div>
                </div>
            </div>
        </section>
    )
}
