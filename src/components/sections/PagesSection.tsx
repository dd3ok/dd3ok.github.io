'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'

const services = [
    {
        title: 'ETF LIVE',
        description: '국내/미국 ETF의 실시간 정보를 한눈에 비교하세요',
        icon: '📈',
        path: '/etfs',
        features: ['실시간 ETF', '트렌드 분석', '정책 수혜주'],
        color: 'from-blue-500 to-cyan-500'
    },
    {
        title: '모바일 청첩장',
        description: '미리보는 모바일 청첩장',
        icon: '🤵‍♂️❤️👰‍♀️',
        path: '/wedding',
        features: ['모바일 청첩장', '포토 갤러리', '방명록'],
        color: 'from-pink-500 to-rose-500'
    },
    {
        title: '개발 도구',
        description: '일상적인 개발 작업을 위한 유용한 도구 모음입니다',
        icon: '🛠️',
        path: '/tools',
        features: ['JSON Formatter', 'Base64 변환', '색상 팔레트'],
        color: 'from-purple-500 to-indigo-500'
    }
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Learn & Studying
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        개인적인 페이지와 토이프로젝트 repository입니다
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card
                            key={service.title}
                            className={`group hover:shadow-2xl transition-all duration-500 overflow-hidden ${
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

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* 기능 목록 */}
                                <div className="mb-6">
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

                                {/* CTA 버튼 */}
                                <Link
                                    href={service.path}
                                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 group-hover:scale-105 font-medium"
                                >
                                    서비스 이용하기
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* 추가 CTA */}
                {/*<div className={`text-center mt-12 ${isVisible ? 'fade-in visible' : 'fade-in'}`} style={{ transitionDelay: '600ms' }}>*/}
                {/*    <p className="text-gray-600 mb-6">*/}
                {/*        더 많은 도구와 서비스가 곧 추가될 예정입니다*/}
                {/*    </p>*/}
                {/*    <div className="inline-flex items-center px-6 py-3 bg-white rounded-lg shadow-md">*/}
                {/*        <span className="text-sm text-gray-500">개발 중</span>*/}
                {/*        <div className="ml-3 flex space-x-1">*/}
                {/*            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>*/}
                {/*            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>*/}
                {/*            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </section>
    )
}
