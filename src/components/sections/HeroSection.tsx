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
            // [수정 1] 모바일 레이아웃 정렬 방식 변경
            // flex-col과 justify-center를 사용하여 모바일에서 세로 중앙 정렬을 구현합니다.
            // PC에서는 justify-start로 상단 정렬로 전환됩니다.
            className="min-h-screen flex flex-col justify-center lg:justify-start relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 section-padding"
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
            </div>

            <div className="container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-8">

                    <div className="text-center lg:text-left lg:justify-self-end lg:max-w-xl">
                        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <div className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                <div className="mb-4">안녕하세요,</div>
                                <div className="text-blue-600 mb-4">Backend Engineer</div>
                                <div>유인재입니다</div>
                            </div>
                        </div>

                        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                스프링 기반의 백엔드 서비스 개발을 해왔고, <br />
                                확장 가능한 시스템과 효율적인 서비스 구축에 집중합니다.
                            </p>
                        </div>

                        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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

                    <div className="w-full max-w-md justify-self-start mt-12 lg:mt-0 lg:ml-8">
                        <AIChat />
                    </div>
                </div>
            </div>
        </section>
    )
}