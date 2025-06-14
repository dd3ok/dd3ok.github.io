'use client'

import { useEffect, useRef, useState } from 'react'
import Card from '@/components/ui/Card'

const skills = [
    { category: 'Language', items: ['Java', 'Kotlin', 'javascript', 'C#'] },
    { category: 'Framework & Library', items: ['Spring Boot', 'React', 'Next.js', 'Vue', 'jQuery'] },
    { category: 'Database', items: ['Oracle', 'MSSQL', 'Redis', 'MongoDB', 'Kafka'] },
    { category: 'Monitoring', items: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog'] }
]

export default function AboutSection() {
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
            id="about"
            ref={sectionRef}
            className="section-padding bg-white"
        >
            <div className="container">
                <div className={`text-center mb-16 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        About Me
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        분산 시스템과 소프트웨어 설계에 관심이 많은 개발자입니다
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div className={`${isVisible ? 'slide-in-left visible' : 'slide-in-left'}`}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            안정적이고 확장 가능한 시스템을 만듭니다
                        </h3>
                        <div className="space-y-4 text-gray-600">
                            <p>
                                스프링 기반의 백엔드 서비스를 주로 담당했고 LLM에 관심이 있습니다.
                                웹 애플리케이션 개발과 운영에 전문성을 갖추고 있습니다.
                            </p>
                            <p>
                                특히 분산 시스템 아키텍처와 도메인 주도 설계(DDD)에 관심이 많으며,
                                코드의 품질과 시스템의 안정성을 중시합니다.
                            </p>
                            <p>
                                지속적인 학습을 통해 최신 기술 트렌드를 따라가며,
                                팀과의 협업을 통한 문제 해결을 선호합니다.
                            </p>
                        </div>
                    </div>

                    <div className={`${isVisible ? 'slide-in-right visible' : 'slide-in-right'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            {skills.map((skillGroup) => (
                                <Card key={skillGroup.category} className="p-6 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        {skillGroup.category}
                                    </h4>
                                    <div className="space-y-2">
                                        {skillGroup.items.map((skill) => (
                                            <div
                                                key={skill}
                                                className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block mr-2 mb-1"
                                            >
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
