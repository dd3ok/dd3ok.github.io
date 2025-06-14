'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

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
            className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
            </div>

            <div className="container relative z-10">
                <div className="text-center max-w-4xl mx-auto px-4">
                    <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            <div className="mb-4">안녕하세요,</div>
                            <div className="text-blue-600 mb-4">Backend Engineer</div>
                            <div>유인재입니다</div>
                        </div>
                    </div>

                    <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            스프링 기반의 백엔드 서비스 개발을 해왔고, <br />
                            확장 가능한 시스템과 효율적인 서비스 구축에 집중합니다.
                        </p>
                    </div>

                    <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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

                    {/* Scroll Indicator */}
                    {/*<div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>*/}
                    {/*    <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">*/}
                    {/*        <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-bounce" />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </section>
    )
}
