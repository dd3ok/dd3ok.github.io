'use client'

import { useState } from 'react'
import { getEnvConfig } from '@/utils/EnvConfig'

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

export default function ContactForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const config = getEnvConfig()

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

        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

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

            window.setTimeout(() => {
                setSubmitStatus('idle')
            }, 5000)
        } catch (error) {
            console.error('Contact form error:', error)
            setSubmitStatus('error')

            window.setTimeout(() => {
                setSubmitStatus('idle')
            }, 5000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
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
    )
}
