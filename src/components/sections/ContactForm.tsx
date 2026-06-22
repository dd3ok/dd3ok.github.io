'use client'

import { useEffect, useRef, useState } from 'react'
import { getEnvConfig } from '@/utils/EnvConfig'
import StatusBanner from '@/components/ui/StatusBanner'

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

interface SubmitFeedback {
    title: string
    detail: string
}

type SubmitError = Error & {
    status?: number
}

const MESSAGE_MIN_LENGTH = 10
const MESSAGE_MAX_LENGTH = 1000

export default function ContactForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [submitFeedback, setSubmitFeedback] = useState<SubmitFeedback | null>(null)
    const resetTimerRef = useRef<number | null>(null)
    const config = getEnvConfig()

    useEffect(() => {
        return () => {
            if (resetTimerRef.current !== null) {
                window.clearTimeout(resetTimerRef.current)
            }
        }
    }, [])

    const clearResetTimer = () => {
        if (resetTimerRef.current !== null) {
            window.clearTimeout(resetTimerRef.current)
            resetTimerRef.current = null
        }
    }

    const scheduleFeedbackReset = () => {
        clearResetTimer()
        resetTimerRef.current = window.setTimeout(() => {
            setSubmitStatus('idle')
            setSubmitFeedback(null)
            resetTimerRef.current = null
        }, 5000)
    }

    const getErrorStatus = (error: unknown) => {
        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
            return error.status
        }

        return undefined
    }

    const getErrorFeedback = (status?: number): SubmitFeedback => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            return {
                title: '오프라인 상태입니다.',
                detail: '인터넷 연결을 확인한 뒤 다시 시도해주세요.',
            }
        }

        if (status === 429) {
            return {
                title: '요청이 잠시 제한되었습니다.',
                detail: '잠시 후 다시 시도해주세요.',
            }
        }

        if (status && status >= 500) {
            return {
                title: '연락 서비스가 아직 준비 중일 수 있습니다.',
                detail: '외부 서비스가 wake up 중일 수 있습니다. 30~60초 후 다시 시도해주세요.',
            }
        }

        return {
            title: '메시지 전송 중 오류가 발생했습니다.',
            detail: '잠시 후 다시 시도해주세요.',
        }
    }

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
        } else if (data.message.trim().length < MESSAGE_MIN_LENGTH) {
            errors.message = `메시지는 ${MESSAGE_MIN_LENGTH}글자 이상 입력해주세요.`
        } else if (data.message.length > MESSAGE_MAX_LENGTH) {
            errors.message = `메시지는 ${MESSAGE_MAX_LENGTH}자 이하로 입력해주세요.`
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

        if (submitStatus !== 'idle') {
            clearResetTimer()
            setSubmitStatus('idle')
            setSubmitFeedback(null)
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
        setSubmitFeedback(null)
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
                const submitError: SubmitError = new Error(
                    errorData?.message || `HTTP error! status: ${response.status}`
                )
                submitError.status = response.status
                throw submitError
            }

            setSubmitStatus('success')
            setSubmitFeedback({
                title: '메시지를 보냈습니다.',
                detail: '확인 후 연락드리겠습니다.',
            })
            setFormData({ name: '', email: '', message: '' })
            scheduleFeedbackReset()
        } catch (error) {
            console.error('Contact form error:', error)
            setSubmitStatus('error')
            setSubmitFeedback(getErrorFeedback(getErrorStatus(error)))
            scheduleFeedbackReset()
        } finally {
            setIsSubmitting(false)
        }
    }

        return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    이름 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? 'contact-name-error' : undefined}
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 glass-input placeholder:text-[var(--text-muted)] text-base ${
                        formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                    placeholder="홍길동"
                />
                {formErrors.name && (
                    <p id="contact-name-error" className="mt-1 text-sm text-red-500 font-medium">
                        {formErrors.name}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    이메일 <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={formErrors.email ? 'contact-email-error' : undefined}
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 glass-input placeholder:text-[var(--text-muted)] text-base ${
                        formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                    placeholder="hong@example.com"
                />
                {formErrors.email && (
                    <p id="contact-email-error" className="mt-1 text-sm text-red-500 font-medium">
                        {formErrors.email}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    메시지 <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    maxLength={MESSAGE_MAX_LENGTH}
                    rows={4}
                    aria-invalid={Boolean(formErrors.message)}
                    aria-describedby={`contact-message-hint${formErrors.message ? ' contact-message-error' : ''}`}
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 glass-input placeholder:text-[var(--text-muted)] resize-none text-base ${
                        formErrors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                    placeholder="안녕하세요! 함께 일하고 싶습니다."
                />
                {formErrors.message && (
                    <p id="contact-message-error" className="mt-1 text-sm text-red-500 font-medium">
                        {formErrors.message}
                    </p>
                )}
                <p id="contact-message-hint" className="mt-1 text-xs text-[var(--text-muted)] font-medium">
                    {formData.message.length}/{MESSAGE_MAX_LENGTH} (최소 {MESSAGE_MIN_LENGTH}자)
                </p>
            </div>

            {submitStatus === 'success' && (
                <StatusBanner
                    tone="success"
                    title={submitFeedback?.title ?? '메시지를 보냈습니다.'}
                    description={submitFeedback?.detail ?? '확인 후 연락드리겠습니다.'}
                    className="animate-fadeIn"
                />
            )}

            {submitStatus === 'error' && (
                <StatusBanner
                    tone="error"
                    title={submitFeedback?.title ?? '메시지 전송 중 오류가 발생했습니다.'}
                    description={submitFeedback?.detail ?? '잠시 후 다시 시도해주세요.'}
                    className="animate-fadeIn"
                />
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-secondary)] text-white py-3 px-6 rounded-xl hover:shadow-[0_0_20px_var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2"
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

            <p className="text-xs text-[var(--text-muted)] text-center font-medium leading-relaxed">
                외부 서비스가 wake up 중일 수 있습니다. 잠시 후 다시 시도해주세요.
            </p>
        </form>
    )
}
