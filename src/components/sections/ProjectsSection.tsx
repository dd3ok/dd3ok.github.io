'use client'

import { useEffect, useRef, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const projects = [
    {
        title: 'ESM+ 부정로그인탐지(ATO) 연동/개발',
        description: 'ATO 솔루션 도입을 위한 협의, 설계, 개발을 담당했습니다.',
        tech: ['.NET', 'Spring Boot', 'MSSQL', 'Redis', 'jQuery', 'Kafka'],
        image: '/api/placeholder/600/400',
        github: '#',
        demo: '#'
    },
    {
        title: 'ESM+ 판매자 가입 개선',
        description: '신규 판매자 가입시 지마켓/옥션 동시가입 및 ESM 가입프로세스 개선 작업입니다.',
        tech: ['.NET', 'Spring Boot', 'Spring Batch', 'MSSQL'],
        image: '/api/placeholder/600/400',
        github: '#',
        demo: '#'
    },
    {
        title: 'ESM+ 로그인 및 인증 서비스 개발',
        description: '모놀리식 서비스였던 ESM+의 MSA화를 위해 로그인 서비스를 닷넷에서 스프링으로 마이그레이션했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Redis', 'Kafka'],
        image: '/api/placeholder/600/400',
        github: '#',
        demo: '#'
    },
    {
        title: 'ESM+ 슈퍼딜/올킬 신청 프로세스',
        description: '판매자가 슈퍼딜/올킬 직접 신청할 수 있는 프로세스이며 프론트와 백엔드 모두 담당했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Next.js', 'React'],
        image: '/api/placeholder/600/400',
        github: '#',
        demo: 'https://www.esmplus.com'
    },
    {
        title: 'ESM+ 카테고리 담당자 관리',
        description: 'ESM+ 카테고리와 영업 담당자와 매칭 및 관리 프로젝트로 백엔드 전체와 어드민 프론트 개발을 했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Redis', 'Spring Batch', 'Vue'],
        image: '/api/placeholder/600/400',
        github: '#',
        demo: '#'
    },
    {
        title: 'ESM+ 판매자 관련 API, Gateway 담당 및 안정화',
        description: '판매자 정보, QA, 공지사항 등 판매자 관련 API와 Gateway 서버 안정화를 담당했습니다.',
        tech: ['Spring Boot', 'Spring Cloud', 'MSSQL', 'Redis', 'Kafka', 'Next.js', 'React'],
        image: '/api/placeholder/600/400',
        github: '#',
        demo: '#'
    }
]

export default function ProjectsSection() {
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
            id="projects"
            ref={sectionRef}
            className="section-padding bg-gray-50"
        >
            <div className="container">
                <div className={`text-center mb-16 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Projects
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        실제 비즈니스 문제를 해결한 주요 프로젝트들입니다
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <Card
                            key={project.title}
                            className={`group hover:shadow-xl transition-all duration-300 ${
                                isVisible ? 'fade-in visible' : 'fade-in'
                            }`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                        >
                            <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mb-6 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {project.title}
                                </h3>

                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                        >
                      {tech}
                    </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(project.github, '_blank')}
                                    >
                                        GitHub
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => window.open(project.demo, '_blank')}
                                    >
                                        Live Demo
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
