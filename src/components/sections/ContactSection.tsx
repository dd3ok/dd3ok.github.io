import ScrollAnimation from '@/components/animations/ScrollAnimations'
import Card from '@/components/ui/Card'
import ContactForm from '@/components/sections/ContactForm'

export default function ContactSection() {
    return (
        <section
            id="contact"
            className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50"
        >
            <div className="container">
                <ScrollAnimation className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3 md:mb-4">
                        Contact
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 md:px-0">
                        새로운 기회나 협업에 관심이 있으시다면 언제든 연락해 주세요
                    </p>
                </ScrollAnimation>

                <div className="max-w-4xl mx-auto">
                    <ScrollAnimation>
                        <Card className="p-6 md:p-8 lg:p-12">
                        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                            {/* 왼쪽: 소개 및 연락처 정보 */}
                            <div className="order-2 lg:order-1">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                                    함께 일해요!
                                </h3>
                                <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                                    흥미로운 프로젝트나 새로운 기회에 대해 이야기하고 싶습니다.
                                    AI를 활용한 백엔드, 분산 시스템 등 스터디도 환영합니다.
                                </p>

                                <div className="space-y-4">
                                    <a
                                        href="mailto:hwick@kakao.com"
                                        className="flex items-center space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                            <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-medium text-sm md:text-base">Email</p>
                                            <p className="text-gray-600 text-sm md:text-base break-all">hwick@kakao.com</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://github.com/dd3ok"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                            <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-medium text-sm md:text-base">GitHub</p>
                                            <p className="text-gray-600 text-sm md:text-base">github.com/dd3ok</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://linkedin.com/in/dd3ok"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-4 p-4 rounded-lg hover:bg-blue-50 transition-colors group"
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                            <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-medium text-sm md:text-base">LinkedIn</p>
                                            <p className="text-gray-600 text-sm md:text-base">linkedin.com/in/dd3ok</p>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* 오른쪽: 연락 폼 */}
                            <div className="order-1 lg:order-2">
                                <ContactForm />
                            </div>
                        </div>
                        </Card>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    )
}
