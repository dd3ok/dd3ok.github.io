'use client'

import { useEffect, useRef, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ImageModal from '@/components/ui/ImageModal'

const projects = [
    {
        title: 'ESM+ 부정로그인탐지(ATO) 연동/개발',
        description: 'ATO 솔루션 도입을 위한 협의, 설계, 개발을 담당했습니다.',
        tech: ['.NET', 'Spring Boot', 'MSSQL', 'Redis', 'jQuery', 'Kafka'],
        image: '/image/projects/esm-signin.png',
        github: '#',
        demo: 'https://signin.esmplus.com'
    },
    {
        title: 'ESM+ 판매자 가입 개선',
        description: '신규 판매자 가입시 지마켓/옥션 동시가입 및 ESM 가입프로세스 개선 작업입니다.',
        tech: ['.NET', 'Spring Boot', 'Spring Batch', 'MSSQL'],
        image: '/image/projects/esm-signup.png',
        github: '#',
        demo: 'https://signup.esmplus.com/signup/seller'
    },
    {
        title: 'ESM+ 로그인 및 인증 서비스 개발',
        description: '모놀리식 서비스였던 ESM+의 MSA화를 위해 로그인 서비스를 닷넷에서 스프링으로 마이그레이션했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Redis', 'Kafka'],
        image: '/image/projects/esm-signin.png',
        github: '#',
        demo: 'https://signin.esmplus.com'
    },
    {
        title: 'ESM+ 슈퍼딜/올킬 신청 프로세스',
        description: '판매자가 슈퍼딜/올킬 직접 신청할 수 있는 프로세스이며 프론트와 백엔드 모두 담당했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Next.js', 'React'],
        image: '/image/projects/esm-seller-deal.png',
        github: '#',
        demo: 'https://signin.esmplus.com'
    },
    {
        title: 'ESM+ 카테고리 담당자 관리',
        description: 'ESM+ 카테고리와 영업 담당자와 매칭 및 관리 프로젝트로 백엔드 전체와 어드민 프론트 개발을 했습니다.',
        tech: ['Spring Boot', 'MSSQL', 'Redis', 'Spring Batch', 'Vue'],
        image: '/image/projects/esm-category-manager.png',
        github: '#',
        demo: 'https://signin.esmplus.com'
    },
    {
        title: '판매자 관련 API, Gateway 담당 및 안정화',
        description: '판매자 정보, QA, 공지사항 등 판매자 관련 API와 Gateway 서버 안정화를 담당했습니다.',
        tech: ['Spring Boot', 'Spring Cloud', 'MSSQL', 'Redis', 'Kafka', 'Next.js', 'React'],
        image: '/image/projects/esm-etapi.png',
        github: '#',
        demo: 'https://etapi.gmarket.com/pages/API-%EA%B0%80%EC%9D%B4%EB%93%9C'
    },
    {
        title: '삼성전자 입찰견적관리시스템(BQMS) MRO 몰',
        description: '삼성 임직원들을 위한 B2B 서비스로 결제를 제외한 상품부터 정산까지 개발/운영했습니다.',
        tech: ['Spring', 'Oracle', 'Mybatis', 'jQuery', 'SOAP'],
        image: '/image/projects/sec-bqms.png',
        github: '#',
        demo: 'https://www.sec-bqms.com/bqms/partnerLogin/anonymous/loginPage.do?_frameF=true'
    }
]

export default function ProjectsSection() {
    const [isVisible, setIsVisible] = useState(false)
    const [modalState, setModalState] = useState({
        isOpen: false,
        imageSrc: '',
        imageAlt: ''
    })
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

    // 모달 열기
    const openImageModal = (imageSrc: string, imageAlt: string) => {
        setModalState({
            isOpen: true,
            imageSrc,
            imageAlt
        })
    }

    // 모달 닫기
    const closeImageModal = () => {
        setModalState({
            isOpen: false,
            imageSrc: '',
            imageAlt: ''
        })
    }

    return (
        <>
            <section
                id="projects"
                ref={sectionRef}
                className="section-padding bg-white"
            >
                <div className="container">
                    <div className={`text-center mb-16 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Projects
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            지마켓/옥션의 판매자 센터 ESM PLUS를 메인으로 담당했습니다
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
                                {/* 클릭 가능한 이미지 영역 */}
                                <div
                                    className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mb-6 overflow-hidden cursor-pointer relative group/image"
                                    onClick={() => openImageModal(project.image, project.title)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            openImageModal(project.image, project.title)
                                        }
                                    }}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`${project.title} 이미지 크게 보기`}
                                >
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={e => {
                                            e.currentTarget.src = '/api/placeholder/600/400'
                                        }}
                                    />

                                    {/* 호버 오버레이 */}
                                    <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                                            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </div>
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
                                            variant="primary"
                                            size="sm"
                                            onClick={() => window.open(project.demo, '_blank')}
                                        >
                                            방문하기
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 이미지 모달 */}
            <ImageModal
                isOpen={modalState.isOpen}
                imageSrc={modalState.imageSrc}
                imageAlt={modalState.imageAlt}
                onClose={closeImageModal}
            />
        </>
    )
}
