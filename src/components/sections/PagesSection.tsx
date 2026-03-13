import ScrollAnimation from '@/components/animations/ScrollAnimations'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { services } from '@/data/portfolio'
import { isExternalLink } from '@/utils/links'

export default function PagesSection() {
    return (
        <section
            id="services"
            className="section-padding bg-gradient-to-br bg-gray-50"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                        Toys
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        개인적인 페이지와 토이프로젝트 repository입니다
                    </p>
                </ScrollAnimation>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ScrollAnimation
                            key={service.title}
                            animation="fade"
                            delay={index * 120}
                        >
                            <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full">
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
                                            className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-300 group-hover:scale-105 font-medium bg-gray-900 text-white hover:bg-blue-600"
                                            target={isExternalLink(service.path) ? '_blank' : undefined}
                                            rel={isExternalLink(service.path) ? 'noopener noreferrer' : undefined}
                                        >
                                            {service.buttonText}
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    )
}
