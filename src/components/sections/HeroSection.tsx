'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import AIChat from '@/components/sections/AIChat'

export default function HeroSection() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300)
        return () => clearTimeout(timer)
    }, [])

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section
            id="hero"
            // section-padding을 다시 사용하고, 정렬 로직을 유지합니다.
            className="min-h-screen flex flex-col justify-center lg:justify-start relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 section-padding"
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
            </div>

            {/* [수정] 이 container div에 반응형 패딩을 추가하여 모바일 헤더 문제를 해결합니다. */}
            <div className="container relative z-10 pt-16 lg:pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">

                    <div className="text-center lg:text-left lg:justify-self-end lg:max-w-xl">
                        <div className={`transition-[opacity,transform] duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <div className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                <div className="mb-4">안녕하세요,</div>
                                <div className="text-blue-600 mb-4">Backend Engineer</div>
                                <div>유인재입니다</div>
                            </div>
                        </div>

                        <div className={`transition-[opacity,transform] duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                스프링 기반의 백엔드 서비스 개발을 해왔고, <br />
                                확장 가능한 시스템과 안정적인 서비스 구축을 목표로 합니다.
                            </p>
                        </div>

                        <div className={`transition-[opacity,transform] duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => scrollToSection('projects')}
                                >
                                    프로젝트 보기
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => scrollToSection('contact')}
                                >
                                    연락하기
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className={`w-full max-w-md justify-self-start lg:ml-8 transition-[opacity,transform] duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <AIChat />
                    </div>
                </div>
            </div>
        </section>
    )
}