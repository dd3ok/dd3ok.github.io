/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useId, useRef, useState } from 'react'

interface ImageModalProps {
    isOpen: boolean
    imageSrc: string
    imageAlt: string
    onClose: () => void
}

const FALLBACK_IMAGE_SRC = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <rect width="1200" height="800" fill="#f3f4f6" />
        <rect x="120" y="120" width="960" height="560" rx="32" fill="#e5e7eb" />
        <text x="600" y="375" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#374151">
            Preview unavailable
        </text>
        <text x="600" y="435" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
            The original image could not be loaded.
        </text>
    </svg>`
)}`

export default function ImageModal({ isOpen, imageSrc, imageAlt, onClose }: ImageModalProps) {
    const titleId = useId()
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const [hasImageError, setHasImageError] = useState(false)

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        setHasImageError(false)
        closeButtonRef.current?.focus()
    }, [imageSrc, isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <div
                className="relative bg-white rounded-xl shadow-2xl max-w-5xl max-h-[90vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* 닫기 버튼 */}
                <button
                    ref={closeButtonRef}
                    type="button"
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all shadow-lg"
                    onClick={onClose}
                    aria-label="모달 닫기"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* 이미지 */}
                <div className="flex items-center justify-center bg-gray-100">
                    <img
                        src={hasImageError ? FALLBACK_IMAGE_SRC : imageSrc}
                        alt={imageAlt}
                        className="max-w-full max-h-[80vh] object-contain"
                        onError={() => setHasImageError(true)}
                    />
                </div>

                {/* 이미지 제목 */}
                <div className="p-6 bg-white border-t">
                    <h3 id={titleId} className="text-lg font-semibold text-gray-900 text-center">
                        {imageAlt}
                    </h3>
                </div>
            </div>
        </div>
    )
}
