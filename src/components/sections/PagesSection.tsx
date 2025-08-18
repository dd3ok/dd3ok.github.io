'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'

const services = [
    {
        title: '모바일 청첩장(작업중)',
        description: '미리보는 모바일 청첩장',
        icon: '🤵‍♂️❤️👰‍♀️',
        path: '/wedding',
        features: ['모바일 청첩장', '포토 갤러리', '방명록'],
        color: 'from-pink-500 to-rose-500',
        buttonText: '서비스 이용하기',
        buttonType: 'service'
    },
    {
        title: '코드리뷰 AI',
        description: 'PR을 올려 Gemini 한테 리뷰를 받자',
        icon: '🤖',
        path: 'https://github.com/dd3ok/no-pair-prgm',
        features: ['Gemini 1.5 Flash 연동', 'Github API 연동', 'Github PR 자동 코드리뷰'],
        color: 'from-purple-500 to-indigo-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo'
    },
    {
        title: '마인크래프트 HUD',
        description: 'Minecraft Mod로 현재 내 상태를 표시합니다',
        icon: '⛏️',
        path: 'https://github.com/dd3ok/fabric-fpsxyzs',
        features: ['Fabric API 사용', '정보별 업데이트 주기 최적화'],
        color: 'from-green-500 to-emerald-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo'
    },
    {
        title: 'OAuth 로그인 + 세션/토큰 관리',
        description: 'Naver, Kakao, Google OAuth로 간편하게 로그인하세요',
        icon: '🔐',
        path: 'https://github.com/dd3ok/auth-service',
        features: ['OAuth 2.0 로그인', 'JWT 토큰 인증', 'Redis 세션 관리'],
        color: 'from-orange-500 to-red-500',
        buttonText: 'Repository 바로가기',
        buttonType: 'repo'
    },
    {
        title: 'Who am AI',
        description: '저에 대해 궁금한 점을 직접 물어보세요.',
        icon: '🤖',
        path: 'https://github.com/dd3ok/who-am-ai',
        features: ['Gen AI SDK + Gemini 2.5 Flash Lite' , '이력서 맞춤 답변', '채팅 컨텍스트 구현'],
        color: "from-gray-300 to-gray-500",
        buttonText: 'Repository 바로가기',
        buttonType: 'repo'
    },
    {
        title: 'Repository to MD/TEXT',
        description: '파일 하나씩 복사 붙여넣기 하지마세요. LLM을 위한 Repository 요약 도구',
        icon: '📦',
        path: 'https://repo2md.onrender.com',
        features: ['TEXT 요약', '마크다운 요약'],
        color: 'from-blue-500 to-cyan-500',
        buttonText: '서비스 이용하기',
        buttonType: 'service'
    },
]


export default function ServicesSection() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section
            id="services"
            ref={sectionRef}
            className="section-padding bg-gradient-to-br bg-gray-50"
        >
            <div className="container">
                <div className={`text-center mb-16 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        Toys
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        개인적인 페이지와 토이프로젝트 repository입니다
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card
                            key={service.title}
                            className={`group hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col ${
                                isVisible ? 'scale-in visible' : 'scale-in'
                            }`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                        >
                            {/* 그라데이션 헤더 */}
                            <div className={`h-32 bg-gradient-to-br ${service.color} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl filter drop-shadow-lg">
                    {service.icon}
                  </span>
                                </div>
                                {/* 장식 요소 */}
                                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                            </div>

                            {/* 컨텐츠 영역 - flex-grow로 공간 확장 */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* 기능 목록 - flex-grow로 남은 공간 차지 */}
                                <div className="mb-6 flex-grow">
                                    <ul className="space-y-2">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        href={service.path}
                                        className={`inline-flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-300 group-hover:scale-105 font-medium bg-gray-900 text-white hover:bg-blue-600'}`}
                                        target='_blank'
                                    >
                                        {service.buttonText}
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
