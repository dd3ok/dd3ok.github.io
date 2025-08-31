'use client'

import {useEffect, useRef, useState} from 'react'
import Card from '@/components/ui/Card'
import {getEnvConfig} from '@/utils/EnvConfig'

interface ContactFormData {
    name: string
    email: string
    message: string
}

interface FormErrors {
    name?: string
    email?: string
    message?: string
}

export default function ContactSection() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement | null>(null)
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const config = getEnvConfig()

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

    const validateForm = (data: ContactFormData): FormErrors => {
        const errors: FormErrors = {}

        if (!data.name.trim()) {
            errors.name = '이름을 입력해주세요.'
        } else if (data.name.trim().length < 2) {
            errors.name = '이름은 2글자 이상 입력해주세요.'
        }

        if (!data.email.trim()) {
            errors.email = '이메일을 입력해주세요.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = '올바른 이메일 형식을 입력해주세요.'
        }

        if (!data.message.trim()) {
            errors.message = '메시지를 입력해주세요.'
        } else if (data.message.trim().length < 10) {
            errors.message = '메시지는 10글자 이상 입력해주세요.'
        }

        return errors
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // 실시간 검증
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // 폼 검증
        const errors = validateForm(formData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        setIsSubmitting(true)
        setSubmitStatus('idle')
        setFormErrors({})

        try {
            const response = await fetch(`${config.pagesApi.baseUrl}/api/home/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`)
            }

            setSubmitStatus('success')
            setFormData({ name: '', email: '', message: '' })

            // 성공 메시지 자동 숨김
            setTimeout(() => {
                setSubmitStatus('idle')
            }, 5000)

        } catch (error) {
            console.error('Contact form error:', error)
            setSubmitStatus('error')

            // 에러 메시지 자동 숨김
            setTimeout(() => {
                setSubmitStatus('idle')
            }, 5000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50"
        >
            <div className="container">
                <div className={`text-center mb-12 md:mb-16 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-3 md:mb-4">
                        Contact
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 md:px-0">
                        새로운 기회나 협업에 관심이 있으시다면 언제든 연락해 주세요
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Card className={`p-6 md:p-8 lg:p-12 ${isVisible ? 'fade-in visible' : 'fade-in'}`}>
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
                                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            이름 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-base ${
                                                formErrors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="홍길동"
                                        />
                                        {formErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            이메일 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-base ${
                                                formErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="hong@example.com"
                                        />
                                        {formErrors.email && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            메시지 <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={4}
                                            className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none text-base ${
                                                formErrors.message ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="안녕하세요! 함께 일하고 싶습니다."
                                        />
                                        {formErrors.message && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            {formData.message.length}/1000 (최소 10자)
                                        </p>
                                    </div>

                                    {/* 상태 메시지 */}
                                    {submitStatus === 'success' && (
                                        <div className="p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <svg className="h-4 w-4 md:h-5 md:w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-green-800">
                                                        메시지가 성공적으로 전송되었습니다! 🎉
                                                    </p>
                                                    <p className="text-xs md:text-sm text-green-700 mt-1">
                                                        빠른 시일 내에 연락드리겠습니다.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <div className="p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <svg className="h-4 w-4 md:h-5 md:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-red-800">
                                                        메시지 전송 중 오류가 발생했습니다.
                                                    </p>
                                                    <p className="text-xs md:text-sm text-red-700 mt-1">
                                                        잠시 후 다시 시도해주세요. 문제가 지속되면 이메일로 직접 연락주세요.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 제출 버튼 - HTML button 사용 */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                                                전송 중...
                                            </div>
                                        ) : (
                                            '메시지 보내기'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
