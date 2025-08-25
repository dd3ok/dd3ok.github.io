'use client'

import { useEffect, useRef, useState } from 'react'

const experiences = [
    {
        company: '지마켓',
        position: 'Backend Developer',
        period: '2021.10 - 2024.12',
        description: [
            'ESM+ 로그인/가입/인증',
            'ESM+ 슈퍼딜/올킬 신청 및 관리',
            'ESM+ 카테고리-카테고리 담당자 매칭',
            'ESM+ QA/공지/판매자정보 관리/안정화',
            '판매자 관련 API 및 Gateway 관리/안정화'
        ]
    },
    {
        company: '미라콤아이앤씨',
        position: 'Backend Developer',
        period: '2018.01 - 2021.10',
        description: [
            '삼성전자 입찰견적시스템(BQMS) MRO몰 개발 및 운영',
            '삼성전자로지텍 설치지원시스템(BISS) 개발 및 운영'
        ]
    }
]

export default function ExperienceSection() {
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
            id="experience"
            ref={sectionRef}
            className="section-padding bg-gray-50"
        >
            <div className="container">
                <div className={`text-center mb-16 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        Experience
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        다양한 환경에서 개발을 경험했습니다.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {experiences.map((exp, index) => (
                        <div
                            key={exp.company}
                            className={`relative pl-12 pb-12 ${
                                isVisible ? 'slide-in-left visible' : 'slide-in-left'
                            }`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                        >
                            {/* 타임라인 선 */}
                            {index !== experiences.length - 1 && (
                                <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200" />
                            )}

                            {/* 타임라인 도트 - 정확한 중앙 정렬 */}
                            <div className="absolute left-3 top-8 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />

                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {exp.position}
                                        </h3>
                                        <p className="text-blue-600 font-medium">
                                            {exp.company}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-500 mt-1 md:mt-0">
                    {exp.period}
                  </span>
                                </div>

                                {/* 불릿 포인트와 텍스트 정렬 개선 */}
                                <ul className="space-y-3">
                                    {exp.description.map((item, idx) => (
                                        <li key={idx} className="text-gray-600 flex items-start leading-relaxed">
                                            <span className="text-blue-600 mr-2 mt-1 flex-shrink-0 text-sm">•</span>
                                            <span className="flex-1">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
